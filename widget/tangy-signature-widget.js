import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import 'tangy-form/input/tangy-signature.js';
import 'tangy-form/input/tangy-checkbox.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangySignatureWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-signature';
  }

  get defaultConfig() {
    return {
      ...this.defaultConfigCommonAttributes()
    };
  }

  upcast(config, element) {
    return {
      ...this.upcastCommonAttributes(config, element)
    };
  }

  downcast(config) {
    return `
      <tangy-signature 
        ${this.downcastCommonAttributes(config)}
      >
      </tangy-signature>
    `;
  }

  renderPrint(config) {
    return `
    <table>
      <tr><td><strong>Variable Name:</strong></td><td>${config.name}</td></tr>
      <tr><td><strong>Required:</strong></td><td>${config.required}</td></tr>
      <tr><td><strong>Disabled:</strong></td><td>${config.disabled}</td></tr>
      <tr><td><strong>Hidden:</strong></td><td>${config.hidden}</td></tr>
    </table>
    <hr/>
    `;
  }

  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>brush</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `
      <tangy-form id="tangy-signature">
        <tangy-form-item>
          ${this.renderEditCommonAttributes(config)}
        </tangy-form-item>
      </tangy-form>
    `;
  }

  onSubmit(config, formEl) {
    return {
      ...this.onSubmitCommonAttributes(config, formEl)
    }
  }

}

window.customElements.define('tangy-signature-widget', TangySignatureWidget);
window.tangyFormEditorWidgets.define(
  'tangy-signature-widget',
  'tangy-signature',
  TangySignatureWidget
);
