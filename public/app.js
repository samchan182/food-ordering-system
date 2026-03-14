// Application State
let menu = [];
let cart = [];

// DOM Elements
const menuList = document.getElementById('menu-list');
const cartList = document.getElementById('cart-list');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const appContainer = document.getElementById('app-container');
const successMessage = document.getElementById('success-message');
const orderIdDisplay = document.getElementById('order-id-display');

// 1. Fetch menu from the backend
async function fetchMenu() {
    try {
        const response = await fetch('/api/menu');
        menu = await response.json();
        renderMenu();
    } catch (error) {
        // Now this will ONLY trigger if the network actually fails
        console.error("Frontend caught an error:", error);
        menuList.innerHTML = `<p class="text-red-500">Error loading menu. Check browser console.</p>`;
    }
}

// 2. Render the menu to the screen
function renderMenu() {
    menuList.innerHTML = ''; 
    menu.forEach(item => {
        const div = document.createElement('div');
        div.className = 'bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center';
        div.innerHTML = `
            <div>
                <h3 class="font-bold text-lg">${item.name}</h3>
                <p class="text-sm text-gray-500">${item.description}</p>
                <span class="text-blue-600 font-semibold">$${parseFloat(item.price).toFixed(2)}</span>
            </div>
            <button onclick="addToCart(${item.id})" class="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-sm">
                Add
            </button>
        `;
        menuList.appendChild(div);
    });
}

// 3. Handle Cart Logic
window.addToCart = function(itemId) {
    const item = menu.find(m => m.id === itemId);
    cart.push(item);
    renderCart();
};

function renderCart() {
    if (cart.length === 0) {
        cartList.innerHTML = '<li class="text-gray-400 text-sm">Cart is empty</li>';
        checkoutBtn.classList.add('hidden');
        cartTotal.innerText = '0.00';
        return;
    }

    cartList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        // CHANGED: Must parse the price before doing math to prevent string concatenation
        total += parseFloat(item.price); 
        const li = document.createElement('li');
        li.className = 'flex justify-between text-sm';
        li.innerHTML = `
            <span>${item.name}</span>
            <span class="font-semibold">$${parseFloat(item.price).toFixed(2)}</span>
        `;
        cartList.appendChild(li);
    });

    cartTotal.innerText = total.toFixed(2);
    checkoutBtn.classList.remove('hidden');
}

// 4. Send the order back to the Express server
checkoutBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart, total: parseFloat(cartTotal.innerText) })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Hide the app and show success screen
            appContainer.classList.add('hidden');
            successMessage.classList.remove('hidden');
            orderIdDisplay.innerText = result.orderId;
        }
    } catch (error) {
        alert("Checkout failed. Check server console.");
    }
});

// Initialize the app
fetchMenu();