# 🚀 Sprint Review: Evolución del The-Data-Center-Guardian (Task 3)

## 🎯 Objetivo del Sprint
Transformar la aplicación base de monitoreo individual en un **Dashboard Analítico** completo, capaz de generar y evaluar masivamente datos sintéticos aplicando reglas de negocio de manera estricta mediante una interfaz web con visualización de datos dinámica, aplicando modularidad en código y alta calidad en la presentación de la información.

## 🛠️ Cambios Implementados

### 1️⃣ Refactorización de la Interfaz Web y Migración a Bulma CSS
*   **Antes:** Formulario simple para ingresar datos de un solo servidor, panel básico de resultados y maquetación CSS completamente manual.
*   **Ahora:** 
    *   Integración del framework **Bulma CSS** mediante CDN para un diseño profesional, limpio y 100% responsivo.
    *   Sección de configuración estricta (`N` registros y `Seed` obligatoria) organizada con el sistema de columnas (`columns`) de Bulma.
    *   Panel de **Métricas Globales** en tarjetas semánticas (`box`).
    *   Contenedores específicos para gráficos estadísticos (`<canvas>`).
    *   Tabla de reporte final (`table is-striped is-hoverable`) con etiquetas (tags) dinámicas coloreadas.
*   **Análisis Riguroso:** La adopción de un framework CSS eliminó más del 95% de la deuda técnica de estilos (el archivo `styles.css` manual quedó casi vacío). Esto delegó la responsabilidad del layout general, sistema de grillas y tipografía a un estándar robusto de la industria. Permite que JavaScript ahora manipule la UI simplemente alternando clases utilitarias (`is-hidden`, `is-success`, `is-danger`), mejorando drásticamente el mantenimiento del proyecto.

### 2️⃣ Generador de Datos Sintéticos con Semilla (Seed)
*   **Antes:** Captura manual de un único servidor dependiente de la acción humana.
*   **Ahora:** Se integró un PRNG (Pseudo-Random Number Generator) utilizando el algoritmo `Mulberry32`. 
*   **Análisis Riguroso:** La función `Math.random()` nativa de JavaScript no permite inicializarse con una semilla, lo que impediría la reproducibilidad de escenarios. Implementar `Mulberry32` garantiza de manera estricta que con un `Seed` específico siempre se generarán exactamente los mismos valores de CPU, Temperatura y Energía.

### 3️⃣ Lógica de Evaluación Masiva (Reglas de Negocio)
*   **Antes:** Se evaluaban reglas sueltas dentro del "event listener" asociado al HTML (alto nivel de acoplamiento).
*   **Ahora:** Se diseñó la función pura `evaluarServidor(servidor)` que encapsula matemáticamente las reglas del Guardian.
*   **Análisis Riguroso:**
    *   **Control de Energía:** Si es `> 400`, calcula y guarda el exceso.
    *   **Estado:** Si Temp `> 75` Y CPU `> 80` marca `CRITICO`. Si solo se da una condición, `ADVERTENCIA`. De lo contrario, `OK`.
    *   **Capacidad de Reserva:** Si CPU `>= 90`, se aplica el cálculo estricto `Math.floor((100 - CPU) / 2)`.
    *   Separación absoluta de responsabilidades: el DOM no se modifica ni se consulta mientras se ejecutan los cálculos lógicos (Mejora drástica de performance).

### 4️⃣ Analítica y Visualización de Datos (Gráficas)
*   **Antes:** Inexistente.
*   **Ahora:** 
    *   La función `analizarDatos()` itera la colección entera para calcular métricas de alto nivel: conteos totales, promedios de temperatura y topes máximos de energía.
    *   Se integró la librería **Chart.js**.
    *   **Visualización 1:** Gráfico de Barras demostrando la distribución consolidada de estados (OK / Advertencia / Crítico).
    *   **Visualización 2:** Gráfico de Dispersión (Scatter) cruzando Temperatura vs CPU, coloreando puntos según severidad y permitiendo notar que el cuadrante superior derecho agrupa inevitablemente las alertas críticas.
*   **Análisis Riguroso:** Se implementó limpieza de memoria para los gráficos en la recarga dinámica. Si el usuario vuelve a generar datos sin refrescar la ventana web, los métodos `destroy()` de las instancias evitan que ocurra el super-renderizado sobre los canvas, previniendo glitcheos visuales.

## 🧼 Calidad de Código y Deuda Técnica Resuelta
*   **Modularidad (Separation of Concerns):** El script JS se segmentó en "Utilidades", "Eventos", "Lógica de Negocio", e "Interacción DOM".
*   **Validaciones Previas:** El sistema no arranca procesamiento si `N <= 0` o el `Seed` no es válido, mejorando la robustez.
*   **UX/UI Elevada:** Empleo de 'badges' visuales coloreados en la tabla de reportes y bloqueo de botoneras mientras los datos no están listos.