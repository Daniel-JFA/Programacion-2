# The-Data-Center-Guardian
Task 1
# 🛡️ Sistema de Monitoreo: Guardián de Infraestructura v1.0

¡Bienvenido al equipo de monitoreo, Como Programados técnico, tu misión es desarrollar un script en Python capaz de diagnosticar la salud de nuestros servidores en tiempo real. 

Este reto pondrá a prueba tu capacidad para capturar datos, realizar cálculos matemáticos simples y aplicar lógica condicional avanzada.

---

## 📋 Requerimientos del Reto

Deberás crear un archivo llamado `main.py` desde cero y programar las siguientes funcionalidades:

### 1. Captura de Parámetros
El programa debe solicitar al usuario los siguientes datos técnicos:
* **ID del Servidor:** (Texto) Ej: `SRV-MEDELLIN-01`.
* **Carga de CPU:** (Porcentaje 0-100).
* **Temperatura del Rack:** (Grados Celsius).
* **Consumo de Energía:** (Watts).

### 2. Lógica de Diagnóstico (Reglas de Negocio)
Tu script debe evaluar y mostrar los siguientes resultados:

* **⚡ Control de Energía:** Si el consumo es mayor a **400W**, calcular y mostrar cuánto exceso de energía se está consumiendo.
* **🌡️ Alerta Crítica (Lógica Pro):** * Si la **Temperatura > 75°C** Y la **Carga de CPU > 80%**: Mostrar `[PELIGRO CRÍTICO]: Apagado de emergencia inminente`.
    * Si solo una de las dos condiciones se cumple: Mostrar `[ADVERTENCIA]: Rendimiento comprometido`.
    * Si ambas están en rangos normales: Mostrar `[ESTADO]: Operación normal`.
* **📊 Capacidad de Reserva:** Si el servidor está al **90% de carga** o más, informar cuántos procesos adicionales puede recibir antes de colapsar (considerando que cada proceso nuevo consume un **2%**).

---

## 🚀 Instrucciones de Entrega

1. **Entorno:** Abre este repositorio en **GitHub Codespaces**.
2. **Creación:** Crea el archivo `main.py`.
3. **Código:** Desarrolla la solución asegurándote de convertir los datos de entrada (`input`) a números (`int` o `float`).
4. **Envío:** - Realiza un `commit` con el mensaje: "Finalización del sistema de monitoreo".
   - Haz `push` de tus cambios a la rama principal.

---

> *"Un buen código no es solo el que funciona, sino el que previene desastres antes de que ocurran."*
