const form = document.getElementById("monitorForm");
const resultado = document.getElementById("resultado");
const loadingPanel = document.getElementById("loadingPanel");
const submitBtn = document.getElementById("submitBtn");

const outId = document.getElementById("outId");
const outCpu = document.getElementById("outCpu");
const outTemp = document.getElementById("outTemp");
const outEnergia = document.getElementById("outEnergia");

const controlEnergia = document.getElementById("controlEnergia");
const estadoServidor = document.getElementById("estadoServidor");
const capacidadReserva = document.getElementById("capacidadReserva");

function construirReporte(cpu, temperatura, energia) {
    let mensajeEnergia = "Consumo de energia dentro del rango permitido.";

    if (energia > 400) {
        const exceso = energia - 400;
        mensajeEnergia = `Exceso de energia: ${exceso.toFixed(2)} W por encima del limite permitido.`;
    }

    let mensajeEstado = "[ESTADO]: Operacion normal.";

    if (temperatura > 75 && cpu > 80) {
        mensajeEstado = "[PELIGRO CRITICO]: Apagado de emergencia inminente.";
    } else if (temperatura > 75 || cpu > 80) {
        mensajeEstado = "[ADVERTENCIA]: Rendimiento comprometido.";
    }

    let mensajeCapacidad = "El servidor aun tiene capacidad disponible.";

    if (cpu >= 90) {
        const capacidadRestante = 100 - cpu;
        const procesosAdicionales = Math.floor(capacidadRestante / 2);
        mensajeCapacidad = `Puede recibir ${procesosAdicionales} procesos adicionales antes de colapsar.`;
    }

    return {
        mensajeEnergia,
        mensajeEstado,
        mensajeCapacidad
    };
}

function esperar(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}

function pintarSalida(data) {
    outId.textContent = data.idServidor;
    outCpu.textContent = `${data.cpu.toFixed(2)} %`;
    outTemp.textContent = `${data.temperatura.toFixed(2)} C`;
    outEnergia.textContent = `${data.energia.toFixed(2)} W`;
    controlEnergia.textContent = data.mensajeEnergia;
    estadoServidor.textContent = data.mensajeEstado;
    capacidadReserva.textContent = data.mensajeCapacidad;
}


form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const idServidor = document.getElementById("idServidor").value.trim();
    const cpu = Number(document.getElementById("cpu").value);
    const temperatura = Number(document.getElementById("temperatura").value);
    const energia = Number(document.getElementById("energia").value);

    if (!idServidor) {
        alert("Ingresa el ID del servidor.");
        return;
    }

    if ([cpu, temperatura, energia].some(Number.isNaN)) {
        alert("Verifica que CPU, temperatura y energia sean valores numericos.");
        return;
    }

    const reporte = construirReporte(cpu, temperatura, energia);

    submitBtn.disabled = true;
    submitBtn.textContent = "Procesando...";

    resultado.classList.add("hidden");
    loadingPanel.classList.remove("hidden");

    await esperar(3000);

    pintarSalida({
        idServidor,
        cpu,
        temperatura,
        energia,
        mensajeEnergia: reporte.mensajeEnergia,
        mensajeEstado: reporte.mensajeEstado,
        mensajeCapacidad: reporte.mensajeCapacidad
    });

    loadingPanel.classList.add("hidden");
    resultado.classList.remove("hidden");

    submitBtn.disabled = false;
    submitBtn.textContent = "Generar Reporte";
});
