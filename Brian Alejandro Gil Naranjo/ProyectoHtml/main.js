// --- Configuración de Supabase ---
// Las variables ahora se cargan desde config.js, que es generado por el build script.
const SUPABASE_URL = window.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.env.SUPABASE_ANON_KEY;

// Corregido: Renombramos la variable del cliente para no entrar en conflicto con el objeto global 'supabase' del CDN.
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Variables Globales
let datosGenerados = [];
let datosAnalizadosGlobal = []; // Almacena los datos analizados para poder filtrarlos sin recalcular
let chartEstadosInstancia = null;
let chartScatterInstancia = null;

// Elementos del DOM
const statusMensaje = document.getElementById("statusMensaje");
const formAgregarServidor = document.getElementById('formAgregarServidor');
const btnAgregarServidor = document.getElementById('btnAgregarServidor');

// --- Lógica Principal (Controladores de Eventos) ---

/**
 * Función principal que carga los datos desde la API, los procesa y actualiza
 * toda la interfaz de usuario (métricas, gráficos y reportes).
 */
async function cargarYRenderizarDatos() {
    statusMensaje.textContent = "Cargando y analizando datos desde Supabase...";
    try {
        const datosDesdeAPI = await obtenerDatosDesdeAPI();
        
        // Mapeamos los nombres de las columnas de la BD a los que espera la lógica de análisis
        datosGenerados = datosDesdeAPI.map(servidor => ({
            id: servidor.server_id,
            cpu: servidor.cpu,
            temperatura: servidor.temperature,
            energia: servidor.energy
        }));

        if (datosGenerados.length === 0) {
            statusMensaje.textContent = "No se encontraron datos. Agrega un servidor para comenzar.";
            document.getElementById("panelInsercion").classList.remove("is-hidden");
            document.getElementById("panelMetricas").classList.add("is-hidden");
            document.getElementById("panelGraficos").classList.add("is-hidden");
            document.getElementById("panelReporte").classList.add("is-hidden");
            return;
        }

        statusMensaje.textContent = `Análisis completado para ${datosGenerados.length} servidores.`;
        
        // Una vez cargados los datos, los analizamos y mostramos todo
        const resultados = analizarDatos(datosGenerados);
        datosAnalizadosGlobal = resultados.datosAnalizados; // Guardamos los datos analizados globalmente

        actualizarMetricas(resultados.metricas);
        actualizarGraficos(resultados);

        // Al cargar datos, reseteamos el filtro a "Todos" y renderizamos el reporte.
        document.querySelectorAll('#reporteFiltros a').forEach(a => a.classList.remove('is-active'));
        document.querySelector('#reporteFiltros a[data-filter="TODOS"]').classList.add('is-active');
        actualizarReporte(datosAnalizadosGlobal);
        // Al cargar/refrescar, mostramos solo el panel de inserción por defecto.
        document.getElementById("panelInsercion").classList.remove("is-hidden");
        document.getElementById("panelMetricas").classList.add("is-hidden");
        document.getElementById("panelGraficos").classList.add("is-hidden");
        document.getElementById("panelReporte").classList.add("is-hidden");

    } catch (error) {
        statusMensaje.textContent = `Error: ${error.message}. Revisa la configuración de Supabase y tu conexión a internet.`;
        alert(`Error al cargar los datos: ${error.message}. Revisa la consola para más detalles.`);
    }
}

// Event listener para el nuevo formulario de inserción
formAgregarServidor.addEventListener('submit', async (event) => {
    event.preventDefault(); // Previene que la página se recargue
    
    btnAgregarServidor.classList.add('is-loading');
    statusMensaje.textContent = 'Guardando nuevo servidor...';

    // Obtiene los datos del formulario
    const nuevoServidor = {
        server_id: document.getElementById('serverId').value,
        cpu: parseFloat(document.getElementById('serverCpu').value),
        temperature: parseFloat(document.getElementById('serverTemp').value),
        energy: parseFloat(document.getElementById('serverEnergy').value)
    };

    try {
        const { data, error } = await supabaseClient
            .from('servers')
            .insert([nuevoServidor]) // Supabase espera un array de objetos
            .select(); // .select() devuelve el registro insertado

        if (error) {
            // Manejar errores específicos de Supabase, como claves duplicadas
            if (error.code === '23505') { // Código de violación de unicidad en PostgreSQL
                throw new Error(`El ID de servidor '${nuevoServidor.server_id}' ya existe.`);
            }
            throw error; // Lanza otros errores
        }

        statusMensaje.textContent = `Servidor '${data[0].server_id}' agregado exitosamente.`;
        
        formAgregarServidor.reset(); // Limpia el formulario
        await cargarYRenderizarDatos(); // Recarga y renderiza todos los datos

    } catch (error) {
        statusMensaje.textContent = `Error al guardar: ${error.message}`;
        alert(`Error al guardar el servidor: ${error.message}`);
    } finally {
        btnAgregarServidor.classList.remove('is-loading');
    }
});

// --- Funciones de Negocio ---

/**
 * Obtiene los datos de los servidores desde nuestra API de Node.js.
 */
async function obtenerDatosDesdeAPI() {
    const { data, error } = await supabaseClient
        .from('servers')
        .select('*')
        .order('created_at', { ascending: false }); // Opcional: ordenar por más reciente

    if (error) {
        console.error("Falló la obtención de datos desde Supabase:", error);
        // Relanzamos el error para que el controlador del evento lo capture.
        throw new Error(error.message);
    }

    return data;
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
            plugins: { title: { display: true, text: 'Distribución por Estados' } },
            onClick: (event, elements) => {
                if (elements.length === 0) return; // No se hizo clic en una barra
                const index = elements[0].index;
                const filtro = ['OK', 'ADVERTENCIA', 'CRITICO'][index];
                
                if (filtro) {
                    navegarYFiltrar(filtro);
                }
            }
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
    const listaServidores = document.getElementById("listaServidores");
    listaServidores.innerHTML = ""; // Limpia la lista anterior

    if (datosAnalizados.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'panel-block';
        placeholder.textContent = 'No hay servidores que coincidan con el filtro seleccionado.';
        listaServidores.appendChild(placeholder);
        return;
    }

    datosAnalizados.forEach(d => {
        const panelBlock = document.createElement("a");
        panelBlock.className = "panel-block is-flex-direction-column is-align-items-flex-start";
        
        let iconClass = "fa-check-circle has-text-success";
        let tagClass = "is-success";
        if (d.estado === "ADVERTENCIA") {
            iconClass = "fa-exclamation-triangle has-text-warning-dark";
            tagClass = "is-warning";
        } else if (d.estado === "CRITICO") {
            iconClass = "fa-times-circle has-text-danger";
            tagClass = "is-danger";
        }

        panelBlock.innerHTML = `
            <div class="is-flex is-justify-content-space-between is-align-items-center is-fullwidth">
                <span class="icon-text"><span class="panel-icon"><i class="fas ${iconClass}"></i></span><span><strong>${d.id}</strong></span></span>
                <span class="tag ${tagClass}">${d.estado}</span>
            </div>
            <div class="content is-small pl-5 mt-1"><strong>CPU:</strong> ${d.cpu}% | <strong>Temp:</strong> ${d.temperatura}°C | <strong>Energía:</strong> ${d.energia}W<br><em>${d.detalles}</em></div>
        `;
        listaServidores.appendChild(panelBlock);
    });
}

// --- Lógica de Navegación de la Navbar ---
// Esta sección maneja el click en los enlaces de la barra de navegación
// para mostrar solo la sección correspondiente.

const navLinks = document.querySelectorAll('.navbar-brand .navbar-item, .navbar-menu .navbar-item');
const contentPanels = [
    document.getElementById('panelInsercion'),
    document.getElementById('panelMetricas'),
    document.getElementById('panelGraficos'),
    document.getElementById('panelReporte')
];

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const targetId = link.getAttribute('href').substring(1); // Obtiene el ID del panel (ej: "panelMetricas")

        // Itera sobre todos los paneles de contenido
        contentPanels.forEach(panel => {
            if (panel) {
                // Si el ID del panel coincide con el objetivo, lo muestra. De lo contrario, lo oculta.
                panel.classList.toggle('is-hidden', panel.id !== targetId);
            }
        });
    });
});

// --- Lógica de Filtros del Reporte ---
const reporteFiltros = document.getElementById('reporteFiltros');

reporteFiltros.addEventListener('click', (event) => {
    const target = event.target;
    // Asegurarnos de que el click fue en un enlace 'a' dentro del contenedor de filtros
    if (target.tagName !== 'A' || !target.hasAttribute('data-filter')) return;

    // Gestionar la clase 'is-active' para el feedback visual
    reporteFiltros.querySelectorAll('a').forEach(a => a.classList.remove('is-active'));
    target.classList.add('is-active');

    const filtro = target.dataset.filter;
    let datosFiltrados;

    if (filtro === 'TODOS') {
        datosFiltrados = datosAnalizadosGlobal;
    } else {
        datosFiltrados = datosAnalizadosGlobal.filter(d => d.estado === filtro);
    }

    actualizarReporte(datosFiltrados);
});

// --- Lógica de Navegación Cruzada (Métricas/Gráficos -> Reporte) ---

/**
 * Helper para navegar al panel de reporte y aplicar un filtro específico.
 * @param {string} filtro El filtro a aplicar ('TODOS', 'OK', 'ADVERTENCIA', 'CRITICO')
 */
function navegarYFiltrar(filtro) {
    // 1. Encontrar y activar el tab de filtro correspondiente en el reporte
    const filtroTab = document.querySelector(`#reporteFiltros a[data-filter="${filtro}"]`);
    if (filtroTab) {
        // Usar .click() para reutilizar la lógica del event listener de filtros existente
        filtroTab.click(); 
    }

    // 2. Cambiar la vista para mostrar únicamente el panel de reporte
    contentPanels.forEach(panel => {
        panel.classList.toggle('is-hidden', panel.id !== 'panelReporte');
    });

    // 3. Opcional: Hacer scroll hasta el panel de reporte para mejor UX
    document.getElementById('panelReporte').scrollIntoView();
}

// Añadir listeners a las métricas clicables
const metricasClicables = document.querySelectorAll('#panelMetricas .panel-block[data-filter]');

metricasClicables.forEach(metrica => {
    metrica.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del enlace
        const filtro = metrica.dataset.filter;
        navegarYFiltrar(filtro);
    });
});

// --- Lógica de Modo Oscuro ---
const darkModeToggle = document.getElementById('darkModeToggle');
const htmlElement = document.documentElement;
const moonIcon = '<i class="fas fa-moon"></i>';
const sunIcon = '<i class="fas fa-sun"></i>';

function setDarkMode(isDark) {
    const toggleIcon = darkModeToggle.querySelector('.icon');
    if (isDark) {
        htmlElement.classList.add('dark-mode');
        if (toggleIcon) toggleIcon.innerHTML = sunIcon;
        Chart.defaults.color = '#f5f5f5'; // Color de texto para los gráficos
    } else {
        htmlElement.classList.remove('dark-mode');
        if (toggleIcon) toggleIcon.innerHTML = moonIcon;
        Chart.defaults.color = '#666'; // Color por defecto de Chart.js para texto
    }
    // Forzar la actualización de los gráficos para que tomen el nuevo color
    if (chartEstadosInstancia) chartEstadosInstancia.update();
    if (chartScatterInstancia) chartScatterInstancia.update();
}

// --- INICIALIZACIÓN ---
// Carga los datos tan pronto como la página esté lista para que no se vea vacía.
document.addEventListener('DOMContentLoaded', () => {
    // Listener para el botón de modo oscuro
    darkModeToggle.addEventListener('click', () => {
        // Alterna la clase en el elemento <html>
        const isDarkMode = htmlElement.classList.toggle('dark-mode');
        // Guarda la preferencia en el almacenamiento local del navegador
        localStorage.setItem('darkMode', isDarkMode);
        // Aplica los cambios visuales
        setDarkMode(isDarkMode);
    });

    // Al cargar la página, aplicar el modo oscuro si estaba guardado
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);

    cargarYRenderizarDatos();
});
