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
      name: '...',
    }
  }

  // Convert this.innerHTML to configuration.
  upcast(config, element) {
    return { ...config, name: element.getAttribute('name') }
  }

  // Convert configuration to HTML.
  downcast(config) {
    return `<tangy-base name="${config.name}"></tangy-base>`
  }
  
  // Return markup for use when in info mode.
  renderInfo(config) {
    return `Name: ${config.name}`
  }

  // Return markup for use when in edit mode.
  renderEdit(config, formEl) {
    formEl.innerHTML = `<input name="${config.name}>`
    return formEl
  }

  // On save of edit form, return updated _config.
  onSubmit(config, formEl) {
    return { ...config, name: formEl.querySelector([name=base]).value }
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
