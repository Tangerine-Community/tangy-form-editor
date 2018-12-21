import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/input/tangy-select.js'
import { TangyBaseWidget } from '../tangy-base-widget'

class TangyInputWidget extends TangyBaseWidget {

  defaultConfig() {
    return {
      name: '...',
      label: '...',
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

  upcast(config) {
    return {...config, ...this.querySelector('tangy-input').getProps()}
  }

  downcast(config) {
    return `
      <tangy-input name="${config.name}" label="${config.label}"></tangy-input>
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
      <p>
        Variable name:
        <paper-input name="name" value="${config.name}"></paper-input>
      </p>
      <p>
        Label:
        <paper-input name="label" value="${config.label}"></paper-input>
      </p>
      <p>
        Show if:
        <paper-input name="tangy-if" value="${config.tangyIf}"></paper-input>
      </p>
      <p>
        Type:
        <tangy-select name="type" value="${config.type}">
          <option value="text">Text</option>
          <option value="number">Number</option>
        </tangy-select>
      </p>
    `
  }

  onSave(config, formEl) {
    return {
      ...config,
      name: formEl.querySelector('[name=name]').value,
      label: formEl.querySelector('[name=label]').value
    }
  }

}

window.customElements.define('tangy-input-widget', TangyInputWidget);
window.tangyFormEditorWidgets.define('tangy-input', TangyInputWidget);
