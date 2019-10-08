import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import 'tangy-form/input/tangy-select.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangyEmailWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-input[type=email]';
  }

  get defaultConfig() {
    return {
      ...this.defaultConfigCommonAttributes(),
      ...this.defaultConfigLabelAttributes(),
      innerLabel: ''
    }
  }

  upcast(config, element) {
    return {
      ...this.upcastCommonAttributes(config, element),
      ...this.upcastLabelAttributes(config, element),
      ...element.getProps()
    }
  }

  downcast(config) {
    return `
      <tangy-input 
        ${this.downcastCommonAttributes(config)}
        ${this.downcastLabelAttributes(config)}
        inner-label="${config.innerLabel}"
        type="email"
      ></tangy-input>
    `
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
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>emailr</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `
      <tangy-form id="tangy-email-widget">
        <tangy-form-item>
          ${this.renderEditCommonAttributes(config)}
          ${this.renderEditLabelAttributes(config)}
          <tangy-input
            name="inner_label"
            inner-label="Inner Label"
            value="${
              config.innerLabel
            }">
          </tangy-input>
        </tangy-form-item>
      </tangy-form>
    `;
  }

  onSubmit(config, formEl) {
    return {
      ...this.onSubmitCommonAttributes(config, formEl),
      ...this.onSubmitLabelAttributes(config, formEl),
      innerLabel: formEl.response.items[0].inputs.find(
        input => input.name === 'inner_label'
      ).value
    }
  }

}

window.customElements.define('tangy-email-widget', TangyEmailWidget);
window.tangyFormEditorWidgets.define(
  'tangy-email-widget',
  'tangy-input[type=email]',
  TangyEmailWidget
);
