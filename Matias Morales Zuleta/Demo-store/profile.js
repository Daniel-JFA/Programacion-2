// Profile Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
    loadUserData();
    loadOrders();
    loadUserProducts();
    setupFormValidation();
});

// Initialize profile functionality
function initializeProfile() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('wudhi_user'));
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // Show/hide products tab based on user role
    if (user.role !== 'vendedor') {
        document.getElementById('productsTab').style.display = 'none';
    }
}

// Load user data from localStorage
function loadUserData() {
    const user = JSON.parse(localStorage.getItem('wudhi_user'));
    if (user) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userEmail').textContent = user.email;

        // Load form data
        const nameParts = user.name.split(' ');
        document.getElementById('firstName').value = nameParts[0] || '';
        document.getElementById('lastName').value = nameParts.slice(1).join(' ') || '';
        document.getElementById('email').value = user.email;
        document.getElementById('phone').value = user.phone || '';
        document.getElementById('university').value = user.university || '';
        document.getElementById('studentId').value = user.studentId || '';

        // Load address data
        const address = user.address || {};
        document.getElementById('country').value = address.country || 'Colombia';
        document.getElementById('city').value = address.city || '';
        document.getElementById('address').value = address.street || '';
        document.getElementById('postalCode').value = address.postalCode || '';
    }
}

// Tab switching functionality
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Load user orders
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('wudhi_orders') || '[]');
    const ordersList = document.getElementById('ordersList');

    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="no-orders">No tienes órdenes realizadas aún.</p>';
        return;
    }

    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-info">
                <h3>Orden #${order.id}</h3>
                <div class="order-meta">
                    <span><i class="fas fa-calendar"></i> ${formatDate(order.createdAt)}</span>
                    <span><i class="fas fa-dollar-sign"></i> $${order.total.toLocaleString()}</span>
                    <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
                </div>
            </div>
            <div class="order-actions">
                <button class="btn-secondary" onclick="viewOrderDetails(${order.id})">
                    <i class="fas fa-eye"></i> Ver Detalles
                </button>
            </div>
        </div>
    `).join('');
}

// Load user products (for sellers)
function loadUserProducts() {
    const user = JSON.parse(localStorage.getItem('wudhi_user'));
    if (user.role !== 'vendedor') return;

    const products = JSON.parse(localStorage.getItem('wudhi_products') || '[]');
    const userProducts = products.filter(product => product.sellerId === user.id);
    const productsGrid = document.getElementById('productsGrid');

    if (userProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No tienes productos publicados aún.</p>';
        return;
    }

    productsGrid.innerHTML = userProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas fa-${getProductIcon(product.category)}"></i>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">$${product.price.toLocaleString()}</div>
                <div class="product-meta">
                    <span><i class="fas fa-box"></i> Stock: ${product.stock}</span>
                    <span><i class="fas fa-star"></i> ${product.rating}</span>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn-secondary" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-secondary" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Setup form validation and submission
function setupFormValidation() {
    // Personal information form
    document.getElementById('personalForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updatePersonalInfo();
    });

    // Address form
    document.getElementById('addressForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateAddress();
    });

    // Password form
    document.getElementById('passwordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        changePassword();
    });

    // Add product form
    document.getElementById('addProductForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addNewProduct();
    });
}

// Update personal information
function updatePersonalInfo() {
    const formData = new FormData(document.getElementById('personalForm'));
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const university = formData.get('university');
    const studentId = formData.get('studentId');

    // Validation
    if (!firstName || !lastName || !email || !phone || !university || !studentId) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showMessage('Ingresa un correo electrónico válido', 'error');
        return;
    }

    // Update user data
    const user = JSON.parse(localStorage.getItem('wudhi_user'));
    user.name = `${firstName} ${lastName}`;
    user.email = email;
    user.phone = phone;
    user.university = university;
    user.studentId = studentId;

    localStorage.setItem('wudhi_user', JSON.stringify(user));

    // Update UI
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;

    showMessage('Información personal actualizada correctamente', 'success');
}

// Update address
function updateAddress() {
    const formData = new FormData(document.getElementById('addressForm'));
    const address = {
        country: formData.get('country'),
        city: formData.get('city'),
        street: formData.get('address'),
        postalCode: formData.get('postalCode')
    };

    // Validation
    if (!address.city || !address.street || !address.postalCode) {
        showMessage('Por favor completa todos los campos de dirección', 'error');
        return;
    }

    // Update user data
    const user = JSON.parse(localStorage.getItem('wudhi_user'));
    user.address = address;
    localStorage.setItem('wudhi_user', JSON.stringify(user));

    showMessage('Dirección actualizada correctamente', 'success');
}

// Change password
function changePassword() {
    const formData = new FormData(document.getElementById('passwordForm'));
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showMessage('Las contraseñas no coinciden', 'error');
        return;
    }

    if (newPassword.length < 8) {
        showMessage('La nueva contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }

    // In a real app, this would verify the current password with the server
    const user = JSON.parse(localStorage.getItem('wudhi_user'));
    user.password = newPassword; // In real app, this would be hashed
    localStorage.setItem('wudhi_user', JSON.stringify(user));

    // Clear form
    document.getElementById('passwordForm').reset();

    showMessage('Contraseña cambiada correctamente', 'success');
}

// Add new product
function addNewProduct() {
    const formData = new FormData(document.getElementById('addProductForm'));
    const user = JSON.parse(localStorage.getItem('wudhi_user'));

    const product = {
        id: Date.now(),
        sellerId: user.id,
        name: formData.get('productName'),
        description: formData.get('productDescription'),
        price: parseFloat(formData.get('productPrice')),
        stock: parseInt(formData.get('productStock')),
        category: formData.get('productCategory'),
        type: formData.get('productType'),
        rating: 0,
        status: 'active',
        createdAt: new Date().toISOString()
    };

    // Validation
    if (!product.name || !product.description || !product.price || !product.stock || !product.category || !product.type) {
        showMessage('Por favor completa todos los campos del producto', 'error');
        return;
    }

    // Save product
    const products = JSON.parse(localStorage.getItem('wudhi_products') || '[]');
    products.push(product);
    localStorage.setItem('wudhi_products', JSON.stringify(products));

    // Close modal and refresh products
    closeAddProductModal();
    loadUserProducts();
    document.getElementById('addProductForm').reset();

    showMessage('Producto agregado correctamente', 'success');
}

// Modal functions
function showAddProductModal() {
    document.getElementById('addProductModal').style.display = 'block';
}

function closeAddProductModal() {
    document.getElementById('addProductModal').style.display = 'none';
}

// Product management functions
function editProduct(productId) {
    // In a real app, this would open an edit modal
    showMessage('Funcionalidad de edición próximamente', 'info');
}

function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        const products = JSON.parse(localStorage.getItem('wudhi_products') || '[]');
        const updatedProducts = products.filter(product => product.id !== productId);
        localStorage.setItem('wudhi_products', JSON.stringify(updatedProducts));

        loadUserProducts();
        showMessage('Producto eliminado correctamente', 'success');
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getStatusText(status) {
    const statusMap = {
        'created': 'Creada',
        'paid': 'Pagada',
        'shipped': 'Enviada',
        'delivered': 'Entregada',
        'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
}

function getProductIcon(category) {
    const iconMap = {
        'electronics': 'laptop',
        'books': 'book',
        'services': 'user-graduate',
        'housing': 'home',
        'transport': 'car',
        'sports': 'futbol'
    };
    return iconMap[category] || 'box';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function viewOrderDetails(orderId) {
    // In a real app, this would navigate to order details page
    showMessage('Vista de detalles de orden próximamente', 'info');
}

function logout() {
    localStorage.removeItem('wudhi_user');
    window.location.href = 'index.html';
}

// Show message function
function showMessage(message, type) {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;

    // Add to page
    document.body.appendChild(messageEl);

    // Remove after 3 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}

// Add message styles dynamically
const style = document.createElement('style');
style.textContent = `
    .message {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    }

    .message-success { background: #10b981; }
    .message-error { background: #ef4444; }
    .message-info { background: #3b82f6; }

    .no-orders, .no-products {
        text-align: center;
        color: #6b7280;
        padding: 2rem;
        font-style: italic;
    }

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 0; }
    }
`;
document.head.appendChild(style);