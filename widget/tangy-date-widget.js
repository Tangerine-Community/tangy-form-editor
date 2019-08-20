import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import 'tangy-form/input/tangy-select.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangyDateWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-input[type=date]';
  }

  get defaultConfig() {
    return {
      type: 'date',
      ...this.defaultConfigCommonAttributes(),
      ...this.defaultConfigLabelAttributes()
    };
  }

  upcast(config, element) {
    return {
      ...this.upcastCommonAttributes(config, element),
      ...this.upcastLabelAttributes(config, element),
      ...element.getProps()
    };
  }

  downcast(config) {
    return `
      <tangy-input 
        ${this.downcastCommonAttributes(config)}
        ${this.downcastLabelAttributes(config)}
        type="date"
      ></tangy-input>
    `;
  }

  renderPrint(config) {
    return `
      <table>
        <tr><td><strong>Prompt:</strong></td><td>${config.label}</td></tr>
        <tr><td><strong>Variable Name:</strong></td><td>${config.name}</td></tr>
        <tr><td><strong>Hint:</strong></td><td>${config.hintText}</td></tr>
        <tr><td><strong>Type:</strong></td><td>${config.type}</td></tr>
        <tr><td><strong>Error Message:</strong></td><td>${
          config.errorMessage
        }</td></tr>
        <tr><td><strong>Allowed Pattern:</strong></td><td>${
          config.allowedPattern
        }</td></tr>
        <tr><td><strong>Min:</strong></td><td>${config.min}</td></tr>
        <tr><td><strong> Max:</strong></td><td>${config.max}</td></tr>
        <tr><td><strong>Private:</strong></td><td>${config.private}</td></tr>
        <tr><td><strong>Required:</strong></td><td>${config.required}</td></tr>
        <tr><td><strong>Disabled:</strong></td><td>${config.disabled}</td></tr>
        <tr><td><strong>Hidden:</strong></td><td>${config.hidden}</td></tr>
      </table>
      <hr/>
    `;
  }

  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>date_range</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `
      <tangy-form id="tangy-date-widget">
        <tangy-form-item>
          ${this.renderEditCommonAttributes(config)}
          ${this.renderEditLabelAttributes(config)}
        </tangy-form-item>
      </tangy-form>
    `;
  }

  onSubmit(config, formEl) {
    return {
      ...this.onSubmitCommonAttributes(config, formEl),
      ...this.onSubmitLabelAttributes(config, formEl)
    };
  }

}

window.customElements.define('tangy-date-widget', TangyDateWidget);
window.tangyFormEditorWidgets.define(
  'tangy-date-widget',
  'tangy-input[type=date]',
  TangyDateWidget
);
