import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (total, item) =>
        total + Number(item.FinalPrice) * (item.Quantity || 1),
      0,
    );

    const numberOfItems = this.list.reduce(
      (total, item) => total + (item.Quantity || 1),
      0,
    );

    document.querySelector(
      `${this.outputSelector} #num-items`,
    ).textContent = numberOfItems;

    document.querySelector(
      `${this.outputSelector} #subtotal`,
    ).textContent = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    const numberOfItems = this.list.reduce(
      (total, item) => total + (item.Quantity || 1),
      0,
    );

    this.tax = this.itemTotal * 0.06;
    this.shipping = numberOfItems > 0 ? 10 + (numberOfItems - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector(
      `${this.outputSelector} #tax`,
    ).textContent = `$${this.tax.toFixed(2)}`;

    document.querySelector(
      `${this.outputSelector} #shipping`,
    ).textContent = `$${this.shipping.toFixed(2)}`;

    document.querySelector(
      `${this.outputSelector} #order-total`,
    ).textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  packageItems(items) {
    return items.map((item) => ({
      id: item.Id,
      name: item.Name,
      price: Number(item.FinalPrice),
      quantity: item.Quantity || 1,
    }));
  }

  async checkout(form) {
    this.calculateOrderTotal();

    const order = formDataToJSON(form);

    order.orderDate = new Date().toISOString();
    order.items = this.packageItems(this.list);
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);

    const externalServices = new ExternalServices();

    return externalServices.checkout(order);
  }
}

