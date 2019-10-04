import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/input/tangy-select.js'
import { TangyBaseWidget } from '../tangy-base-widget.js'

class TangyImageWidget extends TangyBaseWidget {

  get claimElement() {
    return 'div.tangy-image'
  }

  get defaultConfig() {
    return {
      name: '',
      hidden: false,
      tangyIf: '',
      src: '',
      width: '50%'
    }
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyImage.props thus won't get picked up by TangyImage.getProps().
    return {...config,
      name: element.getAttribute('name'),
      tangyIf: element.hasAttribute('tangy-if')
        ? element.getAttribute('tangy-if').replace(/&quot;/g, '"')
        : '',
      src: element.querySelector('img').getAttribute('src'),
      width: element.querySelector('img').getAttribute('width')
    }
  }

  downcast(config) {
    return `
      <div 
        name="${config.name}"
        class="tangy-image"
        style="text-align:center"
        ${config.tangyIf === "" ? "" : `tangy-if="${config.tangyIf.replace(/"/g, '&quot;')}"`}
        ${config.hidden ? 'hidden' : ''}
      >
        <img src="${config.src}" width="${config.width}">
      </div>
    `
  }
  
  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>image</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `
    <tangy-form id="tangy-input">
      <tangy-form-item>
        <tangy-input 
          name="name" 
          valid-if="input.value && input.value.match(/^[a-zA-Z]{1,}[a-zA-Z0-9\_]{1,}$/)"
          hint-text="Enter the variable name that you would like displayed on all data outputs. Valid variable names start with a letter (a-z) with proceeding characters consisting of letters (a-z), underscore (_), and numbers (0-9)."
          inner-label="Enter the variable name you would like displayed on all data outputs (e.g. employee_id)."
          value="${config.name}" 
          required>
        </tangy-input>
        <tangy-input 
          name="tangy_if" 
          inner-label="Show if" 
          hint-text="Enter any conditional display logic. (e.g. getValue('isEmployee') === true)"
          value="${config.tangyIf.replace(/"/g, '&quot;')}">
        </tangy-input>
        <tangy-input 
          name="width" 
          inner-label="Width" 
          hint-text="This may be in pixels or in a percentage. Example: 150 or 75%"
          value="${config.width}">
        </tangy-input>
        <file-list-select
          name="src"
          endpoint="${this.getAttribute('files-endpoint')}"
          value="${
            config.src ? config.src : ''
          }"
        ></file-list-select>
        <tangy-checkbox name="hidden" ${config.hidden ? 'value="on"' : ''}>Hidden</tangy-checkbox>
      </tangy-form-item>
    </tangy-form>
    `
  }

  onSubmit(config, formEl) {
    return {
      ...config,
      name: formEl.response.items[0].inputs.find(input => input.name === 'name').value,
      hidden: formEl.response.items[0].inputs.find(input => input.name === 'hidden').value === 'on' ? true : false,
      tangyIf: formEl.response.items[0].inputs.find(input => input.name === 'tangy_if').value,
      width: formEl.response.items[0].inputs.find(input => input.name === 'width').value,
      src: formEl.querySelector('tangy-form-item').querySelector('[name=src]').value
    }
  }

}

window.customElements.define('tangy-image-widget', TangyImageWidget);
window.tangyFormEditorWidgets.define('tangy-image-widget', 'div', TangyImageWidget);
