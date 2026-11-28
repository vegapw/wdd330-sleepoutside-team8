import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

const zipInput = document.querySelector("#zip");

zipInput.addEventListener("input", () => {
  checkout.calculateOrderTotal();
});

const form = document.querySelector("#checkout-form");

const message = document.querySelector("#checkout-message");
const submitButton = document.querySelector("#place-order");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  submitButton.disabled = true;
  submitButton.textContent = "Processing...";
  message.textContent = "Processing your order...";

  try {
    const response = await checkout.checkout(form);

    message.textContent =
      `Order Placed Successfully! Order #${response.orderId}`;

    submitButton.textContent = "Order Placed";
  } catch {
    message.textContent =
      "Something went wrong. Please try again.";

    submitButton.disabled = false;
    submitButton.textContent = "Place Your Order";
  }
});


