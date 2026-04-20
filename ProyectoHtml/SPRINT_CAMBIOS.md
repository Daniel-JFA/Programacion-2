# Registro de Cambios por Sprint

## Sprint 1 - Migracion de Python a Web
Fecha: 2026-04-08

- Se tomo la logica de monitoreo del script Python y se llevo a JavaScript.
- Se reemplazo el HTML de pruebas por una interfaz funcional con formulario y reporte.
- Se conectaron las reglas de negocio:
  - Control de energia (> 400 W)
  - Estado del servidor por CPU y temperatura
  - Capacidad de reserva para CPU >= 90
- Se agregaron validaciones basicas de entrada en el formulario.

Archivos impactados:
- index.html
- main.js
- styles.css

## Sprint 2 - Mejora Visual con CDN Profesional
Fecha: 2026-04-08

- Se agrego CDN de Halfmoon CSS (framework profesional, menos comun que Bootstrap/Tailwind).
- Se mantuvo la hoja local para personalizacion visual sin perder funcionalidad existente.
- Se mejoro la jerarquia visual: fondo, tipografia, tarjetas y boton.
- Se agrego texto de contexto en cabecera para orientar al usuario.

Archivos impactados:
- index.html
- styles.css

## Sprint 3 - Cards Profesionales + Loading de 3 segundos
Fecha: 2026-04-08

- Se redisenaron los cards con una apariencia mas profesional (acento superior, sombras y profundidad visual).
- Se agrego un panel de carga no tradicional con animacion de escaneo y barras de telemetria.
- El loading se activa durante 3 segundos al generar reporte para reforzar percepcion de procesamiento.
- Se mantuvieron las reglas de negocio existentes y la salida de resultados.
- Se retiro salida de depuracion en consola para limpiar el flujo.

Archivos impactados:
- index.html
- styles.css
- main.js

## Proximo Sprint (Plantilla)
Fecha: pendiente

Objetivo:
- (Definir)

Cambios:
- (Agregar)

Archivos impactados:
- (Agregar)
