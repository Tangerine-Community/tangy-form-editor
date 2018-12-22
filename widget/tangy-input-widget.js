import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/input/tangy-select.js'
import { TangyBaseWidget } from '../tangy-base-widget.js'

class TangyInputWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-input'
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
      <p>
        Minimum:
        <paper-input name="min" value="${config.min}"></paper-input>
      </p>
      <p>
        Maximum:
        <paper-input name="max" value="${config.max}"></paper-input>
      </p>
      <p>
        Required:
        <paper-checkbox name="required" value="${config.required ? 'on' : ''}"></paper-checkbox>
      </p>
      <p>
        Disabled:
        <paper-checkbox name="disabled" value="${config.disabled ? 'on' : ''}"></paper-checkbox>
      </p>
      <p>
        Hidden:
        <paper-checkbox name="hidden" value="${config.hidden ? 'on' : ''}"></paper-checkbox>
      </p>
    `
  }

  onSave(config, formEl) {
    return {
      ...config,
      name: formEl.querySelector('[name=name]').value,
      label: formEl.querySelector('[name=label]').value,
      required: formEl.querySelector('[name=required]') === 'on' ? true : false,
      disabled: formEl.querySelector('[name=disabled]') === 'on' ? true : false,
      hidden: formEl.querySelector('[name=hidden]') === 'on' ? true : false,
      type: formEl.querySelector('[name=type]').value,
      tangyIf: formEl.querySelector('[name=tangy-if]').value,
      max: formEl.querySelector('[name=max]').value,
      min: formEl.querySelector('[name=min]').value,
    }
  }

}

window.customElements.define('tangy-input-widget', TangyInputWidget);
window.tangyFormEditorWidgets.define('tangy-input-widget', TangyInputWidget);
