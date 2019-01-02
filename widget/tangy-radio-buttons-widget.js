import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/tangy-form.js'
import 'tangy-form/input/tangy-radio-buttons.js'
import 'tangy-form/input/tangy-input.js'
import { TangyBaseWidget } from '../tangy-base-widget.js'

class TangyRadioButtonsWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-radio-buttons'
  }

  get defaultConfig() {
    return {
      name: '',
      label: '',
      options: [],
      required: false,
      disabled: false,
      hidden: false,
      tangyIf: ''
    }
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyInput.props thus won't get picked up by TangyInput.getProps().
    return {...config, ...element.getProps(),
      options: [...element.querySelectorAll('option')].map(option => {
        return {
          value: option.getAttribute('value'),
          label: option.innerHTML
        }
      }),
      tangyIf: element.hasAttribute('tangy-if')
        ? element.getAttribute('tangy-if')
        : ''
    }
  }

  downcast(config) {
    return `
      <tangy-radio-buttons
        name="${config.name}"
        label="${config.label}"
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
      >
       ${config.options.map(option => `
       <option value="${option.value}">${option.label}</option>
      `).join('')}
      </tangy-radio-buttons>
    `
  }

  renderInfo(config) {
    return `<strong>Variable name: ${config.name}, Type: Radio buttons</strong> <br/>
    ${config.options.length > 0 ? this.downcast(config) : ''}`
  }

  renderEdit(config) {
    return `
    <tangy-form id="tangy-radio-buttons">
      <tangy-form-item id="tangy-radio-buttons">
        <template type="tangy-form-item">
          <tangy-input name="name" label="Variable name" value="${config.name}" required></tangy-input>
          <tangy-input name="label" label="Label" value="${config.label}"></tangy-input>
          <tangy-input name="tangy_if" label="Show if" value="${config.tangyIf}"></tangy-input>
          <tangy-checkbox name="required" ${config.required ? 'value="on"' : ''}>Required</tangy-checkbox>
          <tangy-checkbox name="disabled" ${config.disabled ? 'value="on"' : ''}>Disabled</tangy-checkbox>
          <tangy-checkbox name="hidden" ${config.hidden ? 'value="on"' : ''}>Hidden</tangy-checkbox>
          <tangy-list name="options">
            <template type="tangy-list/new-item">
              <tangy-input name="value" label="Value" type="text"></tangy-input>
              <tangy-input name="label" label="Label" type="text"></tangy-input>
            </template>
            ${config.options.length > 0 ? `
            <template type="tangy-list/initial-items">
              ${config.options.map(option => `
                <tangy-list-item>
                  <tangy-input name="value" label="Value" type="text" value="${option.value}"></tangy-input>
                  <tangy-input name="label" label="Label" type="text" value="${option.label}"></tangy-input>
                </tangy-list-item>
              `).join('')}
            </template>
            ` : ''}
          </tangy-list>
        </template>
      </tangy-form-item>
    </tangy-form>
    `
  }

  editResponse(config) {
    return {
      form: {
        complete: false
      },
      items: [
        {
          id: "tangy-radio-buttons",
          inputs: [
            {
              name: 'name',
              value: config.name
            },
            {
              name: 'label',
              value: config.label
            }
          ]
        }
      ]
    }
  }

  onSubmit(config, formEl) {
    return {
      ...config,
      name: formEl.values.name,
      label: formEl.values.label,
      required: formEl.values.required === 'on' ? true : false,
      hidden: formEl.values.hidden === 'on' ? true : false,
      disabled: formEl.values.disabled === 'on' ? true : false,
      options: formEl.values.options.map(item => item.reduce((acc, input) => {
        return {...acc, [input.name]: input.value}
      }, {}))
    }
  }

}

window.customElements.define('tangy-radio-buttons-widget', TangyRadioButtonsWidget);
window.tangyFormEditorWidgets.define('tangy-radio-buttons-widget', 'tangy-radio-buttons', TangyRadioButtonsWidget);
