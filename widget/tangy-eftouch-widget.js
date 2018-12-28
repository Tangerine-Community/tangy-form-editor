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
    return {...config, ...element.getProps(),
      options: [...element.querySelectorAll('option')].map(option => {
        return {
          width: option.getAttribute('width'),
          height: option.getAttribute('height'),
          src: option.getAttribute('src'),
          value: option.getAttribute('value')
        }
      })
    }
  }

  downcast(config) {
    return `
      <tangy-eftouch
        name="${config.name}"
        label="${config.label}"
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
        <template type="tangy-form-item">
          <tangy-input name="name" label="Variable name" value="${config.name}" required></tangy-input>
          <tangy-input name="label" label="Label" value="${config.label}"></tangy-input>
          <tangy-checkbox name="required" ${config.required ? 'value="on"' : ''}>Required</tangy-checkbox>
          <tangy-checkbox name="disabled" ${config.disabled ? 'value="on"' : ''}>Disabled</tangy-checkbox>
          <tangy-checkbox name="hidden" ${config.hidden ? 'value="on"' : ''}>Hidden</tangy-checkbox>
          <tangy-list name="options">
            <template type="tangy-list/new-item">
              <tangy-input name="width" label="Width" type="number"></tangy-input>
              <tangy-input name="height" label="Height" type="number"></tangy-input>
              <tangy-input name="src" label="Path to image" type="text"></tangy-input>
              <tangy-input name="value" label="Selection value" type="text"></tangy-input>
            </template>
            <template type="tangy-list/initial-items">
              ${config.options.map(option => `
                <tangy-list-item>
                  <tangy-input name="width" label="Width" type="number" value="${option.width}"></tangy-input>
                  <tangy-input name="height" label="Height" type="number" value="${option.height}"></tangy-input>
                  <tangy-input name="src" label="Path to image" type="text" value="${option.src}"></tangy-input>
                  <tangy-input name="value" label="Selection value" type="text" value="${option.value}"></tangy-input>
                </tangy-list-item>
              `).join('')}
            </template>
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

window.customElements.define('tangy-eftouch-widget', TangyEftouchWidget);
window.tangyFormEditorWidgets.define('tangy-eftouch-widget', 'tangy-eftouch', TangyEftouchWidget);
