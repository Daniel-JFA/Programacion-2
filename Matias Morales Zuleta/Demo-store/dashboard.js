// ===========================
// VARIABLES Y REFERENCIAS DOM
// ===========================

// Elementos del header
const navLinks = document.querySelectorAll('.nav-link');
const logoutBtn = document.querySelector('.logout-btn');

// Elementos de acciones rápidas
const actionButtons = document.querySelectorAll('.action-btn');

// Elementos de productos
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

// Estado del usuario (simulado)
const userState = {
    name: 'Juan Pérez',
    role: 'comprador', // 'comprador' o 'vendedor'
    stats: {
        orders: 12,
        totalSpent: 2500000,
        rating: 4.8,
        productsSelling: 3
    },
    recentActivity: [
        {
            type: 'purchase',
            description: 'Compraste: Laptop Dell Inspiron',
            time: 'Hace 2 horas',
            icon: '🛒'
        },
        {
            type: 'payment',
            description: 'Pago confirmado: Orden #12345',
            time: 'Hace 1 día',
            icon: '💰'
        },
        {
            type: 'rating',
            description: 'Calificación recibida: 5 estrellas por "Servicio excelente"',
            time: 'Hace 3 días',
            icon: '⭐'
        }
    ]
};

// ===========================
// UTILIDADES
// ===========================

const showNotification = (message, type = 'success') => {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Agregar estilos básicos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    // Colores según tipo
    if (type === 'success') {
        notification.style.background = '#10b981';
    } else if (type === 'error') {
        notification.style.background = '#ef4444';
    } else if (type === 'warning') {
        notification.style.background = '#f59e0b';
    }

    // Agregar animación CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Agregar al DOM
    document.body.appendChild(notification);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);

    // Agregar animación de salida
    style.textContent += `
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
};

const updateUserStats = () => {
    // Actualizar estadísticas en el DOM
    const statCards = document.querySelectorAll('.stat-card');
    statCards[0].querySelector('.stat-number').textContent = userState.stats.orders;
    statCards[1].querySelector('.stat-number').textContent = formatCurrency(userState.stats.totalSpent);
    statCards[2].querySelector('.stat-number').textContent = userState.stats.rating;
    statCards[3].querySelector('.stat-number').textContent = userState.stats.productsSelling;
};

// ===========================
// NAVEGACIÓN
// ===========================

const handleNavigation = (targetPage) => {
    // Remover clase active de todos los links
    navLinks.forEach(link => link.classList.remove('active'));

    // Agregar clase active al link clickeado
    event.target.classList.add('active');

    // Simular navegación (en una app real, esto sería routing)
    console.log(`Navegando a: ${targetPage}`);

    switch(targetPage) {
        case 'Inicio':
            showNotification('Ya estás en el inicio', 'info');
            break;
        case 'Productos':
            showNotification('Redirigiendo al catálogo de productos...', 'info');
            // En una app real: window.location.href = '/productos';
            break;
        case 'Mis Órdenes':
            showNotification('Redirigiendo a tus órdenes...', 'info');
            // En una app real: window.location.href = '/ordenes';
            break;
        case 'Perfil':
            showNotification('Redirigiendo a tu perfil...', 'info');
            // En una app real: window.location.href = '/perfil';
            break;
    }
};

// ===========================
// ACCIONES RÁPIDAS
// ===========================

const handleQuickAction = (action) => {
    console.log(`Acción rápida: ${action}`);

    switch(action) {
        case 'Ver Catálogo':
            showNotification('Abriendo catálogo de productos...', 'info');
            // Simular navegación al catálogo
            setTimeout(() => {
                showNotification('Catálogo cargado exitosamente', 'success');
            }, 1000);
            break;

        case 'Crear Producto':
            if (userState.role === 'vendedor') {
                showNotification('Redirigiendo al formulario de producto...', 'info');
            } else {
                showNotification('Necesitas ser vendedor para crear productos', 'warning');
            }
            break;

        case 'Ver Órdenes':
            showNotification('Cargando tus órdenes...', 'info');
            setTimeout(() => {
                showNotification(`Tienes ${userState.stats.orders} órdenes`, 'success');
            }, 800);
            break;

        case 'Mi Perfil':
            showNotification('Abriendo configuración de perfil...', 'info');
            break;
    }
};

// ===========================
// CARRITO DE COMPRAS
// ===========================

const handleAddToCart = (productName) => {
    console.log(`Agregando al carrito: ${productName}`);

    // Simular agregar al carrito
    showNotification(`"${productName}" agregado al carrito`, 'success');

    // En una app real, esto actualizaría el estado del carrito
    // y posiblemente mostraría un contador en el header
};

// ===========================
// LOGOUT
// ===========================

const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        showNotification('Cerrando sesión...', 'info');

        // Simular logout
        setTimeout(() => {
            showNotification('Sesión cerrada exitosamente', 'success');

            // En una app real, esto limpiaría tokens y redirigiría al login
            // window.location.href = '/login';
            console.log('Usuario cerró sesión');
        }, 1000);
    }
};

// ===========================
// EVENT LISTENERS
// ===========================

// Navegación
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        handleNavigation(e.target.textContent);
    });
});

// Acciones rápidas
actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleQuickAction(button.textContent);
    });
});

// Agregar al carrito
addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const productCard = button.closest('.product-card');
        const productName = productCard.querySelector('h4').textContent;
        handleAddToCart(productName);
    });
});

// Logout
logoutBtn.addEventListener('click', handleLogout);

// ===========================
// INICIALIZACIÓN
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard de Wudhi inicializado');

    // Actualizar estadísticas del usuario
    updateUserStats();

    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        showNotification(`¡Bienvenido de vuelta, ${userState.name}!`, 'success');
    }, 500);

    // Simular carga de datos en tiempo real
    setTimeout(() => {
        console.log('Datos del dashboard cargados:', userState);
    }, 1000);
});

// ===========================
// FUNCIONES PARA INTEGRACIÓN FUTURA
// ===========================

// Función para actualizar el estado del usuario (desde API)
const updateUserState = (newState) => {
    Object.assign(userState, newState);
    updateUserStats();
    console.log('Estado del usuario actualizado:', userState);
};

// Función para agregar actividad reciente
const addRecentActivity = (activity) => {
    userState.recentActivity.unshift(activity);
    if (userState.recentActivity.length > 5) {
        userState.recentActivity.pop();
    }

    // En una app real, esto actualizaría el DOM
    console.log('Nueva actividad agregada:', activity);
};

// Función para cambiar rol del usuario
const changeUserRole = (newRole) => {
    if (newRole === 'vendedor' || newRole === 'comprador') {
        userState.role = newRole;
        document.querySelector('.user-role').textContent = newRole.charAt(0).toUpperCase() + newRole.slice(1);
        showNotification(`Rol cambiado a: ${newRole}`, 'success');
        console.log(`Rol del usuario cambiado a: ${newRole}`);
    }
};

// Exponer funciones globalmente para debugging/consola
window.wudhiDashboard = {
    updateUserState,
    addRecentActivity,
    changeUserRole,
    showNotification
};
