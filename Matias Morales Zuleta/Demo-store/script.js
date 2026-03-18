// ===========================
// VARIABLES Y REFERENCIAS DOM
// ===========================

// Formulario de Registro
const registerForm = document.getElementById('register-form');
const registerIdInput = document.getElementById('register-id');
const registerNameInput = document.getElementById('register-name');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');
const roleOptions = document.querySelectorAll('input[name="role"]');
const createdAtDisplay = document.getElementById('createdAt-display');

// Formulario de Login
const loginForm = document.getElementById('login-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');

// Botones y Toggle
const nextFieldBtn = document.getElementById('next-field-btn');
const submitRegisterBtn = document.getElementById('submit-register');
const submitLoginBtn = document.getElementById('submit-login');
const toggleToLoginBtn = document.getElementById('toggle-to-login');
const toggleToRegisterBtn = document.getElementById('toggle-to-register');

// Botones de contraseña
const togglePasswordRegister = document.getElementById('toggle-password-register');
const togglePasswordLogin = document.getElementById('toggle-password-login');

// Recuperación de contraseña
const recoveryModal = document.getElementById('recovery-modal');
const forgotPasswordBtn = document.getElementById('forgot-password-btn');
const sendRecoveryBtn = document.getElementById('send-recovery');
const cancelRecoveryBtn = document.getElementById('cancel-recovery');
const closeRecoveryBtn = document.getElementById('close-recovery');
const recoveryEmailInput = document.getElementById('recovery-email');

// Estado del Registro
const registrationState = {
    currentFieldIndex: 0,
    fields: ['id', 'name', 'email', 'password', 'role', 'createdAt'],
    data: {
        id: '',
        name: '',
        email: '',
        password: '',
        role: '',
        createdAt: ''
    },
    isValid: {
        id: false,
        name: false,
        email: false,
        password: false,
        role: false
    }
};

// ===========================
// UTILIDADES
// ===========================

const showFieldStatus = (fieldId, message, isValid) => {
    const statusElement = document.getElementById(`${fieldId}-status`);
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = 'field-status';
        if (message) {
            statusElement.classList.add(isValid ? 'success' : 'error');
        }
    }
};

const disableAllInputs = () => {
    registerNameInput.disabled = true;
    registerEmailInput.disabled = true;
    registerPasswordInput.disabled = true;
    roleOptions.forEach(option => option.disabled = true);
};

const enableInput = (inputElement) => {
    inputElement.disabled = false;
    inputElement.focus();
};

const disableInput = (inputElement) => {
    inputElement.disabled = true;
};

const formatDate = (date) => {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
    };
    return date.toLocaleDateString('es-ES', options);
};

const togglePasswordVisibility = (inputElement) => {
    if (inputElement.type === 'password') {
        inputElement.type = 'text';
    } else {
        inputElement.type = 'password';
    }
};

// ===========================
// VALIDACIONES
// ===========================

const validators = {
    id: (value) => {
        const isValid = value.trim().length >= 3 && value.trim().length <= 20;
        return {
            isValid,
            message: isValid ? '✓ ID válido' : '✗ El ID debe tener entre 3 y 20 caracteres'
        };
    },

    name: (value) => {
        const nameRegex = /^[a-záéíóúñ\s]{3,50}$/i;
        const isValid = nameRegex.test(value.trim());
        return {
            isValid,
            message: isValid ? '✓ Nombre válido' : '✗ Ingresa un nombre válido (solo letras y espacios)'
        };
    },

    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(value.trim());
        return {
            isValid,
            message: isValid ? '✓ Correo válido' : '✗ Ingresa un correo electrónico válido'
        };
    },

    password: (value) => {
        const hasLength = value.length >= 8;
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        
        const isValid = hasLength && hasUppercase && hasNumber;

        return {
            isValid,
            message: isValid ? '✓ Contraseña fuerte' : '✗ La contraseña no cumple los requisitos',
            requirements: {
                length: hasLength,
                uppercase: hasUppercase,
                number: hasNumber
            }
        };
    },

    role: (value) => {
        const isValid = value === 'vendedor' || value === 'comprador';
        return {
            isValid,
            message: isValid ? '✓ Rol seleccionado' : '✗ Selecciona un rol'
        };
    }
};

// ===========================
// ACTUALIZAR REQUISITOS DE CONTRASEÑA
// ===========================

const updatePasswordRequirements = (password) => {
    const validation = validators.password(password);
    
    document.getElementById('req-length').className = validation.requirements.length ? 'valid' : '';
    document.getElementById('req-uppercase').className = validation.requirements.uppercase ? 'valid' : '';
    document.getElementById('req-number').className = validation.requirements.number ? 'valid' : '';
};

// ===========================
// MOSTRAR SIGUIENTE CAMPO
// ===========================

const showNextField = () => {
    const currentField = registrationState.fields[registrationState.currentFieldIndex];
    const nextIndex = registrationState.currentFieldIndex + 1;
    
    if (currentField === 'id' && !registrationState.isValid.id) {
        registerIdInput.classList.add('error-shake');
        setTimeout(() => registerIdInput.classList.remove('error-shake'), 300);
        return;
    }

    if (currentField === 'name' && !registrationState.isValid.name) {
        registerNameInput.classList.add('error-shake');
        setTimeout(() => registerNameInput.classList.remove('error-shake'), 300);
        return;
    }

    if (currentField === 'email' && !registrationState.isValid.email) {
        registerEmailInput.classList.add('error-shake');
        setTimeout(() => registerEmailInput.classList.remove('error-shake'), 300);
        return;
    }

    if (currentField === 'password' && !registrationState.isValid.password) {
        registerPasswordInput.classList.add('error-shake');
        setTimeout(() => registerPasswordInput.classList.remove('error-shake'), 300);
        return;
    }

    if (currentField === 'role' && !registrationState.isValid.role) {
        document.querySelector('.role-selector').classList.add('error-shake');
        setTimeout(() => document.querySelector('.role-selector').classList.remove('error-shake'), 300);
        return;
    }

    // Mostrar siguiente campo
    if (nextIndex < registrationState.fields.length) {
        const nextField = registrationState.fields[nextIndex];
        const nextFieldGroup = document.querySelector(`[id="${nextField}-status"]`).closest('.form-group');
        
        if (nextFieldGroup) {
            nextFieldGroup.classList.remove('hidden');
            nextFieldGroup.classList.add('visible');
            
            // Habilitar input si existe
            if (nextField === 'name') enableInput(registerNameInput);
            if (nextField === 'email') enableInput(registerEmailInput);
            if (nextField === 'password') enableInput(registerPasswordInput);
            if (nextField === 'role') {
                roleOptions.forEach(option => option.disabled = false);
            }
            if (nextField === 'createdAt') {
                // CreatedAt se muestra pero no se edita
                const createdAtGroup = document.querySelector('#createdAt-display').closest('.form-group');
                createdAtGroup.classList.remove('hidden');
                createdAtGroup.classList.add('visible');
            }
        }

        registrationState.currentFieldIndex = nextIndex;

        // Actualizar botón
        if (nextIndex === registrationState.fields.length - 1) {
            nextFieldBtn.style.display = 'none';
            submitRegisterBtn.style.display = 'block';
        }
    }
};

// ===========================
// VALIDAR Y ACTUALIZAR CAMPO ID
// ===========================

registerIdInput.addEventListener('input', (e) => {
    const value = e.target.value;
    registrationState.data.id = value;

    const validation = validators.id(value);
    registrationState.isValid.id = validation.isValid;

    showFieldStatus('id', validation.message, validation.isValid);

    if (validation.isValid) {
        nextFieldBtn.disabled = false;
    } else {
        nextFieldBtn.disabled = true;
    }
});

registerIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && registrationState.isValid.id) {
        showNextField();
    }
});

// ===========================
// VALIDAR Y ACTUALIZAR CAMPO NOMBRE
// ===========================

registerNameInput.addEventListener('input', (e) => {
    const value = e.target.value;
    registrationState.data.name = value;

    const validation = validators.name(value);
    registrationState.isValid.name = validation.isValid;

    showFieldStatus('name', validation.message, validation.isValid);

    if (validation.isValid) {
        nextFieldBtn.disabled = false;
    } else {
        nextFieldBtn.disabled = true;
    }
});

registerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && registrationState.isValid.name) {
        showNextField();
    }
});

// ===========================
// VALIDAR Y ACTUALIZAR CAMPO EMAIL
// ===========================

registerEmailInput.addEventListener('input', (e) => {
    const value = e.target.value;
    registrationState.data.email = value;

    const validation = validators.email(value);
    registrationState.isValid.email = validation.isValid;

    showFieldStatus('email', validation.message, validation.isValid);

    if (validation.isValid) {
        nextFieldBtn.disabled = false;
    } else {
        nextFieldBtn.disabled = true;
    }
});

registerEmailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && registrationState.isValid.email) {
        showNextField();
    }
});

// ===========================
// VALIDAR Y ACTUALIZAR CAMPO CONTRASEÑA
// ===========================

registerPasswordInput.addEventListener('input', (e) => {
    const value = e.target.value;
    registrationState.data.password = value;

    const validation = validators.password(value);
    registrationState.isValid.password = validation.isValid;

    showFieldStatus('password', validation.message, validation.isValid);
    updatePasswordRequirements(value);

    if (validation.isValid) {
        nextFieldBtn.disabled = false;
    } else {
        nextFieldBtn.disabled = true;
    }
});

registerPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && registrationState.isValid.password) {
        showNextField();
    }
});

// ===========================
// VALIDAR Y ACTUALIZAR CAMPO ROL
// ===========================

roleOptions.forEach(option => {
    option.addEventListener('change', (e) => {
        registrationState.data.role = e.target.value;
        registrationState.isValid.role = true;

        showFieldStatus('role', '✓ Rol seleccionado', true);
        nextFieldBtn.disabled = false;
    });
});

// ===========================
// BOTÓN SIGUIENTE CAMPO
// ===========================

nextFieldBtn.addEventListener('click', showNextField);

// ===========================
// SUMARI DEL REGISTRO
// ===========================

const submitRegistration = () => {
    // Validar todos los campos
    const allValid = Object.values(registrationState.isValid).every(v => v === true);

    if (!allValid) {
        alert('Por favor completa todos los campos correctamente');
        return;
    }

    // Generar fecha de creación
    const createdAt = new Date();
    registrationState.data.createdAt = createdAt.toISOString();

    // Mostrar createdAt
    createdAtDisplay.textContent = formatDate(createdAt);

    // Guardar datos (en una aplicación real, se enviarían al servidor)
    console.log('Datos del registro:', registrationState.data);

    // Simular respuesta exitosa
    alert(`¡Bienvenido ${registrationState.data.name}!\n\nTu cuenta ha sido creada exitosamente.\n\nAhora puedes iniciar sesión.`);

    // Ir a formulario de login
    toggleToLogin();
    resetFormularios();
};

submitRegisterBtn.addEventListener('click', submitRegistration);

// ===========================
// SUBMIT LOGIN
// ===========================

const submitLogin = () => {
    const email = loginEmailInput.value.trim();
    const password = loginPasswordInput.value.trim();

    if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
    }

    // Simular login exitoso
    console.log('Login:', { email, password });
    alert(`¡Bienvenido!\n\nHas iniciado sesión correctamente como: ${email}`);

    // Limpiar formulario
    loginEmailInput.value = '';
    loginPasswordInput.value = '';
};

submitLoginBtn.addEventListener('click', submitLogin);

// ===========================
// TOGGLE CONTRASEÑA
// ===========================

togglePasswordRegister.addEventListener('click', () => {
    togglePasswordVisibility(registerPasswordInput);
});

togglePasswordLogin.addEventListener('click', () => {
    togglePasswordVisibility(loginPasswordInput);
});

// ===========================
// TOGGLE ENTRE FORMULARIOS
// ===========================

const toggleToLogin = () => {
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
};

const toggleToRegister = () => {
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
};

toggleToLoginBtn.addEventListener('click', toggleToLogin);
toggleToRegisterBtn.addEventListener('click', toggleToRegister);

// ===========================
// RECUPERACIÓN DE CONTRASEÑA
// ===========================

const openRecoveryModal = () => {
    recoveryModal.classList.remove('hidden');
    recoveryEmailInput.focus();
};

const closeRecoveryModal = () => {
    recoveryModal.classList.add('hidden');
    recoveryEmailInput.value = '';
    document.getElementById('recovery-status').textContent = '';
};

const sendRecoveryEmail = () => {
    const email = recoveryEmailInput.value.trim();

    if (!email) {
        showFieldStatus('recovery', '✗ Ingresa un correo o ID', false);
        return;
    }

    // Simular envío de email
    console.log('Enviar instrucciones de recuperación a:', email);

    document.getElementById('recovery-status').textContent = '✓ Instrucciones enviadas al correo';
    document.getElementById('recovery-status').className = 'field-status success';

    setTimeout(() => {
        closeRecoveryModal();
    }, 2000);
};

forgotPasswordBtn.addEventListener('click', openRecoveryModal);
sendRecoveryBtn.addEventListener('click', sendRecoveryEmail);
cancelRecoveryBtn.addEventListener('click', closeRecoveryModal);
closeRecoveryBtn.addEventListener('click', closeRecoveryModal);

// ===========================
// SELLER ONBOARDING SYSTEM
// ===========================

// Estado del onboarding
const sellerOnboardingState = {
    currentStep: 'category',
    selectedCategory: null,
    products: [],
    storeData: {
        name: '',
        category: '',
        description: ''
    }
};

// Elementos DOM del onboarding
const sellerOnboardingModal = document.getElementById('seller-onboarding-modal');
const addProductModal = document.getElementById('add-product-modal');
const closeSellerOnboardingBtn = document.getElementById('close-seller-onboarding');
const closeAddProductBtn = document.getElementById('close-add-product');

// Botones de navegación del onboarding
const nextToProductsBtn = document.getElementById('next-to-products');
const backToCategoryBtn = document.getElementById('back-to-category');
const nextToPreviewBtn = document.getElementById('next-to-preview');
const backToProductsBtn = document.getElementById('back-to-products');
const finishOnboardingBtn = document.getElementById('finish-onboarding');
const goToDashboardBtn = document.getElementById('go-to-dashboard');
const skipOnboardingBtn = document.getElementById('skip-onboarding');

// Elementos del formulario de producto
const addProductBtn = document.getElementById('add-product-btn');
const addProductForm = document.getElementById('add-product-form');
const cancelAddProductBtn = document.getElementById('cancel-add-product');

// ===========================
// FUNCIONES DE ONBOARDING
// ===========================

// Iniciar onboarding para vendedores
const startSellerOnboarding = () => {
    // Resetear estado
    sellerOnboardingState.currentStep = 'category';
    sellerOnboardingState.selectedCategory = null;
    sellerOnboardingState.products = [];
    sellerOnboardingState.storeData = {
        name: `${registrationState.data.name} Store`,
        category: '',
        description: ''
    };

    // Mostrar modal
    sellerOnboardingModal.classList.remove('hidden');

    // Mostrar primer paso
    showOnboardingStep('category');

    // Actualizar nombre de la tienda
    updateStorePreview();
};

// Mostrar paso específico del onboarding
const showOnboardingStep = (step) => {
    // Ocultar todos los pasos
    document.querySelectorAll('.onboarding-step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });

    // Mostrar paso actual
    document.getElementById(`step-${step}`).classList.add('active');
    sellerOnboardingState.currentStep = step;

    // Actualizar título del paso de productos
    if (step === 'products') {
        const categoryTitles = {
            'alimentos': 'Agrega tus Alimentos',
            'servicios-academicos': 'Agrega tus Servicios Académicos',
            'productos-varios': 'Agrega tus Productos',
            'venta-independiente': 'Agrega tus Productos/Servicios'
        };
        document.getElementById('step-title').textContent = categoryTitles[sellerOnboardingState.selectedCategory] || 'Agrega tus Productos';
    }
};

// Seleccionar categoría
const selectCategory = (categoryCard) => {
    // Remover selección anterior
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Seleccionar nueva categoría
    categoryCard.classList.add('selected');
    sellerOnboardingState.selectedCategory = categoryCard.dataset.category;

    // Actualizar datos de la tienda
    const categoryNames = {
        'alimentos': 'Alimentos',
        'servicios-academicos': 'Servicios Académicos',
        'productos-varios': 'Productos Varios',
        'venta-independiente': 'Venta Independiente'
    };
    sellerOnboardingState.storeData.category = categoryNames[sellerOnboardingState.selectedCategory];

    // Habilitar botón siguiente
    nextToProductsBtn.disabled = false;

    // Actualizar vista previa
    updateStorePreview();
};

// Agregar producto
const addProduct = () => {
    // Resetear formulario
    addProductForm.reset();

    // Cargar campos específicos por categoría
    loadCategorySpecificFields();

    // Mostrar modal
    addProductModal.classList.remove('hidden');
};

// Cargar campos específicos por categoría
const loadCategorySpecificFields = () => {
    const categoryFields = document.getElementById('category-specific-fields');
    const category = sellerOnboardingState.selectedCategory;

    let fieldsHTML = '';

    switch (category) {
        case 'alimentos':
            fieldsHTML = `
                <div class="form-group">
                    <label for="food-type">Tipo de Alimento</label>
                    <select id="food-type" required>
                        <option value="">Seleccionar tipo</option>
                        <option value="postres">Postres</option>
                        <option value="almuerzos">Almuerzos</option>
                        <option value="dulceria">Dulcería</option>
                        <option value="bebidas">Bebidas</option>
                        <option value="otros">Otros</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="preparation-time">Tiempo de Preparación</label>
                    <input type="text" id="preparation-time" placeholder="Ej: 30 minutos, 2 horas">
                </div>
            `;
            break;

        case 'servicios-academicos':
            fieldsHTML = `
                <div class="form-group">
                    <label for="service-type">Tipo de Servicio</label>
                    <select id="service-type" required>
                        <option value="">Seleccionar tipo</option>
                        <option value="tutoria">Tutoría Individual</option>
                        <option value="asesoria">Asesoría de Tesis</option>
                        <option value="clases">Clases Grupales</option>
                        <option value="ayuda-tareas">Ayuda con Tareas</option>
                        <option value="otros">Otros</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="experience">Experiencia/Años</label>
                    <input type="text" id="experience" placeholder="Ej: 2 años, estudiante avanzado">
                </div>
            `;
            break;

        case 'productos-varios':
            fieldsHTML = `
                <div class="form-group">
                    <label for="product-condition">Condición</label>
                    <select id="product-condition" required>
                        <option value="">Seleccionar condición</option>
                        <option value="nuevo">Nuevo</option>
                        <option value="usado-excelente">Usado - Excelente</option>
                        <option value="usado-bueno">Usado - Bueno</option>
                        <option value="usado-regular">Usado - Regular</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="product-brand">Marca/Modelo</label>
                    <input type="text" id="product-brand" placeholder="Ej: Dell Inspiron, Nike Air">
                </div>
            `;
            break;

        case 'venta-independiente':
            fieldsHTML = `
                <div class="form-group">
                    <label for="custom-category">Categoría Personalizada</label>
                    <input type="text" id="custom-category" placeholder="Ej: Arte, Música, Tecnología">
                </div>
                <div class="form-group">
                    <label for="delivery-type">Tipo de Entrega</label>
                    <select id="delivery-type" required>
                        <option value="">Seleccionar tipo</option>
                        <option value="entrega-personal">Entrega Personal</option>
                        <option value="envio">Envío por Correo</option>
                        <option value="digital">Entrega Digital</option>
                        <option value="servicio-presencial">Servicio Presencial</option>
                    </select>
                </div>
            `;
            break;
    }

    categoryFields.innerHTML = fieldsHTML;
};

// Guardar producto
const saveProduct = (event) => {
    event.preventDefault();

    const productData = {
        id: Date.now(),
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        description: document.getElementById('product-description').value,
        type: document.getElementById('product-type').value,
        stock: parseInt(document.getElementById('product-stock').value),
        category: sellerOnboardingState.selectedCategory,
        createdAt: new Date().toISOString()
    };

    // Agregar campos específicos por categoría
    const category = sellerOnboardingState.selectedCategory;
    switch (category) {
        case 'alimentos':
            productData.foodType = document.getElementById('food-type').value;
            productData.preparationTime = document.getElementById('preparation-time').value;
            break;
        case 'servicios-academicos':
            productData.serviceType = document.getElementById('service-type').value;
            productData.experience = document.getElementById('experience').value;
            break;
        case 'productos-varios':
            productData.condition = document.getElementById('product-condition').value;
            productData.brand = document.getElementById('product-brand').value;
            break;
        case 'venta-independiente':
            productData.customCategory = document.getElementById('custom-category').value;
            productData.deliveryType = document.getElementById('delivery-type').value;
            break;
    }

    // Agregar producto a la lista
    sellerOnboardingState.products.push(productData);

    // Cerrar modal
    addProductModal.classList.add('hidden');

    // Actualizar UI
    renderProductsList();
    updateStorePreview();

    // Habilitar botón continuar si hay al menos un producto
    nextToPreviewBtn.disabled = sellerOnboardingState.products.length === 0;
};

// Renderizar lista de productos
const renderProductsList = () => {
    const productsList = document.getElementById('products-list');
    const noProductsMessage = document.querySelector('.no-products-message');

    if (sellerOnboardingState.products.length === 0) {
        productsList.innerHTML = '';
        noProductsMessage.style.display = 'block';
        return;
    }

    noProductsMessage.style.display = 'none';

    productsList.innerHTML = sellerOnboardingState.products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <i class="fas fa-${getProductIcon(product.category)}"></i>
            </div>
            <div class="product-info">
                <h5>${product.name}</h5>
                <div class="product-price">$${product.price.toLocaleString()}</div>
                <div class="product-type">${getProductTypeText(product.type)}</div>
            </div>
            <div class="product-actions">
                <button class="btn-icon btn-edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
};

// Editar producto
const editProduct = (productId) => {
    const product = sellerOnboardingState.products.find(p => p.id === productId);
    if (!product) return;

    // Cargar datos en el formulario
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-type').value = product.type;
    document.getElementById('product-stock').value = product.stock;

    // Cargar campos específicos
    loadCategorySpecificFields();

    // Cargar valores específicos
    setTimeout(() => {
        const category = sellerOnboardingState.selectedCategory;
        switch (category) {
            case 'alimentos':
                if (document.getElementById('food-type')) {
                    document.getElementById('food-type').value = product.foodType || '';
                }
                if (document.getElementById('preparation-time')) {
                    document.getElementById('preparation-time').value = product.preparationTime || '';
                }
                break;
            case 'servicios-academicos':
                if (document.getElementById('service-type')) {
                    document.getElementById('service-type').value = product.serviceType || '';
                }
                if (document.getElementById('experience')) {
                    document.getElementById('experience').value = product.experience || '';
                }
                break;
            case 'productos-varios':
                if (document.getElementById('product-condition')) {
                    document.getElementById('product-condition').value = product.condition || '';
                }
                if (document.getElementById('product-brand')) {
                    document.getElementById('product-brand').value = product.brand || '';
                }
                break;
            case 'venta-independiente':
                if (document.getElementById('custom-category')) {
                    document.getElementById('custom-category').value = product.customCategory || '';
                }
                if (document.getElementById('delivery-type')) {
                    document.getElementById('delivery-type').value = product.deliveryType || '';
                }
                break;
        }
    }, 100);

    // Cambiar texto del botón
    const submitBtn = addProductForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Actualizar Producto';

    // Agregar atributo para identificar edición
    addProductForm.setAttribute('data-editing-id', productId);

    // Mostrar modal
    addProductModal.classList.remove('hidden');
};

// Eliminar producto
const deleteProduct = (productId) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        sellerOnboardingState.products = sellerOnboardingState.products.filter(p => p.id !== productId);
        renderProductsList();
        updateStorePreview();
        nextToPreviewBtn.disabled = sellerOnboardingState.products.length === 0;
    }
};

// Actualizar vista previa de la tienda
const updateStorePreview = () => {
    document.getElementById('preview-store-name').textContent = sellerOnboardingState.storeData.name;
    document.getElementById('preview-store-category').textContent = sellerOnboardingState.storeData.category;

    const previewProducts = document.getElementById('preview-products');
    if (sellerOnboardingState.products.length === 0) {
        previewProducts.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">No hay productos para mostrar</p>';
        return;
    }

    previewProducts.innerHTML = sellerOnboardingState.products.slice(0, 3).map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas fa-${getProductIcon(product.category)}"></i>
            </div>
            <div class="product-info">
                <h5>${product.name}</h5>
                <div class="product-price">$${product.price.toLocaleString()}</div>
            </div>
        </div>
    `).join('');

    if (sellerOnboardingState.products.length > 3) {
        previewProducts.innerHTML += `<div class="product-card" style="justify-content: center; align-items: center; color: var(--text-secondary);">
            <span>+${sellerOnboardingState.products.length - 3} más</span>
        </div>`;
    }
};

// Completar onboarding
const completeOnboarding = () => {
    // Crear usuario con rol de vendedor
    const userData = {
        id: Date.now(),
        name: registrationState.data.name,
        email: registrationState.data.email,
        password: registrationState.data.password, // En producción, esto sería hasheado
        role: 'vendedor',
        phone: '',
        university: '',
        studentId: '',
        address: null,
        createdAt: new Date().toISOString(),
        stats: {
            orders: 0,
            totalSpent: 0,
            rating: 0,
            productsSelling: sellerOnboardingState.products.length
        }
    };

    // Crear tienda
    const storeData = {
        id: Date.now(),
        sellerId: userData.id,
        storeName: sellerOnboardingState.storeData.name,
        storeSlug: sellerOnboardingState.storeData.name.toLowerCase().replace(/\s+/g, '-'),
        category: sellerOnboardingState.selectedCategory,
        rating: 0,
        createdAt: new Date().toISOString()
    };

    // Guardar productos
    const productsData = sellerOnboardingState.products.map(product => ({
        ...product,
        storeId: storeData.id,
        sellerId: userData.id,
        status: 'active'
    }));

    // Guardar en localStorage
    localStorage.setItem('wudhi_user', JSON.stringify(userData));
    localStorage.setItem('wudhi_store', JSON.stringify(storeData));
    localStorage.setItem('wudhi_products', JSON.stringify(productsData));

    // Mostrar paso completado
    showOnboardingStep('complete');
};

// Ir al dashboard
const goToDashboard = () => {
    // Cerrar modal
    sellerOnboardingModal.classList.add('hidden');

    // Resetear formularios
    resetFormularios();

    // Simular redirección al dashboard
    alert('¡Bienvenido a tu tienda en Wudhi!\n\nAhora puedes gestionar tus productos y ver tus ventas.');

    // En una aplicación real, aquí redirigiríamos al dashboard
    // window.location.href = 'dashboard.html';
};

// Omitir onboarding
const skipOnboarding = () => {
    // Crear usuario básico de vendedor
    const userData = {
        id: Date.now(),
        name: registrationState.data.name,
        email: registrationState.data.email,
        password: registrationState.data.password,
        role: 'vendedor',
        phone: '',
        university: '',
        studentId: '',
        address: null,
        createdAt: new Date().toISOString(),
        stats: {
            orders: 0,
            totalSpent: 0,
            rating: 0,
            productsSelling: 0
        }
    };

    localStorage.setItem('wudhi_user', JSON.stringify(userData));

    // Cerrar modal
    sellerOnboardingModal.classList.add('hidden');

    // Resetear formularios
    resetFormularios();

    alert('¡Cuenta creada exitosamente!\n\nPuedes configurar tu tienda más tarde desde tu perfil.');
};

// ===========================
// UTILIDADES PARA ONBOARDING
// ===========================

const getProductIcon = (category) => {
    const iconMap = {
        'alimentos': 'utensils',
        'servicios-academicos': 'graduation-cap',
        'productos-varios': 'box',
        'venta-independiente': 'store'
    };
    return iconMap[category] || 'box';
};

const getProductTypeText = (type) => {
    const typeMap = {
        'productos': 'Producto Físico',
        'servicios': 'Servicio',
        'digital': 'Producto Digital'
    };
    return typeMap[type] || type;
};

// ===========================
// EVENT LISTENERS PARA ONBOARDING
// ===========================

// Selección de categoría
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => selectCategory(card));
});

// Navegación entre pasos
nextToProductsBtn.addEventListener('click', () => showOnboardingStep('products'));
backToCategoryBtn.addEventListener('click', () => showOnboardingStep('category'));
nextToPreviewBtn.addEventListener('click', () => showOnboardingStep('preview'));
backToProductsBtn.addEventListener('click', () => showOnboardingStep('products'));
finishOnboardingBtn.addEventListener('click', completeOnboarding);
goToDashboardBtn.addEventListener('click', goToDashboard);
skipOnboardingBtn.addEventListener('click', skipOnboarding);

// Agregar producto
addProductBtn.addEventListener('click', addProduct);
addProductForm.addEventListener('submit', saveProduct);
cancelAddProductBtn.addEventListener('click', () => {
    addProductModal.classList.add('hidden');
    addProductForm.removeAttribute('data-editing-id');
    const submitBtn = addProductForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Agregar Producto';
});

// Cerrar modales
closeSellerOnboardingBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres salir? Perderás el progreso actual.')) {
        sellerOnboardingModal.classList.add('hidden');
    }
});

closeAddProductBtn.addEventListener('click', () => {
    addProductModal.classList.add('hidden');
    addProductForm.removeAttribute('data-editing-id');
    const submitBtn = addProductForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Agregar Producto';
});

// Cerrar modales al hacer clic fuera
sellerOnboardingModal.addEventListener('click', (e) => {
    if (e.target === sellerOnboardingModal) {
        if (confirm('¿Estás seguro de que quieres salir? Perderás el progreso actual.')) {
            sellerOnboardingModal.classList.add('hidden');
        }
    }
});

addProductModal.addEventListener('click', (e) => {
    if (e.target === addProductModal) {
        addProductModal.classList.add('hidden');
        addProductForm.removeAttribute('data-editing-id');
        const submitBtn = addProductForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Agregar Producto';
    }
});

// ===========================
// MODIFICAR SUBMIT DE REGISTRO PARA VENDEDORES
// ===========================

const originalSubmitRegistration = submitRegistration;
submitRegistration = () => {
    // Llamar al submit original
    originalSubmitRegistration();

    // Si el usuario es vendedor, iniciar onboarding
    if (registrationState.data.role === 'vendedor') {
        setTimeout(() => {
            startSellerOnboarding();
        }, 1000); // Pequeño delay para que se vea el mensaje de éxito
    }
};

recoveryEmailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendRecoveryEmail();
    }
});

// ===========================
// CERRAR MODAL CON ESC
// ===========================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !recoveryModal.classList.contains('hidden')) {
        closeRecoveryModal();
    }
});

// ===========================
// RESETEAR FORMULARIOS
// ===========================

const resetFormularios = () => {
    // Reset Registro
    registerIdInput.value = '';
    registerNameInput.value = '';
    registerEmailInput.value = '';
    registerPasswordInput.value = '';

    // Reset Rol
    roleOptions.forEach(option => option.checked = false);

    // Reset estado
    registrationState.currentFieldIndex = 0;
    registrationState.data = {
        id: '',
        name: '',
        email: '',
        password: '',
        role: '',
        createdAt: ''
    };
    registrationState.isValid = {
        id: false,
        name: false,
        email: false,
        password: false,
        role: false
    };

    // Resetear vista
    const formGroups = registerForm.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        if (index > 0) {
            group.classList.add('hidden');
            group.classList.remove('visible');
        } else {
            group.classList.remove('hidden');
            group.classList.add('visible');
        }
    });

    // Resetear botones
    nextFieldBtn.style.display = 'block';
    submitRegisterBtn.style.display = 'none';
    nextFieldBtn.disabled = true;

    // Deshabilitar inputs
    disableAllInputs();

    // Reset Login
    loginEmailInput.value = '';
    loginPasswordInput.value = '';
    document.getElementById('remember-me').checked = false;

    // Limpiar estados de validación
    document.querySelectorAll('.field-status').forEach(status => {
        status.textContent = '';
        status.className = 'field-status';
    });

    registerIdInput.focus();
};

// ===========================
// INICIALIZACIÓN
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Deshabilitar inputs inicialmente
    disableAllInputs();
    nextFieldBtn.disabled = true;

    console.log('✓ Wudhi Marketplace - Sistema de Registro e Login Inicializado');
});
