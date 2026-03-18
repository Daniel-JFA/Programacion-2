# 🏪 Wudhi - Marketplace Universitario

Sistema visual completo de marketplace siguiendo arquitectura profesional de 5 dominios: **Identity**, **Catalog**, **Commerce**, **Payments** y **Logistics**.

## 📋 Arquitectura del Sistema

### 5 Dominios Principales

```
🏢 IDENTITY (Seguridad)
├── users - Usuarios registrados
├── user_sessions - Sesiones activas
└── addresses - Direcciones de envío

📦 CATALOG (Catálogo)
├── sellers - Vendedores
├── stores - Tiendas por vendedor
├── products - Productos/servicios
├── categories - Categorías jerárquicas
├── product_images - Imágenes de productos
└── inventory - Control de stock

🛒 COMMERCE (Compras)
├── carts - Carritos de compra
├── cart_items - Items en carrito
├── orders - Órdenes principales
├── order_groups - Subórdenes por tienda
├── order_items - Items por suborden
└── order_status_history - Historial de estados

💳 PAYMENTS (Pagos)
├── payments - Pagos principales
├── payment_transactions - Transacciones
└── Integración con Stripe/PayPal

🚚 LOGISTICS (Envíos)
├── shipments - Envíos
├── shipment_events - Eventos de envío
└── Tracking en tiempo real
```

## 📁 Estructura de Archivos

```
Demo-store/
├── index.html          # Registro/Login (Identity)
├── style.css           # Estilos base
├── script.js           # Lógica registro/login
├── dashboard.html      # Dashboard principal (Commerce)
├── dashboard.css       # Estilos dashboard
├── dashboard.js        # Lógica dashboard
├── catalog.html        # Catálogo de productos (Catalog)
├── catalog.css         # Estilos catálogo
├── catalog.js          # Lógica catálogo + Commerce
├── profile.html        # Perfil de usuario (Identity + Commerce)
├── profile.css         # Estilos perfil
├── profile.js          # Lógica perfil + gestión productos
├── cart.html           # Carrito de compras (Commerce)
├── cart.css            # Estilos carrito
├── cart.js             # Lógica carrito + checkout
├── config.json         # Configuración completa del sistema
└── README.md           # Este archivo
```

## 🎯 Funcionalidades Implementadas

### ✅ Identity (Seguridad)
- **Registro Progresivo**: Campos validados uno por uno con feedback visual
- **Login Seguro**: Email/ID + contraseña + recuperación de contraseña
- **Sesiones**: Control de estado de usuario persistente
- **Validaciones**: Email, contraseña fuerte (8+ chars, mayúscula, número), nombres
- **Perfil de Usuario**: Información personal, dirección, cambio de contraseña
- **Roles**: Comprador vs Vendedor con funcionalidades específicas
- **Onboarding de Vendedores**: Flujo guiado para configurar tienda y productos

### ✅ Catalog (Catálogo)
- **Productos**: 12 productos de muestra con categorías y tipos
- **Categorías**: Electrónica, Libros, Servicios, Vivienda, Transporte, Deportes
- **Búsqueda**: Búsqueda en tiempo real por nombre y descripción
- **Filtros**: Por tipo (productos/servicios/digital) y categoría
- **Ordenamiento**: Precio (asc/desc), rating, fecha, relevancia
- **Inventario**: Control de stock y disponibilidad
- **Modal de Detalles**: Vista ampliada con información completa

### ✅ Commerce (Comercio)
- **Carrito de Compras**: Agregar, modificar cantidades, remover items
- **Dashboard**: Estadísticas de usuario, acciones rápidas, actividad reciente
- **Sistema de Órdenes**: Historial completo con estados y detalles
- **Checkout Completo**: Información de envío, pago simulado, resumen
- **Códigos Promocionales**: ESTUDIANTE10 (10%), UNIV20 (20%)
- **Gestión de Productos**: Vendedores pueden agregar/editar/eliminar productos
- **Cálculos Automáticos**: Subtotal, envío, impuestos, descuentos

### ✅ Payments (Pagos - Simulado)
- **Métodos de Pago**: Tarjeta de crédito/débito
- **Validación**: Número de tarjeta, fecha expiración, CVV
- **Transacciones**: Registro de pagos y estados
- **Integración Lista**: Preparado para Stripe/PayPal

### ✅ Logistics (Envíos - Simulado)
- **Cálculo de Envío**: Gratis sobre $100k COP, $10k fijo
- **Direcciones**: Gestión completa de direcciones de envío
- **Tracking**: Estados de envío preparados

## 🚀 Flujo del Usuario

### 1. Registro/Login (Identity)
```
index.html → Validación progresiva → Dashboard
```

### 2. Dashboard Principal (Commerce)
```
dashboard.html → Acciones rápidas:
├── Ver Catálogo → catalog.html
├── Mi Carrito → cart.html
├── Ver Órdenes → profile.html#orders
└── Mi Perfil → profile.html
```

### 3. Catálogo de Productos (Catalog)
```
catalog.html → Búsqueda + Filtros → Detalle Modal → Agregar al Carrito
```

### 4. Carrito de Compras (Commerce)
```
cart.html → Modificar cantidades → Aplicar códigos → Checkout
```

### 5. Checkout (Payments + Logistics)
```
Checkout Modal → Información envío → Datos de pago → Confirmar orden
```

### 6. Perfil de Usuario (Identity + Commerce)
```
profile.html → Pestañas:
├── Información Personal → Actualizar datos
├── Mis Órdenes → Historial completo
├── Mis Productos → Gestión (solo vendedores)
└── Seguridad → Cambiar contraseña
```

### 7. Onboarding de Vendedores (Identity + Catalog)
```
Registro con rol "Vendedor" → Onboarding Modal:
├── Paso 1: Selección de Categoría
│   ├── Alimentos (Postres, Almuerzos, Dulcería)
│   ├── Servicios Académicos (Tutorías, Asesorías)
│   ├── Productos Varios (Útiles, Accesorios)
│   └── Venta Independiente (Personalizado)
├── Paso 2: Agregar Productos/Servicios
│   ├── Formulario específico por categoría
│   ├── Campos dinámicos según selección
│   ├── Vista de tarjetas de productos
│   └── Edición/eliminación de productos
├── Paso 3: Vista Previa de la Tienda
│   ├── Preview de cómo se verá la tienda
│   └── Confirmación final
└── Paso 4: Completado → Dashboard
```

## 📊 Datos de Muestra

### Usuarios
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan.perez@universidad.edu",
  "role": "comprador",
  "stats": {
    "orders": 12,
    "totalSpent": 2500000,
    "rating": 4.8,
    "productsSelling": 3
  }
}
```

### Productos (Catálogo)
- **Electrónica**: Laptops gaming, tablets, audífonos
- **Servicios**: Clases de matemáticas, tutorías, diseño gráfico
- **Vivienda**: Habitaciones para estudiantes, apartamentos
- **Transporte**: Bicicletas, scooters eléctricos
- **Libros**: Textos universitarios, apuntes
- **Deportes**: Equipos de fútbol, raquetas de tennis

### Categorías de Vendedores
- **Alimentos**: Postres, almuerzos, dulcería, bebidas
- **Servicios Académicos**: Tutorías, asesorías, clases grupales, ayuda con tareas
- **Productos Varios**: Útiles escolares, accesorios, artículos diversos
- **Venta Independiente**: Productos/servicios personalizados con categorías custom

### Órdenes (Commerce)
- Sistema de órdenes con subórdenes por vendedor
- Estados: created, paid, shipped, delivered, cancelled
- Historial completo de cambios de estado

## 📋 Sistema de Vendedores Detallado

### Categorías Disponibles

#### 🍽️ **Alimentos**
- **Postres**: Tortas, galletas, dulces caseros
  - Tiempo de preparación, ingredientes, info dietética
- **Almuerzos**: Comidas principales preparadas
  - Tipo de comida, porciones, tiempo preparación
- **Dulcería**: Chocolates, caramelos artesanales
  - Tipo de dulce, ingredientes, tiempo conservación

#### 📚 **Servicios Académicos**
- **Tutoría**: Ayuda individualizada en materias
  - Materia, nivel académico, experiencia, modalidad
- **Clases**: Clases grupales o cursos intensivos
  - Materia, duración, máximo estudiantes, experiencia
- **Asesoría**: Consultoría académica y orientación
  - Especialidad, experiencia, modalidad

#### 🛍️ **Productos Varios**
- **Material de Estudio**: Útiles, libros, cuadernos
  - Tipo producto, estado, especificaciones
- **Tecnología**: Dispositivos electrónicos y accesorios
  - Tipo dispositivo, marca, modelo, estado, garantía
- **Ropa y Accesorios**: Prendas de vestir y complementos
  - Tipo prenda, talla, estado, material

#### 💼 **Venta Independiente**
- **Venta General**: Productos y servicios diversos
  - Tipo producto/servicio, categoría general, especificaciones

### Funcionalidades del Sistema

#### 🎯 **Onboarding Guiado**
- **4 Pasos intuitivos**: Categoría → Productos → Preview → Completado
- **Formularios dinámicos**: Campos cambian según categoría seleccionada
- **Validaciones en tiempo real**: Feedback inmediato sobre errores
- **Vista previa interactiva**: Ver cómo se verá la tienda antes de publicar

#### 📦 **Gestión de Productos**
- **CRUD completo**: Crear, leer, actualizar, eliminar productos
- **Tarjetas visuales**: Presentación atractiva de productos/servicios
- **Campos específicos**: Información contextual por categoría
- **Estado de productos**: Activo, inactivo, agotado

#### 🏪 **Vista de Tienda**
- **Preview en tiempo real**: Cómo se verá la tienda para compradores
- **Información completa**: Nombre, descripción, precio, detalles específicos
- **Categorización clara**: Fácil navegación por tipo de producto/servicio

## 🎭 Simulación John ↔ Jane

### Archivos de Simulación

#### **`simulation.html`** - Simulación Completa
- **Vista general**: Proceso completo de publicación y compra
- **Perfiles visuales**: Información detallada de John y Jane
- **Flujo de interacción**: 6 pasos del proceso completo
- **Log en tiempo real**: Seguimiento de todas las acciones
- **Controles manuales**: Ejecutar cada paso individualmente
- **Simulación automática**: Ver el flujo completo automáticamente

#### **`demo.html`** - Demo Interactiva
- **Switch de usuarios**: Cambiar entre John y Jane dinámicamente
- **Paneles específicos**: Interfaces diferentes para vendedor/comprador
- **Barra de progreso**: Seguimiento visual del flujo de interacción
- **Acciones contextuales**: Botones específicos según el usuario activo
- **Estado persistente**: Los datos se guardan en localStorage
- **Notificaciones**: Feedback visual de todas las acciones

#### **`demo-complete.html`** - Demo Completa con Historia
- **Escenario narrativo**: Historia completa de John y Jane
- **Timeline interactivo**: Cronología detallada de la interacción
- **Datos precargados**: Experiencia completa sin configuración manual
- **Perspectivas duales**: Ver la interacción desde ambos lados
- **Resultados reales**: Mostrar órdenes completadas y productos vendidos

### Escenario de Simulación

#### 👨‍💼 **John Smith - Vendedor**
- **Perfil**: Estudiante de Ingeniería de Sistemas, tutor experimentado
- **Tienda**: "MathMaster Academy" - Servicios Académicos
- **Productos**: 3 servicios de tutoría matemática
- **Proceso**: Registro → Configuración tienda → Agregar productos

#### 👩 **Jane Doe - Compradora**
- **Perfil**: Estudiante de Medicina, necesita ayuda en matemáticas
- **Necesidad**: Preparación para examen de cálculo
- **Proceso**: Registro → Navegar catálogo → Agregar al carrito → Checkout

### Flujo de Interacción Completo

1. **Registro**: Ambos usuarios se registran en Wudhi
2. **Configuración**: John configura su tienda de servicios académicos
3. **Publicación**: John agrega sus productos/servicios al catálogo
4. **Descubrimiento**: Jane encuentra los servicios de John
5. **Compra**: Jane agrega productos al carrito y completa la compra
6. **Completado**: Transacción exitosa, servicios programados

## 🧪 Sistema de Pruebas

### Archivo de Pruebas: `test.html`
- **Simulación de registro**: Crear usuario vendedor de prueba
- **Verificación de datos**: Mostrar contenido de localStorage
- **Limpieza de datos**: Eliminar datos de prueba
- **Acceso al sistema**: Ir a la aplicación principal

### Archivo de Validación: `validate.html`
- **Verificación de archivos**: Comprobar que todos los archivos existen
- **Validación de configuración**: Verificar estructura del JSON
- **Pruebas automáticas**: Ejecutar tests del sistema de vendedores
- **Resumen de resultados**: Mostrar estado general del sistema

### Archivo de Configuración: `seller-config.json`
- **Categorías jerárquicas**: Definición completa de categorías y subcategorías
- **Campos dinámicos**: Especificación de campos por categoría
- **Reglas de validación**: Límites y formatos para datos
- **Configuración UI**: Límites de productos, imágenes, etc.

### Cómo usar las pruebas:
1. **Abrir `validate.html`** para verificación completa del sistema
2. **Usar `test.html`** para pruebas manuales del flujo de vendedores
3. **Ir a `simulation.html`** para ver el proceso completo John ↔ Jane
4. **Probar `demo.html`** para experiencia interactiva real
5. **Explorar `demo-complete.html`** para la historia completa con datos precargados

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Arquitectura**: Componentes modulares, estado localStorage
- **UI/UX**: Diseño responsive, animaciones CSS, feedback visual
- **Validaciones**: JavaScript con expresiones regulares
- **Persistencia**: localStorage (preparado para backend)
- **Configuración**: JSON estructurado para mantenibilidad

## 🚀 Próximos Pasos

### Integración Backend
- [ ] Conectar con API NestJS existente
- [ ] Migrar datos de localStorage a base de datos
- [ ] Implementar autenticación JWT real
- [ ] Sistema de imágenes para productos

### Funcionalidades Avanzadas
- [ ] Dashboard específico para vendedores
- [ ] Sistema de reseñas y calificaciones
- [ ] Notificaciones push
- [ ] Sistema de pedidos para vendedores
- [ ] Analytics de ventas

### Mejoras de UX
- [ ] Sistema de imágenes para productos
- [ ] Búsqueda avanzada con filtros
- [ ] Sistema de favoritos
- [ ] Compartir productos en redes sociales

## 📞 Soporte

Para preguntas sobre el sistema de vendedores o cualquier funcionalidad, revisar:
- `seller-config.json` - Configuración de categorías
- `test.html` - Pruebas del sistema
- `README.md` - Documentación completa

## � Sistema de Vendedores

### Onboarding Guiado
- **Flujo Paso a Paso**: 4 pasos intuitivos para configurar tienda
- **Categorías Especializadas**: 4 categorías principales con validación
- **Campos Dinámicos**: Formularios adaptativos según categoría
- **Vista Previa Interactiva**: Preview en tiempo real de la tienda

### Categorías Disponibles
- **🍽️ Alimentos**: Postres, almuerzos, dulcería, bebidas
  - Campos específicos: Tipo de comida, tiempo de preparación
- **🎓 Servicios Académicos**: Tutorías, asesorías, clases grupales
  - Campos específicos: Tipo de servicio, experiencia del tutor
- **📦 Productos Varios**: Útiles escolares, accesorios, artículos diversos
  - Campos específicos: Condición del producto, marca/modelo
- **🏪 Venta Independiente**: Productos/servicios personalizados
  - Campos específicos: Categoría custom, tipo de entrega

### Gestión de Productos
- **Tarjetas Visuales**: Vista de productos como tarjetas atractivas
- **Edición en Línea**: Modificar productos sin recargar página
- **Validación Robusta**: Campos requeridos y formatos específicos
- **Eliminación Segura**: Confirmación antes de eliminar productos

## �🎨 Diseño y UX

### Paleta de Colores
- **Primario**: #6366f1 (Índigo - Confianza académica)
- **Secundario**: #ec4899 (Rosa - Energía juvenil)
- **Éxito**: #10b981 (Verde - Positivo)
- **Error**: #ef4444 (Rojo - Alerta)
- **Advertencia**: #f59e0b (Amarillo - Atención)

### Breakpoints Responsive
- **Desktop**: > 768px (Grid layouts, navegación completa)
- **Tablet**: 481px - 768px (Columnas ajustadas)
- **Mobile**: ≤ 480px (Layout vertical, navegación colapsada)

### Animaciones y Transiciones
- **Botones**: Hover effects con escala y cambio de color
- **Cards**: Elevación en hover con sombras
- **Modales**: Fade-in/out con backdrop
- **Notificaciones**: Slide-in desde la derecha
- **Formularios**: Validación visual en tiempo real
- **Carga**: Animaciones escalonadas de entrada

### Iconografía
- **Font Awesome**: Iconos consistentes en toda la aplicación
- **Semántica**: Cada sección tiene su icono representativo
- **Estados**: Iconos diferentes para estados (loading, success, error)

## 🔧 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica, formularios progresivos
- **CSS3**: Variables CSS, Flexbox/Grid, animaciones, responsive
- **JavaScript ES6+**: Manipulación DOM, localStorage, validaciones
- **Arquitectura**: Componentes modulares, separación de responsabilidades

### Almacenamiento Local
- **localStorage**: Persistencia de usuarios, productos, carritos, órdenes
- **JSON**: Estructura de datos consistente
- **Simulación API**: Funciones que simulan llamadas al backend

### Validaciones
- **Tiempo Real**: Feedback inmediato en formularios
- **Formatos**: Email, contraseñas, números de tarjeta
- **Lógica**: Disponibilidad de stock, límites de cantidad
- **UX**: Mensajes claros y acciones correctivas

## 🚀 Próximas Funcionalidades

### Backend Integration
- **NestJS**: API REST completa con los 5 dominios
- **PostgreSQL + Prisma**: Base de datos relacional
- **JWT**: Autenticación segura
- **WebSocket**: Notificaciones en tiempo real

### Funcionalidades Avanzadas
- **Reviews y Ratings**: Sistema de calificaciones
- **Mensajería**: Chat entre compradores y vendedores
- **Notificaciones**: Push notifications
- **Analytics**: Dashboard administrativo
- **Multi-tenant**: Múltiples universidades

### Mejoras UX/UI
- **PWA**: Progressive Web App
- **Offline**: Funcionalidad sin conexión
- **Accesibilidad**: WCAG 2.1 compliance
- **Internacionalización**: Múltiples idiomas

## 📝 Notas de Desarrollo

### Arquitectura Modular
- Cada dominio tiene su propia lógica y datos
- Componentes reutilizables entre páginas
- Separación clara entre presentación y lógica

### Escalabilidad
- Preparado para múltiples vendedores
- Sistema de órdenes complejo con subórdenes
- Arquitectura lista para microservicios

### Seguridad
- Validaciones en frontend y backend
- Sanitización de datos
- Control de acceso basado en roles

## 🎓 Contexto Educativo

Este proyecto simula un marketplace real para estudiantes universitarios, donde pueden:
- **Comprar**: Productos, servicios, vivienda, transporte
- **Vender**: Servicios académicos, productos usados, habitaciones
- **Conectar**: Comunidad universitaria en un solo lugar

La arquitectura de 5 dominios asegura escalabilidad y mantenibilidad profesional.

## 🔧 Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Arquitectura**: Componentes modulares
- **Responsive**: CSS Grid y Flexbox
- **Interactividad**: Event listeners y DOM manipulation
- **Estado**: Objetos JavaScript para state management

## 🚀 Próximas Implementaciones

### Identity
- [ ] Verificación de email
- [ ] Cambio de contraseña
- [ ] Perfil de usuario editable
- [ ] Direcciones múltiples

### Catalog
- [ ] Sistema de vendedores múltiples
- [ ] Upload de imágenes reales
- [ ] Reviews y ratings detallados
- [ ] Favoritos/Lista de deseos

### Commerce
- [ ] Carrito de compras completo
- [ ] Checkout con múltiples pasos
- [ ] Sistema de órdenes real
- [ ] Historial de compras

### Payments
- [ ] Integración con pasarelas de pago
- [ ] Múltiples métodos de pago
- [ ] Facturación automática

### Logistics
- [ ] Sistema de envíos
- [ ] Tracking en tiempo real
- [ ] Múltiples transportadoras

## 🔗 Integración con Backend

### Endpoints Esperados (NestJS)
```typescript
// Identity
POST /auth/register
POST /auth/login
POST /auth/forgot-password
GET /users/profile

// Catalog
GET /products
GET /products/:id
GET /categories
POST /products (solo vendedores)

// Commerce
GET /cart
POST /cart/items
DELETE /cart/items/:id
POST /orders
GET /orders
```

### Base de Datos (PostgreSQL + Prisma)
```sql
-- Tablas principales según arquitectura
-- users, user_sessions, addresses
-- sellers, stores, products, categories
-- carts, cart_items, orders, order_groups
-- payments, payment_transactions
-- shipments, shipment_events
```

## 📈 Escalabilidad

### Arquitectura Modular
- Separación clara por dominios
- Componentes reutilizables
- Estado centralizado
- API preparada para backend

### Performance
- Lazy loading de productos
- Paginación implementada
- Optimización de imágenes
- Caché de búsquedas

## 🧪 Testing

### Validaciones Implementadas
- ✅ Email formato válido
- ✅ Contraseña: 8+ chars, mayúscula, número
- ✅ Nombres: solo letras y espacios
- ✅ Stock: control de disponibilidad
- ✅ Precios: formato moneda colombiana

### Navegación
- ✅ Flujo registro → dashboard
- ✅ Navegación entre secciones
- ✅ Búsqueda y filtros funcionales
- ✅ Modal de detalles de producto

## 📞 Contacto

**Wudhi Marketplace** - Sistema universitario de comercio electrónico
- **Versión**: 1.0.0
- **Última actualización**: 9 de marzo de 2026
- **Arquitectura**: 5 dominios profesionales

---

*Este sistema sigue las mejores prácticas de arquitectura de marketplace, preparado para escalar a miles de usuarios y productos.*

## 🚀 Cómo Usar

1. **Abrir la aplicación**
   - Abre `index.html` en tu navegador web

2. **Registro**
   - Completa cada campo progressivamente
   - Cada campo se habilita cuando el anterior es válido
   - Presiona "Siguiente" o Enter para avanzar
   - Completa todos los campos y haz clic en "Crear Cuenta"

3. **Inicio de Sesión**
   - Usa el correo o ID registrado
   - Ingresa tu contraseña
   - Haz clic en "Iniciar Sesión"

4. **Recuperar Contraseña**
   - Haz clic en "¿Olvidaste tu contraseña?" en el login
   - Ingresa tu correo o ID
   - Recibirás instrucciones de recuperación

## 🔧 Campos del Registro

### ID Universitario
- **Validación**: 3-20 caracteres alfanuméricos
- **Ejemplo**: `2024001` o `U2024001`

### Nombre Completo
- **Validación**: Solo letras y espacios, 3-50 caracteres
- **Ejemplo**: `Juan Pérez García`

### Correo Electrónico
- **Validación**: Formato de correo válido
- **Ejemplo**: `juan.perez@universidad.edu`

### Contraseña
- **Requisitos**:
  - Mínimo 8 caracteres
  - Al menos una letra mayúscula
  - Al menos un número
- **Ejemplo**: `MiPassword123`

### Rol de Usuario
- **Comprador** (🛍️): Para comprar productos y servicios
- **Vendedor** (📦): Para vender productos y servicios

### Fecha de Creación
- **Auto-generada**: Se crea automáticamente al completar el registro
- **Formato**: Día, Mes, Año, Hora (ej: 9 de marzo de 2026, 14:30)

## 🎯 Validaciones Implementadas

### En Tiempo Real
- ✓ Validación mientras escribes
- ✓ Feedback visual instantáneo
- ✓ Cambio de color en bordes y estados
- ✓ Mensaje de error/éxito personalizado

### Requisitos de Contraseña
Se muestran dinámicamente con estados:
- ✗ Mínimo 8 caracteres (se marca ✓ cuando se cumple)
- ✗ Una letra mayúscula (se marca ✓ cuando se cumple)
- ✗ Un número (se marca ✓ cuando se cumple)

## 🎨 Paleta de Colores

- **Primario**: #6366f1 (Índigo)
- **Secundario**: #ec4899 (Rosa)
- **Éxito**: #10b981 (Verde)
- **Error**: #ef4444 (Rojo)
- **Fondo**: Gradiente Índigo-Púrpura

## 📱 Breakpoints Responsive

- **Desktop**: > 768px (400x600 px con max-width 500px)
- **Tablet**: 481px - 768px (ajustes de espaciado)
- **Móvil**: ≤ 480px (optimizado para pantallas pequeñas)

## 🔐 Consideraciones de Seguridad

⚠️ **Nota Importante**: Esta es una maqueta frontend. Para producción:
1. Valida todos los datos en el servidor
2.  Usa HTTPS para transmisión segura
3. Implementa rate limiting para ataques de fuerza bruta
4. Usa hashing bcrypt para contraseñas
5. Implementa CORS correctamente
6. Protege contra inyección SQL y XSS
7. Implementa autenticación JWT o similär

## 💾 Almacenamiento

Actualmente los datos se muestran en la consola del navegador:
```javascript
console.log('Datos del registro:', registrationState.data);
console.log('Login:', { email, password });
```

Para conectar con backend (Wudhi-backend):
1. Reemplaza los `console.log()` con llamadas fetch/axios
2. Envía los datos al endpoint `/auth/register` o `/auth/login`
3. Guarda el token JWT devuelto
4. Usa el token para nuevas peticiones

## 🚀 Próximas Mejoras

- [ ] Integración con backend NestJS (Wudhi-backend)
- [ ] Almacenamiento de token JWT
- [ ] Verificación de correo electrónico
- [ ] Autenticación social (Google, GitHub)
- [ ] Perfil de usuario
- [ ] Dashboard de productos
- [ ] Carrito de compras
- [ ] Sistema de calificaciones

## 📧 Contacto

Desarrollado como parte del desarrollo de **Wudhi** - Marketplace Universitario

---

**Versión**: 1.0  
**Última actualización**: 9 de marzo de 2026
