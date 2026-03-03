# The-Data-Center-Guardian
Task 2

# 🛡️ Sistema de Monitoreo: Guardián de Infraestructura v2.0
¡Bienvenido nuevamente al equipo de monitoreo! Como Programador técnico, tu misión ahora es evolucionar el sistema del reto anterior para que pueda diagnosticar **múltiples servidores automáticamente**, utilizando listas, matrices y procesamiento masivo de datos.

Este reto pondrá a prueba tu capacidad para trabajar con estructuras de datos, automatizar procesos mediante bucles y aplicar lógica condicional sobre múltiples registros.

---

# 📋 Requerimientos del Reto

Deberás crear un archivo llamado **main.py** desde cero y programar las siguientes funcionalidades:

---

1. Captura General del Sistema

El programa debe solicitar:

* Nombre del técnico (Texto).
* Número de servidores a revisar (entero).

---

2. Captura Masiva con Matrices

Debes crear una lista llamada **servidores** donde almacenarás la información de todos los servidores.

Cada servidor debe guardarse como una fila con la siguiente estructura:

[id_servidor, cpu, temperatura, energia]

Para cada servidor el programa debe solicitar:

* ID del Servidor (Texto) Ej: SRV-MEDELLIN-01.
* Carga de CPU (Porcentaje 0-100).
* Consumo de Energía (Watts).

---

3. Temperatura del Rack (OBLIGATORIO)

La temperatura del rack debe generarse automáticamente usando el método **random**.

# ⚠️ Condición obligatoria:
La temperatura debe estar en un rango entre **40 y 120 grados Celsius**.

---

4. Lógica de Diagnóstico (Reglas de Negocio)

Tu script debe evaluar cada servidor dentro de la matriz y mostrar los siguientes resultados:

# ⚡ Control de Energía:
Si el consumo es mayor a 400W, calcular y mostrar cuánto exceso de energía se está consumiendo.

# 🌡️ Alerta Crítica (Lógica Pro):

* Si la Temperatura > 75°C Y la Carga de CPU > 80%: Mostrar [PELIGRO CRÍTICO]: Apagado de emergencia inminente.
* Si solo una de las condiciones se cumple: Mostrar [ADVERTENCIA]: Rendimiento comprometido.
* Si ambas están en rangos normales: Mostrar [ESTADO]: Operación normal.

# 📊 Capacidad de Reserva:
Si el servidor está al 90% de carga o más, informar cuántos procesos adicionales puede recibir antes de colapsar (considerando que cada proceso nuevo consume un 2%).

---

5. Reporte Final (Procesamiento Masivo)

El programa debe:

* Mostrar un reporte por cada servidor evaluado.
* Crear una lista llamada **servidores_en_riesgo** que almacene únicamente los servidores que NO estén en estado normal.
* Guardar para cada servidor en riesgo:

  * número del servidor
  * ID
  * razones del riesgo (lista de motivos)

Ejemplo conceptual:

(1, "SRV-01", ["temperatura alta", "cpu alta"])

Al finalizar, imprimir el resumen de servidores en riesgo.

---

# 🌟 Bonus (Puntos Extra)

* Usar la librería math para redondear procesos restantes.
* Usar f-strings para todos los reportes.
* Mantener código limpio y legible siguiendo prigitncipios vistos en clase.

---

# 🚀 Instrucciones de Entrega

Código: Desarrolla la solución usando listas, matrices y bucles.
Envío:

* Realiza un commit con el mensaje: "Finalización del sistema de monitoreo v2".
* Haz push de tus cambios a la rama principal.
* Fecha de entrega 26/02/2026 23:59:59.

---

# "Un buen código no es solo el que funciona, sino el que automatiza el trabajo que antes hacías manualmente."
