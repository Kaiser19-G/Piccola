// --- Piccola Cart Logic ---

const CART_KEY = 'piccolaCart';
const cartToastEl = document.getElementById('cartToast');
const cartToast = cartToastEl ? new bootstrap.Toast(cartToastEl) : null;

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    // Only prepare checkout form if on the payment page
    if (document.getElementById('checkout-form')) {
        prepareCheckoutForm();
    }
});

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
}

// La firma de la función ahora acepta un cuarto parámetro: imageUrl
function addToCart(productId, name, price, imageUrl) {
    const cart = getCart();
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex > -1) {
        cart[productIndex].quantity++;
    } else {
        // Cuando añadimos un nuevo producto, guardamos también su imageUrl
        cart.push({ id: productId, name, price, quantity: 1, imageUrl: imageUrl });
    }

    saveCart(cart);

    if (cartToast) {
        cartToast.show();
    }
}
function updateCartUI() {
    const cart = getCart();
    // Elements in the modal
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutButton = document.getElementById('checkout-button');
    // Badge in the navbar
    const cartCountEl = document.getElementById('cart-count');

    if (!cartContainer) return;

    cartContainer.innerHTML = '';
    let total = 0;
    let itemCount = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío.</p>';
        if (checkoutButton) checkoutButton.classList.add('disabled');
    } else {
        const list = document.createElement('ul');
        list.className = 'list-group list-group-flush';

        cart.forEach((item, index) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            itemCount += item.quantity;

            const listItem = document.createElement('li');
// Usamos clases de Flexbox de Bootstrap para alinear todo perfectamente
listItem.className = 'list-group-item d-flex align-items-center';
listItem.innerHTML = `
    <!-- Columna de la Imagen -->
    <div class="flex-shrink-0">
        <img src="${item.imageUrl}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
    </div>
    
    <!-- Columna del Nombre y Cantidad -->
    <div class="flex-grow-1 ms-3">
        <h6 class="my-0">${item.name}</h6>
        <small class="text-muted">Cantidad: ${item.quantity} × $${item.price.toFixed(2)}</small>
    </div>
    
    <!-- Columna del Precio y Botón de Eliminar -->
    <div class="d-flex flex-column align-items-end">
        <span class="fw-bold mb-2">$${subtotal.toFixed(2)}</span>
        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})" title="Eliminar producto">×</button>
    </div>`;
list.appendChild(listItem);
        });
        cartContainer.appendChild(list);
        if (checkoutButton) checkoutButton.classList.remove('disabled');
    }
    
    if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
    if (cartCountEl) cartCountEl.textContent = itemCount;
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
    updateCartUI();
}

function prepareCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    if (!checkoutForm) return; // Buena práctica: salir si no estamos en la página de pago

    const cartDataInput = document.getElementById('cartData');
    const summaryContainer = document.getElementById('checkout-summary');
    const cartCountEl = document.getElementById('checkout-cart-count');

    const cart = getCart();
    let total = 0;
    let itemCount = 0;

    // Esta parte se queda igual
    if (cart.length === 0) {
        if (summaryContainer) {
            summaryContainer.innerHTML = '<li class="list-group-item">No hay productos para pagar.</li>';
        }
        if (checkoutForm) {
            checkoutForm.querySelector('button[type="submit"]').classList.add('disabled');
        }
        return;
    }
    
    // Esta parte se queda igual
    if (summaryContainer) {
        summaryContainer.innerHTML = '';
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            itemCount += item.quantity;
            const itemEl = document.createElement('li');
            itemEl.className = 'list-group-item d-flex justify-content-between lh-sm';
            itemEl.innerHTML = `<div><h6 class="my-0">${item.name}</h6><small class="text-muted">Cantidad: ${item.quantity}</small></div><span class="text-muted">$${subtotal.toFixed(2)}</span>`;
            summaryContainer.appendChild(itemEl);
        });

        const totalEl = document.createElement('li');
        totalEl.className = 'list-group-item d-flex justify-content-between';
        totalEl.innerHTML = `<span>Total (USD)</span><strong>$${total.toFixed(2)}</strong>`;
        summaryContainer.appendChild(totalEl);
    }

    if(cartCountEl) {
        cartCountEl.textContent = itemCount;
    }
    
    // ======================================================================
    //               AQUÍ VA EL CAMBIO QUE NECESITAS
    // ======================================================================
    
    // <<< AÑADIR ESTO >>>
    // Seleccionamos el elemento que muestra el total para Yape.
    const yapeTotalAmountEl = document.getElementById('yape-total-amount');

    // Si el elemento existe en la página actual...
    if (yapeTotalAmountEl) {
        // ...actualizamos su contenido con el total calculado.
        yapeTotalAmountEl.textContent = `$${total.toFixed(2)}`;
    }
    // <<< FIN DE LO QUE DEBES AÑADIR >>>

    // ======================================================================


    // Esta parte se queda igual
    checkoutForm.addEventListener('submit', (e) => {
        // Transform cart for backend DTO before submitting
        const cartForBackend = cart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));
        
        cartDataInput.value = JSON.stringify(cartForBackend);
        
        // Clear cart after submitting to avoid resubmission
        clearCart();
    });
}