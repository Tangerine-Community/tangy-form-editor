import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/tangy-form.js'
import 'tangy-form/input/tangy-select.js'
import 'tangy-form/input/tangy-input.js'
import { TangyBaseWidget } from '../tangy-base-widget.js'

class TangySelectWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-select'
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
          name: option.getAttribute('value'),
          label: option.innerHTML
        }
      })
    }
  }

  downcast(config) {
    return `
      <tangy-select
        name="${config.name}"
        label="${config.label}"
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
      >
         ${config.options.map(option => `
          <option value="${option.name}">${option.label}</option>
        `).join('')}
      </tangy-select>
    `
  }

  renderInfo(config) {
    return `
      type: Select<br>
      variable name: ${config.name}<br>
      label: ${config.label}
    `
  }

  renderEdit(config) {
    // Will fail in tests if you don't test for tangy-form-editor element
    if (document.querySelector('tangy-form-editor')) {
      // disable dragging
      document.querySelector('tangy-form-editor')
        .querySelector('tangy-form-item-editor')
        .shadowRoot.querySelector('#container')
        .querySelector('paper-card')
        .querySelector('tangy-form-condensed-editor')
        .shadowRoot.querySelector('sortable-list')
        .disabled=true
    }
    return `
    <tangy-form id="tangy-select">
      <tangy-form-item id="tangy-select">
        <template type="tangy-form-item">
          <tangy-input name="name" label="Variable name" value="${config.name}" required></tangy-input>
          <tangy-input name="label" label="Label" value="${config.label}"></tangy-input>
          <tangy-input name="tangy_if" label="Show if" value="${config.tangyIf}"></tangy-input>
          <tangy-checkbox name="required" ${config.required ? 'value="on"' : ''}>Required</tangy-checkbox>
          <tangy-checkbox name="disabled" ${config.disabled ? 'value="on"' : ''}>Disabled</tangy-checkbox>
          <tangy-checkbox name="hidden" ${config.hidden ? 'value="on"' : ''}>Hidden</tangy-checkbox>
          <tangy-list name="options">
            <template type="tangy-list/new-item">
              <tangy-input name="name" label="Variable name" type="text"></tangy-input>
              <tangy-input name="label" label="Label" type="text"></tangy-input>
            </template>
            ${config.options.length > 0 ? `
            <template type="tangy-list/initial-items">
              ${config.options.map(option => `
                <tangy-list-item>
                  <tangy-input name="name" label="Variable name" type="text" value="${option.name}"></tangy-input>
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
          id: "tangy-select",
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

window.customElements.define('tangy-select-widget', TangySelectWidget);
window.tangyFormEditorWidgets.define('tangy-select-widget', 'tangy-select', TangySelectWidget);