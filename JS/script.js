const products = [
    { id: 1, title: 'Aurora - Eau de Parfum', price: 59.90, gender: 'mujer', img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=60', desc: 'Notas florales y ámbar.' },
    { id: 2, title: 'Noir Essence', price: 72.00, gender: 'hombre', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60', desc: 'Aromas amaderados y especiados.' },
    { id: 3, title: 'Citrus Bloom', price: 39.50, gender: 'unisex', img: 'https://images.unsplash.com/photo-1556228453-5f98e6f7d8f6?auto=format&fit=crop&w=800&q=60', desc: 'Fresco y cítrico para el día a día.' },
    { id: 4, title: 'Velvet Oud', price: 89.90, gender: 'hombre', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=60', desc: 'Intenso, oriental con oud.' },
    { id: 5, title: 'Rose Whisper', price: 44.20, gender: 'mujer', img: 'https://images.unsplash.com/photo-1545972152-385b0d1b39d6?auto=format&fit=crop&w=800&q=60', desc: 'Rosas y toques empolvados.' }
];

let cart = JSON.parse(localStorage.getItem('nw_cart') || '[]');
const grid = document.getElementById('productGrid');
const filter = document.getElementById('filter');

function renderProducts() {
    const f = filter.value;
    grid.innerHTML = '';
    const list = products.filter(p => f === 'all' ? true : p.gender === f);
    list.forEach(p => {
        const el = document.createElement('div');
        el.className = 'card';
        el.innerHTML = `
            <img src="${p.img}" alt="${p.title}">
            <h3>${p.title}</h3>
            <div class="muted">${p.desc}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
                <div class="price">$${p.price.toFixed(2)}</div>
            </div>
            <div class="actions">
                <button class="btn btn-primary" onclick="addToCart(${p.id})">Agregar</button>
                <button class="btn btn-ghost" onclick="viewProduct(${p.id})">Ver</button>
            </div>
        `;
        grid.appendChild(el);
    });
}

filter.addEventListener('change', renderProducts);
renderProducts();

const cartDrawer = document.getElementById('cartDrawer');
const cartList = document.getElementById('cartList');
const cartTotal = document.getElementById('cartTotal');
const cartCountEl = document.getElementById('cartCount');

function saveCart() {
    localStorage.setItem('nw_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    cartList.innerHTML = '';
    let total = 0;
    let qty = 0;
    cart.forEach(item => {
        const p = products.find(x => x.id === item.id);
        total += p.price * item.qty;
        qty += item.qty;
        const node = document.createElement('div');
        node.className = 'cart-item';
        node.innerHTML = `
            <img src="${p.img}" alt="${p.title}">
            <div style="flex:1">
                <div style="display:flex;justify-content:space-between">
                    <strong>${p.title}</strong>
                    <span>$${(p.price * item.qty).toFixed(2)}</span>
                </div>
                <div class="muted">
                    Cantidad: 
                    <button class="btn" onclick="changeQty(${p.id},-1)">-</button> 
                    ${item.qty} 
                    <button class="btn" onclick="changeQty(${p.id},1)">+</button>
                </div>
            </div>
        `;
        cartList.appendChild(node);
    });
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCountEl.textContent = qty;
}

function addToCart(id) {
    const found = cart.find(i => i.id === id);
    if (found) found.qty++;
    else cart.push({ id, qty: 1 });
    saveCart();
    openCart();
}

function changeQty(id, delta) {
    const idx = cart.findIndex(i => i.id === id);
    if (idx === -1) return;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    saveCart();
}

function openCart() {
    cartDrawer.style.display = 'block';
    updateCartUI();
}

function closeCart() {
    cartDrawer.style.display = 'none';
}

document.getElementById('openCart').addEventListener('click', () => {
    if (cartDrawer.style.display === 'block') closeCart();
    else openCart();
});

function viewProduct(id) {
    const p = products.find(x => x.id === id);
    alert(p.title + "\n\n" + p.desc + "\nPrecio: $" + p.price.toFixed(2));
}

document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    alert('Procesando pago simulado... ¡gracias por tu compra!');
    cart = [];
    saveCart();
    closeCart();
});

document.getElementById('subscribeBtn').addEventListener('click', () => {
    const em = document.getElementById('subEmail').value.trim();
    if (!em) return alert('Ingresá un email');
    alert('Gracias por suscribirte: ' + em);
    document.getElementById('subEmail').value = '';
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const n = document.getElementById('name').value.trim();
    const eMail = document.getElementById('email').value.trim();
    const m = document.getElementById('message').value.trim();
    if (!n || !eMail || !m) return alert('Completá todos los campos');
    alert('Mensaje enviado. Nos comunicaremos pronto.');
    document.getElementById('contactForm').reset();
});

updateCartUI();
