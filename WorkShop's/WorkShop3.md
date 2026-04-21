🛡️ The-Data-Center-Guardian
Task 3 — Dashboard Analítico con HTML, CSS y JavaScript
📊 Rúbrica de Evaluación

Esta entrega evalúa la evolución del Guardian hacia una aplicación web con:

Generar landing page donde se explique el proyecto
Generación de datos sintéticos
Analítica básica
Visualización en entorno web
Seed modificable (OBLIGATORIO)
🧩 1️⃣ Interfaz Web Funcional

La aplicación debe:

Mostrar una interfaz construida con HTML
Tener estilos aplicados con CSS
Tener botones funcionales
Mostrar métricas visibles
Mostrar gráficos o visualizaciones dentro de la página

Se espera una interfaz organizada, clara y coherente.

🔄 2️⃣ Generación de Datos Sintéticos

Debe existir un botón que:

Genere N registros dinámicamente
Cree datos realistas y coherentes
Permita múltiples ejecuciones sin recargar la página

Los datos no deben estar hardcodeados.

🎲 3️⃣ Seed Modificable (OBLIGATORIO)

Debe existir un campo donde el usuario pueda modificar el valor del seed.

Se debe cumplir que:

Misma seed → mismos datos generados
Seed diferente → datos diferentes

Si el seed no es modificable desde la interfaz, la entrega se considera incompleta.

⚙️ 4️⃣ Reglas del Guardian Correctamente Implementadas

Debe aplicarse correctamente la lógica del sistema:

Energía mayor a 400 → mostrar exceso
Temperatura mayor a 75 y CPU mayor a 80 → PELIGRO CRÍTICO
Solo una condición → ADVERTENCIA
CPU mayor o igual a 90 → cálculo de procesos restantes

Las reglas deben reflejarse en los resultados y/o visualizaciones.

📈 5️⃣ Analítica Implementada

La aplicación debe mostrar métricas globales como mínimo:

Total de registros analizados
Conteo por estado (OK / Advertencia / Crítico)
Promedio, mínimo o máximo de al menos una variable

Las métricas deben actualizarse cuando se generen nuevos datos.

📊 6️⃣ Visualización Gráfica

Debe incluir al menos dos visualizaciones relevantes, por ejemplo:

Histograma de temperatura
Barras de estados
Serie de CPU o temperatura
Scatter CPU vs Temperatura

Los gráficos deben actualizarse cuando se regeneren o analicen nuevos datos.

Puedes usar librerías como Chart.js, ApexCharts o construir visualizaciones propias con HTML/CSS/JS.

🧼 7️⃣ Calidad del Código

Se evaluará que:

El código esté organizado en funciones
Los nombres de variables sean descriptivos
Existan validaciones básicas (por ejemplo N > 0)
La lógica no esté duplicada innecesariamente
La estructura HTML sea clara
El CSS esté ordenado y aporte a la experiencia visual
El JavaScript tenga buena separación de responsabilidades
📌 Criterio General

El objetivo no es solo que funcione, sino que:

Genere datos coherentes
Aplique correctamente las reglas del negocio
Permita análisis reproducible mediante seed
Transforme datos en información visual clara
Genere un informe tipo reporte basado en los resultados
🚀 Requerimientos Técnicos

La solución debe construirse con:

HTML para la estructura
CSS para el diseño visual
JavaScript para la lógica, generación de datos, analítica y actualización dinámica

Archivos mínimos esperados:

index.html
styles.css
script.js
💡 Sugerencia de estructura visual

La aplicación puede tener:

Un título principal
Un formulario con:
cantidad de registros
seed
botón de generar datos
botón de analizar
Un panel de métricas
Un área de visualización de gráficos
Un bloque final de reporte o conclusiones
📝 Entrega esperada

La entrega debe incluir:

Interfaz funcional en navegador
Generación de datos sintéticos
Seed modificable
Aplicación correcta de reglas del Guardian
Analítica visible
Visualizaciones dinámicas
Reporte final en pantalla