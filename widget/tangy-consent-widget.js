import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import 'tangy-form/input/tangy-consent.js';
import 'tangy-form/input/tangy-checkbox.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangyConsentWidget extends TangyBaseWidget {
  get claimElement() {
    return 'tangy-consent';
  }

  get defaultConfig() {
    return {
      ...this.defaultConfigCommonAttributes(),
      metaDataTemplate: '',
      prompt: ''
    };
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyQr.props thus won't get picked up by TangyQr.getProps().
    return {
      ...this.upcastCommonAttributes(config, element),
      ...element.getProps()
    };
  }

  downcast(config) {
    return `
      <tangy-consent 
        ${this.downcastCommonAttributes(config)}
        prompt="${config.prompt}"
      >
        ${config.metaDataTemplate}
      </tangy-consent>
    `;
  }

  renderPrint(config) {
    return `
    <table>
      <tr><td><strong>Variable Name:</strong></td><td>${config.name}</td></tr>
      <tr><td><strong>Prompt:</strong></td><td>${config.prompt}</td></tr>
      <tr><td><strong>Required:</strong></td><td>${config.required}</td></tr>
      <tr><td><strong>Disabled:</strong></td><td>${config.disabled}</td></tr>
      <tr><td><strong>Hidden:</strong></td><td>${config.hidden}</td></tr>
    </table>
    <hr/>
    `;
  }

  renderInfo(config) {
    return `<div class="element-header"><div><mwc-icon>thumbs_up_down</mwc-icon></div><div id="element-name">${
      config.name
    }</div></div>
    ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `
      <tangy-form id="tangy-consent">
        <tangy-form-item>
          ${this.renderEditCommonAttributes(config)}
          <tangy-input
            name="prompt"
            inner-label="Prompt" 
            value="${
              config.prompt
            }"
            required>
          </tangy-input>
        
        </tangy-form-item>
      </tangy-form>
    `;
  }

  onSubmit(config, formEl) {
    return {
      ...this.onSubmitCommonAttributes(config, formEl),
      prompt: formEl.response.items[0].inputs.find(input => input.name === 'prompt').value
    };
  }
}

window.customElements.define('tangy-consent-widget', TangyConsentWidget);
window.tangyFormEditorWidgets.define(
  'tangy-consent-widget',
  'tangy-consent',
  TangyConsentWidget
);
