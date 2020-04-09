import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-toggle-button/paper-toggle-button.js";
import "tangy-form/input/tangy-select.js";
import { TangyBaseWidget } from "../tangy-base-widget.js";
class TangyToggleWidget extends TangyBaseWidget {
  get claimElement() {
    return "tangy-toggle";
  }

  upcast(config, element) {
    return {
      ...this.upcastCommonAttributes(config, element),
      ...this.upcastLabelAttributes(config, element),
      label: element.innerHTML
        ? element.innerHTML
        : this.upcastLabelAttributes(config, element).label
        ? this.upcastLabelAttributes(config, element).label
        : "",
    };
  }

  downcast(config) {
    return `
      <tangy-toggle 
        ${this.downcastCommonAttributes(config)}
        ${this.downcastLabelAttributes(config)}
      ></tangy-toggle>
    `;
  }

  renderInfo(config) {
    const icon = (this.shadowRoot.querySelector(
      "#icon"
    ).innerHTML = `<span class="header-text"><mwc-icon>toggle_on</mwc-icon><span>`);
    const name = (this.shadowRoot.querySelector(
      "#name"
    ).innerHTML = `<span class="header-text">${config.name}</span>`);
    return `${icon} ${name} ${this.downcast(config)}`;
  }
}

window.customElements.define("tangy-toggle-widget", TangyToggleWidget);
window.tangyFormEditorWidgets.define(
  "tangy-toggle-widget",
  "tangy-toggle",
  TangyToggleWidget
);
