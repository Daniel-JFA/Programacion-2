// Cart Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCartCount();
    setupEventListeners();
});

// Load cart items from localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('wudhi_cart') || '[]');
    const cartItems = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');

    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }

    emptyCart.style.display = 'none';
    cartContent.style.display = 'grid';

    // Load all products to get full details
    const products = JSON.parse(localStorage.getItem('wudhi_products') || '[]');

    cartItems.innerHTML = cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (!product) return '';

        const itemTotal = product.price * cartItem.quantity;

        return `
            <div class="cart-item" data-product-id="${cartItem.productId}">
                <div class="item-image">
                    <i class="fas fa-${getProductIcon(product.category)}"></i>
                </div>
                <div class="item-details">
                    <h3>${product.name}</h3>
                    <div class="item-meta">
                        <span><i class="fas fa-user"></i> ${product.seller}</span>
                        <span><i class="fas fa-tag"></i> ${getCategoryName(product.category)}</span>
                    </div>
                    <div class="item-price">$${product.price.toLocaleString()}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${cartItem.productId}, ${cartItem.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${cartItem.quantity}"
                               min="1" max="${product.stock}" onchange="updateQuantity(${cartItem.productId}, this.value)">
                        <button class="quantity-btn" onclick="updateQuantity(${cartItem.productId}, ${cartItem.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="item-total">
                    <div class="item-price">$${itemTotal.toLocaleString()}</div>
                    <button class="remove-btn" onclick="removeFromCart(${cartItem.productId})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    updateCartSummary();
}

// Update cart summary (subtotal, shipping, tax, total)
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('wudhi_cart') || '[]');
    const products = JSON.parse(localStorage.getItem('wudhi_products') || '[]');

    let subtotal = 0;
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (product) {
            subtotal += product.price * cartItem.quantity;
        }
    });

    const shipping = subtotal > 100000 ? 0 : 10000; // Free shipping over $100k
    const tax = subtotal * 0.19; // 19% IVA
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString()}`;
    document.getElementById('tax').textContent = `$${tax.toLocaleString()}`;
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;
}

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('wudhi_cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.count').textContent = totalItems;
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    if (newQuantity < 1) return;

    const cart = JSON.parse(localStorage.getItem('wudhi_cart') || '[]');
    const products = JSON.parse(localStorage.getItem('wudhi_products') || '[]');
    const product = products.find(p => p.id === productId);

    if (!product || newQuantity > product.stock) {
        showMessage('Cantidad no disponible en stock', 'error');
        return;
    }

    const cartItem = cart.find(item => item.productId === productId);
    if (cartItem) {
        cartItem.quantity = newQuantity;
        localStorage.setItem('wudhi_cart', JSON.stringify(cart));
        loadCart();
        updateCartCount();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('wudhi_cart') || '[]');
    const updatedCart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('wudhi_cart', JSON.stringify(updatedCart));
    loadCart();
    updateCartCount();
    showMessage('Producto removido del carrito', 'success');
}

// Apply promo code
function applyPromoCode() {
    const promoCode = document.getElementById('promoCode').value.toUpperCase();
    const validCodes = {
        'ESTUDIANTE10': 0.1, // 10% discount
        'UNIV20': 0.2 // 20% discount
    };

    if (validCodes[promoCode]) {
        const discount = validCodes[promoCode];
        localStorage.setItem('wudhi_promo', JSON.stringify({ code: promoCode, discount: discount }));
        showMessage(`Código aplicado: ${discount * 100}% de descuento`, 'success');
        updateCartSummary();
    } else {
        showMessage('Código promocional inválido', 'error');
    }
}

// Proceed to checkout
function proceedToCheckout() {
    const user = JSON.parse(localStorage.getItem('wudhi_user'));
    if (!user) {
        showMessage('Debes iniciar sesión para continuar', 'error');
        setTimeout(() => window.location.href = 'index.html', 2000);
        return;
    }

    // Load user data into checkout form
    document.getElementById('shippingName').value = user.name;
    document.getElementById('shippingPhone').value = user.phone || '';
    if (user.address) {
        document.getElementById('shippingAddress').value = user.address.street || '';
        document.getElementById('shippingCity').value = user.address.city || '';
        document.getElementById('shippingPostal').value = user.address.postalCode || '';
    }

    // Load cart items into checkout
    loadCheckoutItems();

    // Show modal
    document.getElementById('checkoutModal').style.display = 'block';
}

// Load checkout items
function loadCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('wudhi_cart') || '[]');
    const products = JSON.parse(localStorage.getItem('wudhi_products') || '[]');
    const checkoutItems = document.getElementById('checkoutItems');

    checkoutItems.innerHTML = cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (!product) return '';

        const itemTotal = product.price * cartItem.quantity;

        return `
            <div class="checkout-item">
                <span class="checkout-item-name">${product.name} x${cartItem.quantity}</span>
                <span class="checkout-item-price">$${itemTotal.toLocaleString()}</span>
            </div>
        `;
    }).join('');

    // Update checkout totals
    updateCheckoutTotals();
}

// Update checkout totals
function updateCheckoutTotals() {
    const cart = JSON.parse(localStorage.getItem('wudhi_cart') || '[]');
    const products = JSON.parse(localStorage.getItem('wudhi_products') || '[]');
    const promo = JSON.parse(localStorage.getItem('wudhi_promo') || 'null');

    let subtotal = 0;
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        if (product) {
            subtotal += product.price * cartItem.quantity;
        }
    });

    // Apply promo discount
    if (promo) {
        subtotal = subtotal * (1 - promo.discount);
    }

    const shipping = subtotal > 100000 ? 0 : 10000;
    const tax = subtotal * 0.19;
    const total = subtotal + shipping + tax;

    document.getElementById('checkoutSubtotal').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString()}`;
    document.getElementById('checkoutTax').textContent = `$${tax.toLocaleString()}`;
    document.getElementById('checkoutTotal').textContent = `$${total.toLocaleString()}`;
}

// Confirm order
function confirmOrder() {
    // Validate form
    const requiredFields = [
        'shippingName', 'shippingPhone', 'shippingAddress', 'shippingCity', 'shippingPostal',
        'cardNumber', 'expiryDate', 'cvv', 'cardName'
    ];

    let isValid = true;
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            field.style.borderColor = '#d1d5db';
        }
    });

    if (!isValid) {
        showMessage('Por favor completa todos los campos requeridos', 'error');
        return;
    }

    // Validate card number (basic check)
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    if (cardNumber.length < 13 || cardNumber.length > 19 || !/^\d+$/.test(cardNumber)) {
        showMessage('Número de tarjeta inválido', 'error');
        return;
    }

    // Create order
    const user = JSON.parse(localStorage.getItem('wudhi_user'));
    const cart = JSON.parse(localStorage.getItem('wudhi_cart') || '[]');
    const products = JSON.parse(localStorage.getItem('wudhi_products') || '[]');
    const promo = JSON.parse(localStorage.getItem('wudhi_promo') || 'null');

    let subtotal = 0;
    const orderItems = cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId);
        const itemTotal = product.price * cartItem.quantity;
        subtotal += itemTotal;

        return {
            productId: cartItem.productId,
            productName: product.name,
            quantity: cartItem.quantity,
            price: product.price,
            total: itemTotal
        };
    });

    // Apply promo discount
    if (promo) {
        subtotal = subtotal * (1 - promo.discount);
    }

    const shipping = subtotal > 100000 ? 0 : 10000;
    const tax = subtotal * 0.19;
    const total = subtotal + shipping + tax;

    const order = {
        id: Date.now(),
        userId: user.id,
        items: orderItems,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total,
        status: 'paid',
        createdAt: new Date().toISOString(),
        shippingAddress: {
            name: document.getElementById('shippingName').value,
            phone: document.getElementById('shippingPhone').value,
            address: document.getElementById('shippingAddress').value,
            city: document.getElementById('shippingCity').value,
            postalCode: document.getElementById('shippingPostal').value
        },
        promoCode: promo ? promo.code : null
    };

    // Save order
    const orders = JSON.parse(localStorage.getItem('wudhi_orders') || '[]');
    orders.push(order);
    localStorage.setItem('wudhi_orders', JSON.stringify(orders));

    // Clear cart and promo
    localStorage.removeItem('wudhi_cart');
    localStorage.removeItem('wudhi_promo');

    // Close modal and redirect
    closeCheckoutModal();
    showMessage('¡Orden creada exitosamente!', 'success');

    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 2000);
}

// Close checkout modal
function closeCheckoutModal() {
    document.getElementById('checkoutModal').style.display = 'none';
}

// Continue shopping
function continueShopping() {
    window.location.href = 'catalog.html';
}

// Setup event listeners
function setupEventListeners() {
    // Close modal when clicking outside
    document.getElementById('checkoutModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeCheckoutModal();
        }
    });

    // Enter key on promo code
    document.getElementById('promoCode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyPromoCode();
        }
    });
}

// Utility functions
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

function getCategoryName(category) {
    const nameMap = {
        'electronics': 'Electrónica',
        'books': 'Libros',
        'services': 'Servicios',
        'housing': 'Vivienda',
        'transport': 'Transporte',
        'sports': 'Deportes'
    };
    return nameMap[category] || category;
}

// Show message function
function showMessage(message, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;

    document.body.appendChild(messageEl);

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

    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 0; }
    }
`;
document.head.appendChild(style);