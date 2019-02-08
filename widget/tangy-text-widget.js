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
      name: '',
      label: '',
      hintText: '',
      type: 'text',
      required: false,
      disabled: false,
      hidden: false,
      allowedPattern: '',
      tangyIf: ''
    };
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyInput.props thus won't get picked up by TangyInput.getProps().
    return {
      ...config,
      ...element.getProps(),
      ...{
        tangyIf: element.hasAttribute('tangy-if')
          ? element.getAttribute('tangy-if').replace(/&quot;/g, '"')
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
        type="text"
        ${config.tangyIf === "" ? "" : `tangy-if="${config.tangyIf.replace(/"/g, '&quot;')}"`}
        allowed-pattern="${config.allowedPattern}"
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
      <tr><td><strong>Private:</strong></td><td>${config.private}</td></tr>
      <tr><td><strong>Required:</strong></td><td>${config.required}</td></tr>
      <tr><td><strong>Disabled:</strong></td><td>${config.disabled}</td></tr>
      <tr><td><strong>Hidden:</strong></td><td>${config.hidden}</td></tr>
    </table>
    <hr/>
    `;
  }

  renderInfo(config) {
    return `<div class="element-header"><div><mwc-icon>text_fields</mwc-icon></div><div id="element-name">${
      config.name
    }</div></div>
    ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `<h2>Add Text Input</h2>
    <tangy-form id="tangy-input">
      <tangy-form-item>
        <tangy-input name="name" label="Variable name" value="${
          config.name
        }" required></tangy-input>
        <tangy-input name="label" label="Label" value="${
          config.label
        }"></tangy-input>
        <tangy-input name="hintText" label="Hint Text" value="${
          config.hintText
        }"></tangy-input>
        <tangy-input name="allowed_pattern" label="Allowed pattern" value="${
          config.allowedPattern
        }"></tangy-input>
        <tangy-input name="tangy_if" label="Show if" value="${config.tangyIf.replace(/"/g, '&quot;')}"></tangy-input>
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
      allowedPattern: formEl.response.items[0].inputs.find(
        input => input.name === 'allowed_pattern'
      ).value,
      tangyIf: formEl.response.items[0].inputs.find(
        input => input.name === 'tangy_if'
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
