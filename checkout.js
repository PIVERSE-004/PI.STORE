
// Load cart items from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];

// Calculate totals
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('cart-tax').textContent = tax.toFixed(2);
    document.getElementById('cart-total').textContent = total.toFixed(2);
    return { subtotal, tax, total };
}

// Display checkout items
function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkout-items');
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>$${item.price} x ${item.quantity || 1}</p>
            </div>
        </div>
    `).join('');
    
    calculateTotals();
}

// Handle form submission
// Card validation functions
function validateExpiry(expiry) {
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiry)) return false;
    
    const [month, year] = expiry.split('/');
    const now = new Date();
    const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    return expDate > now;
}

function validateCVV(cvv) {
    return /^[0-9]{3,4}$/.test(cvv);
}

document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const expiry = e.target.querySelector('[placeholder="MM/YY"]').value;
    const cvv = e.target.querySelector('[placeholder="CVV"]').value;
    
    if (!validateExpiry(expiry)) {
        alert('Please enter a valid expiry date (MM/YY)');
        return;
    }
    
    if (!validateCVV(cvv)) {
        alert('Please enter a valid CVV (3-4 digits)');
        return;
    }
    
    try {
        const response = await fetch('http://0.0.0.0:5000/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: cart.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity || 1,
                    image: item.image
                }))
            })
        });

        const data = await response.json();
        
        if (data.url) {
            window.location.href = data.url;
        } else {
            alert('Error creating checkout session');
        }
    } catch (error) {
        alert('Error processing order');
    }
});

// Initialize checkout page
document.addEventListener('DOMContentLoaded', displayCheckoutItems);
