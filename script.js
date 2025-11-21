// Year in footer
document.getElementById("year").textContent = new Date().getFullYear();

// Simple cart state
const cart = {};

// Elements
const cartToggle = document.getElementById("cart-toggle");
const cartPanel = document.getElementById("cart-panel");
const cartClose = document.getElementById("cart-close");
const cartBackdrop = document.getElementById("cart-backdrop");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");

// Open/close cart
function openCart() {
  cartPanel.classList.add("open");
  cartBackdrop.classList.add("show");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartBackdrop.classList.remove("show");
}

cartToggle.addEventListener("click", openCart);
cartClose.addEventListener("click", closeCart);
cartBackdrop.addEventListener("click", closeCart);

// Add to cart buttons
document.querySelectorAll(".btn-add").forEach((btn) => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    if (!cart[id]) {
      cart[id] = { id, name, price, qty: 0 };
    }
    cart[id].qty += 1;
    renderCart();
    openCart();
  });
});

// Render cart
function renderCart() {
  cartItemsContainer.innerHTML = "";

  const items = Object.values(cart);
  if (items.length === 0) {
    cartItemsContainer.innerHTML =
      '<p style="font-size:0.9rem;color:#7b7468;">Your cart is empty.</p>';
    cartTotalEl.textContent = "$0.00";
    cartCountEl.textContent = "0";
    return;
  }

  let total = 0;
  let count = 0;

  items.forEach((item) => {
    const lineTotal = item.price * item.qty;
    total += lineTotal;
    count += item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="cart-item-main">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-qty">Qty: ${item.qty}</span>
      </div>
      <div class="cart-item-actions">
        <span class="cart-item-price">$${lineTotal.toFixed(2)}</span>
        <button class="cart-remove" data-id="${item.id}">Remove</button>
      </div>
    `;

    cartItemsContainer.appendChild(div);
  });

  cartTotalEl.textContent = `$${total.toFixed(2)}`;
  cartCountEl.textContent = count.toString();

  // Attach remove listeners
  document.querySelectorAll(".cart-remove").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      delete cart[id];
      renderCart();
    });
  });
}

// Temporary checkout behavior: email order
checkoutBtn.addEventListener("click", () => {
  const items = Object.values(cart);
  if (items.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  let body = "Hello Loft Café,%0D%0A%0D%0AI would like to place this order:%0D%0A";
  items.forEach((item) => {
    body += `- ${item.name} x ${item.qty}%0D%0A`;
  });
  body += `%0D%0ATotal shown on site: ${cartTotalEl.textContent}%0D%0A%0D%0AThank you!`;

  window.location.href = `mailto:hello@loftcafe.com?subject=Loft%20Online%20Order&body=${body}`;
});
