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
        paper-card {
          display: flex;
          margin: 30px 0px 0px;
          padding: 15px;
          width: 98%;
          justify-content:space-between;
          z-index:1;
        }
        paper-button {
          background: var(--accent-color);
        }
        .align-icon-text {
          display: inline-flex;
          vertical-align: middle;
        }
        :host([mode='MODE_EDIT']) paper-card {
            background-color: lightgrey;
        }
        .card-content {
            text-align:left;
            padding: 2px;
            width:100%
        }
        .card-actions {
            border-top: none;
        }

        .card-actions > paper-button  {
            margin: 0 0 15px 0;
          width: 110px;
        }
        mwc-fab {
          bottom: -42px;
          position: absolute;
          right: -42px;
          --mdc-theme-secondary: var(--accent-color);
        }
        .element-header {
          color: var(--primary-color);
          /*font-size: 2em;*/
          /*opacity: 0.3;*/
          margin-left: .7em;
          margin-bottom: 1.5em;
          display: flex;
          justify-content:start;
          align-items: center;
        }
        mwc-icon {
          color:var(--primary-color);
          position: absolute;
          left: -16px;
          top: -16px;
        }
        #element-name {
            position: absolute;
            top: -12px;
        }
        :host([mode="MODE_PRINT"]) #info-edit-card {
          display: none;
        }
        :host(:not([mode="MODE_PRINT"])) #print-container {
          display: none;
        }
      </style>
      <paper-card id="info-edit-card">
        <div class="card-content" id="container"></div>
        <div class="card-actions">
          <paper-button id="edit-button" class="action-buttons" on-click="_onEditClick"><iron-icon icon="create"></iron-icon> edit</paper-button>
          <br/>
          <paper-button id="remove-button" class="action-buttons" on-click="_onRemoveClick"><iron-icon icon="delete"></iron-icon> remove</paper-button>
          <br/>
          <paper-button id="copy-button" class="action-buttons" on-click="_onCopyClick"><iron-icon icon="content-copy"></iron-icon> copy</paper-button>
          <mwc-fab icon="add" id="add-button" on-click="_onAddClick">add</mwc-fab>
        </div>  
      </paper-card>
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
      this.shadowRoot.querySelector('.card-actions').style = "display:none"
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
    this._config = this.onSubmit(this._config, this.shadowRoot.querySelector('tangy-form'))
    this.innerHTML = this.downcast(this._config)
    this.dispatchEvent(new CustomEvent('submit-input', {bubbles: true}))
    this.mode = MODE_INFO
    setTimeout(_ => this.shadowRoot.querySelector('#container').scrollIntoView({ behavior: 'smooth', block: 'start', inline: "nearest" }), 50)
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
