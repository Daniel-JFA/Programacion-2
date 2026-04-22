const tablaBody = document.getElementById("tablaBody");
const emptyState = document.getElementById("emptyState");
const resumenRegistros = document.getElementById("resumenRegistros");

const filtroServidor = document.getElementById("filtroServidor");
const filtroOperador = document.getElementById("filtroOperador");
const filtroEstado = document.getElementById("filtroEstado");

let mediciones = [];

function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "-";
    }
    return date.toLocaleString("es-CO");
}

function renderRows(rows) {
    tablaBody.innerHTML = "";

    if (rows.length === 0) {
        emptyState.classList.remove("hidden");
        resumenRegistros.textContent = "0 registros encontrados.";
        return;
    }

    emptyState.classList.add("hidden");
    resumenRegistros.textContent = `${rows.length} registros encontrados.`;

    rows.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.id_medicion}</td>
            <td>${formatDate(item.fecha_medicion)}</td>
            <td>${item.id_servidor}</td>
            <td>${item.operador}</td>
            <td>${item.estado}</td>
            <td>${Number(item.cpu).toFixed(2)}</td>
            <td>${Number(item.temperatura).toFixed(2)}</td>
            <td>${Number(item.energia).toFixed(2)}</td>
        `;
        tablaBody.appendChild(row);
    });
}

function applyFilters() {
    const servidorQuery = filtroServidor.value.trim().toLowerCase();
    const operadorQuery = filtroOperador.value.trim().toLowerCase();
    const estadoQuery = filtroEstado.value;

    const filtered = mediciones.filter((row) => {
        const matchesServidor = !servidorQuery || String(row.id_servidor).toLowerCase().includes(servidorQuery);
        const matchesOperador = !operadorQuery || String(row.operador).toLowerCase().includes(operadorQuery);
        const matchesEstado = !estadoQuery || row.estado === estadoQuery;
        return matchesServidor && matchesOperador && matchesEstado;
    });

    renderRows(filtered);
}

async function loadHistorico() {
    try {
        const response = await fetch("/api/mediciones?all=1");
        if (!response.ok) {
            throw new Error("No se pudo cargar el histórico de mediciones.");
        }

        mediciones = await response.json();
        applyFilters();
    } catch (error) {
        tablaBody.innerHTML = "";
        emptyState.classList.remove("hidden");
        emptyState.textContent = error.message;
        resumenRegistros.textContent = "";
    }
}

filtroServidor.addEventListener("input", applyFilters);
filtroOperador.addEventListener("input", applyFilters);
filtroEstado.addEventListener("change", applyFilters);

loadHistorico();