const products = [
    { id: 1, name: "Red Sport Pro", price: 2500, type: "sport", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff", sale: true },
    { id: 2, name: "Urban Dark Sneaker", price: 1800, type: "sneaker", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d", sale: false },
    { id: 3, name: "Classic Leather", price: 3200, type: "leather", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77", sale: false },
    { id: 4, name: "Neon Runner", price: 2100, type: "sport", image: "https://images.unsplash.com/photo-1560769629-975ec94e6a86", sale: true }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 1. Render Products
function displayProducts(items) {
    const grid = document.getElementById("product-grid");
    grid.innerHTML = items.map(p => `
        <div class="shoe-card">
            ${p.sale ? '<div class="badge">SALE</div>' : ''}
            <img src="${p.image}" alt="${p.name}">
            <div class="card-content">
                <h3>${p.name}</h3>
                <p class="price">${p.price.toLocaleString()} ETB</p>
                <button class="btn-add" onclick="addToCart(${p.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// 2. Add to Cart
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    const inCart = cart.find(item => item.id === id);
    if(inCart) inCart.qty++;
    else cart.push({...product, qty: 1});
    
    save();
    updateUI();
};

function save() { localStorage.setItem("cart", JSON.stringify(cart)); }

window.removeItem = (index) => {
    cart.splice(index, 1);
    save();
    updateUI();
};

window.clearCart = () => { if(confirm("Clear cart?")) { cart = []; save(); updateUI(); } };

// 3. Search & Filter
window.searchProduct = () => {
    const query = document.getElementById("search-input").value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(query));
    displayProducts(filtered);
};

window.filterType = (type) => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    const filtered = type === 'all' ? products : products.filter(p => p.type === type);
    displayProducts(filtered);
};

// 4. Update UI & Telegram Link
function updateUI() {
    const list = document.getElementById("cart-list");
    const totalDisp = document.getElementById("total-price");
    const countDisp = document.getElementById("item-count");
    const link = document.getElementById("checkout-link");
    
    list.innerHTML = cart.map((item, i) => `
        <li>
            <span>${item.name} (x${item.qty})</span>
            <span>${(item.price * item.qty).toLocaleString()} ETB 
            <button onclick="removeItem(${i})" style="color:red; border:none; background:none; cursor:pointer;">✕</button></span>
        </li>
    `).join('');

    let sum = cart.reduce((a, b) => a + (b.price * b.qty), 0);
    totalDisp.innerText = sum.toLocaleString();
    countDisp.innerText = cart.length;

    // Telegram Logic
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const hasProof = document.getElementById("payment-proof").files.length > 0;

    let msg = `👟 *NEW ORDER FROM ARIF SHOES*\n\n`;
    cart.forEach(item => msg += `• ${item.name} x${item.qty}\n`);
    msg += `\n💰 *Total:* ${sum} ETB\n👤 *Customer:* ${name}\n📞 *Phone:* ${phone}\n📍 *Address:* ${address}`;

    link.href = `https://t.me/zedyo123?text=${encodeURIComponent(msg)}`;

    // Enable/Disable Order Button
    if(cart.length > 0 && name && phone && hasProof) {
        link.classList.remove("disabled");
        link.innerText = "Confirm Order via Telegram";
    } else {
        link.classList.add("disabled");
        link.innerText = "Complete All Info & Upload Receipt";
    }
}

// Utility functions
window.scrollToCart = () => document.getElementById('cart-section').scrollIntoView();
window.scrollToProducts = () => window.scrollTo(0, 600);

// Initialize
document.getElementById("payment-proof").onchange = updateUI;
[document.getElementById("name"), document.getElementById("phone"), document.getElementById("address")].forEach(i => i.oninput = updateUI);

displayProducts(products);
updateUI();
