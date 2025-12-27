// ===== PRODUCT DATA =====
const products = [
    {
        id: 1,
        name: 'Rompi KKN Basic',
        description: 'Rompi KKN dengan desain simple dan elegan, cocok untuk kegiatan sehari-hari',
        price: 85000,
        badge: 'Populer',
        features: [
            'Bahan Drill Premium',
            'Sablon Nama & Logo',
            'Kantong Depan 2 Buah',
            'Jahitan Rapi & Kuat'
        ]
    },
    {
        id: 2,
        name: 'Rompi KKN Premium',
        description: 'Rompi KKN dengan kualitas terbaik dan desain modern yang profesional',
        price: 125000,
        badge: 'Best Seller',
        features: [
            'Bahan American Drill',
            'Bordir Nama & Logo',
            'Kantong Multifungsi',
            'Resleting YKK Original'
        ]
    },
    {
        id: 3,
        name: 'Rompi KKN Custom',
        description: 'Rompi KKN dengan desain full custom sesuai keinginan tim Anda',
        price: 150000,
        badge: 'Custom',
        features: [
            'Bahan Pilihan Premium',
            'Desain Full Custom',
            'Bordir 3D Eksklusif',
            'Aksesoris Tambahan'
        ]
    },
    {
        id: 4,
        name: 'Rompi KKN Ekonomis',
        description: 'Rompi KKN dengan harga terjangkau namun tetap berkualitas',
        price: 65000,
        badge: 'Hemat',
        features: [
            'Bahan Katun Berkualitas',
            'Sablon Standar',
            'Kantong Depan',
            'Jahitan Standar'
        ]
    },
    {
        id: 5,
        name: 'Rompi KKN Deluxe',
        description: 'Rompi KKN eksklusif dengan fitur lengkap dan desain mewah',
        price: 175000,
        badge: 'Exclusive',
        features: [
            'Bahan Japanese Drill',
            'Bordir Komputer HD',
            'Multi Pocket System',
            'Waterproof Coating'
        ]
    },
    {
        id: 6,
        name: 'Rompi KKN Sport',
        description: 'Rompi KKN dengan bahan ringan dan breathable untuk aktivitas outdoor',
        price: 110000,
        badge: 'New',
        features: [
            'Bahan Quick Dry',
            'Ventilasi Udara',
            'Reflective Strip',
            'Kantong Zipper Aman'
        ]
    }
];

// ===== STATE MANAGEMENT =====
let cart = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    renderProducts();
    setupEventListeners();
    loadCartFromStorage();
    updateCartUI();
    setupTheme();
}

// ===== PRODUCT RENDERING =====
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);

    card.innerHTML = `
        <div class="product-image">
            <span class="product-badge">${product.badge}</span>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <ul class="product-features">
                ${product.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <div class="product-footer">
                <div class="product-price">${formatPrice(product.price)}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Tambah
                </button>
            </div>
        </div>
    `;

    return card;
}

// ===== CART FUNCTIONALITY =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartUI();
    showCartSidebar();

    // Add animation feedback
    const btn = event.target;
    btn.textContent = '✓ Ditambahkan';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

    setTimeout(() => {
        btn.textContent = 'Tambah';
        btn.style.background = '';
    }, 1000);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCartToStorage();
        updateCartUI();
    }
}

function updateCartUI() {
    updateCartCount();
    renderCartItems();
    updateCartTotal();
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (totalItems > 0) {
        cartCount.style.display = 'block';
    } else {
        cartCount.style.display = 'none';
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">🛒</div>
                <h3>Keranjang Kosong</h3>
                <p>Belum ada produk yang ditambahkan</p>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">🎓</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateCartTotal() {
    const totalPriceElement = document.getElementById('totalPrice');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = formatPrice(total);
}

// ===== CART SIDEBAR =====
function showCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideCartSidebar() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== CHECKOUT =====
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang belanja Anda masih kosong!');
        return;
    }

    // Prepare WhatsApp message
    let message = '*PESANAN VEST KKN - KONVEKSI PURWOKERTO*\n\n';
    message += '*Detail Pesanan:*\n';

    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   Jumlah: ${item.quantity} pcs\n`;
        message += `   Harga: ${formatPrice(item.price)}\n`;
        message += `   Subtotal: ${formatPrice(item.price * item.quantity)}\n\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `*TOTAL: ${formatPrice(total)}*\n\n`;
    message += 'Mohon konfirmasi pesanan ini. Terima kasih! 🙏';

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp number from Instagram profile
    const phoneNumber = '6287747082902'; // Format: 62 + nomor tanpa 0 di depan

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    // Optional: Clear cart after checkout
    // cart = [];
    // saveCartToStorage();
    // updateCartUI();
    // hideCartSidebar();
}

// ===== LOCAL STORAGE =====
function saveCartToStorage() {
    localStorage.setItem('rompikknCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('rompikknCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// ===== THEME MANAGEMENT =====
function setupTheme() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const sunIcon = themeToggleBtn.querySelector('.sun-icon');
    const moonIcon = themeToggleBtn.querySelector('.moon-icon');

    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-mode');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');

        // Update icons
        if (isDark) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
            localStorage.setItem('theme', 'dark');
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
            localStorage.setItem('theme', 'light');
        }
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.addEventListener('click', showCartSidebar);

    // Cart close button
    const cartClose = document.getElementById('cartClose');
    cartClose.addEventListener('click', hideCartSidebar);

    // Cart overlay
    const cartOverlay = document.getElementById('cartOverlay');
    cartOverlay.addEventListener('click', hideCartSidebar);

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.addEventListener('click', checkout);

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });

                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');

    mobileMenuBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });
}

// ===== UTILITY FUNCTIONS =====
function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.feature-card, .product-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});
