// --- Utilidades ---
// Generador de números pseudoaleatorios con semilla (Mulberry32)
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Variables Globales
let datosGenerados = [];
let chartEstadosInstancia = null;
let chartScatterInstancia = null;

// Elementos del DOM
const btnGenerar = document.getElementById("btnGenerar");
const btnAnalizar = document.getElementById("btnAnalizar");
const inputN = document.getElementById("numRegistros");
const inputSeed = document.getElementById("seedValue");
const statusMensaje = document.getElementById("statusMensaje");

// --- Lógica Principal (Controladores de Eventos) ---

btnGenerar.addEventListener("click", () => {
    const N = parseInt(inputN.value);
    const seed = parseInt(inputSeed.value);

    if (isNaN(N) || N <= 0) {
        alert("La cantidad de registros debe ser un número mayor a 0.");
        return;
    }
    if (isNaN(seed)) {
        alert("La semilla debe ser un número válido.");
        return;
    }

    datosGenerados = generarDatosSinteticos(N, seed);
    
    statusMensaje.textContent = `Se han generado ${N} registros con la semilla ${seed}. Listos para analizar.`;
    btnAnalizar.disabled = false;
});

btnAnalizar.addEventListener("click", () => {
    if (datosGenerados.length === 0) return;

    const resultados = analizarDatos(datosGenerados);
    
    actualizarMetricas(resultados.metricas);
    actualizarGraficos(resultados);
    actualizarReporte(resultados.datosAnalizados);

    document.getElementById("panelMetricas").classList.remove("is-hidden");
    document.getElementById("panelGraficos").classList.remove("is-hidden");
    document.getElementById("panelReporte").classList.remove("is-hidden");
});

// --- Funciones de Negocio ---

function generarDatosSinteticos(n, seed) {
    const prng = mulberry32(seed);
    const datos = [];

    for (let i = 0; i < n; i++) {
        // Uso de CPU: entre 5% y 100%
        const cpu = (prng() * 95) + 5; 
        // Temperatura: entre 30°C y 110°C
        const temp = (prng() * 80) + 30;
        // Energía: entre 200W y 600W
        const energia = (prng() * 400) + 200;

        datos.push({
            id: `SRV-${(i + 1).toString().padStart(4, '0')}`,
            cpu: parseFloat(cpu.toFixed(2)),
            temperatura: parseFloat(temp.toFixed(2)),
            energia: parseFloat(energia.toFixed(2))
        });
    }
    return datos;
}

function evaluarServidor(servidor) {
    const { cpu, temperatura, energia } = servidor;
    let estado = "OK";
    let detalles = [];

    if (energia > 400) {
        detalles.push(`Exceso energía: ${(energia - 400).toFixed(2)}W`);
    }
    
    if (temperatura > 75 && cpu > 80) {
        estado = "CRITICO";
        detalles.push("Temp y CPU altas");
    } else if (temperatura > 75 || cpu > 80) {
        estado = "ADVERTENCIA";
        if (temperatura > 75) detalles.push("Temp alta");
        if (cpu > 80) detalles.push("CPU alta");
    }

    if (cpu >= 90) {
        const procesos = Math.floor((100 - cpu) / 2);
        detalles.push(`Reserva: ${procesos} procesos`);
    }

    return {
        ...servidor,
        estado,
        detalles: detalles.join(" | ") || "Operación normal"
    };
}

function analizarDatos(datos) {
    const datosAnalizados = datos.map(evaluarServidor);
    
    let ok = 0, adv = 0, crit = 0;
    let sumTemp = 0;
    let maxEnergia = 0;

    datosAnalizados.forEach(d => {
        if (d.estado === "OK") ok++;
        else if (d.estado === "ADVERTENCIA") adv++;
        else if (d.estado === "CRITICO") crit++;

        sumTemp += d.temperatura;
        if (d.energia > maxEnergia) maxEnergia = d.energia;
    });

    const metricas = {
        total: datos.length,
        ok,
        adv,
        crit,
        promTemp: (sumTemp / datos.length).toFixed(2),
        maxEnergia: maxEnergia.toFixed(2)
    };

    return { datosAnalizados, metricas };
}

// --- Funciones de UI e Inserción en DOM ---

function actualizarMetricas(metricas) {
    document.getElementById("metTotal").textContent = metricas.total;
    document.getElementById("metOk").textContent = metricas.ok;
    document.getElementById("metAdv").textContent = metricas.adv;
    document.getElementById("metCrit").textContent = metricas.crit;
    document.getElementById("metTempProm").textContent = `${metricas.promTemp} °C`;
    document.getElementById("metMaxEnergia").textContent = `${metricas.maxEnergia} W`;
}

function actualizarGraficos(resultados) {
    const { metricas, datosAnalizados } = resultados;

    // 1. Gráfico de Barras de Estados
    const ctxEstados = document.getElementById("chartEstados").getContext("2d");
    if (chartEstadosInstancia) chartEstadosInstancia.destroy();
    
    chartEstadosInstancia = new Chart(ctxEstados, {
        type: 'bar',
        data: {
            labels: ['OK', 'Advertencia', 'Crítico'],
            datasets: [{
                label: 'Cantidad de Servidores',
                data: [metricas.ok, metricas.adv, metricas.crit],
                backgroundColor: ['#28a745', '#ffc107', '#dc3545']
            }]
        },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: 'Distribución por Estados' } }
        }
    });

    // 2. Scatter CPU vs Temperatura
    const ctxScatter = document.getElementById("chartTempCpu").getContext("2d");
    if (chartScatterInstancia) chartScatterInstancia.destroy();

    const scatterData = datosAnalizados.map(d => ({
        x: d.temperatura,
        y: d.cpu,
        estado: d.estado
    }));

    chartScatterInstancia = new Chart(ctxScatter, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'OK',
                    data: scatterData.filter(d => d.estado === 'OK'),
                    backgroundColor: '#28a745'
                },
                {
                    label: 'Advertencia',
                    data: scatterData.filter(d => d.estado === 'ADVERTENCIA'),
                    backgroundColor: '#ffc107'
                },
                {
                    label: 'Crítico',
                    data: scatterData.filter(d => d.estado === 'CRITICO'),
                    backgroundColor: '#dc3545'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: { title: { display: true, text: 'Dispersión: Temperatura vs CPU' } },
            scales: {
                x: { title: { display: true, text: 'Temperatura (°C)' } },
                y: { title: { display: true, text: 'CPU (%)' } }
            }
        }
    });
}

function actualizarReporte(datosAnalizados) {
    const tbody = document.querySelector("#tablaReporte tbody");
    tbody.innerHTML = "";

    datosAnalizados.forEach(d => {
        const tr = document.createElement("tr");
        
        let badgeClass = "is-success";
        if (d.estado === "ADVERTENCIA") badgeClass = "is-warning";
        else if (d.estado === "CRITICO") badgeClass = "is-danger";

        tr.innerHTML = `
            <td><strong>${d.id}</strong></td>
            <td>${d.cpu}</td>
            <td>${d.temperatura}</td>
            <td>${d.energia}</td>
            <td><span class="tag ${badgeClass} is-light">${d.estado}</span></td>
            <td><small>${d.detalles}</small></td>
        `;
        tbody.appendChild(tr);
    });
}
