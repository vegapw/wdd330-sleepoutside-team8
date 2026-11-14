
export default class Alert {
  constructor() {
    this.alertsUrl = "/json/alerts.json";
    this.mainElement = document.querySelector("main");
  }

  async init() {
    try {
      const response = await fetch(this.alertsUrl);

      if (!response.ok) {
        throw new Error(`Could not load alerts: ${response.status}`);
      }

      const alerts = await response.json();

      if (!Array.isArray(alerts) || alerts.length === 0) {
        return;
      }

      if (!this.mainElement) {
        return;
      }

      const alertSection = document.createElement("section");
      alertSection.classList.add("alert-list");

      alerts.forEach((alert) => {
        const paragraph = document.createElement("p");

        paragraph.textContent = alert.message;
        paragraph.style.backgroundColor = alert.background;
        paragraph.style.color = alert.color;

        alertSection.appendChild(paragraph);
      });

      this.mainElement.prepend(alertSection);
    } catch { /* empty */ }
  }
}
