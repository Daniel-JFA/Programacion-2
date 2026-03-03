"""
MotoBoard Pro  ->  Guardian Monitor Pro
Dashboard de monitoreo de sistemas con reglas del Guardian.
Logica: Energia, Temperatura, CPU con estados OK / ADVERTENCIA / PELIGRO CRITICO
"""
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import random
import datetime
import matplotlib
matplotlib.use("TkAgg")
from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.gridspec as gridspec
import matplotlib.patches as mpatches
import numpy as np

# ══════════════════════════════════════════════
#  PALETA  —  tema industrial oscuro
# ══════════════════════════════════════════════
BG_MAIN      = "#0D1117"
BG_PANEL     = "#161B25"
BG_CARD      = "#1C2333"
ACCENT_BLUE  = "#58A6FF"
ACCENT_GREEN = "#3FB950"
ACCENT_AMBER = "#D29922"
ACCENT_RED   = "#F85149"
ACCENT_TEAL  = "#39D353"
ACCENT_PUR   = "#BC8CFF"
TEXT_WHITE   = "#E6EDF3"
TEXT_MUTED   = "#8B949E"
BORDER       = "#30363D"
MPL_BG       = "#161B25"
MPL_AX       = "#1C2333"
MPL_GRID     = "#21262D"

# ══════════════════════════════════════════════
#  UMBRALES DEL GUARDIAN
# ══════════════════════════════════════════════
ENERGIA_MAX    = 400.0   # W — por encima: exceso
TEMP_CRITICA   = 75.0    # C
CPU_CRITICA    = 80.0    # %
CPU_ALTA       = 90.0    # % — calculo procesos restantes
PROCESOS_BASE  = 100     # procesos maximos del sistema


# ══════════════════════════════════════════════
#  1. GENERACION DE DATOS SINTETICOS
# ══════════════════════════════════════════════
def generar_datos_sinteticos(n: int, seed=None) -> list:
    """
    Genera n registros: [energia_W, temperatura_C, cpu_pct]
    Distribucion realista:
      - Energia:     150 - 520 W  (algunos superan 400)
      - Temperatura: 40  - 95 C   (algunos superan 75)
      - CPU:          5  - 99 %   (algunos superan 80/90)
      -  3% datos invalidos (None) para practicar limpieza
    """
    if seed is not None:
        random.seed(seed)
    registros = []
    for _ in range(n):
        energia = (random.uniform(390, 520)
                   if random.random() < 0.30
                   else random.uniform(150, 399))
        temperatura = (random.uniform(70, 95)
                       if random.random() < 0.30
                       else random.uniform(40, 69))
        cpu = (random.uniform(75, 99)
               if random.random() < 0.30
               else random.uniform(5, 74))
        if random.random() < 0.03:
            registros.append([None, temperatura, cpu])
        else:
            registros.append([energia, temperatura, cpu])
    return registros


def limpiar_datos(registros: list) -> list:
    """Elimina filas con None o valores fuera de rango fisico."""
    limpios = []
    for fila in registros:
        if len(fila) != 3:
            continue
        e, t, c = fila
        if None in (e, t, c):
            continue
        try:
            e, t, c = float(e), float(t), float(c)
        except (TypeError, ValueError):
            continue
        if not (0 < e <= 1000):
            continue
        if not (0 <= t <= 150):
            continue
        if not (0 <= c <= 100):
            continue
        limpios.append([e, t, c])
    return limpios


# ══════════════════════════════════════════════
#  2. REGLAS DEL GUARDIAN
# ══════════════════════════════════════════════
def evaluar_guardian(e: float, t: float, c: float) -> dict:
    """
    Aplica las reglas del Guardian a un registro individual.
    Retorna: estado, exceso_energia, procesos_restantes, detalle
    """
    exceso_energia     = round(e - ENERGIA_MAX, 2) if e > ENERGIA_MAX else 0.0
    procesos_restantes = None
    detalles           = []

    cond_temp = t > TEMP_CRITICA
    cond_cpu  = c > CPU_CRITICA

    if cond_temp and cond_cpu:
        estado = "CRITICO"
        detalles.append("PELIGRO CRITICO: Temperatura y CPU elevadas")
    elif cond_temp or cond_cpu:
        estado = "ADVERTENCIA"
        if cond_temp:
            detalles.append(f"Temperatura alta ({t:.1f}C)")
        if cond_cpu:
            detalles.append(f"CPU alta ({c:.1f}%)")
    else:
        estado = "OK"
        detalles.append("Sistema estable")

    if exceso_energia > 0:
        detalles.append(f"Exceso de energia: +{exceso_energia:.1f}W")
        if estado == "OK":
            estado = "ADVERTENCIA"

    if c >= CPU_ALTA:
        procesos_restantes = max(0, int(PROCESOS_BASE * (100 - c) / 100))
        detalles.append(f"CPU >= 90% — procesos restantes: {procesos_restantes}")

    return {
        "estado":             estado,
        "exceso_energia":     exceso_energia,
        "procesos_restantes": procesos_restantes,
        "detalle":            " | ".join(detalles),
    }


# ══════════════════════════════════════════════
#  3. ANALITICA
# ══════════════════════════════════════════════
def calcular_metricas(registros: list) -> dict:
    """Calcula metricas globales y aplica reglas del Guardian a cada registro."""
    empty = {
        "total": 0, "ok": 0, "advertencia": 0, "critico": 0,
        "prom_e": 0, "min_e": 0, "max_e": 0,
        "prom_t": 0, "min_t": 0, "max_t": 0,
        "prom_c": 0, "min_c": 0, "max_c": 0,
        "n_exceso": 0, "n_cpu_alta": 0,
        "energias": [], "temps": [], "cpus": [], "estados": [], "detalles_reg": [],
    }
    if not registros:
        return empty

    energias, temps, cpus = [], [], []
    estados, detalles_reg = [], []
    ok = adv = crit = n_exceso = n_cpu_alta = 0

    for e, t, c in registros:
        res = evaluar_guardian(e, t, c)
        energias.append(e)
        temps.append(t)
        cpus.append(c)
        estados.append(res["estado"])
        detalles_reg.append(res)
        if res["estado"] == "OK":         ok   += 1
        elif res["estado"] == "ADVERTENCIA": adv += 1
        else:                              crit += 1
        if res["exceso_energia"] > 0:     n_exceso  += 1
        if c >= CPU_ALTA:                 n_cpu_alta += 1

    return {
        "total": len(registros),
        "ok": ok, "advertencia": adv, "critico": crit,
        "prom_e": sum(energias)/len(energias), "min_e": min(energias), "max_e": max(energias),
        "prom_t": sum(temps)/len(temps),       "min_t": min(temps),   "max_t": max(temps),
        "prom_c": sum(cpus)/len(cpus),         "min_c": min(cpus),    "max_c": max(cpus),
        "n_exceso": n_exceso, "n_cpu_alta": n_cpu_alta,
        "energias": energias, "temps": temps, "cpus": cpus,
        "estados": estados, "detalles_reg": detalles_reg,
    }


# ══════════════════════════════════════════════
#  4. HELPERS MATPLOTLIB
# ══════════════════════════════════════════════
def _style_ax(ax, title="", xlabel="", ylabel=""):
    ax.set_facecolor(MPL_AX)
    ax.tick_params(colors=TEXT_MUTED, labelsize=8, length=3)
    ax.xaxis.label.set_color(TEXT_MUTED)
    ax.yaxis.label.set_color(TEXT_MUTED)
    for sp in ax.spines.values():
        sp.set_edgecolor(BORDER)
    ax.grid(color=MPL_GRID, linewidth=0.55, linestyle="--", alpha=0.8)
    ax.set_title(title, fontsize=9, fontweight="bold",
                 pad=9, color=TEXT_WHITE, fontfamily="monospace")
    ax.set_xlabel(xlabel, fontsize=8, labelpad=5)
    ax.set_ylabel(ylabel, fontsize=8, labelpad=5)


def _ecol(estado):
    return {
        "OK":          ACCENT_GREEN,
        "ADVERTENCIA": ACCENT_AMBER,
        "CRITICO":     ACCENT_RED,
    }.get(estado, TEXT_MUTED)


def _mini_legend(ax, entries):
    patches = [mpatches.Patch(color=c, label=l) for l, c in entries]
    leg = ax.legend(handles=patches, fontsize=6.5,
                    facecolor=BG_CARD, edgecolor=BORDER,
                    labelcolor=TEXT_WHITE, loc="best")
    leg.get_frame().set_linewidth(0.6)


# ══════════════════════════════════════════════
#  5. APP PRINCIPAL
# ══════════════════════════════════════════════
class GuardianApp(tk.Tk):

    def __init__(self):
        super().__init__()
        self.title("Guardian Monitor Pro  —  Monitoreo de Sistemas")
        self.geometry("1400x860")
        self.configure(bg=BG_MAIN)
        self.resizable(True, True)
        self.registros = []
        self.metricas  = None
        self._setup_styles()
        self._build_header()
        self._build_controls()
        self._build_kpis()
        self._build_notebook()   # tabs: Graficas | Reporte

    # ── estilos ttk ──────────────────────────────────────────
    def _setup_styles(self):
        s = ttk.Style(self)
        s.theme_use("clam")
        s.configure(".", background=BG_MAIN, foreground=TEXT_WHITE,
            fieldbackground=BG_CARD, font=("Courier New", 10))
        s.configure("TFrame",    background=BG_MAIN)
        s.configure("TLabel",    background=BG_MAIN, foreground=TEXT_WHITE)
        s.configure("TNotebook", background=BG_PANEL, borderwidth=0)
        s.configure("TNotebook.Tab",
            background=BG_CARD, foreground=TEXT_MUTED,
            font=("Courier New", 9, "bold"),
            padding=(14, 5))
        s.map("TNotebook.Tab",
            background=[("selected", ACCENT_BLUE)],
            foreground=[("selected", BG_MAIN)])
        for name, bg, fg, abg, afg in [
            ("Blue.TButton",  ACCENT_BLUE,  BG_MAIN, "#79BBFF", BG_MAIN),
            ("Amber.TButton", ACCENT_AMBER, BG_MAIN, "#F0B429", BG_MAIN),
            ("Green.TButton", ACCENT_GREEN, BG_MAIN, "#56D364", BG_MAIN),
        ]:
            s.configure(name, background=bg, foreground=fg,
                        font=("Courier New", 9, "bold"),
                        borderwidth=0, padding=(10, 5), relief="flat")
            s.map(name,
                  background=[("active", abg)],
                  foreground=[("active", afg)])

    # ── header ───────────────────────────────────────────────
    def _build_header(self):
        hdr = tk.Frame(self, bg=BG_PANEL, height=56)
        hdr.pack(fill="x")
        hdr.pack_propagate(False)
        tk.Label(hdr, text="  GUARDIAN MONITOR PRO",
                 bg=BG_PANEL, fg=ACCENT_BLUE,
                 font=("Courier New", 17, "bold")).pack(side="left", padx=22, pady=8)
        tk.Label(hdr, text="/ Monitoreo de Sistemas",
                 bg=BG_PANEL, fg=TEXT_MUTED,
                 font=("Courier New", 10)).pack(side="left")
        self.operador_lbl = tk.Label(hdr, text="",
                 bg=BG_PANEL, fg=ACCENT_TEAL,
                 font=("Courier New", 9, "italic"))
        self.operador_lbl.pack(side="right", padx=22)
        tk.Canvas(self, height=2, bg=ACCENT_BLUE, highlightthickness=0).pack(fill="x")

    # ── controles ────────────────────────────────────────────
    def _build_controls(self):
        bar = tk.Frame(self, bg=BG_MAIN, pady=12)
        bar.pack(fill="x", padx=22)

        def field(lbl_text, var, w, color=TEXT_WHITE):
            tk.Label(bar, text=lbl_text, bg=BG_MAIN, fg=TEXT_MUTED,
                     font=("Courier New", 8, "bold")).pack(side="left")
            tk.Entry(bar, textvariable=var, width=w,
                     bg=BG_CARD, fg=color, insertbackground=color,
                     relief="flat", bd=0, font=("Courier New", 10),
                     highlightbackground=BORDER,
                     highlightthickness=1).pack(side="left", padx=(3, 18), ipady=3)

        self.operador_var = tk.StringVar(value="")
        self.n_var        = tk.IntVar(value=60)
        self.seed_var     = tk.StringVar(value="42")
        field("OPERADOR",  self.operador_var, 18)
        field("N REGISTROS", self.n_var,       6)
        field("SEED",        self.seed_var,     9, ACCENT_AMBER)

        ttk.Button(bar, text="  GENERAR",
                   style="Blue.TButton",
                   command=self.on_generar).pack(side="left", padx=3)
        ttk.Button(bar, text="  SEED ALEATORIA",
                   style="Amber.TButton",
                   command=self.on_regenerar).pack(side="left", padx=3)
        ttk.Button(bar, text="  GENERAR REPORTE",
                   style="Green.TButton",
                   command=self.on_reporte).pack(side="left", padx=3)

        self.status_var = tk.StringVar(value="Configura los parametros y presiona GENERAR.")
        tk.Label(bar, textvariable=self.status_var,
                 bg=BG_MAIN, fg=TEXT_MUTED,
                 font=("Courier New", 8)).pack(side="right")

    # ── tarjetas KPI ─────────────────────────────────────────
    def _build_kpis(self):
        row = tk.Frame(self, bg=BG_MAIN)
        row.pack(fill="x", padx=22, pady=(0, 10))
        self._kpi = {}
        specs = [
            ("total",      "TOTAL REGISTROS", TEXT_WHITE),
            ("ok",         "ESTADO OK",        ACCENT_GREEN),
            ("advertencia","ADVERTENCIA",       ACCENT_AMBER),
            ("critico",    "CRITICO",           ACCENT_RED),
            ("n_exceso",   "EXCESO ENERGIA",    ACCENT_PUR),
            ("n_cpu_alta", "CPU >= 90%",        ACCENT_RED),
            ("prom_e",     "ENERGIA PROM",      ACCENT_BLUE),
            ("prom_t",     "TEMP PROM",         ACCENT_AMBER),
            ("prom_c",     "CPU PROM",          ACCENT_TEAL),
            ("seed_disp",  "SEED USADA",        ACCENT_PUR),
        ]
        for key, lbl, col in specs:
            card = tk.Frame(row, bg=BG_CARD,
                            highlightbackground=BORDER, highlightthickness=1)
            card.pack(side="left", padx=3, pady=2, ipadx=11, ipady=7)
            tk.Label(card, text=lbl, bg=BG_CARD, fg=TEXT_MUTED,
                     font=("Courier New", 7, "bold")).pack(anchor="w")
            v = tk.Label(card, text="--", bg=BG_CARD, fg=col,
                         font=("Courier New", 15, "bold"))
            v.pack(anchor="w")
            self._kpi[key] = v

    def _refresh_kpis(self, m, seed_txt):
        self._kpi["total"].config(text=str(m["total"]))
        self._kpi["ok"].config(text=str(m["ok"]))
        self._kpi["advertencia"].config(text=str(m["advertencia"]))
        self._kpi["critico"].config(text=str(m["critico"]))
        self._kpi["n_exceso"].config(text=str(m["n_exceso"]))
        self._kpi["n_cpu_alta"].config(text=str(m["n_cpu_alta"]))
        self._kpi["prom_e"].config(text=f"{m['prom_e']:.1f} W")
        self._kpi["prom_t"].config(text=f"{m['prom_t']:.1f} C")
        self._kpi["prom_c"].config(text=f"{m['prom_c']:.1f} %")
        self._kpi["seed_disp"].config(text=seed_txt)

    # ── notebook (tabs) ───────────────────────────────────────
    def _build_notebook(self):
        self.nb = ttk.Notebook(self)
        self.nb.pack(fill="both", expand=True, padx=22, pady=(0, 16))

        # Tab 1: Graficas
        self.tab_graf = tk.Frame(self.nb, bg=BG_PANEL)
        self.nb.add(self.tab_graf, text="  GRAFICAS  ")
        self._build_charts(self.tab_graf)

        # Tab 2: Reporte
        self.tab_rep = tk.Frame(self.nb, bg=BG_PANEL)
        self.nb.add(self.tab_rep, text="  REPORTE  ")
        self._build_report_tab(self.tab_rep)

    # ── graficas ─────────────────────────────────────────────
    def _build_charts(self, parent):
        self.fig = Figure(figsize=(14, 4.5), dpi=96, facecolor=MPL_BG)
        gs = gridspec.GridSpec(1, 4, figure=self.fig,
                               left=0.055, right=0.975,
                               bottom=0.16, top=0.87, wspace=0.42)
        self.ax_hist_t = self.fig.add_subplot(gs[0])   # histograma temperatura
        self.ax_cpu    = self.fig.add_subplot(gs[1])   # serie CPU
        self.ax_pie    = self.fig.add_subplot(gs[2])   # donut estados
        self.ax_sc     = self.fig.add_subplot(gs[3])   # scatter CPU vs Temp
        for ax in (self.ax_hist_t, self.ax_cpu, self.ax_pie, self.ax_sc):
            ax.set_facecolor(MPL_AX)
        self.canvas = FigureCanvasTkAgg(self.fig, master=parent)
        self.canvas.get_tk_widget().pack(fill="both", expand=True)
        self._clear_charts()

    def _clear_charts(self):
        for ax in (self.ax_hist_t, self.ax_cpu, self.ax_pie, self.ax_sc):
            ax.clear()
            ax.set_facecolor(MPL_AX)
            for sp in ax.spines.values():
                sp.set_edgecolor(BORDER)
            ax.tick_params(colors=TEXT_MUTED)
            ax.text(0.5, 0.5, "Sin datos", color=TEXT_MUTED,
                    ha="center", va="center", transform=ax.transAxes,
                    fontsize=11, style="italic", fontfamily="monospace")
        self.canvas.draw()

    # ── reporte tab ───────────────────────────────────────────
    def _build_report_tab(self, parent):
        self.report_text = scrolledtext.ScrolledText(
            parent,
            bg=BG_CARD, fg=ACCENT_GREEN,
            font=("Courier New", 10),
            insertbackground=ACCENT_GREEN,
            relief="flat",
            padx=18, pady=14,
            wrap=tk.WORD,
        )
        self.report_text.pack(fill="both", expand=True, padx=10, pady=10)
        self.report_text.insert("end", "Presiona  GENERAR REPORTE  para ver el informe.\n")
        self.report_text.config(state="disabled")

    # ── acciones ─────────────────────────────────────────────
    def _parse_seed(self):
        raw = self.seed_var.get().strip()
        if not raw:
            return None
        try:
            return int(raw)
        except ValueError:
            messagebox.showerror("Seed invalida",
                "Ingresa un numero entero (ej. 42, 1234).")
            return -1

    def _run(self, seed):
        n = self.n_var.get()
        if n <= 0:
            messagebox.showerror("Error", "N debe ser > 0.")
            return
        datos        = generar_datos_sinteticos(n, seed=seed)
        antes        = len(datos)
        self.registros = limpiar_datos(datos)
        self.metricas  = calcular_metricas(self.registros)
        seed_txt       = str(seed) if seed is not None else "ninguna"
        operador       = self.operador_var.get().strip() or "N/D"
        self.operador_lbl.config(text=f"Operador: {operador}")
        self.status_var.set(
            f"Seed {seed_txt}  |  {antes} generados  |  "
            f"{len(self.registros)} validos  |  "
            f"{self.metricas['critico']} criticos detectados")
        self._refresh_kpis(self.metricas, seed_txt)
        self._plot()

    def on_generar(self):
        seed = self._parse_seed()
        if seed == -1:
            return
        self._run(seed)

    def on_regenerar(self):
        new_seed = random.randint(1, 99999)
        self.seed_var.set(str(new_seed))
        self._run(new_seed)

    def on_reporte(self):
        if not self.metricas or self.metricas["total"] == 0:
            messagebox.showwarning("Sin datos", "Genera datos primero.")
            return
        self.nb.select(self.tab_rep)
        self._generar_reporte_texto()

    # ── ploteo de graficas ────────────────────────────────────
    def _plot(self):
        m        = self.metricas
        energias = np.array(m["energias"])
        temps    = np.array(m["temps"])
        cpus     = np.array(m["cpus"])
        estados  = m["estados"]
        cols_est = [_ecol(e) for e in estados]

        for ax in (self.ax_hist_t, self.ax_cpu, self.ax_pie, self.ax_sc):
            ax.clear()
            ax.set_facecolor(MPL_AX)

        # A. Histograma de temperatura con zonas
        ax = self.ax_hist_t
        bins = np.linspace(temps.min() - 1, temps.max() + 1, 17)
        centers = (bins[:-1] + bins[1:]) / 2
        _, _, patches = ax.hist(temps, bins=bins, edgecolor=MPL_BG, linewidth=0.5)
        for p, c in zip(patches, centers):
            col = ACCENT_RED if c > TEMP_CRITICA else (
                  ACCENT_AMBER if c > TEMP_CRITICA - 10 else ACCENT_GREEN)
            p.set_facecolor(col)
            p.set_alpha(0.88)
        ax.axvspan(TEMP_CRITICA, float(temps.max()) + 2,
                   color=ACCENT_RED, alpha=0.07, zorder=0)
        ax.axvline(TEMP_CRITICA, color=ACCENT_RED, linewidth=1.3,
                   linestyle="--", alpha=0.85)
        ax.axvline(float(np.mean(temps)), color=ACCENT_BLUE, linewidth=1.2,
                   linestyle=":", alpha=0.9)
        _mini_legend(ax, [
            (f"Critica >{TEMP_CRITICA}C", ACCENT_RED),
            (f"Prom {np.mean(temps):.1f}C", ACCENT_BLUE),
        ])
        _style_ax(ax, "Histograma Temperatura", "Temperatura (C)", "Frecuencia")

        # B. Serie CPU coloreada por estado
        ax = self.ax_cpu
        idx = np.arange(1, len(cpus) + 1)
        ax.fill_between(idx, cpus, alpha=0.08, color=ACCENT_TEAL, zorder=0)
        ax.plot(idx, cpus, color=ACCENT_TEAL, linewidth=0.7, alpha=0.35, zorder=1)
        ax.scatter(idx, cpus, c=cols_est, s=20, zorder=2, alpha=0.90, linewidths=0)
        ax.axhline(CPU_CRITICA, color=ACCENT_AMBER, linewidth=1.0,
                   linestyle="--", alpha=0.7, label=f"CPU critica {CPU_CRITICA}%")
        ax.axhline(CPU_ALTA,    color=ACCENT_RED,   linewidth=1.0,
                   linestyle="--", alpha=0.7, label=f"CPU alta {CPU_ALTA}%")
        _mini_legend(ax, [
            (f"CPU >= {CPU_ALTA}%", ACCENT_RED),
            (f"CPU >= {CPU_CRITICA}%", ACCENT_AMBER),
        ])
        _style_ax(ax, "Serie CPU", "Registro #", "CPU (%)")

        # C. Donut estados Guardian
        ax = self.ax_pie
        vals  = [m["ok"], m["advertencia"], m["critico"]]
        labs  = ["OK", "Advertencia", "Critico"]
        clrs  = [ACCENT_GREEN, ACCENT_AMBER, ACCENT_RED]
        data  = [(v, l, c) for v, l, c in zip(vals, labs, clrs) if v > 0]
        if data:
            vs_f, ls_f, cs_f = zip(*data)
            ax.pie(
                vs_f, colors=cs_f,
                startangle=90, counterclock=False,
                wedgeprops=dict(width=0.55, edgecolor=MPL_BG, linewidth=1.8)
            )
            ax.text(0,  0.08, str(m["total"]),
                    color=TEXT_WHITE, ha="center", va="center",
                    fontsize=15, fontweight="bold", fontfamily="monospace")
            ax.text(0, -0.15, "registros",
                    color=TEXT_MUTED, ha="center", va="center",
                    fontsize=8, fontfamily="monospace")
            els = [mpatches.Patch(color=c, label=f"{l}  {v}")
                   for v, l, c in zip(vs_f, ls_f, cs_f)]
            leg = ax.legend(handles=els, loc="lower center",
                            bbox_to_anchor=(0.5, -0.24), ncol=3,
                            fontsize=7, facecolor=BG_CARD,
                            edgecolor=BORDER, labelcolor=TEXT_WHITE)
            leg.get_frame().set_linewidth(0.6)
        ax.set_facecolor(MPL_AX)
        ax.set_title("Estados Guardian", fontsize=9, fontweight="bold",
                     pad=9, color=TEXT_WHITE, fontfamily="monospace")

        # D. Scatter CPU vs Temperatura
        ax = self.ax_sc
        ax.scatter(temps, cpus, c=cols_est, s=24,
                   alpha=0.85, linewidths=0, zorder=2)
        # zonas de peligro
        ax.axvspan(TEMP_CRITICA, float(temps.max()) + 2,
                   color=ACCENT_RED, alpha=0.06, zorder=0)
        ax.axhspan(CPU_CRITICA, 100,
                   color=ACCENT_AMBER, alpha=0.05, zorder=0)
        ax.axvline(TEMP_CRITICA, color=ACCENT_RED,   linewidth=1.0,
                   linestyle="--", alpha=0.6)
        ax.axhline(CPU_CRITICA,  color=ACCENT_AMBER, linewidth=1.0,
                   linestyle="--", alpha=0.6)
        ax.axhline(CPU_ALTA,     color=ACCENT_RED,   linewidth=0.9,
                   linestyle=":",  alpha=0.6)
        _mini_legend(ax, [
            ("Critico", ACCENT_RED),
            ("Advertencia", ACCENT_AMBER),
            ("OK", ACCENT_GREEN),
        ])
        _style_ax(ax, "CPU vs Temperatura", "Temperatura (C)", "CPU (%)")

        self.fig.set_facecolor(MPL_BG)
        self.canvas.draw()

    # ── reporte de texto ──────────────────────────────────────
    def _generar_reporte_texto(self):
        m         = self.metricas
        operador  = self.operador_var.get().strip() or "N/D"
        seed_txt  = self.seed_var.get().strip() or "ninguna"
        ahora     = datetime.datetime.now().strftime("%Y-%m-%d  %H:%M:%S")
        pct_ok    = m["ok"]         / m["total"] * 100
        pct_adv   = m["advertencia"]/ m["total"] * 100
        pct_crit  = m["critico"]    / m["total"] * 100

        # Casos criticos destacados
        criticos = [(i+1, d) for i, d in enumerate(m["detalles_reg"])
                    if d["estado"] == "CRITICO"][:10]  # max 10

        sep  = "=" * 66
        sep2 = "-" * 66

        lineas = [
            sep,
            "   GUARDIAN MONITOR PRO  —  REPORTE DE ANALISIS",
            sep,
            f"  Operador : {operador}",
            f"  Fecha    : {ahora}",
            f"  Seed     : {seed_txt}",
            f"  Registros analizados : {m['total']}",
            sep2,
            "  RESUMEN EJECUTIVO",
            sep2,
            f"  Estado OK          : {m['ok']:>5}  ({pct_ok:.1f}%)",
            f"  Advertencia        : {m['advertencia']:>5}  ({pct_adv:.1f}%)",
            f"  PELIGRO CRITICO    : {m['critico']:>5}  ({pct_crit:.1f}%)",
            "",
            f"  Registros con exceso de energia (>{ENERGIA_MAX}W)  : {m['n_exceso']}",
            f"  Registros con CPU >= {CPU_ALTA}% (proc. limitados) : {m['n_cpu_alta']}",
            sep2,
            "  ESTADISTICAS POR VARIABLE",
            sep2,
            f"  Energia  (W)  — Prom: {m['prom_e']:.1f}  Min: {m['min_e']:.1f}  Max: {m['max_e']:.1f}",
            f"  Temp     (C)  — Prom: {m['prom_t']:.1f}  Min: {m['min_t']:.1f}  Max: {m['max_t']:.1f}",
            f"  CPU      (%)  — Prom: {m['prom_c']:.1f}  Min: {m['min_c']:.1f}  Max: {m['max_c']:.1f}",
            sep2,
            "  REGLAS DEL GUARDIAN APLICADAS",
            sep2,
            f"  [R1] Energia > {ENERGIA_MAX}W       -> exceso reportado",
            f"  [R2] Temp > {TEMP_CRITICA}C  Y  CPU > {CPU_CRITICA}%  -> PELIGRO CRITICO",
            f"  [R3] Solo una condicion              -> ADVERTENCIA",
            f"  [R4] CPU >= {CPU_ALTA}%             -> calculo procesos restantes",
            sep2,
            f"  CASOS CRITICOS DETECTADOS  (primeros {len(criticos)} de {m['critico']})",
            sep2,
        ]
        for num, d in criticos:
            lineas.append(f"  Reg #{num:03d}  |  {d['detalle']}")
        if not criticos:
            lineas.append("  Ninguno — sistema estable.")
        lineas += [
            sep2,
            "  CONCLUSION",
            sep2,
        ]
        if pct_crit > 20:
            lineas.append(f"  ALERTA: {pct_crit:.1f}% de registros en estado critico.")
            lineas.append("  Se recomienda intervencion inmediata.")
        elif pct_adv > 40:
            lineas.append(f"  PRECAUCION: {pct_adv:.1f}% en advertencia. Monitorear de cerca.")
        else:
            lineas.append(f"  Sistema mayormente estable ({pct_ok:.1f}% OK).")
        lineas += [
            "",
            f"  Reporte generado automaticamente por Guardian Monitor Pro",
            f"  Seed reproducible: {seed_txt}",
            sep,
        ]

        self.report_text.config(state="normal")
        self.report_text.delete("1.0", "end")
        self.report_text.insert("end", "\n".join(lineas))
        self.report_text.config(state="disabled")


# ══════════════════════════════════════════════
if __name__ == "__main__":
    app = GuardianApp()
    app.mainloop()