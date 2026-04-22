# Diccionario de Datos

Documento de referencia para las variables, entradas y salidas del sistema de monitoreo.

## Variables de entrada

| Variable | Tipo | Ejemplo | Regla de validación | Uso |
| --- | --- | --- | --- | --- |
| idServidor | Texto | SRV-01 | No puede estar vacío | Identifica el servidor a analizar. |
| operadorMedicion | Texto | Ana Perez | No puede estar vacío | Indica quien realiza la medicion. |
| cpu | Decimal | 82.5 | Debe ser numérico y estar entre 0 y 100 | Determina carga operativa y capacidad de reserva. |
| temperatura | Decimal | 78.2 | Debe ser numérico | Participa en el cálculo del estado del servidor. |
| energia | Decimal | 420 | Debe ser numérico y mayor o igual a 0 | Define si el sistema supera el límite de energía. |
| estado | Texto | Activo | Debe ser Activo o Inactivo | Controla si el registro o entidad se encuentra habilitada. |

## Variables calculadas

| Variable | Tipo | Fórmula / Regla | Descripción |
| --- | --- | --- | --- |
| exceso | Decimal | energia - 400 si energia > 400 | Mide cuánto se excede el consumo permitido. |
| capacidadRestante | Decimal | 100 - cpu si cpu >= 90 | Muestra cuánta CPU queda antes del colapso. |
| procesosAdicionales | Entero | Math.floor(capacidadRestante / 2) | Estima procesos extra soportados. |
| mensajeEnergia | Texto | Según condición de energía | Mensaje visible en el reporte. |
| mensajeEstado | Texto | Según CPU y temperatura | Mensaje visible en el reporte. |
| mensajeCapacidad | Texto | Según CPU | Mensaje visible en el reporte. |
| operadorMedicion | Texto | DOM / BD | Muestra quien realizo la medicion. |
| estado | Texto | DOM / BD | Indica si el registro o entidad esta activa o inactiva. |

## Elementos de salida en pantalla

| Elemento DOM | Tipo | Contenido |
| --- | --- | --- |
| outId | Span | ID del servidor ingresado. |
| outCpu | Span | CPU con formato de porcentaje. |
| outTemp | Span | Temperatura con unidad Celsius. |
| outEnergia | Span | Consumo con unidad watts. |
| controlEnergia | Párrafo | Estado del consumo energético. |
| estadoServidor | Párrafo | Nivel de salud del servidor. |
| capacidadReserva | Párrafo | Capacidad residual de CPU. |

## Reglas resumidas

- Energía mayor a 400 W: mostrar exceso.
- Temperatura mayor a 75 °C y CPU mayor a 80 %: estado crítico.
- Temperatura mayor a 75 °C o CPU mayor a 80 %: advertencia.
- CPU mayor o igual a 90 %: calcular procesos adicionales.
- Estado permitido: Activo o Inactivo.

## Relacion con la base de datos

- `operadorMedicion` se almacena como referencia a la persona que realiza la medicion.
- `estado` se usa como campo de control para filtrar registros activos e inactivos.

