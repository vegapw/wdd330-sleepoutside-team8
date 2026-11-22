// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

//Return the value of a parameter in the queryString
export function getParam(param){
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(param);
  return value;
}

//Rendering a dynamic list
export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false){
  const htmlStrings = list.map(templateFn);
  if (clear){
    parentElement.innerHtml = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

//Rendering a template
export function renderWithTemplate(template, parentElement, data, callback){
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

//Load template from a path
async function loadTemplate(path){
  const resp = await fetch(path);
  const template = await resp.text();
  return template;
}

//Load header and footer from templates
export async function loadHeaderFooter(){
  const headerTemp = await loadTemplate("../partials/header.html");
  const footerTemp = await loadTemplate("../partials/footer.html");
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");
  renderWithTemplate(headerTemp, headerElement);
  renderWithTemplate(footerTemp, footerElement);
}