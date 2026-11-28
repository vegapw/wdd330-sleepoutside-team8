
import { getLocalStorage, setLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const htmlItems = cartItems.length
    ? cartItems.map((item) => cartItemTemplate(item))
    : [`<li><h3>No items to display!</h3></li>`];

  document.querySelector(".cart-list").innerHTML = htmlItems.join("");
  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.FinalPrice) * (item.Quantity || 1),
    0,
  );

  document.querySelector(".cart-total").textContent =
    `$${subtotal.toFixed(2)}`;
  addQuantityListeners();
}

function cartItemTemplate(item) {
  const image = item.Images?.PrimaryMedium || item.Image || "";
  const color = item.Colors?.[0]?.ColorName || "Not specified";
  const quantity = item.Quantity || 1;

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${image}" alt="${item.Name}">
    </a>

    <a href="#" class="cart-card__details">
      <h2 class="card__name">${item.Name}</h2>
    </a>

    <p class="cart-card__color">${color}</p>

    <div class="cart-card__quantity">
      <button class="quantity-btn" data-action="decrease" data-id="${item.Id}">−</button>
      <span>${quantity}</span>
      <button class="quantity-btn" data-action="increase" data-id="${item.Id}">+</button>
    </div>

    <p class="cart-card__price">$${(item.FinalPrice * quantity).toFixed(2)}</p>
  </li>`;
}

function addQuantityListeners() {
  document.querySelectorAll(".quantity-btn").forEach((button) => {
    button.addEventListener("click", () => {
      updateQuantity(button.dataset.id, button.dataset.action);
    });
  });
}

function updateQuantity(productId, action) {
  const cartItems = getLocalStorage("so-cart") || [];
  const product = cartItems.find((item) => item.Id === productId);

  if (!product) return;

  product.Quantity = product.Quantity || 1;

  if (action === "increase") {
    product.Quantity++;
  } else if (action === "decrease") {
    product.Quantity--;

    if (product.Quantity <= 0) {
      const index = cartItems.findIndex((item) => item.Id === productId);
      cartItems.splice(index, 1);
    }
  }

  setLocalStorage("so-cart", cartItems);
  renderCartContents();
}

renderCartContents();
