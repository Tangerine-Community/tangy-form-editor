import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import 'tangy-form/input/tangy-select.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangyTimeWidget extends TangyBaseWidget {
  get claimElement() {
    return 'tangy-input[type=time]';
  }

  get defaultConfig() {
    return {
      ...this.defaultConfigCommonAttributes(),
      ...this.defaultConfigLabelAttributes(),
      type: 'time',
    };
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyTime.props thus won't get picked up by TangyTime.getProps().
    return {
      ...config,
      ...element.getProps(),
      ...this.upcastCommonAttributes(config, element),
      ...this.upcastLabelAttributes(config, element)
    };
  }

  downcast(config) {
    return `
      <tangy-input 
        ${this.downcastCommonAttributes(config)}
        ${this.downcastLabelAttributes(config)}
        type="time"
      ></tangy-input>
    `;
  }

  renderPrint(config) {
    return `
    <table>
      <tr><td><strong>Prompt:</strong></td><td>${config.label}</td></tr>
      <tr><td><strong>Variable Name:</strong></td><td>${config.name}</td></tr>
      <tr><td><strong>Hint:</strong></td><td>${config.hint}</td></tr>
      <tr><td><strong>Type:</strong></td><td>${config.type}</td></tr>
      <tr><td><strong>Error Message:</strong></td><td>${
        config.errorText
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
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>timer</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `
      <tangy-form id="tangy-time-widget">
        <tangy-form-item>
          ${this.renderEditCommonAttributes(config)}
          ${this.renderEditLabelAttributes(config)}
        </tangy-form-item>
      </tangy-form>
    `
  }

  onSubmit(config, formEl) {
    return {
      ...config,
      ...this.onSubmitCommonAttributes(config, formEl),
      ...this.onSubmitLabelAttributes(config, formEl)
    }
  }

}

window.customElements.define('tangy-time-widget', TangyTimeWidget);
window.tangyFormEditorWidgets.define(
  'tangy-time-widget',
  'tangy-input[type=time]',
  TangyTimeWidget
);
