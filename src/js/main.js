import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.js";


const dataSource = new ProductData("tents");
const list = new ProductList(
  "tents",
  dataSource,
  document.querySelector(".product-list"),
);

list.init();

const alert = new Alert();
alert.init();