import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/input/tangy-select.js'
import { TangyBaseWidget } from '../tangy-base-widget.js'

class TangyCheckboxWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-checkbox'
  }

  get defaultConfig() {
    return {
      name: '',
      label: '',
      type: 'text',
      required: false,
      disabled: false,
      hidden: false,
      allowedPattern: '',
      tangyIf: ''
    }
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyInput.props thus won't get picked up by TangyInput.getProps().
    return {...config, ...element.getProps(), ...{
      tangyIf: element.hasAttribute('tangy-if')
        ? element.getAttribute('tangy-if')
        : ''
    }}
  }

  downcast(config) {
    return `
      <tangy-checkbox 
        name="${config.name}"
        label="${config.label}"
        tangy-if="${config.tangyIf}"
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
      ></tangy-checkbox>
    `
  }
  
  renderInfo(config) {
    return `
      <iron-icon icon="icons:check-box-outline-blank"></iron-icon><span class="align-icon-text">${config.label} Variable: ${config.name}</span>
    `
  }

  renderEdit(config) {
    return `
    <tangy-form id="tangy-checkbox">
      <tangy-form-item>
        <tangy-input name="name" label="Variable name" value="${config.name}" required></tangy-input>
        <tangy-input name="label" label="Label" value="${config.label}"></tangy-input>
        <tangy-input name="tangy_if" label="Show if" value="${config.tangyIf}"></tangy-input>
        <tangy-checkbox name="required" ${config.required ? 'value="on"' : ''}>Required</tangy-checkbox>
        <tangy-checkbox name="disabled" ${config.disabled ? 'value="on"' : ''}>Disabled</tangy-checkbox>
        <tangy-checkbox name="hidden" ${config.hidden ? 'value="on"' : ''}>Hidden</tangy-checkbox>
      </tangy-form-item>
    </tangy-form>
    `
  }

  onSubmit(config, formEl) {
    return {
      ...config,
      name: formEl.response.items[0].inputs.find(input => input.name === 'name').value,
      label: formEl.response.items[0].inputs.find(input => input.name === 'label').value,
      required: formEl.response.items[0].inputs.find(input => input.name === 'required').value === 'on' ? true : false,
      hidden: formEl.response.items[0].inputs.find(input => input.name === 'hidden').value === 'on' ? true : false,
      disabled: formEl.response.items[0].inputs.find(input => input.name === 'disabled').value === 'on' ? true : false,
      tangyIf: formEl.response.items[0].inputs.find(input => input.name === 'tangy_if').value
    }
  }

}

window.customElements.define('tangy-checkbox-widget', TangyCheckboxWidget);
window.tangyFormEditorWidgets.define('tangy-checkbox-widget', 'tangy-checkbox', TangyCheckboxWidget);
