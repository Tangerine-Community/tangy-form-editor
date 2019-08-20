import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/input/tangy-select.js'
import { TangyBaseWidget } from '../tangy-base-widget.js'

class TangyTemplateWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-template'
  }

  get defaultConfig() {
    return {
      ...this.defaultConfigCommonAttributes(),
      htmlCode:  ''
    }
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyTemplate.props thus won't get picked up by TangyTemplate.getProps().
    return {
      ...this.upcastCommonAttributes(config, element),
      htmlCode: element.innerHTML
    }
  }

  downcast(config) {
    return `
      <tangy-template 
        ${this.downcastCommonAttributes(config)}
      >${config.htmlCode}</tangy-template>
    `
  }
  
  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>attach_money</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} (output only available in preview mode)`
  }

  renderEdit(config) {
    return `
      <tangy-form id="tangy-input">
        <tangy-form-item>
          ${this.renderEditCommonAttributes(config)}
          <tangy-code mode="ace/mode/html" name="htmlCode" height="600" required>
            ${config.htmlCode}
          </tangy-code>
        </tangy-form-item>
      </tangy-form>
    `
  }

  onSubmit(config, formEl) {
    return {
      ...this.onSubmitCommonAttributes(config, formEl),
      htmlCode: formEl.response.items[0].inputs.find(input => input.name === 'htmlCode').value
    }
  }

}

window.customElements.define('tangy-template-widget', TangyTemplateWidget);
window.tangyFormEditorWidgets.define('tangy-template-widget', 'tangy-template', TangyTemplateWidget);
