import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import 'tangy-form/tangy-form.js';
import 'tangy-form/input/tangy-checkboxes.js';
import 'tangy-form/input/tangy-input.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangyCheckboxesWidget extends TangyBaseWidget {
  
  get claimElement() {
    return 'tangy-checkboxes';
  }

  get defaultConfig() {
    return {
      ...this.defaultConfigCommonAttributes(),
      ...this.defaultConfigLabelAttributes(),
      options: []
    };
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyInput.props thus won't get picked up by TangyInput.getProps().
    return {
      ...this.upcastCommonAttributes(config, element),
      ...this.upcastLabelAttributes(config, element),
      options: [...element.querySelectorAll('option')].map(option => {
        return {
          value: option.getAttribute('value'),
          label: option.innerHTML
        };
      })
    };
  }

  downcast(config) {
    return `
      <tangy-checkboxes
        ${this.downcastCommonAttributes(config)}
        ${this.downcastLabelAttributes(config)}
      >
        ${config.options.map(option => `
          <option value="${option.value}">${option.label}</option>
        `).join('')}
      </tangy-checkboxes>
    `;
  }

  renderPrint(config) {
    let keyValuePairs = '';
    config.options.map(option => {
      keyValuePairs += `<li>${option.value}: ${option.label}</li>`;
    });
    return `
    <table>
      <tr><td><strong>Prompt:</strong></td><td>${config.label}</td></tr>
      <tr><td><strong>Variable Name:</strong></td><td>${config.name}</td></tr>
      <tr><td><strong>Hint:</strong></td><td>${config.hintText}</td></tr>
      <tr><td><strong>Required:</strong></td><td>${config.required}</td></tr>
      <tr><td><strong>Disabled:</strong></td><td>${config.disabled}</td></tr>
      <tr><td><strong>Hidden:</strong></td><td>${config.hidden}</td></tr>
      <tr><td><strong>Options:</strong></td><td><ul>${keyValuePairs}</ul></td></tr>
    </table>
    <hr/>
    `;
  }

  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>check_box_outline_blank</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${config.options.length > 0 ? this.downcast(config) : ''}`;
  }

  renderEdit(config) {
    return `
      <tangy-form id="tangy-checkboxes">
        <tangy-form-item id="tangy-checkboxes">
          <template>
            ${this.renderEditCommonAttributes(config)}
            ${this.renderEditLabelAttributes(config)}
            <tangy-list name="options">
              <template type="tangy-list/new-item">
                <tangy-input name="value" allowed-pattern="[a-zA-Z0-9\-_]" inner-label="Value" hint-text="Enter the variable value if checkbox is chosen" type="text"></tangy-input>
                <tangy-input name="label" inner-label="Label" hint-text="Enter the display label of the checkbox" type="text"></tangy-input>
              </template>
              ${config.options.length > 0 ? `
                <template type="tangy-list/initial-items">
                  ${config.options.map(option => `
                    <tangy-list-item>
                      <tangy-input name="value" allowed-pattern="[a-zA-Z0-9\-_]" inner-label="Value" hint-text="Enter the variable value if checkbox is chosen" type="text" value="${option.value}"></tangy-input>
                      <tangy-input name="label" hint-text="Enter the display label of the checkbox" inner-label="Label" type="text" value="${option.label}"></tangy-input>
                    </tangy-list-item>  
                  `).join('')}
                </template>
              `: ''}
            </tangy-list>
          </template>
        </tangy-form-item>
      </tangy-form>
    `;
  }

  onSubmit(config, formEl) {
    return {
      ...this.onSubmitCommonAttributes(config, formEl),
      ...this.onSubmitLabelAttributes(config, formEl),
      options: formEl.values.options.map(item =>
        item.reduce((acc, input) => {
          return { ...acc, [input.name]: input.value };
        }, {})
      )
    };
  }

}

window.customElements.define('tangy-checkboxes-widget', TangyCheckboxesWidget);
window.tangyFormEditorWidgets.define(
  'tangy-checkboxes-widget',
  'tangy-checkboxes',
  TangyCheckboxesWidget
);
