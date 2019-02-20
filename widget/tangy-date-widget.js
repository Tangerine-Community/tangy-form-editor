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
      name: '',
      label: '',
      hintText: '',
      type: 'date',
      required: false,
      disabled: false,
      hidden: false,
      tangyIf: '',
      validIf: ''
    };
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyDate.props thus won't get picked up by TangyDate.getProps().
    return {
      ...config,
      ...element.getProps(),
      ...{
        tangyIf: element.hasAttribute('tangy-if')
          ? element.getAttribute('tangy-if').replace(/&quot;/g, '"')
          : '',
        validIf: element.hasAttribute('valid-if')
          ? element.getAttribute('valid-if').replace(/&quot;/g, '"')
          : ''
      }
    };
  }

  downcast(config) {
    return `
      <tangy-input 
        name="${config.name}"
        label="${config.label}"
        hint-text="${config.hintText}"
        type="date"
        ${config.tangyIf === "" ? "" : `tangy-if="${config.tangyIf.replace(/"/g, '&quot;')}"`}
        ${config.validIf === "" ? "" : `valid-if="${config.validIf.replace(/"/g, '&quot;')}"`}
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
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
    return `<div class="element-header"><mwc-icon>date_range</mwc-icon><div id="element-name">${
      config.name
    }</div></div>
    ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `<h2>Add a Date Input</h2>
    <tangy-form id="tangy-date-widget">
      <tangy-form-item>
        <tangy-input
          name="name"
          valid-if="input.value.match(/^[a-zA-Z].{1,}[a-zA-Z0-9\-_]$/)"
          inner-label="Variable name" 
          value="${
            config.name
          }"
          hint-text="Enter the variable name that you would like displayed on all data outputs. Valid variable names start with a letter (a-z) with proceeding characters consisting of letters (a-z), underscore (_), dash (-), and numbers (0-9)."
          required>
        </tangy-input>
        <tangy-input
          name="label"
          inner-label="Label"
          hint-text="Enter the Question or Statement Text"
          value="${
            config.label
          }">
        </tangy-input>
        <tangy-input 
          name="hintText"
          inner-label="Hint Text"
          value="${
            config.hintText
          }">
        </tangy-input>
        <tangy-input
          name="tangy_if"
          inner-label="Show if"
          hint-text="Enter any conditional display logic. (e.g. getValue('isEmployee') === true)"
          value="${config.tangyIf.replace(/"/g, '&quot;')}">
        </tangy-input>
        <tangy-input
          name="valid_if"
          label="Valid if"
          hint-text="Enter any conditional validation logic. (e.g. input.value.length > 5)"
          value="${config.validIf.replace(/"/g, '&quot;')}">
        </tangy-input>
        <tangy-checkbox name="required" ${
          config.required ? 'value="on"' : ''
        }>Required</tangy-checkbox>
        <tangy-checkbox name="disabled" ${
          config.disabled ? 'value="on"' : ''
        }>Disabled</tangy-checkbox>
        <tangy-checkbox name="hidden" ${
          config.hidden ? 'value="on"' : ''
        }>Hidden</tangy-checkbox>
      </tangy-form-item>
    </tangy-form>
    `;
  }

  onSubmit(config, formEl) {
    return {
      ...config,
      name: formEl.response.items[0].inputs.find(input => input.name === 'name')
        .value,
      label: formEl.response.items[0].inputs.find(
        input => input.name === 'label'
      ).value,
      hintText: formEl.values.hintText,
      required:
        formEl.response.items[0].inputs.find(input => input.name === 'required')
          .value === 'on'
          ? true
          : false,
      hidden:
        formEl.response.items[0].inputs.find(input => input.name === 'hidden')
          .value === 'on'
          ? true
          : false,
      disabled:
        formEl.response.items[0].inputs.find(input => input.name === 'disabled')
          .value === 'on'
          ? true
          : false,
      tangyIf: formEl.response.items[0].inputs.find(
        input => input.name === 'tangy_if'
      ).value,
      validIf: formEl.response.items[0].inputs.find(
        input => input.name === 'valid_if'
      ).value

    };
  }
}

window.customElements.define('tangy-date-widget', TangyDateWidget);
window.tangyFormEditorWidgets.define(
  'tangy-date-widget',
  'tangy-input[type=date]',
  TangyDateWidget
);
