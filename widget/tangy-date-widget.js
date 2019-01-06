import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/input/tangy-select.js'
import { TangyBaseWidget } from '../tangy-base-widget.js'

class TangyDateWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-input[type=date]'
  }

  get defaultConfig() {
    return {
      name: '',
      label: '',
      type: 'date',
      required: false,
      disabled: false,
      hidden: false,
      tangyIf: ''
    }
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyDate.props thus won't get picked up by TangyDate.getProps().
    return {...config, ...element.getProps(), ...{
      tangyIf: element.hasAttribute('tangy-if')
        ? element.getAttribute('tangy-if')
        : ''
    }}
  }

  downcast(config) {
    return `
      <tangy-input 
        name="${config.name}"
        label="${config.label}"
        type="date"
        tangy-if="${config.tangyIf}"
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
      ></tangy-input>
    `
  }
  
  renderInfo(config) {
    return `<div class="element-header"><mwc-icon>date_range</mwc-icon><div id="element-name">${config.name}</div></div>
    ${this.downcast(config)}`

  }

  renderEdit(config) {
    return `<h2>Add a Date Input</h2>
    <tangy-form id="tangy-date-widget">
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

window.customElements.define('tangy-date-widget', TangyDateWidget);
window.tangyFormEditorWidgets.define('tangy-date-widget', 'tangy-input[type=date]', TangyDateWidget);