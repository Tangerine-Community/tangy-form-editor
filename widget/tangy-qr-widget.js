import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import 'tangy-form/input/tangy-qr.js';
import 'tangy-form/input/tangy-checkbox.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangyQrWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-qr';
  }

  get defaultConfig() {
    return {
      ...this.defaultConfigCommonAttributes(),
      hideOutput: false
    };
  }

  upcast(config, element) {
    return {
      ...this.upcastCommonAttributes(config, element)
    };
  }

  downcast(config) {
    return `
      <tangy-qr 
        ${this.downcastCommonAttributes(config)}
        ${config.hideOutput ? 'hide-output' : ''}
      >
      </tangy-qr>
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
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>filter_center_focus</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `
      <tangy-form id="tangy-qr">
        <tangy-form-item>
          ${this.renderEditCommonAttributes(config)}
          <tangy-checkbox name="hide-output" help-text="Hide the data output scanned from the QR code. This may be useful if you are using a format such as JSON and parsing it out into other items.">Hide output</tangy-checkbox>
        </tangy-form-item>
      </tangy-form>
    `;
  }

  onSubmit(config, formEl) {
    return {
      ...this.onSubmitCommonAttributes(config, formEl),
      hideInput: formEl.values['hide-output']
    }
  }

}

window.customElements.define('tangy-qr-widget', TangyQrWidget);
window.tangyFormEditorWidgets.define(
  'tangy-qr-widget',
  'tangy-qr',
  TangyQrWidget
);
