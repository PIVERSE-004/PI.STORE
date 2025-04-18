
// Product data
const products = [
    {
        id: 1,
        name: "Meta Vision Pro",
        price: 3499.99,
        image: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac",
        category: "wearables"
    },
    {
        id: 9,
        name: "Quantum Computer",
        price: 9999.99,
        image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48",
        category: "computing"
    },
    {
        id: 10,
        name: "Neural Link",
        price: 2999.99,
        image: "https://images.unsplash.com/photo-1561736778-92e52a7769ef",
        category: "wearables"
    },
    {
        id: 11,
        name: "Hover Car",
        price: 49999.99,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
        category: "transport"
    },
    {
        id: 2,
        name: "Quantum Smart Watch",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        category: "wearables"
    },
    {
        id: 2,
        name: "Neural Interface Headset",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        category: "gadgets"
    },
    {
        id: 3,
        name: "Hover Board X2",
        price: 899.99,
        image: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee",
        category: "transport"
    },
    {
        id: 4,
        name: "Crypto Mining Rig",
        price: 2499.99,
        image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a",
        category: "computing"
    },
    {
        id: 2,
        name: "Holographic Display",
        price: 999.99,
        image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147",
        category: "electronics"
    },
    {
        id: 3,
        name: "AI Assistant Bot",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
        category: "tech"
    },
    {
        id: 4,
        name: "Smart Sneakers",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        category: "fashion"
    },
    {
        id: 5,
        name: "Nanotech Jacket",
        price: 399.99,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
        category: "fashion"
    },
    {
        id: 6,
        name: "Smart Home Hub",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1558089687-db5ff4d84885",
        category: "home"
    },
    {
        id: 7,
        name: "Biometric Lock",
        price: 159.99,
        image: "https://images.unsplash.com/photo-1558002038-bb0d7e4e2f5b",
        category: "home"
    },
    {
        id: 8,
        name: "Drone Camera",
        price: 799.99,
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f",
        category: "electronics"
    }
];

// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the site
function initializeSite() {
    displayProducts();
    updateCartCount();
    displayCartItems();
    filterByCategory(window.location.hash.slice(1) || 'all');
}

// Display products in the grid
function displayProducts(category = 'all') {
    const productsContainer = document.getElementById('products');
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);

    productsContainer.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-badge">${product.category}</div>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <button onclick="addToCart(${product.id})" class="add-to-cart">
                    Add to Cart <i class="fas fa-cart-plus"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function filterByCategory(category) {
    displayProducts(category);
    document.querySelectorAll('.nav-categories a').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href').slice(1) === category);
    });
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.push({...product, quantity: 1});
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
    showToast(`${product.name} added to cart!`);
}

function updateItemQuantity(index, delta) {
    if (cart[index].quantity + delta > 0) {
        cart[index].quantity += delta;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
    }
}

function saveForLater(index) {
    const savedItems = JSON.parse(localStorage.getItem('savedItems')) || [];
    savedItems.push(cart[index]);
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
    removeFromCart(index);
    showToast('Item saved for later!');
}

// Update cart count
function updateCartCount() {
    document.getElementById('cart-count').textContent = cart.length;
}

// Display cart items
function displayCartItems() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price}</p>
                <div class="quantity-controls">
                    <button onclick="updateItemQuantity(${index}, -1)">-</button>
                    <span>${item.quantity || 1}</span>
                    <button onclick="updateItemQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-actions">
                <i class="fas fa-heart" onclick="saveForLater(${index})" title="Save for later"></i>
                <i class="fas fa-trash remove-item" onclick="removeFromCart(${index})"></i>
            </div>
        </div>
    `).join('');
    
    updateCartTotal();
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
    showToast('Item removed from cart');
}

// Update cart total
function updateCartTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('cart-tax').textContent = tax.toFixed(2);
    document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Toggle cart sidebar
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

// Show toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    
    window.location.href = 'checkout.html';
}

// Logout function
function logout() {
    localStorage.removeItem('cart');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}

// Initialize the site when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSite);

// Handle category navigation
window.addEventListener('hashchange', () => {
    filterByCategory(window.location.hash.slice(1) || 'all');
});
