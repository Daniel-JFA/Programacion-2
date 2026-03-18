// ===========================
// VARIABLES Y REFERENCIAS DOM
// ===========================

// Elementos del header
const navLinks = document.querySelectorAll('.nav-link');
const logoutBtn = document.querySelector('.logout-btn');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');

// Elementos de búsqueda y filtros
const searchInput = document.getElementById('search-input');
const searchBtn = document.querySelector('.search-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');

// Elementos de categorías
const categoryCards = document.querySelectorAll('.category-card');

// Elementos de productos
const productsGrid = document.getElementById('products-grid');
const loadMoreBtn = document.getElementById('load-more-btn');

// Modal
const productModal = document.getElementById('product-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalAddCartBtn = document.getElementById('modal-add-cart');

// ===========================
// DATOS SIMULADOS (BASADO EN LA ARQUITECTURA)
// ===========================

// Estado del catálogo
const catalogState = {
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
    currentFilter: 'all',
    currentCategory: 'all',
    currentSort: 'relevance',
    searchQuery: '',
    cartItems: 3 // Simulado
};

// Datos de productos (simulando la tabla products de la BD)
const productsData = [
    {
        id: 1,
        store_id: 1,
        category_id: 1,
        name: 'Laptop Gaming ASUS ROG',
        description: 'Potente laptop para gaming con RTX 4060, 16GB RAM, 512GB SSD. Perfecta para estudiantes de ingeniería y diseño.',
        price: 4500000,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/6366f1/ffffff?text=ASUS+ROG'],
        seller: 'TechStore Uni',
        rating: 4.8,
        reviews: 24,
        stock: 5,
        type: 'productos',
        category: 'electronics',
        created_at: '2026-03-01'
    },
    {
        id: 2,
        store_id: 2,
        category_id: 2,
        name: 'Clases de Matemáticas Avanzadas',
        description: 'Tutorías personalizadas de cálculo diferencial, álgebra lineal y estadística. Más de 50 estudiantes aprobados.',
        price: 35000,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/ec4899/ffffff?text=Matematicas'],
        seller: 'TutorPro',
        rating: 5.0,
        reviews: 18,
        stock: 999,
        type: 'servicios',
        category: 'services',
        created_at: '2026-02-28'
    },
    {
        id: 3,
        store_id: 3,
        category_id: 3,
        name: 'Habitación en Residencias Estudiantiles',
        description: 'Habitación privada con baño, cocina compartida, WiFi incluido. A 5 minutos del campus principal.',
        price: 450000,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/10b981/ffffff?text=Habitacion'],
        seller: 'Residencias UniCentro',
        rating: 4.6,
        reviews: 12,
        stock: 3,
        type: 'productos',
        category: 'housing',
        created_at: '2026-03-05'
    },
    {
        id: 4,
        store_id: 4,
        category_id: 4,
        name: 'Bicicleta Montañera Specialized',
        description: 'Bicicleta casi nueva, usada solo 6 meses. Incluye candado y luces. Perfecta para movilizarte por el campus.',
        price: 1200000,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/f59e0b/ffffff?text=Bicicleta'],
        seller: 'Deportes Uni',
        rating: 4.7,
        reviews: 8,
        stock: 1,
        type: 'productos',
        category: 'transport',
        created_at: '2026-03-03'
    },
    {
        id: 5,
        store_id: 5,
        category_id: 5,
        name: 'Libro: Estructuras de Datos y Algoritmos',
        description: 'Texto universitario en excelente estado. Incluye ejercicios resueltos y apuntes adicionales.',
        price: 65000,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Libro+EDA'],
        seller: 'Librería Campus',
        rating: 4.9,
        reviews: 15,
        stock: 2,
        type: 'productos',
        category: 'books',
        created_at: '2026-02-25'
    },
    {
        id: 6,
        store_id: 6,
        category_id: 6,
        name: 'Balón de Fútbol Profesional',
        description: 'Balón oficial tamaño 5, nuevo. Ideal para partidos entre amigos o equipos universitarios.',
        price: 85000,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/06b6d4/ffffff?text=Balon'],
        seller: 'Deportes Total',
        rating: 4.5,
        reviews: 6,
        stock: 4,
        type: 'productos',
        category: 'sports',
        created_at: '2026-03-07'
    },
    {
        id: 7,
        store_id: 7,
        category_id: 7,
        name: 'Servicio de Diseño Gráfico',
        description: 'Diseño de logos, posters y material publicitario para tu emprendimiento universitario. Portafolio disponible.',
        price: 150000,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/84cc16/ffffff?text=Diseno'],
        seller: 'Creative Studio',
        rating: 4.9,
        reviews: 22,
        stock: 999,
        type: 'servicios',
        category: 'services',
        created_at: '2026-02-20'
    },
    {
        id: 8,
        store_id: 8,
        category_id: 8,
        name: 'Audífonos Sony WH-1000XM4',
        description: 'Audífonos inalámbricos con cancelación de ruido. Perfectos para estudiar o escuchar música en la biblioteca.',
        price: 850000,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/f97316/ffffff?text=Sony+WH1000'],
        seller: 'AudioTech',
        rating: 4.8,
        reviews: 31,
        stock: 7,
        type: 'productos',
        category: 'electronics',
        created_at: '2026-03-02'
    },
    {
        id: 9,
        store_id: 9,
        category_id: 9,
        name: 'Clases de Inglés Conversacional',
        description: 'Clases particulares o grupales de inglés. Enfoque en conversación y pronunciación. Niveles básico a avanzado.',
        price: 25000,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/6366f1/ffffff?text=Ingles'],
        seller: 'English Pro',
        rating: 4.7,
        reviews: 14,
        stock: 999,
        type: 'servicios',
        category: 'services',
        created_at: '2026-02-15'
    },
    {
        id: 10,
        store_id: 10,
        category_id: 10,
        name: 'Tablet Samsung Galaxy Tab S8',
        description: 'Tablet de 11" con S-Pen incluido. Ideal para tomar notas en clases o hacer presentaciones.',
        price: 1800000,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/ec4899/ffffff?text=Tablet+S8'],
        seller: 'Digital Store',
        rating: 4.6,
        reviews: 9,
        stock: 3,
        type: 'productos',
        category: 'electronics',
        created_at: '2026-03-04'
    },
    {
        id: 11,
        store_id: 11,
        category_id: 11,
        name: 'Servicio de Fotografía para Eventos',
        description: 'Cobertura fotográfica para fiestas universitarias, graduaciones y eventos. Edición profesional incluida.',
        price: 200000,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/10b981/ffffff?text=Fotografia'],
        seller: 'Campus Photos',
        rating: 5.0,
        reviews: 7,
        stock: 999,
        type: 'servicios',
        category: 'services',
        created_at: '2026-02-10'
    },
    {
        id: 12,
        store_id: 12,
        category_id: 12,
        name: 'Raqueta de Tenis Wilson',
        description: 'Raqueta profesional en buen estado. Perfecta para estudiantes que juegan en las canchas universitarias.',
        price: 350000,
        status: 'active',
        images: ['https://via.placeholder.com/400x300/f59e0b/ffffff?text=Raqueta'],
        seller: 'Sports Center',
        rating: 4.4,
        reviews: 5,
        stock: 2,
        type: 'productos',
        category: 'sports',
        created_at: '2026-03-06'
    }
];

// ===========================
// UTILIDADES
// ===========================

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
};

const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
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

    if (type === 'success') notification.style.background = '#10b981';
    else if (type === 'error') notification.style.background = '#ef4444';
    else if (type === 'warning') notification.style.background = '#f59e0b';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
};

const updateCartCount = (count) => {
    cartCount.textContent = count;
    catalogState.cartItems = count;
};

// ===========================
// RENDERIZADO DE PRODUCTOS
// ===========================

const renderProductCard = (product) => {
    const isService = product.type === 'servicios';
    const stockStatus = product.stock > 0 ? 'Disponible' : 'Agotado';
    const stockClass = product.stock > 0 ? 'success' : 'error';

    return `
        <div class="product-card" data-product-id="${product.id}" data-category="${product.category}" data-type="${product.type}">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}">
                ${product.stock < 5 && product.stock > 0 ? '<div class="product-badge">¡Últimas unidades!</div>' : ''}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${formatCurrency(product.price)}${isService ? '/hora' : ''}</div>
                <div class="product-meta">
                    <span class="product-seller">${product.seller}</span>
                    <span class="product-rating">⭐ ${product.rating} (${product.reviews})</span>
                </div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn-secondary" onclick="viewProductDetail(${product.id})">Ver Detalles</button>
                    <button class="btn-primary" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                    </button>
                </div>
            </div>
        </div>
    `;
};

const renderProducts = (products) => {
    const productsHTML = products.map(product => renderProductCard(product)).join('');
    productsGrid.innerHTML = productsHTML;
};

const filterAndSortProducts = () => {
    let filteredProducts = [...productsData];

    // Filtro por búsqueda
    if (catalogState.searchQuery) {
        const query = catalogState.searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.seller.toLowerCase().includes(query)
        );
    }

    // Filtro por tipo
    if (catalogState.currentFilter !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.type === catalogState.currentFilter);
    }

    // Filtro por categoría
    if (catalogState.currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === catalogState.currentCategory);
    }

    // Ordenamiento
    switch (catalogState.currentSort) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        default: // relevance
            // Mantener orden original
            break;
    }

    catalogState.totalItems = filteredProducts.length;
    const startIndex = 0;
    const endIndex = catalogState.itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    renderProducts(productsToShow);

    // Actualizar botón "Cargar más"
    loadMoreBtn.style.display = filteredProducts.length > catalogState.itemsPerPage ? 'block' : 'none';
};

// ===========================
// MODAL DE DETALLE DE PRODUCTO
// ===========================

const viewProductDetail = (productId) => {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const isService = product.type === 'servicios';
    const stockText = product.stock === 999 ? 'Disponible' : `${product.stock} unidades`;

    modalTitle.textContent = product.name;
    modalBody.innerHTML = `
        <img src="${product.images[0]}" alt="${product.name}" class="modal-product-image">
        <div class="modal-product-info">
            <h3>${product.name}</h3>
            <div class="modal-product-price">${formatCurrency(product.price)}${isService ? '/hora' : ''}</div>
            <div class="modal-product-meta">
                <span>Vendedor: ${product.seller}</span>
                <span>⭐ ${product.rating} (${product.reviews} reseñas)</span>
            </div>
            <p class="modal-product-description">${product.description}</p>
            <div class="modal-product-details">
                <h4>Detalles del ${isService ? 'Servicio' : 'Producto'}</h4>
                <p><strong>Categoría:</strong> ${product.category}</p>
                <p><strong>Disponibilidad:</strong> ${stockText}</p>
                <p><strong>Tipo:</strong> ${isService ? 'Servicio' : 'Producto físico'}</p>
                <p><strong>Publicado:</strong> ${new Date(product.created_at).toLocaleDateString('es-ES')}</p>
            </div>
        </div>
    `;

    productModal.classList.remove('hidden');
};

const closeModal = () => {
    productModal.classList.add('hidden');
};

// ===========================
// FUNCIONES DE CARRITO
// ===========================

const addToCart = (productId) => {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    if (product.stock === 0) {
        showNotification('Producto agotado', 'error');
        return;
    }

    // Simular agregar al carrito
    catalogState.cartItems++;
    updateCartCount(catalogState.cartItems);

    showNotification(`"${product.name}" agregado al carrito`, 'success');

    // En una app real, aquí se haría una llamada a la API para actualizar el carrito
    console.log('Producto agregado al carrito:', product);
};

// ===========================
// EVENT LISTENERS
// ===========================

// Navegación
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const page = link.textContent;
        console.log(`Navegando a: ${page}`);
        // En una app real: window.location.href = `/${page.toLowerCase()}`;
    });
});

// Logout
logoutBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        showNotification('Cerrando sesión...', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
});

// Búsqueda
searchBtn.addEventListener('click', () => {
    catalogState.searchQuery = searchInput.value.trim();
    catalogState.currentPage = 1;
    filterAndSortProducts();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Filtros
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        catalogState.currentFilter = button.dataset.filter;
        catalogState.currentPage = 1;
        filterAndSortProducts();
    });
});

// Categorías
categoryCards.forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        catalogState.currentCategory = category;
        catalogState.currentPage = 1;

        // Resaltar categoría seleccionada
        categoryCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        filterAndSortProducts();
        showNotification(`Mostrando productos de ${card.querySelector('h3').textContent}`, 'info');
    });
});

// Ordenamiento
sortSelect.addEventListener('change', () => {
    catalogState.currentSort = sortSelect.value;
    filterAndSortProducts();
});

// Cargar más productos
loadMoreBtn.addEventListener('click', () => {
    catalogState.currentPage++;
    const startIndex = (catalogState.currentPage - 1) * catalogState.itemsPerPage;
    const endIndex = startIndex + catalogState.itemsPerPage;

    // En una app real, aquí se haría una llamada a la API
    // Por ahora, simulamos cargando más productos
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Cargando...';

    setTimeout(() => {
        // Simular que se cargaron más productos
        showNotification('Más productos cargados', 'success');
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = 'Cargar Más Productos';

        // Si no hay más productos, ocultar el botón
        if (endIndex >= catalogState.totalItems) {
            loadMoreBtn.style.display = 'none';
        }
    }, 1000);
});

// Modal
closeModalBtn.addEventListener('click', closeModal);
modalCloseBtn.addEventListener('click', closeModal);
modalAddCartBtn.addEventListener('click', () => {
    const productId = parseInt(productModal.querySelector('.product-card')?.dataset.productId);
    if (productId) {
        addToCart(productId);
        closeModal();
    }
});

// Cerrar modal con ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !productModal.classList.contains('hidden')) {
        closeModal();
    }
});

// Cerrar modal haciendo click fuera
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        closeModal();
    }
});

// ===========================
// INICIALIZACIÓN
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Catálogo de Wudhi inicializado');

    // Cargar productos iniciales
    filterAndSortProducts();

    // Actualizar contador del carrito
    updateCartCount(catalogState.cartItems);

    // Agregar estilos CSS para las animaciones de notificación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .category-card.selected {
            border-color: #6366f1;
            background: rgba(99, 102, 241, 0.05);
        }
    `;
    document.head.appendChild(style);

    showNotification('Catálogo cargado exitosamente', 'success');
});

// ===========================
// FUNCIONES GLOBALES PARA DEBUGGING
// ===========================

window.viewProductDetail = viewProductDetail;
window.addToCart = addToCart;
window.wudhiCatalog = {
    catalogState,
    productsData,
    filterAndSortProducts,
    updateCartCount
};
