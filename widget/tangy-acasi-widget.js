import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import 'tangy-form/input/tangy-select.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangyAcasiWidget extends TangyBaseWidget {
  get claimElement() {
    return 'tangy-acasi';
  }
  get defaultConfig() {
    return {
      name: '',
      label: '',
      hintText: '',
      type: 'text',
      required: false,
      disabled: false,
      hidden: false,
      allowedPattern: '',
      tangyIf: '',
      validIf: '',
      images:'../demo/assets/images/never.png,../demo/assets/images/once.png,../demo/assets/images/few.png,../demo/assets/images/many.png,../demo/assets/images/dont_know.png',
      touchsrc:'../demo/assets/sounds/never_Eng.mp3,../demo/assets/sounds/once_Eng.mp3,../demo/assets/sounds/fewtimes_Eng.mp3,../demo/assets/sounds/manytimes_Eng.mp3,../demo/assets/sounds/noresponse_Eng.mp3',
      introsrc:'',
      transitionsrc:'../demo/assets/sounds/swish.mp3'
    };
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyInput.props thus won't get picked up by TangyInput.getProps().
    return {
      ...config,
      ...element.getProps(),
      ...{
        images: element.images,
        touchsrc: element.touchsrc,
        introsrc: element.introsrc,
        transitionsrc: element.transitionsrc,
        tangyIf: element.hasAttribute('tangy-if')
          ? element.getAttribute('tangy-if').replace(/&quot;/g, '"')
          : '',
        validIf: element.hasAttribute('valid-if')
          ? element.getAttribute('valid-if').replace(/&quot;/g, '"')
          : ''
      }
    };
  }

  downcast(config) {
    return `
      <tangy-acasi 
        name="${config.name}"
        label="${config.label}"
        hint-text="${config.hintText}"
        type="text"
        ${config.tangyIf === "" ? "" : `tangy-if="${config.tangyIf.replace(/"/g, '&quot;')}"`}
        ${config.validIf === "" ? "" : `valid-if="${config.validIf.replace(/"/g, '&quot;')}"`}
        allowed-pattern="${config.allowedPattern}"
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
        ${config.images === "" ? "" : `images="${config.images.replace(/"/g, '&quot;')}"`}
        ${config.touchsrc === "" ? "" : `touchsrc="${config.touchsrc.replace(/"/g, '&quot;')}"`}
        ${config.introsrc === "" ? "" : `introsrc="${config.introsrc.replace(/"/g, '&quot;')}"`}
        ${config.transitionsrc === "" ? "" : `transitionsrc="${config.transitionsrc.replace(/"/g, '&quot;')}"`}
      ></tangy-acasi>
    `;
  }

  renderPrint(config) {
    return `
   
    <table>
      <tr><td><strong>Prompt:</strong></td><td>${config.label}</td></tr>
      <tr><td><strong>Variable Name:</strong></td><td>${config.name}</td></tr>
      <tr><td><strong>Hint:</strong></td><td>${config.hintText}</td></tr>
      <tr><td><strong>Type:</strong></td><td>${config.type}</td></tr>
      <tr><td><strong>Error Message:</strong></td><td>${
        config.errorMessage
      }</td></tr>
      <tr><td><strong>Allowed Pattern:</strong></td><td>${
        config.allowedPattern
      }</td></tr>
      <tr><td><strong>Private:</strong></td><td>${config.private}</td></tr>
      <tr><td><strong>Required:</strong></td><td>${config.required}</td></tr>
      <tr><td><strong>Disabled:</strong></td><td>${config.disabled}</td></tr>
      <tr><td><strong>Hidden:</strong></td><td>${config.hidden}</td></tr>
      <tr><td><strong>images:</strong></td><td>${config.images}</td></tr>
      <tr><td><strong>touchsrc:</strong></td><td>${config.touchsrc}</td></tr>
      <tr><td><strong>introsrc:</strong></td><td>${config.introsrc}</td></tr>
      <tr><td><strong>transitionsrc:</strong></td><td>${config.transitionsrc}</td></tr>
    </table>
    <hr/>
    `;
  }

  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>speaker</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `<h2>Add Acasi Input</h2>
    <tangy-form id="tangy-acasii-widget">
      <tangy-form-item>
        <tangy-input 
          name="name" 
          valid-if="input.value.match(/^[a-zA-Z].{1,}[a-zA-Z0-9\-_]$/)" 
          inner-label="Variable name"
          value="${config.name}"
          hint-text="Enter the variable name that you would like displayed on all data outputs. Valid variable names start with a letter (a-z) with proceeding characters consisting of letters (a-z), underscore (_), dash (-), and numbers (0-9)."
          required>
        </tangy-input>
        <tangy-input
          name="label"
          inner-label="Label"
          hint-text="Enter the Question or Statement Text"
          value="${config.label}">
        </tangy-input>
        <tangy-input
          name="hintText"
          inner-label="Hint Text"
          value="${config.hintText}">
        </tangy-input>
        <tangy-input
          name="allowed_pattern"
          inner-label="Allowed pattern"
          hint-text="Optional Javascript RegExp pattern to validate text (e.g. minimum length of 5 characters would be [a-zA-Z]{5,})
          value="${config.allowedPattern}">
        </tangy-input>
        <tangy-input
          name="tangy_if"
          inner-label="Show if"
          hint-text="Enter any conditional display logic. (e.g. getValue('isEmployee') === true)"
          value="${config.tangyIf.replace(/"/g, '&quot;')}">
        </tangy-input>
        <tangy-input 
          name="valid_if"
          inner-label="Valid if"
          hint-text="Enter any conditional validation logic. (e.g. input.value.length > 5)"
          value="${config.validIf.replace(/"/g, '&quot;')}">
        </tangy-input>
        <tangy-checkbox
          name="required" 
          ${config.required ? 'value="on"' : ''}>
          Required
        </tangy-checkbox>
        <tangy-checkbox
          name="disabled" 
          ${config.disabled ? 'value="on"' : ''}>
          Disabled
        </tangy-checkbox>
        <tangy-checkbox
          name="hidden"
          ${config.hidden ? 'value="on"' : ''}>
          Hidden
        </tangy-checkbox>
         <tangy-input
          name="introsrc"
          inner-label="introsrc - path to audio file that plays when the page loads"
          hint-text="Enter the introsrc, commma-separated."
          value="${config.introsrc}">
          </tangy-input>
         <tangy-input
          name="images"
          inner-label="images"
          hint-text="Enter the images, comma-separated."
          value="${config.images}">
          </tangy-input>
         <tangy-input
          name="touchsrc"
          inner-label="touchsrc - path to audio files"
          hint-text="Enter the touchsrc, commma-separated."
          value="${config.touchsrc}">
        </tangy-input>
         <tangy-input
          name="transitionsrc"
          inner-label="transitionsrc - path to audio file that plays when transitioning to a new page"
          hint-text="Enter the transitionsrc, commma-separated."
          value="${config.transitionsrc}">
        </tangy-input>
      </tangy-form-item>
    </tangy-form>
    `;
  }

  onSubmit(config, formEl) {
    return {
      ...config,
      name: formEl.response.items[0].inputs.find(input => input.name === 'name')
        .value,
      label: formEl.response.items[0].inputs.find(
        input => input.name === 'label'
      ).value,
      hintText: formEl.values.hintText,
      required:
        formEl.response.items[0].inputs.find(input => input.name === 'required')
          .value === 'on'
          ? true
          : false,
      hidden:
        formEl.response.items[0].inputs.find(input => input.name === 'hidden')
          .value === 'on'
          ? true
          : false,
      disabled:
        formEl.response.items[0].inputs.find(input => input.name === 'disabled')
          .value === 'on'
          ? true
          : false,
      allowedPattern: formEl.response.items[0].inputs.find(
        input => input.name === 'allowed_pattern'
      ).value,
      validIf: formEl.response.items[0].inputs.find(
        input => input.name === 'valid_if'
      ).value,
      tangyIf: formEl.response.items[0].inputs.find(
        input => input.name === 'tangy_if'
      ).value,
      images: formEl.response.items[0].inputs.find(
        input => input.name === 'images'
      ).value,
      touchsrc: formEl.response.items[0].inputs.find(
        input => input.name === 'touchsrc'
      ).value,
      introsrc: formEl.response.items[0].inputs.find(
        input => input.name === 'introsrc'
      ).value,
      transitionsrc: formEl.response.items[0].inputs.find(
        input => input.name === 'transitionsrc'
      ).value
    };
  }
}

window.customElements.define('tangy-acasi-widget', TangyAcasiWidget);
window.tangyFormEditorWidgets.define('tangy-acasi-widget', 'tangy-acasi', TangyAcasiWidget);
