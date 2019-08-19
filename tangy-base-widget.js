import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import {Fab} from '@material/mwc-fab'
import {Icon} from "@material/mwc-icon"

const MODE_INFO = 'MODE_INFO'
const MODE_EDIT = 'MODE_EDIT'
const MODE_PRINT = 'MODE_PRINT'

class TangyBaseWidget extends PolymerElement {

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
   * Implement API.
   */

  get claimElement() {
    return 'tangy-base'
  }

  get defaultConfig() {
    return {
      ...this.defaultConfigCommonAttributes()
    }
  }

  defaultConfigCommonAttributes() {
    return {
      name: '',
      class: '',
      style: '',
      required: false,
      disabled: false,
      hidden: false,
      showIf: '',
      validIf: ''
    }
  }

  // Convert this.innerHTML to configuration.
  upcast(config, element) {
    return { 
      ...config,
      ...this.upcastCommonAttributes()
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
        showIf: (
          element.hasAttribute('show-if')
            ? element.getAttribute('show-if')
            : element.hasAttribute('tangy-if')
              ? element.getAttribute('tangy-if')
              : ''
          ).replace(/&quot;/g, '"'),
        validIf: element.hasAttribute('valid-if')
          ? element.getAttribute('valid-if').replace(/&quot;/g, '"')
          : ''
      }
    }
  }

  // Convert configuration to HTML.
  downcast(config) {
    return `<tangy-base ${this.downcastCommonAttributes(config)}></tangy-base>`
  }

  downcastCommonAttributes(config) {
    return `
      name="${config.name}"
      class="${config.class}"
      style="${config.style}"
      error-message="${config.errorMessage}"
      invalid-message="${config.errorMessage}"
      ${config.showIf === "" ? "" : `tangy-if="${config.showIf.replace(/"/g, '&quot;')}"`}
      ${config.validIf === "" ? "" : `valid-if="${config.validIf.replace(/"/g, '&quot;')}"`}
      ${config.required ? 'required' : ''}
      ${config.disabled ? 'disabled' : ''}
      ${config.hidden ? 'hidden' : ''}
  `
  }
  
  // Return markup for use when in info mode.
  renderInfo(config) {
    return `${this.renderInfoCommonAttributes(config)}`
  }

  renderInfoCommonAttributes(config) {
    return `Name: ${config.name}`
  }

  // Return markup for use when in edit mode.
  renderEdit(config) {
    return `<h2>Add Text Input</h2>
      <tangy-form id="form">
        <tangy-form-item id='item'>
          ${this.renderEditCommonAttributes(config)}
          ...custom attributes here...
        </tangy-form-item>
      </tangy-form>
    `
  }

  renderEditCommonAttributes(config) {
    return `
      <tangy-input 
        name="name" 
        valid-if="input.value.match(/^[a-zA-Z].{1,}[a-zA-Z0-9\-_]$/)" 
        inner-label="Variable name"
        value="${config.name}"
        hint-text="Enter the variable name that you would like displayed on all data outputs. Valid variable names start with a letter (a-z) with proceeding characters consisting of letters (a-z), underscore (_), dash (-), and numbers (0-9)."
        required>
      </tangy-input>
      <tangy-input
        name="show_if"
        inner-label="Show if"
        hint-text="Enter any conditional display logic. (e.g. getValue('isEmployee') === true)"
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

  // On save of edit form, return updated _config.
  onSubmit(config, formEl) {
    return { 
      ...config, 
      ...this.onSubmitCommonAttributes(config, formEl)
    }
  }

  onSubmitCommonAttributes(config, formEl) {
    return { 
      name: formEl.response.items[0].inputs.find(input => input.name === 'name')
        .value,
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
      showIf: formEl.response.items[0].inputs.find(
        input => input.name === 'show_if'
      ).value
    }
  }

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
