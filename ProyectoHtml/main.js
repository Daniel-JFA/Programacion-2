const form = document.getElementById("monitorForm");
const resultado = document.getElementById("resultado");

const outId = document.getElementById("outId");
const outCpu = document.getElementById("outCpu");
const outTemp = document.getElementById("outTemp");
const outEnergia = document.getElementById("outEnergia");

const controlEnergia = document.getElementById("controlEnergia");
const estadoServidor = document.getElementById("estadoServidor");
const capacidadReserva = document.getElementById("capacidadReserva");



form.addEventListener("submit", function (event) {
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
        alert("Verifica que CPU, temperatura y energía sean valores numéricos.");
        return;
    }
    
    outId.textContent = idServidor;
    outCpu.textContent = `${cpu.toFixed(2)} %`;
    outTemp.textContent = `${temperatura.toFixed(2)} °C`;
    outEnergia.textContent = `${energia.toFixed(2)} W`;

    if (energia > 400) {
        const exceso = energia - 400;
        controlEnergia.textContent = `Exceso de energía: ${exceso.toFixed(2)} W por encima del límite permitido.`;
    } else {
        controlEnergia.textContent = "Consumo de energía dentro del rango permitido.";
    }

    console.log(energia);
    
    if (temperatura > 75 && cpu > 80) {
        estadoServidor.textContent = "[PELIGRO CRÍTICO]: Apagado de emergencia inminente.";
    } else if (temperatura > 75 || cpu > 80) {
        estadoServidor.textContent = "[ADVERTENCIA]: Rendimiento comprometido.";
    } else {
        estadoServidor.textContent = "[ESTADO]: Operación normal.";
    }

    if (cpu >= 90) {
        const capacidadRestante = 100 - cpu;
        const procesosAdicionales = Math.floor(capacidadRestante / 2);
        capacidadReserva.textContent = `Puede recibir ${procesosAdicionales} procesos adicionales antes de colapsar.`;
    } else {
        capacidadReserva.textContent = "El servidor aún tiene capacidad disponible.";
    }

    resultado.classList.remove("hidden");
});
