const form = document.getElementById("monitorForm");
const resultado = document.getElementById("resultado");
const loadingPanel = document.getElementById("loadingPanel");
const submitBtn = document.getElementById("submitBtn");
const operadorSelect = document.getElementById("operadorMedicion");
const estadoRegistroSelect = document.getElementById("estadoRegistro");

const outId = document.getElementById("outId");
const outOperador = document.getElementById("outOperador");
const outEstado = document.getElementById("outEstado");
const outCpu = document.getElementById("outCpu");
const outTemp = document.getElementById("outTemp");
const outEnergia = document.getElementById("outEnergia");

const controlEnergia = document.getElementById("controlEnergia");
const estadoServidor = document.getElementById("estadoServidor");
const capacidadReserva = document.getElementById("capacidadReserva");

const toastContainer = document.createElement("div");
toastContainer.className = "toast-container";
document.body.appendChild(toastContainer);

function mostrarToast(mensaje, tipo = "info") {
    const toast = document.createElement("article");
    toast.className = `toast toast-${tipo}`;
    toast.setAttribute("role", "status");
    toast.textContent = mensaje;

    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 250);
    }, 3200);
}

async function cargarOperadores() {
    const response = await fetch("/api/operadores");

    if (!response.ok) {
        throw new Error("No se pudieron cargar los usuarios.");
    }

    const data = await response.json();
    operadorSelect.innerHTML = "";

    if (data.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "Sin usuarios disponibles";
        operadorSelect.appendChild(option);
        operadorSelect.disabled = true;
        return;
    }

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione un usuario";
    operadorSelect.appendChild(defaultOption);

    data.forEach((operador) => {
        const option = document.createElement("option");
        option.value = String(operador.id_operador);
        option.textContent = `${operador.nombre} (${operador.estado})`;
        operadorSelect.appendChild(option);
    });
}

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
    outOperador.textContent = data.operadorMedicion;
    outEstado.textContent = data.estadoRegistro;
    outCpu.textContent = `${data.cpu.toFixed(2)} %`;
    outTemp.textContent = `${data.temperatura.toFixed(2)} C`;
    outEnergia.textContent = `${data.energia.toFixed(2)} W`;
    controlEnergia.textContent = data.mensajeEnergia;
    estadoServidor.textContent = data.mensajeEstado;
    capacidadReserva.textContent = data.mensajeCapacidad;
}


form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const operadorSeleccionado = operadorSelect.value;
    const operadorTexto = operadorSelect.selectedOptions[0]?.textContent || "";
    const estadoRegistro = estadoRegistroSelect.value;
    const idServidor = document.getElementById("idServidor").value.trim();
    const cpu = Number(document.getElementById("cpu").value);
    const temperatura = Number(document.getElementById("temperatura").value);
    const energia = Number(document.getElementById("energia").value);

    if (!operadorSeleccionado) {
        mostrarToast("Selecciona el usuario que realiza la medición.", "warning");
        return;
    }

    if (!idServidor) {
        mostrarToast("Ingresa el ID del servidor.", "warning");
        return;
    }

    if ([cpu, temperatura, energia].some(Number.isNaN)) {
        mostrarToast("Verifica que CPU, temperatura y energia sean valores numéricos.", "warning");
        return;
    }

    const reporte = construirReporte(cpu, temperatura, energia);

    submitBtn.disabled = true;
    submitBtn.textContent = "Procesando...";

    resultado.classList.add("hidden");
    loadingPanel.classList.remove("hidden");

    try {
        await esperar(3000);

        const saveResponse = await fetch("/api/mediciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                idServidor,
                idOperador: Number(operadorSeleccionado),
                estado: estadoRegistro,
                cpu,
                temperatura,
                energia
            })
        });

        if (!saveResponse.ok) {
            const errorData = await saveResponse.json().catch(() => ({}));
            throw new Error(errorData.error || "No se pudo guardar la medición.");
        }

        mostrarToast("Medición guardada correctamente.", "success");

        pintarSalida({
            idServidor,
            operadorMedicion: operadorTexto,
            estadoRegistro,
            cpu,
            temperatura,
            energia,
            mensajeEnergia: reporte.mensajeEnergia,
            mensajeEstado: reporte.mensajeEstado,
            mensajeCapacidad: reporte.mensajeCapacidad
        });

        form.reset();

        loadingPanel.classList.add("hidden");
        resultado.classList.remove("hidden");
    } catch (error) {
        console.error(error);
        mostrarToast(error.message || "Ocurrió un error al guardar la medición.", "error");
        loadingPanel.classList.add("hidden");
        resultado.classList.add("hidden");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Generar Reporte";
    }
});

cargarOperadores().catch((error) => {
    console.error(error);
    operadorSelect.innerHTML = "<option value=''>Error cargando usuarios</option>";
    operadorSelect.disabled = true;
    mostrarToast("No se pudieron cargar los usuarios.", "error");
});
