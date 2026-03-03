# 🛡️ The-Data-Center-Guardian

## Task 3 — Dashboard Analítico con Tkinter

---

## 📊 Rúbrica de Evaluación

Esta entrega evalúa la evolución del Guardian hacia una aplicación con:

* Generación de datos sintéticos
* Analítica básica
* Visualización con Tkinter + Matplotlib
* **Seed modificable (OBLIGATORIO)**

---

## 🧩 1️⃣ Interfaz Gráfica Funcional

La aplicación debe:

* Abrir correctamente una ventana Tkinter
* Tener botones funcionales
* Mostrar métricas visibles
* Mostrar gráficos dentro de la ventana

Se espera una interfaz organizada y coherente.

---

## 🔄 2️⃣ Generación de Datos Sintéticos

Debe existir un botón que:

* Genere N registros dinámicamente
* Cree datos realistas y coherentes
* Permita múltiples ejecuciones sin cerrar el programa

Los datos no deben estar hardcodeados.

---

## 🎲 3️⃣ Seed Modificable (OBLIGATORIO)

Debe existir un campo donde el usuario pueda modificar el valor del `seed`.

Se debe cumplir que:

* Misma seed → mismos datos generados
* Seed diferente → datos diferentes

Si el seed no es modificable desde la interfaz, la entrega se considera incompleta.

---

## ⚙️ 4️⃣ Reglas del Guardian Correctamente Implementadas

Debe aplicarse correctamente la lógica del sistema:

* Energía mayor a 400 → mostrar exceso
* Temperatura mayor a 75 y CPU mayor a 80 → PELIGRO CRÍTICO
* Solo una condición → ADVERTENCIA
* CPU mayor o igual a 90 → cálculo de procesos restantes

Las reglas deben reflejarse en los resultados y/o visualizaciones.

---

## 📈 5️⃣ Analítica Implementada

La aplicación debe mostrar métricas globales como mínimo:

* Total de registros analizados
* Conteo por estado (OK / Advertencia / Crítico)
* Promedio, mínimo o máximo de al menos una variable

Las métricas deben actualizarse cuando se generen nuevos datos.

---

## 📊 6️⃣ Visualización Gráfica

Debe incluir al menos dos gráficos relevantes, por ejemplo:

* Histograma de temperatura
* Barras de estados
* Serie de CPU o temperatura
* Scatter CPU vs Temperatura

Los gráficos deben actualizarse cuando se regeneren o analicen nuevos datos.

---

## 🧼 7️⃣ Calidad del Código

Se evaluará que:

* El código esté organizado en funciones
* Los nombres de variables sean descriptivos
* Se utilicen f-strings correctamente
* Existan validaciones básicas (por ejemplo N > 0)
* La lógica no esté duplicada innecesariamente

---

## 📌 Criterio General

El objetivo no es solo que funcione, sino que:

* Genere datos coherentes
* Aplique correctamente las reglas del negocio
* Permita análisis reproducible mediante seed
* Transforme datos en información visual clara
* Genere un informe tipo reporte basado en los resultados

---

> ### “Un sistema profesional no solo genera datos… los convierte en información útil.”
