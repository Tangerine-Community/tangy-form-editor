 import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import '@polymer/paper-input/paper-textarea.js'
import 'tangy-form/tangy-form.js'
import 'tangy-form/input/tangy-timed.js'
import 'tangy-form/input/tangy-input.js'
import { TangyBaseWidget } from '../tangy-base-widget.js'

class TangyTimedWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-timed'
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
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyTimed.props thus won't get picked up by TangyTimed.getProps().
    return {...config, ...element.getProps(),
      options: [...element.querySelectorAll('option')].map(option => {
        return {
          name: option.getAttribute('value'),
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
      <tangy-timed
        name="${config.name}"
        label="${config.label}"
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
      >
      ${config.options.map(option => `
        <option value="${option.value}">${option.label}</option>
      `).join('')}
      </tangy-timed>
    `
  }

  renderInfo(config) {
    return `<strong>Variable name: ${config.name}, Type: Timed Grid</strong> <br/>
    ${this.downcast(config)}`
  }

  renderEdit(config) {
    return `<h2>Add Timed Grid</h2>
    <tangy-form id="tangy-timed">
      <tangy-form-item id="tangy-timed">
        <template type="tangy-form-item">
          <tangy-input name="name" label="Variable name" value="${config.name}" required></tangy-input>
          <tangy-input name="label" label="Label" value="${config.label}"></tangy-input>
          <tangy-input name="tangy_if" label="Show if" value="${config.tangyIf}"></tangy-input>
          <tangy-checkbox name="required" ${config.required ? 'value="on"' : ''}>Required</tangy-checkbox>
          <tangy-checkbox name="disabled" ${config.disabled ? 'value="on"' : ''}>Disabled</tangy-checkbox>
          <tangy-checkbox name="hidden" ${config.hidden ? 'value="on"' : ''}>Hidden</tangy-checkbox>
          <tangy-input name="duration" label="Duration in seconds" value="${config.duration}"></tangy-input>
          <tangy-input name="options"  label="Options (Each option separated by a space)" value="${config.options.map(option => `${option.label}`).join(' ')}"></tangy-input>
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
          id: "tangy-timed",
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
      options: formEl.values.options.split(' ').map((item, i) => {
        return {value: i, label: item}
      })
    }
  }

}

window.customElements.define('tangy-timed-widget', TangyTimedWidget);
window.tangyFormEditorWidgets.define('tangy-timed-widget', 'tangy-timed', TangyTimedWidget);
