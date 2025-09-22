
// LISTA DE PRODUCTOS
const productos = [
    { id: 1, title: 'Aurora - Eau de Parfum', price: 59.90, gender: 'mujer', img: '', desc: 'Notas florales y ámbar.' },
    { id: 2, title: 'Noir Essence', price: 72.00, gender: 'hombre', img: '', desc: 'Aromas amaderados y especiados.' },
    { id: 3, title: 'Citrus Bloom', price: 39.50, gender: 'unisex', img: '', desc: 'Fresco y cítrico para el día a día.' },
    { id: 4, title: 'Velvet Oud', price: 89.90, gender: 'hombre', img: '', desc: 'Intenso, oriental con oud.' },
    { id: 5, title: 'Rose Whisper', price: 44.20, gender: 'mujer', img: '', desc: 'Rosas y toques empolvados.' }
];


// ESTADO DEL CARRITO (se guarda en localStorage)
let carrito = JSON.parse(localStorage.getItem('nw_carrito') || '[]');


// REFERENCIAS A ELEMENTOS DEL DOM
const cuadricula = document.getElementById('cuadriculaProductos');
const filtro = document.getElementById('filtro');
const cajonCarrito = document.getElementById('cajonCarrito');
const listaCarrito = document.getElementById('listaCarrito');
const totalCarrito = document.getElementById('totalCarrito');
const contadorCarrito = document.getElementById('contadorCarrito');


// RENDERIZADO DE PRODUCTOS
function renderizarProductos() {
    const f = filtro.value; // valor del filtro seleccionado
    cuadricula.innerHTML = '';

    // Filtra por género (hombre/mujer/unisex) o muestra todos
    const lista = productos.filter(p => f === 'all' ? true : p.gender === f);

    // Crea dinámicamente las tarjetas de productos
    lista.forEach(p => {
        const el = document.createElement('div');
        el.className = 'tarjeta';
        el.innerHTML = `
            <img src="${p.img}" alt="${p.title}">
            <h3>${p.title}</h3>
            <div class="muted">${p.desc}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
                <div class="precio">$${p.price.toFixed(2)}</div>
            </div>
            <div class="acciones">
                <button class="btn btn-primario" onclick="agregarAlCarrito(${p.id})">Agregar</button>
                <button class="btn btn-ghost" onclick="verProducto(${p.id})">Ver</button>
            </div>
        `;
        cuadricula.appendChild(el);
    });
}

// Escucha cambios en el select de filtro y vuelve a renderizar
filtro.addEventListener('change', renderizarProductos);

// Render inicial de los productos
renderizarProductos();


// FUNCIONES DE CARRITO

// Guarda el carrito en localStorage y actualiza la interfaz
function guardarCarrito() {
    localStorage.setItem('nw_carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
}

// Actualiza los elementos visibles del carrito
function actualizarCarritoUI() {
    listaCarrito.innerHTML = '';
    let total = 0;
    let cantidad = 0;

    carrito.forEach(item => {
        const p = productos.find(x => x.id === item.id);
        total += p.price * item.qty;
        cantidad += item.qty;

        const nodo = document.createElement('div');
        nodo.className = 'item-carrito';
        nodo.innerHTML = `
            <img src="${p.img}" alt="${p.title}">
            <div style="flex:1">
                <div style="display:flex;justify-content:space-between">
                    <strong>${p.title}</strong>
                    <span>$${(p.price * item.qty).toFixed(2)}</span>
                </div>
                <div class="muted">
                    Cantidad: 
                    <button class="btn" onclick="cambiarCantidad(${p.id},-1)">-</button> 
                    ${item.qty} 
                    <button class="btn" onclick="cambiarCantidad(${p.id},1)">+</button>
                </div>
            </div>
        `;
        listaCarrito.appendChild(nodo);
    });

    totalCarrito.textContent = `$${total.toFixed(2)}`;
    contadorCarrito.textContent = cantidad;
}

// Agrega un producto al carrito
function agregarAlCarrito(id) {
    const encontrado = carrito.find(i => i.id === id);
    if (encontrado) encontrado.qty++;
    else carrito.push({ id, qty: 1 });
    guardarCarrito();
    abrirCarrito();
}

// Cambia la cantidad de un producto (+ o -)
function cambiarCantidad(id, delta) {
    const idx = carrito.findIndex(i => i.id === id);
    if (idx === -1) return;
    carrito[idx].qty += delta;
    if (carrito[idx].qty <= 0) carrito.splice(idx, 1);
    guardarCarrito();
}

// FUNCIONES PARA MOSTRAR / OCULTAR CARRITO
function abrirCarrito() {
    cajonCarrito.style.display = 'block';
    actualizarCarritoUI();
}

function cerrarCarrito() {
    cajonCarrito.style.display = 'none';
}

// Alternar apertura/cierre del carrito al hacer clic en el botón 🛒
document.getElementById('abrirCarrito').addEventListener('click', () => {
    if (cajonCarrito.style.display === 'block') cerrarCarrito();
    else abrirCarrito();
});

// VER PRODUCTO INDIVIDUAL
function verProducto(id) {
    const p = productos.find(x => x.id === id);
    alert(p.title + "\n\n" + p.desc + "\nPrecio: $" + p.price.toFixed(2));
}

// BOTÓN DE FINALIZAR COMPRA
document.getElementById('botonPagar').addEventListener('click', () => {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    alert('Procesando pago simulado... ¡gracias por tu compra!');
    carrito = [];
    guardarCarrito();
    cerrarCarrito();
});

// SUSCRIPCIÓN AL NEWSLETTER
document.getElementById('botonSuscribir').addEventListener('click', () => {
    const em = document.getElementById('correoSuscripcion').value.trim();
    if (!em) return alert('Ingresá un email');
    alert('Gracias por suscribirte: ' + em);
    document.getElementById('correoSuscripcion').value = '';
});

// FORMULARIO DE CONTACTO
document.getElementById('formularioContacto').addEventListener('submit', (e) => {
    e.preventDefault();
    const n = document.getElementById('nombre').value.trim();
    const eMail = document.getElementById('correo').value.trim();
    const m = document.getElementById('mensaje').value.trim();

    if (!n || !eMail || !m) return alert('Completá todos los campos');
    alert('Mensaje enviado. Nos comunicaremos pronto.');
    document.getElementById('formularioContacto').reset();
});

// INICIALIZAR INTERFAZ DEL CARRITO
actualizarCarritoUI();