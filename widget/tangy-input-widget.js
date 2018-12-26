import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/input/tangy-select.js'
import { TangyBaseWidget } from '../tangy-base-widget.js'

class TangyInputWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-input[type=number]'
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
      min: undefined,
      max: undefined,
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
      <tangy-input 
        name="${config.name}"
        label="${config.label}"
        type="${config.type}"
        min="${config.min}"
        max="${config.max}"
        tangy-if="${config.tangyIf}"
        allowed-pattern="${config.allowedPattern}"
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
      ></tangy-input>
    `
  }
  
  renderInfo(config) {
    return `
      type: Text Input<br>
      variable name: ${config.name}<br>
      label: ${config.label}
    `
  }

  renderEdit(config) {
    return `
    <tangy-form id="tangy-input">
      <tangy-form-item>
        <tangy-input name="name" label="Variable name" value="${config.name}"></tangy-input>
        <tangy-input name="label" label="Label" value="${config.label}"></tangy-input>
        <tangy-input name="tangy-if" label="Show if" value="${config.tangyIf}"></tangy-input>
        Type:
        <tangy-select name="type" value="${config.type}">
          <option value="text">Text</option>
          <option value="number">Number</option>
        </tangy-select>
        <tangy-input name="min" label="Minimum" value="${config.min}"></tangy-input>
        <tangy-input name="max" label="Maximum" value="${config.max}"></tangy-input>
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
      type: formEl.response.items[0].inputs.find(input => input.name === 'type').value,
      tangyIf: formEl.response.items[0].inputs.find(input => input.name === 'tangy-if').value,
      max: formEl.response.items[0].inputs.find(input => input.name === 'max').value,
      min: formEl.response.items[0].inputs.find(input => input.name === 'min').value
    }
  }

}

window.customElements.define('tangy-input-widget', TangyInputWidget);
window.tangyFormEditorWidgets.define('tangy-input-widget', 'tangy-input', TangyInputWidget);
