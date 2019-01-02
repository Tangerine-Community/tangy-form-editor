import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/input/tangy-select.js'
import { TangyBaseWidget } from '../tangy-base-widget.js'

class TangyBoxWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-box'
  }

  get defaultConfig() {
    return {
      name: '',
      required: false,
      disabled: false,
      hidden: false,
      tangyIf: '',
      htmlCode:  ''
    }
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyBox.props thus won't get picked up by TangyBox.getProps().
    return {...config,
      ...element.getProps(),
      htmlCode: element.innerHTML,
      tangyIf: element.hasAttribute('tangy-if')
        ? element.getAttribute('tangy-if')
        : ''
    }
  }

  downcast(config) {
    return `
      <tangy-box 
        name="${config.name}"
        tangy-if="${config.tangyIf}"
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
      >${config.htmlCode}</tangy-box>
    `
  }
  
  renderInfo(config) {
    return `
      type: HTML Code Container<br>
      variable name: ${config.name}<br>
    `
  }

  renderEdit(config) {
    return `<h2>Add HTML content</h2>
    <tangy-form id="tangy-input">
      <tangy-form-item>
        <tangy-input name="name" label="Variable name" value="${config.name}" required></tangy-input>
        <tangy-input name="tangy_if" label="Show if" value="${config.tangyIf}"></tangy-input>
        <tangy-checkbox name="required" ${config.required ? 'value="on"' : ''}>Required</tangy-checkbox>
        <tangy-checkbox name="disabled" ${config.disabled ? 'value="on"' : ''}>Disabled</tangy-checkbox>
        <tangy-checkbox name="hidden" ${config.hidden ? 'value="on"' : ''}>Hidden</tangy-checkbox>
        <tangy-input name="htmlCode" label="Enter HTML code" value="${config.htmlCode}"></tangy-input>
      </tangy-form-item>
    </tangy-form>
    `
  }

  onSubmit(config, formEl) {
    return {
      ...config,
      name: formEl.response.items[0].inputs.find(input => input.name === 'name').value,
      hidden: formEl.response.items[0].inputs.find(input => input.name === 'hidden').value === 'on' ? true : false,
      disabled: formEl.response.items[0].inputs.find(input => input.name === 'disabled').value === 'on' ? true : false,
      tangyIf: formEl.response.items[0].inputs.find(input => input.name === 'tangy_if').value,
      htmlCode: formEl.response.items[0].inputs.find(input => input.name === 'htmlCode').value
    }
  }

}

window.customElements.define('tangy-box-widget', TangyBoxWidget);
window.tangyFormEditorWidgets.define('tangy-box-widget', 'tangy-box', TangyBoxWidget);
