import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/tangy-form.js'
import 'tangy-form/input/tangy-eftouch.js'
import 'tangy-form/input/tangy-input.js'
import { TangyBaseWidget } from '../tangy-base-widget.js'

class TangyEftouchWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-eftouch'
  }

  get defaultConfig() {
    return {
      name: '',
      label: '',
      options: [],
      required: false,
      disabled: false,
      hidden: false,
    }
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyInput.props thus won't get picked up by TangyInput.getProps().
    return {...config, ...element.getProps(), ...{
      tangyIf: element.hasAttribute('tangy-if')
        ? element.getAttribute('tangy-if')
        : '',
      options: [...element.querySelectorAll('option')].map(option => {
        return {
          width: option.getAttribute('width'),
          height: option.getAttribute('height'),
          src: option.getAttribute('src'),
          value: option.getAttribute('value')
        }
      })
    }}
  }

  downcast(config) {
    return `
      <tangy-eftouch
        name="${config.name}"
        label="${config.label}"
        type="text"
        tangy-if="${config.tangyIf}"
        allowed-pattern="${config.allowedPattern}"
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
      >
        ${config.options.map(option => `
          <option
            width="${option.width}"
            height="${option.height}"
            src="${option.src}"
            value="${option.value}"
          >
        `).join('')}
      </tangy-eftouch>
    `
  }
  
  renderInfo(config) {
    return `
      type: Executive Function Test<br>
      variable name: ${config.name}<br>
      label: ${config.label}
    `
  }

  renderEdit(config) {
    return `
    <tangy-form id="tangy-eftouch">
      <tangy-form-item id="tangy-eftouch">
        <tangy-input name="name" label="Variable name" required></tangy-input>
        <tangy-input name="label" label="Label"></tangy-input>
        <tangy-checkbox name="required" ${config.required ? 'value="on"' : ''}>Required</tangy-checkbox>
        <tangy-checkbox name="disabled" ${config.disabled ? 'value="on"' : ''}>Disabled</tangy-checkbox>
        <tangy-checkbox name="hidden" ${config.hidden ? 'value="on"' : ''}>Hidden</tangy-checkbox>
        <tangy-input-groups name="options">
          <tangy-input name="width" label="Width" type="number"></tangy-input>
          <tangy-input name="height" label="Height" type="number"></tangy-input>
          <tangy-input name="src" label="Path to image" type="text"></tangy-input>
          <tangy-input name="value" label="Selection value" type="text"></tangy-input>
        </tangy-input-groups>
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
          id: "tangy-eftouch",
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
      name: formEl.response.items[0].inputs.find(input => input.name === 'name').value,
      label: formEl.response.items[0].inputs.find(input => input.name === 'label').value,
      required: formEl.response.items[0].inputs.find(input => input.name === 'required').value === 'on' ? true : false,
      hidden: formEl.response.items[0].inputs.find(input => input.name === 'hidden').value === 'on' ? true : false,
      disabled: formEl.response.items[0].inputs.find(input => input.name === 'disabled').value === 'on' ? true : false,
    }
  }

}

window.customElements.define('tangy-eftouch-widget', TangyEftouchWidget);
window.tangyFormEditorWidgets.define('tangy-eftouch-widget', 'tangy-eftouch', TangyEftouchWidget);
