import tkinter as tk
from tkinter import ttk, messagebox
import random
import math

from matplotlib.figure import Figure
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg


# =========================
# 1) Datos sintéticos (servidores)
# =========================
def generar_datos_sinteticos(n: int, seed: int):
    random.seed(seed)

    servidores = []
    for i in range(n):
        IDs = "SRV-" + str(i + 1)

        # CPU
        Carga = random.uniform(10, 85)
        if random.random() < 0.20:
            Carga = random.uniform(80, 100)

        # Temperatura
        Temp = random.randint(40, 120)

        # Energía 
        Ce = random.uniform(250, 520)
        if random.random() < 0.25:
            Ce = random.uniform(401, 650)

        servidores.append([IDs, Carga, Ce, Temp])

    return servidores


# =========================
# 2) Reglas del Guardian
# =========================
def evaluar_servidor(IDs, Carga, Ce, Temp):
    # Exceso de energía
    exceso = 0
    if Ce > 400:
        exceso = Ce - 400

    # Estado
    if Temp > 75 and Carga > 80:
        estado = "CRITICO"
    elif Temp > 75 or Carga > 80:
        estado = "ADVERTENCIA"
    else:
        estado = "OK"

    # Procesos restantes si CPU >= 90
    procesos = 0
    if Carga >= 90:
        porcentajeFaltante = 100 - Carga
        procesos = math.ceil(porcentajeFaltante / 2)

    return estado, exceso, procesos


# =========================
# 3) Analítica (métricas)
# =========================
def calcular_metricas(servidores_analizados):
    total = len(servidores_analizados)
    if total == 0:
        return {
            "total": 0,
            "ok": 0,
            "adv": 0,
            "crit": 0,
            "prom_temp": 0,
            "min_temp": 0,
            "max_temp": 0,
            "temps": [],
            "exceso_count": 0,
            "procesos_count": 0
        }

    temps = []
    estados = []
    excesos = []
    procesos_list = []
    cargas = []

    for s in servidores_analizados:
        temps.append(s[3])         # Temp
        estados.append(s[4])       # estado
        excesos.append(s[5])       # exceso
        procesos_list.append(s[6]) # procesos
        cargas.append(s[1])      # Carga

    ok = estados.count("OK")
    adv = estados.count("ADVERTENCIA")
    crit = estados.count("CRITICO")

    exceso_count = 0
    for e in excesos:
        if e > 0:
            exceso_count += 1

    procesos_count = 0
    for p in procesos_list:
        if p > 0:
            procesos_count += 1

    return {
        "total": total,
        "ok": ok,
        "adv": adv,
        "crit": crit,
        "prom_cpu": sum(cargas) / total,
        "prom_temp": sum(temps) / total,
        "min_temp": min(temps),
        "max_temp": max(temps),
        "temps": temps,
        "exceso_count": exceso_count,
        "procesos_count": procesos_count
    }


# =========================
# 4) Tkinter + Matplotlib
# =========================
class App(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("The-Data-Center-Guardian — Task 3")
        self.geometry("1150x680")

        self.servidores = []             # [IDs, Carga, Ce, Temp]
        self.servidores_analizados = []  # [IDs, Carga, Ce, Temp, estado, exceso, procesos]
        self.metricas = None
        self.seed_actual = 42

        self._build_ui()

    def _build_ui(self):
        top = ttk.Frame(self, padding=10)
        top.pack(fill="x")

        ttk.Label(top, text="Técnico:").pack(side="left")
        self.tecnico_var = tk.StringVar(value="")
        ttk.Entry(top, textvariable=self.tecnico_var, width=25).pack(side="left", padx=8)

        ttk.Label(top, text="N servidores:").pack(side="left")
        self.n_var = tk.IntVar(value=30)
        ttk.Entry(top, textvariable=self.n_var, width=8).pack(side="left", padx=8)

        ttk.Label(top, text="Seed:").pack(side="left")
        self.seed_var = tk.IntVar(value=42)
        ttk.Entry(top, textvariable=self.seed_var, width=10).pack(side="left", padx=8)

        ttk.Button(top, text="Generar datos sintéticos", command=self.on_generar).pack(side="left", padx=6)
        ttk.Button(top, text="Analizar + Graficar", command=self.on_analizar).pack(side="left", padx=6)
        ttk.Button(top, text="Regenerar (otra muestra)", command=self.on_regenerar).pack(side="left", padx=6)

        # Panel métricas
        self.stats = ttk.LabelFrame(self, text="Métricas", padding=10)
        self.stats.pack(fill="x", padx=10, pady=5)

        self.stats_text = tk.StringVar(value="Genera datos sintéticos para iniciar.")
        ttk.Label(self.stats, textvariable=self.stats_text, font=("Segoe UI", 11)).pack(anchor="w")

        # Panel gráficos
        self.graphs = ttk.LabelFrame(self, text="Visualización", padding=10)
        self.graphs.pack(fill="both", expand=True, padx=10, pady=10)

        self.fig = Figure(figsize=(10, 4.8), dpi=100)
        self.ax1 = self.fig.add_subplot(121)  # hist temp
        self.ax2 = self.fig.add_subplot(122)  # barras estado

        self.canvas = FigureCanvasTkAgg(self.fig, master=self.graphs)
        self.canvas.get_tk_widget().pack(fill="both", expand=True)

    def on_generar(self):
        n = self.n_var.get()
        if n <= 0:
            messagebox.showerror("Error", "N debe ser mayor a 0.")
            return

        self.seed_actual = self.seed_var.get()

        datos = generar_datos_sinteticos(n, seed=self.seed_actual)
        self.servidores = datos

        self.servidores_analizados = []
        self.metricas = None
        self._limpiar_graficas()

        self.stats_text.set(
            f"Datos generados (seed={self.seed_actual}). Registros: {len(self.servidores)}. "
            f"Presiona 'Analizar + Graficar'."
        )
        self.canvas.draw()

    def on_regenerar(self):
        n = self.n_var.get()
        if n <= 0:
            messagebox.showerror("Error", "N debe ser mayor a 0.")
            return

        # Nueva muestra: seed distinta
        self.seed_actual = random.randint(1, 9999)
        self.seed_var.set(self.seed_actual)
        self.on_generar()

    def on_analizar(self):
        if not self.servidores:
            messagebox.showwarning("Atención", "Primero genera datos sintéticos.")
            return

        self.servidores_analizados = []

        for fila in self.servidores:
            IDs = fila[0]
            Carga = fila[1]
            Ce = fila[2]
            Temp = fila[3]

            estado, exceso, procesos = evaluar_servidor(IDs, Carga, Ce, Temp)
            self.servidores_analizados.append([IDs, Carga, Ce, Temp, estado, exceso, procesos])

        self.metricas = calcular_metricas(self.servidores_analizados)

        t = self.tecnico_var.get().strip() or "N/D"
        m = self.metricas

        resumen = (
            f"Técnico: {t} | Seed: {self.seed_actual}\n"
            f"Total analizados: {m['total']}\n"
            f"Estados: {m['ok']} | Advertencia: {m['adv']} | Crítico: {m['crit']}\n"
            f"CPU promedio: {m['prom_cpu']:.2f}\n"
            f"Temperatura → Prom: {m['prom_temp']:.2f} | Min: {m['min_temp']} | Max: {m['max_temp']}\n"
            f"Energía>400: {m['exceso_count']} | CPU>=90 (procesos): {m['procesos_count']}"
        )
        self.stats_text.set(resumen)

        self._graficar()

    def _limpiar_graficas(self):
        self.ax1.clear()
        self.ax2.clear()

    def _graficar(self):
        self._limpiar_graficas()
        m = self.metricas

        temps = m["temps"]

        # Histograma de temperatura
        self.ax1.set_title("Histograma de Temperatura")
        self.ax1.set_xlabel("Temp (°C)")
        self.ax1.set_ylabel("Frecuencia")
        self.ax1.hist(temps, bins=12)

        # Barras de estados
        self.ax2.set_title("Barras por Estado")
        self.ax2.set_xlabel("Estado")
        self.ax2.set_ylabel("Cantidad")
        self.ax2.bar(["OK", "ADVERTENCIA", "CRITICO"], [m["ok"], m["adv"], m["crit"]])

        self.fig.tight_layout()
        self.canvas.draw()


if __name__ == "__main__":
    app = App()
    app.mainloop()