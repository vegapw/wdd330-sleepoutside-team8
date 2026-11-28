import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const orderConfirmation = document.querySelector("#order-confirmation");

const orderId = localStorage.getItem("orderId");

if (orderId) {
  orderConfirmation.textContent = `Your order number is #${orderId}.`;
}