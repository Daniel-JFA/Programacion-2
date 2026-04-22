# Sistema de Monitoreo

Aplicación web simple para registrar métricas de un servidor y generar un reporte de estado en tiempo real. El proyecto fue migrado desde un script de Python hacia una interfaz web con HTML, CSS y JavaScript.

## Objetivo

Permitir que un usuario ingrese datos básicos de telemetría y obtenga un diagnóstico inmediato sobre:

- Consumo de energía.
- Estado operativo del servidor.
- Capacidad de reserva de CPU.

## Alcance

El proyecto trabaja principalmente en el navegador y no depende de un backend. Toda la lógica de validación y cálculo se ejecuta en JavaScript del lado del cliente, y la base de datos sirve como soporte para registrar operadores, servidores y mediciones.

## Tecnologías usadas

- HTML5 para la estructura.
- CSS3 para la presentación.
- JavaScript para validación y reglas de negocio.
- Halfmoon CSS vía CDN para la base visual del formulario y las tarjetas.

## Estructura del proyecto

- index.html: formulario, panel de carga y salida del reporte.
- styles.css: estilos personalizados, variables de color y animaciones.
- main.js: lógica de validación, cálculo de mensajes y renderizado del resultado.
- server.js: API local con Express y MySQL para operadores y mediciones.
- package.json: dependencias y comandos de arranque.
- SPRINT_CAMBIOS.md: historial resumido de la evolución del proyecto.
- main2.py: versión previa en Python conservada como referencia.

## Flujo de funcionamiento

1. El usuario ingresa el ID del servidor, la carga de CPU, la temperatura del rack y el consumo de energía.
2. El sistema valida que el ID no esté vacío y que los valores numéricos sean válidos.
3. Se activa un panel de carga durante 3 segundos.
4. Se calculan las reglas de negocio.
5. Se muestra el reporte final en pantalla.

## Reglas de negocio

### Control de energía

- Si el consumo es mayor a 400 W, se muestra el exceso por encima del límite.
- Si el consumo es menor o igual a 400 W, se indica que está dentro del rango permitido.

### Estado del servidor

- Si la temperatura es mayor a 75 °C y la CPU es mayor a 80 %, el estado es crítico.
- Si solo una de las dos condiciones se supera, se muestra advertencia.
- Si ninguna se supera, el estado es normal.

### Capacidad de reserva

- Si la CPU es mayor o igual a 90 %, se calcula cuántos procesos adicionales puede soportar antes de colapsar.
- En caso contrario, se informa que todavía existe capacidad disponible.

## Validaciones

- El ID del servidor es obligatorio.
- CPU, temperatura y energía deben ser valores numéricos.
- La CPU se ingresa entre 0 y 100.
- La energía no puede ser negativa.

## Ejecución local

1. Instalar dependencias con `npm install` dentro de `ProyectoHtml`.
2. Iniciar la API local con `npm start`.
3. Abrir `http://localhost:3000`.
4. Completar los campos del formulario y seleccionar el usuario que realiza la medicion.
5. Presionar `Generar Reporte`.

Si se desea cambiar el puerto, editar `PORT` en el archivo `.env` o en la variable de entorno.

## Observaciones técnicas

- El proyecto no persiste datos.
- El reporte se genera solo con valores ingresados en la sesión actual.
- La interfaz usa un panel de espera simulado para mejorar la percepción visual del procesamiento.

## Estructura de base de datos

Para el registro histórico se propone una estructura relacional con estas entidades:

- `operadores`: personas que realizan la medicion.
- `servidores`: equipos monitoreados.
- `mediciones`: registros tomados por un operador sobre un servidor.

Campos nuevos considerados:

- `id_operador` o `operadorMedicion`: identifica quien realiza la medicion.
- `estado`: valida si el registro, operador o servidor esta `Activo` o `Inactivo`.

## Diccionario de datos

### Entrada

| Campo | Tipo | Obligatorio | Rango / Formato | Descripción |
| --- | --- | --- | --- | --- |
| idServidor | Texto | Sí | No vacío | Identificador del servidor monitoreado. |
| operadorMedicion | Texto | Sí | No vacío | Persona que realiza la medicion. |
| cpu | Numérico decimal | Sí | 0 a 100 | Porcentaje de carga de CPU. |
| temperatura | Numérico decimal | Sí | Sin límite fijo en la interfaz | Temperatura del rack en grados Celsius. |
| energia | Numérico decimal | Sí | Mayor o igual a 0 | Consumo de energía en watts. |
| estado | Texto | Sí | Activo o Inactivo | Estado del registro o entidad relacionada. |

### Salida

| Campo | Tipo | Origen | Descripción |
| --- | --- | --- | --- |
| mensajeEnergia | Texto | Calculado en main.js | Indica si el consumo está dentro del límite o reporta el exceso. |
| mensajeEstado | Texto | Calculado en main.js | Resume el estado del servidor según CPU y temperatura. |
| mensajeCapacidad | Texto | Calculado en main.js | Describe la capacidad restante de procesamiento. |
| operadorMedicion | Texto | DOM / BD | Identifica quien realizo la medicion. |
| estado | Texto | DOM / BD | Indica si el registro se encuentra activo o inactivo. |
| outId | Texto | DOM | Muestra el ID ingresado. |
| outCpu | Texto | DOM | Muestra la CPU formateada con porcentaje. |
| outTemp | Texto | DOM | Muestra la temperatura formateada en Celsius. |
| outEnergia | Texto | DOM | Muestra el consumo formateado en watts. |

## Estructura SQL sugerida

El archivo [estructura_bd.sql](estructura_bd.sql) contiene el script para crear la estructura base en MySQL o MariaDB sobre `Dev_2`.

## Historial relacionado

- Ver [SPRINT_CAMBIOS.md](SPRINT_CAMBIOS.md) para el resumen de migración y mejoras visuales.
