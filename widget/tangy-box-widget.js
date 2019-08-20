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
      ...this.defaultConfigCommonAttributes(),
      htmlCode:  ''
    }
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyBox.props thus won't get picked up by TangyBox.getProps().
    return {...config,
      ...this.upcastCommonAttributes(config, element),
      htmlCode: element.innerHTML
    }
  }

  downcast(config) {
    return `
      <tangy-box 
        ${this.downcastCommonAttributes(config)}
      >${config.htmlCode}</tangy-box>
    `
  }
  
  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>code</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
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

window.customElements.define('tangy-box-widget', TangyBoxWidget);
window.tangyFormEditorWidgets.define('tangy-box-widget', 'tangy-box', TangyBoxWidget);
