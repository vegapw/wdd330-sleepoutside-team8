import { loadHeaderFooter, alertMessage } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const checkout = new CheckoutProcess("so-cart", ".order-summary");
checkout.init();

const zipInput = document.querySelector("#zip");

zipInput.addEventListener("input", () => {
  checkout.calculateOrderTotal();
});

const form = document.querySelector("#checkout-form");

const submitButton = document.querySelector("#place-order");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  submitButton.disabled = true;
  submitButton.textContent = "Processing...";

  try {
    const response = await checkout.checkout(form);

    localStorage.setItem("orderId", response.orderId);

    localStorage.removeItem("so-cart");

    window.location.href = "./success.html";
  } catch (error) {

    const errorMessage =
      error.message && typeof error.message === "object"
        ? Object.values(error.message).join(", ")
        : error.message || "Something went wrong. Please try again.";

    alertMessage(errorMessage, true, "error");

    submitButton.disabled = false;
    submitButton.textContent = "Place Your Order";
  }
});


