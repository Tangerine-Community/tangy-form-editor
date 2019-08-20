import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/input/tangy-select.js'
import { TangyBaseWidget } from '../tangy-base-widget.js'
class TangyCheckboxWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-checkbox'
  }

  upcast(config, element) {
    return { 
      ...this.upcastCommonAttributes(config, element),
      ...this.upcastLabelAttributes(config, element),
      label: element.innerHTML
    }
  }

  downcast(config) {
    return `
      <tangy-checkbox 
        ${this.downcastCommonAttributes(config)}
        ${this.downcastLabelAttributes(config)}
      >${config.label}</tangy-checkbox>
    `
  }
  
  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>check_box</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
  }

}

window.customElements.define('tangy-checkbox-widget', TangyCheckboxWidget);
window.tangyFormEditorWidgets.define('tangy-checkbox-widget', 'tangy-checkbox', TangyCheckboxWidget);
