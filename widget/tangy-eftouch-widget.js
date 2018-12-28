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
      inputSound: '',
      transitionSound: '',
      transitionDelay: '',
      transitionMessage: '',
      autoProgress: false,
      required: false,
      disabled: false,
      hidden: false,
    }
  }

  upcast(config, element) {
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
        input-sound="${config.inputSound}"
        transition-sound="${config.transitionSound}"
        transition-delay="${config.transitionDelay}"
        transition-message="${config.transitionMessage}"
        ${config.autoProgress ? 'auto-progress' : ''}
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
          <tangy-input name="input-sound" label="Input sound" value="${config.inputSound}"></tangy-input>
          <tangy-input name="transition-sound" label="Transition sound" value="${config.transitionSound}"></tangy-input>
          <tangy-input name="transition-delay" label="Transition delay" value="${config.transitionDelay}" type="number"></tangy-input>
          <tangy-input name="transition-message" label="Transition message" value="${config.transitionMessage}"></tangy-input>
          <tangy-checkbox name="auto-progress" ${config.autoProgress ? 'value="on"' : ''}>auto-progress</tangy-checkbox>
          <tangy-checkbox name="required" ${config.required ? 'value="on"' : ''}>Required</tangy-checkbox>
          <tangy-checkbox name="disabled" ${config.disabled ? 'value="on"' : ''}>Disabled</tangy-checkbox>
          <tangy-checkbox name="hidden" ${config.hidden ? 'value="on"' : ''}>Hidden</tangy-checkbox>
          <tangy-list name="options">
            <template type="tangy-list/new-item">
              <tangy-input name="width" label="Width" type="number" required></tangy-input>
              <tangy-input name="height" label="Height" type="number" required></tangy-input>
              <tangy-input name="src" label="Path to image" type="text" required></tangy-input>
              <tangy-input name="value" label="Selection value" type="text" required></tangy-input>
            </template>
            <template type="tangy-list/initial-items">
              ${config.options.map(option => `
                <tangy-list-item>
                  <tangy-input name="width" label="Width" type="number" value="${option.width}" required></tangy-input>
                  <tangy-input name="height" label="Height" type="number" value="${option.height}" required></tangy-input>
                  <tangy-input name="src" label="Path to image" type="text" value="${option.src}" required></tangy-input>
                  <tangy-input name="value" label="Selection value" type="text" value="${option.value}" required></tangy-input>
                </tangy-list-item>
              `).join('')}
            </template>
          </tangy-list>
        </template>
      </tangy-form-item>
    </tangy-form>
    `
  }

  onSubmit(config, formEl) {
    return {
      ...config,
      name: formEl.values.name,
      label: formEl.values.label,
      inputSound: formEl.values['input-sound'],
      transitionDelay: formEl.values['transition-delay'],
      transitionSound: formEl.values['transition-sound'],
      transitionMessage: formEl.values['transition-message'],
      autoProgress: formEl.values['auto-progress'] === 'on' ? true : false,
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
