import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import 'tangy-form/input/tangy-select.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangyTextWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-input[type=text], tangy-input:not([type])';
  }

  get defaultConfig() {
    return {
      ...this.defaultConfigCommonAttributes(),
      ...this.defaultConfigLabelAttributes(),
      allowedPattern: '',
      innerLabel: ''
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
        type="text"
        allowed-pattern="${config.allowedPattern}"
        inner-label="${config.innerLabel}"
        ${this.downcastCommonAttributes(config)}
        ${this.downcastLabelAttributes(config)}
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
        config.errorText
      }</td></tr>
      <tr><td><strong>Allowed Pattern:</strong></td><td>${
        config.allowedPattern
      }</td></tr>
      <tr><td><strong>Private:</strong></td><td>${config.private}</td></tr>
      <tr><td><strong>Required:</strong></td><td>${config.required}</td></tr>
      <tr><td><strong>Disabled:</strong></td><td>${config.disabled}</td></tr>
      <tr><td><strong>Hidden:</strong></td><td>${config.hidden}</td></tr>
    </table>
    <hr/>
    `;
  }

  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>text_fields</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `<h2>Add Text Input</h2>
    <tangy-form id="tangy-input">
      <tangy-form-item>
        ${this.renderEditCommonAttributes(config)}
        ${this.renderEditLabelAttributes(config)}
        <tangy-input
          name="inner-label"
          inner-label="Inner Label"
          value="${
            config.innerLabel
          }">
        </tangy-input>
        <tangy-input
          name="allowed-pattern"
          inner-label="Allowed pattern"
          hint-text="Optional Javascript RegExp pattern to validate text (e.g. minimum length of 5 characters would be [a-zA-Z]{5,})"
          value="${config.allowedPattern}">
        </tangy-input>
      </tangy-form-item>
    </tangy-form>
    `;
  }

  onSubmit(config, formEl) {
    return {
      ...config,
      ...this.onSubmitCommonAttributes(config, formEl),
      ...this.onSubmitLabelAttributes(config, formEl),
      innerLabel: formEl.response.items[0].inputs.find(
        input => input.name === 'inner-label'
      ).value,
      allowedPattern: formEl.response.items[0].inputs.find(
        input => input.name === 'allowed-pattern'
      ).value
    };
  }
}

window.customElements.define('tangy-text-widget', TangyTextWidget);
window.tangyFormEditorWidgets.define(
  'tangy-text-widget',
  'tangy-input[type=text], tangy-input:not([type])',
  TangyTextWidget
);
