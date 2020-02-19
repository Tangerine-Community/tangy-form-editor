import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'

const MODE_INFO = 'MODE_INFO'
const MODE_EDIT = 'MODE_EDIT'
const MODE_PRINT = 'MODE_PRINT'

class TangyBaseWidget extends PolymerElement {

  /*
   * Implement API.
   */

  get claimElement() {
    return 'tangy-base'
  }

  get defaultConfig() {
    return {
      ...this.defaultConfigCommonAttributes(),
      ...this.defaultConfigLabelAttributes()
    }
  }

  upcast(config, element) {
    return { 
      ...config,
      ...this.upcastCommonAttributes(config, element),
      ...this.upcastLabelAttributes(config, element),
      ...this.getProps()
    }
  }

  // Convert configuration to HTML.
  downcast(config) {
    return `<tangy-base 
        ${this.downcastCommonAttributes(config)}
        ${this.downcastLabelAttributes(config)}
      ></tangy-base>`
  }

  
  // Return markup for use when in info mode.
  renderInfo(config) {
    return `${this.renderInfoCommonAttributes(config)}`
  }

  // Return markup for use when in edit mode.
  renderEdit(config) {
    return `
      <tangy-form id="form">
        <tangy-form-item id='item'>
          ${this.renderEditCommonAttributes(config)}
          ${this.renderEditLabelAttributes(config)}
        </tangy-form-item>
      </tangy-form>
    `
  }

  // On save of edit form, return updated _config.
  onSubmit(config, formEl) {
    return { 
      ...this.onSubmitCommonAttributes(config, formEl),
      ...this.onSubmitLabelAttributes(config, formEl)
    }
  }

  /*
   * Public API.
   */

  set markup(markup) {
    this.innerHTML = markup
    if (!this.querySelector(this.claimElement)) {
      this.innerHTML = this.downcast(this.defaultConfig)
    }
    this._element = this.querySelector(this.claimElement)
    this._config = {...this.defaultConfig}
    this._config = this.upcast(this._config, this._element)
  }

  get markup() {
    return this.downcast(this._config)
  }

  // Need it?
  /*
  detach() {

  }
  */

  /* 
   * Helpers.
   */

  defaultConfigCommonAttributes() {
    return {
      name: '',
      class: '',
      style: '',
      required: false,
      disabled: false,
      hidden: false,
      showIf: '',
      skipIf: '',
      validIf: ''
    }
  }

  defaultConfigLabelAttributes() {
    return {
      questionNumber: '',
      label: '',
      hintText: '',
      errorText: ''
    }
  }

  upcastCommonAttributes(config, element) {
    return {
      ...{
        name: element.hasAttribute('name')
          ? element.getAttribute('name')
          : '',
        class: element.hasAttribute('class')
          ? element.getAttribute('class')
          : '',
        style: element.hasAttribute('style')
          ? element.getAttribute('style')
          : '',
        required: element.hasAttribute('required') ? true : false,
        hidden: element.hasAttribute('hidden') ? true : false,
        disabled: element.hasAttribute('disabled') ? true : false,
        showIf: (
          element.hasAttribute('show-if')
            ? element.getAttribute('show-if')
            : element.hasAttribute('tangy-if')
              ? element.getAttribute('tangy-if')
              : ''
          ).replace(/&quot;/g, '"'),
        skipIf: element.hasAttribute('skip-if')
          ? element.getAttribute('skip-if').replace(/&quot;/g, '"')
          : '',
        validIf: element.hasAttribute('valid-if')
          ? element.getAttribute('valid-if').replace(/&quot;/g, '"')
          : ''
      }
    }
  }

  upcastLabelAttributes(config, element) {
    return {
      questionNumber: element.hasAttribute('question-number')
        ? element.getAttribute('question-number')
        : '',
      label: element.hasAttribute('label')
        ? element.getAttribute('label')
        : '',
      errorText: element.hasAttribute('error-text')
        ? element.getAttribute('error-text')
        : '',
      hintText: element.hasAttribute('hint-text')
        ? element.getAttribute('hint-text')
        : ''
    }
  }

  downcastCommonAttributes(config) {
    return `
      name="${config.name}"
      class="${config.class}"
      style="${config.style}"
      ${config.showIf === "" ? "" : `tangy-if="${config.showIf.replace(/"/g, '&quot;')}"`}
      ${config.validIf === "" ? "" : `valid-if="${config.validIf.replace(/"/g, '&quot;')}"`}
      ${config.skipIf === "" ? "" : `skip-if="${config.skipIf.replace(/"/g, '&quot;')}"`}
      ${config.required ? 'required' : ''}
      ${config.disabled ? 'disabled' : ''}
      ${config.hidden ? 'hidden' : ''}
  `
  }

   downcastLabelAttributes(config) {
     return `
       question-number="${config.questionNumber}"
       label="${config.label}"
       error-text="${config.errorText}"
       hint-text="${config.hintText}"
     `
  }

  renderInfoCommonAttributes(config) {
    return `Name: ${config.name}`
  }

  renderEditCommonAttributes(config) {
    return `
      <tangy-input 
        name="name" 
        valid-if="input.value.match(/^[a-zA-Z]{1,}[a-zA-Z0-9\_]{1,}$/)" 
        inner-label="Variable name"
        value="${config.name}"
        hint-text="Enter the variable name that you would like displayed on all data outputs. Valid variable names start with a letter (a-z) with proceeding characters consisting of letters (a-z), underscore (_), and numbers (0-9)."
        required>
      </tangy-input>
      <tangy-input 
        name="class" 
        inner-label="CSS Class"
        value="${config.class}"
        hint-text="Enter CSS classes this element may belong to."
        >
      </tangy-input>
      <tangy-input
        name="style"
        inner-label="CSS Style"
        hint-text="Enter CSS for this element."
        value="${config.style.replace(/"/g, '&quot;')}">
      </tangy-input>
      ${!this.hasAttribute('hide-skip-if') ? `
        <tangy-input 
          name="skip_if"
          inner-label="Skip if"
          hint-text="Enter logic for whether or not this should be skipped. Values entered while shown will not persist after hiding (e.g. getValue('should_proceed') === '')"
          value="${config.skipIf.replace(/"/g, '&quot;')}">
        </tangy-input>
      `:''}
      <tangy-input
        name="show_if"
        inner-label="Show if"
        hint-text="Enter any conditional display logic. Values that users enter while shown will persist after hiding. (e.g. getValue('isEmployee') === true)"
        value="${config.showIf.replace(/"/g, '&quot;')}">
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
    `
  }

  renderEditLabelAttributes(config) {
    return `
      <tangy-input
        name="question-number"
        inner-label="Question number"
        value="${
          config.questionNumber
        }">
      </tangy-input>
      <tangy-input
        name="label"
        inner-label="Label"
        value="${
          config.label
        }">
      </tangy-input>
      <tangy-input
        name="hint-text"
        inner-label="Hint text"
        value="${
          config.hintText
        }">
      </tangy-input>
      <tangy-input
        name="error-text"
        inner-label="Error text"
        value="${
          config.errorText
        }">
      </tangy-input>
    `
  }

  onSubmitCommonAttributes(config, formEl) {
    return { 
      name: formEl.response.items[0].inputs.find(input => input.name === 'name').value,
      style: formEl.response.items[0].inputs.find(input => input.name === 'style').value,
      class: formEl.response.items[0].inputs.find(input => input.name === 'class').value,
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
      validIf: formEl.response.items[0].inputs.find(
        input => input.name === 'valid_if'
      ).value,
      skipIf: !this.hasAttribute('hide-skip-if')
        ? formEl.response.items[0].inputs.find(
            input => input.name === 'skip_if'
          ).value
        : '',
      showIf: formEl.response.items[0].inputs.find(
        input => input.name === 'show_if'
      ).value
    }
  }

  onSubmitLabelAttributes(config, formEl) {
    return { 
      questionNumber: formEl.response.items[0].inputs.find(input => input.name === 'question-number')
        .value,
      label: formEl.response.items[0].inputs.find(input => input.name === 'label')
        .value,
       errorText: formEl.response.items[0].inputs.find(input => input.name === 'error-text')
        .value,
       hintText: formEl.response.items[0].inputs.find(input => input.name === 'hint-text')
        .value
    }
  }

  // @Deprecated
  editResponse(config) {
    return false
  }

  // ?? So we can do event listeners on dynamic items?? Could also make form components for things like <tangy-list>.
  afterRenderEdit() {

  }

  /*
   * PolymerElement usage.
   */

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          width: 100%;
          cursor: move;
        }
        
        paper-button {
          background: var(--accent-color);
          color:var(--accent-text-color);
          margin-top:10px;
        }
        
        :host([mode='MODE_EDIT']) paper-card {
            background-color: lightgrey;
        }
        .tangy-spacer{
          flex: 1 1 auto;
        }
        .span-spacer{
          margin-left:10px;
        }
        .card-header{
          display:flex;
          height: 20px;
          height:34px;
          padding-top:10px;
          background:var(--lighter-accent-color);
          color:var(--accent-text-color);
          border-radius: 5px 5px 0px 0px
        }
        paper-card {
          text-align: left; 
          width:98%;
          margin: 30px 0px 0px;
        }
  
        .card-content {
          text-align: left;
          padding: 15px;
        }
        
        .card-actions {
           border-top: none;
        }
        .card-actions-edit {
          margin-top:3em;
          margin-right:3em;
          margin-bottom: 100px;
        }
        
        .card-actions-edit paper-button {
          float:right;
          line-height: 1em;
          background: var(--accent-color);
        }
        
        .tangy-action-buttons{
          color: var(--accent-text-color);
          background-color: var(--accent-color);
          font-size: 12px;
          font-weight: 500;
          height: 2rem;
        }

        .action-buttons{
          margin-right:10px;
          cursor: pointer;
        }

        :host([mode="MODE_PRINT"]) #info-edit-card {
          display: none;
        }
        :host(:not([mode="MODE_PRINT"])) #print-container {
          display: none;
        }
        span span .header-text, #container span mwc-icon{
          display:none;
        }
      </style>

      <paper-card id="info-edit-card">
        <div class="card-header" >
          <span class="span-spacer" id="icon"></span>
          <span class="span-spacer tangy-spacer" id="name"></span>
          <span id="edit-button" class="action-buttons" on-click="_onEditClick"><iron-icon icon="create"></iron-icon></span>
          <span id="copy-button" class="action-buttons" on-click="_onCopyClick"><iron-icon icon="content-copy"></iron-icon></span>
          <span id="remove-button" class="action-buttons" on-click="_onRemoveClick"><iron-icon icon="delete"></iron-icon></span>
        </div>
        <div class="card-content" id="container"></div>
        
      </paper-card>
      <paper-button id="add-button" 
            class="tangy-action-buttons" on-click="_onAddClick">
            <iron-icon icon="add"></iron-icon>
            Insert Here
          </paper-button>
     
      <span id="print-container"></span>
    `;
  }

  static get properties() {
    return {
      name: {
        type: String,
        value: ''
      },
      widget: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },
      mode: {
        type: String,
        value: MODE_INFO,
        observer: '_render',
        reflectToAttribute: true
      },
      _config: {
        type: Object,
        value: {},
        observer: '_render',
        reflectToAttribute: true
      }
      // sparkle: {
      //   type: String,
      //   value: '',
      //   observer: '_sparkler',
      //   reflectToAttribute: true
      // },
    }
  }

  constructor() {
    super()
    this._config = this.defaultConfig
  }

  connectedCallback() {
    super.connectedCallback()
    this.markup = this.innerHTML
    // A useful selector from higher in the DOM.
    this.widget = true
  }

  /*
   *Private API
   */

  // Proxy for render to the #container element.
  _render() {
    if (this.mode === MODE_EDIT) {
      this.shadowRoot.querySelector('#container').innerHTML = this.renderEdit(this._config)
      if (this.editResponse(this._config)) {
        this.shadowRoot
          .querySelector('#container')
          .querySelector('tangy-form')
          .response = this.editResponse(this._config)
      } else {
        this.shadowRoot
          .querySelector('#container')
          .querySelector('tangy-form')
          .newResponse()
      }
      this.shadowRoot
        .querySelector('#container')
        .querySelector('tangy-form')
        .addEventListener('submit', (event) => this._onSubmit())
    } else if (this.mode === MODE_INFO) {
      this.shadowRoot.querySelector('#container').innerHTML = this.renderInfo(this._config)
    } else if (this.mode === MODE_PRINT) {
      // Make implementing renderPrint optional.
      this.shadowRoot.querySelector('#container').innerHTML = `` 
      this.shadowRoot.querySelector('#print-container').innerHTML = this.renderPrint 
        ? this.renderPrint(this._config)
        : this.renderInfo(this._config)
    }
  }

  _sparkler() {
    console.log("sparkler: ")
    console.log("sparkler: " + this.sparkle)
    if ( this.sparkle !=='') {
      console.log("sparkler me now: " + this.sparkle)
    }
  }

  _onSubmit() {
    this.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    this._config = this.onSubmit(this._config, this.shadowRoot.querySelector('tangy-form'))
    this.innerHTML = this.downcast(this._config)
    this.dispatchEvent(new CustomEvent('submit-input', {bubbles: true}))
    this.mode = MODE_INFO
    // this.shadowRoot.querySelector('.card-content').style.backgroundColor = "lightblue";
    // this.shadowRoot.querySelector('#container').style = 'background-color:lightblue';

    // this.updateStyles({
    //   '--special-bgcolor': 'blue',
    // });
    // this.updateStyles({'--paper-toolbar-background': '#ed0'});
    this.sparkle = "now"
  }

  _onRemoveClick() {
    this.remove()
  }

  _onEditClick() {
    this.dispatchEvent(new CustomEvent('edit-input', {bubbles: true}))
    this.mode = MODE_EDIT
  }

  _onAddClick() {
    let addInputEl = this.parentElement.querySelector("tangy-form-editor-add-input");
    !addInputEl? this.dispatchEvent(new CustomEvent('add-input', {bubbles: true})):this.parentElement.removeChild(addInputEl)
  }

  _onCopyClick() {
    this.dispatchEvent(new CustomEvent('copy-input', {bubbles: true}))
  }

}

export { TangyBaseWidget }
