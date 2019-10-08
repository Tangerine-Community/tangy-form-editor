import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import 'tangy-form/input/tangy-select.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangyNumberWidget extends TangyBaseWidget {
  get claimElement() {
    return 'tangy-input[type=number]';
  }

  get defaultConfig() {
    return {
      ...this.defaultConfigCommonAttributes(),
      ...this.defaultConfigLabelAttributes(),
      allowedPattern: '',
      min: undefined,
      max: undefined,
      innerLabel: ''
    };
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
        type="number"
        inner-label="${config.innerLabel}"
        allowed-pattern="${config.allowedPattern}"
        ${config.min ? `min="${config.min}"` : ``}
        ${config.max ? `max="${config.max}"` : ``}
      ></tangy-input>
    `;
  }

  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>looks_one</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
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

  renderEdit(config) {
    return `
    <tangy-form id="tangy-number-widget">
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
        <tangy-input
          name="allowed_pattern"
          inner-label="Allowed pattern"
          hint-text="Optional Javascript RegExp pattern to validate text (e.g. minimum length of 5 characters would be [a-zA-Z]{5,})
          value="${
            config.allowedPattern
          }">
        </tangy-input>
        <tangy-input
          name="min"
          type="number"
          inner-label="Minimum"
          hint-text="Optional minimum number allowed."
          value="${
            config.min
          }">
        </tangy-input>
        <tangy-input
          name="max"
          type="number"
          inner-label="Maximum"
          hint-text="Optional maximum number allowed."
          value="${
            config.max
          }">
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
      min: formEl.values.min,
      max: formEl.values.max,
      innerLabel: formEl.response.items[0].inputs.find(
        input => input.name === 'inner_label'
      ).value,
      allowedPattern: formEl.response.items[0].inputs.find(
        input => input.name === 'allowed_pattern'
      ).value
    }
  }

}

window.customElements.define('tangy-number-widget', TangyNumberWidget);
window.tangyFormEditorWidgets.define(
  'tangy-number-widget',
  'tangy-input[type=number]',
  TangyNumberWidget
);
