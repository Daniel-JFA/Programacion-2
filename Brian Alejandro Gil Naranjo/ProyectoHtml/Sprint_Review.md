# 🚀 Sprint Review: Evolución del The-Data-Center-Guardian (Full-Stack) - [Fecha Actual]

## 🎯 Objetivo del Sprint
Transformar el dashboard de un prototipo frontend a una **aplicación web full-stack funcional**. El objetivo era desacoplar la lógica de datos, implementar persistencia con una base de datos real y crear una interfaz de usuario dinámica para la gestión y visualización de los servidores.

## 🛠️ Cambios Implementados

### 1️⃣ Implementación de Arquitectura Cliente-Servidor (Full-Stack)
*   **Antes:** Aplicación monolítica de frontend que generaba datos sintéticos en el navegador (`Mulberry32`). Los datos eran volátiles y se perdían al recargar.
*   **Ahora:** 
    *   Se desarrolló un **backend con Node.js y Express**, creando una API RESTful para gestionar los datos de los servidores.
    *   El frontend ahora consume esta API mediante peticiones `fetch` (`GET` para obtener datos, `POST` para insertar).
*   **Análisis Riguroso:** Este cambio es el más crítico del proyecto. Separa completamente la capa de presentación (cliente) de la capa de datos (servidor), estableciendo una arquitectura escalable y profesional. La lógica de negocio y el acceso a la base de datos ahora están centralizados y seguros en el backend.

### 2️⃣ Integración de Base de Datos Persistente (MySQL)
*   **Antes:** Sin base de datos. Los datos existían solo en la memoria del navegador.
*   **Ahora:** 
    *   Se integró una base de datos **MySQL/MariaDB** gestionada a través de **XAMPP**.
    *   El backend de Node.js utiliza el driver `mysql2` para crear un pool de conexiones y ejecutar consultas SQL de forma segura y eficiente.
    *   El servidor es capaz de crear la tabla `servers` e incluso poblarla con datos de ejemplo si se encuentra vacía al arrancar.
*   **Análisis Riguroso:** La persistencia de datos es un hito fundamental. La información de los servidores ahora se almacena de forma permanente, sobreviviendo a recargas de página y reinicios del servidor. Esto sienta las bases para futuras funcionalidades como historiales, autenticación de usuarios y auditorías.

### 3️⃣ Interfaz de Usuario Dinámica e Interactiva
*   **Antes:** Una interfaz estática que requería un clic para generar y mostrar datos.
*   **Ahora:**
    *   **Precarga de Datos:** La aplicación carga y muestra los datos de la base de datos automáticamente al iniciar, ofreciendo valor inmediato.
    *   **Formulario de Inserción:** Se reemplazó el generador de datos por un formulario funcional para **agregar nuevos servidores** a la base de datos en tiempo real.
    *   **Navegación por Paneles:** Se implementó una barra de navegación (`navbar`) que permite al usuario alternar entre las vistas de "Inserción", "Métricas", "Gráficos" y "Reporte", mostrando solo un panel a la vez para una interfaz más limpia.
    *   **Filtros Interactivos:** El panel de "Reporte" ahora cuenta con pestañas para filtrar los servidores por estado (Todos, OK, Advertencia, Crítico).
    *   **Navegación Cruzada:** Al hacer clic en las métricas o en las barras del gráfico de estados, la aplicación navega automáticamente al panel de "Reporte" y aplica el filtro correspondiente, creando una experiencia de usuario fluida e intuitiva.

### 4️⃣ Refinamiento de la Interfaz y Experiencia de Usuario (UX)
*   **Antes:** Paneles de métricas y reportes basados en cajas y tablas básicas.
*   **Ahora:** 
    *   Se rediseñaron los paneles de "Métricas" y "Reporte" utilizando el componente `panel` de Bulma, logrando una presentación vertical, moderna y consistente.
    *   Se mejoró la legibilidad y el atractivo visual mediante el uso de iconos de Font Awesome y una paleta de colores coherente para los diferentes estados de los servidores.
*   **Análisis Riguroso:** La consistencia visual y la mejora en la presentación de la información hacen que el dashboard no solo sea más funcional, sino también más profesional y agradable de usar.

## 🧼 Calidad de Código y Deuda Técnica Resuelta
*   **Separación de Responsabilidades (SoC):** La deuda técnica más grande fue resuelta al separar el frontend del backend. La lógica de negocio, el acceso a datos y la manipulación del DOM están ahora en sus capas correspondientes.
*   **Código Asíncrono:** Se adoptó `async/await` de forma extensiva tanto en el frontend (para `fetch`) como en el backend (para consultas a la base de datos), resultando en un código más limpio y no bloqueante.
*   **Manejo de Errores Mejorado:** El frontend ahora es capaz de detectar y reportar de manera más clara los errores provenientes de la API, facilitando enormemente la depuración.
*   **Eliminación de Código Obsoleto:** Se eliminó toda la lógica de generación de datos sintéticos (`Mulberry32`, `seed`, etc.) del frontend, simplificando el código base.

### 5️⃣ Mejoras de Interfaz y Calidad de Vida (QoL)
*   **Modo Oscuro:**
    *   Se implementó un botón en la barra de navegación para alternar entre un tema claro y uno oscuro.
    *   La preferencia del usuario se guarda en el `localStorage` del navegador, por lo que el tema se mantiene entre sesiones.
    *   Se refactorizó el CSS a su propio archivo (`styles.css`) para una mejor organización, asegurando que los estilos personalizados sobreescriban correctamente a Bulma.
*   **Mejoras de Interacción y Navegación:**
    *   **Filtros en Reporte:** Se añadieron pestañas de filtro (Todos, OK, Advertencia, Crítico) en el panel de reporte para una visualización de datos más granular.
    *   **Navegación Cruzada:** Se hizo que las métricas y el gráfico de barras fueran interactivos. Al hacer clic en ellos, el usuario es dirigido al panel de reporte con el filtro correspondiente ya aplicado, mejorando la fluidez del análisis.
*   **Refinamiento de Diseño:**
    *   Se rediseñaron los paneles de "Métricas" y "Reporte" utilizando el componente `panel` de Bulma, unificando el estilo visual y presentando la información de una manera más moderna y compacta.
    *   Se añadió un sutil efecto `hover` a los paneles en modo oscuro para mejorar la retroalimentación visual.
*   **Calidad del Proyecto:**
    *   Se creó un archivo `.gitignore` para excluir la carpeta `node_modules` y otros archivos generados del control de versiones, siguiendo las buenas prácticas de desarrollo.

---
## 🚀 Sprint Review: Evolución a Serverless - 22 de Mayo de 2024

## 🎯 Objetivo del Sprint
Modernizar la arquitectura del proyecto, migrando de una pila full-stack tradicional (Node.js + MySQL) a una arquitectura serverless utilizando **Supabase** como backend. El objetivo era simplificar el desarrollo, eliminar la necesidad de un servidor propio y facilitar el despliegue.

## 🛠️ Cambios Implementados

### 6️⃣ Migración a Arquitectura Serverless con Supabase
*   **Antes:** El proyecto utilizaba una arquitectura cliente-servidor con un backend personalizado en **Node.js/Express** y una base de datos **MySQL** local (gestionada con XAMPP). Esto requería mantener un proceso de servidor activo durante el desarrollo y complicaba el despliegue.
*   **Ahora:** 
    *   Se ha **eliminado por completo el backend de Node.js** (`server.js`) y sus dependencias (`node_modules`, `package.json`).
    *   La base de datos y la API RESTful son ahora proporcionadas automáticamente por **Supabase**.
    *   El frontend se comunica directamente con la API de Supabase a través de su librería cliente (`@supabase/supabase-js`), simplificando las peticiones de datos.
*   **Análisis Riguroso:** Este cambio representa una modernización fundamental del stack tecnológico.
    *   **Simplificación Radical:** Se elimina toda la complejidad de gestionar un servidor, conexiones a bases de datos y la creación de endpoints de API. El código del proyecto se reduce, enfocándose únicamente en la lógica del frontend.
    *   **Despliegue Instantáneo:** Al ser ahora una aplicación 100% frontend (JAMstack), puede ser desplegada de forma gratuita y casi instantánea en servicios como Vercel, Netlify o GitHub Pages.
    *   **Escalabilidad y Mantenimiento:** Se delega la escalabilidad, seguridad y mantenimiento de la base de datos a la plataforma de Supabase, permitiendo al desarrollador centrarse en las funcionalidades de la aplicación.
