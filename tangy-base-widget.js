import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'

class TangyBaseWidget extends PolymerElement {

  /*
   * Public API.
   */

  static set markup(markup) {
    this.innerHTML = markup
    this.config = this.upcast(this.config)
  }

  static get markup() {
    this.downcast()
  }

  /*
   * Implement API.
   */

  defaultConfig() {
    return {
      name: '...',
      label: '...',
      type: 'text',
      required: false,
      disabled: false,
      hidden: false,
      allowedPattern: '',
      min: undefined,
      max: undefined,
      tangyIf: ''
    }
  }

  // Convert this.innerHTML to configuration.
  upcast(config) {
    return {}
  }

  // Convert configuration to HTML.
  downcast(config) {
    return ``
  }
  
  // Return markup for use when in info mode.
  renderInfo(config) {
    return ``
  }

  // Return markup for use when in edit mode.
  renderEdit(config) {
    return ``
  }

  // On save of edit form, return updated config.
  onSave(config, formEl) {
    return {...config}
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
        }
        paper-card {
          display: block;
          margin: 15px;
          padding: 15px;
          width: 100%;
        }
      </style>
      <paper-card>
        <div class="card-content" id="container"></div>
        <div class="card-actions">
          <paper-button id="remove-button" on-click="_onRemoveClick">remove</paper-button>
          <paper-button id="edit-button" on-click="_onEditClick">edit</paper-button>
          <paper-button id="add-button" on-click="_onAddClick">add</paper-button>
        </div>  
      </paper-card>
    `;
  }

  static get properties() {
    return {
      name: {
        type: String,
        value: ''
      },
      wrapper: {
        type: Boolean,
        value: true,
        reflectToAttribute: true
      },
      edit: {
        type: Boolean,
        value: false,
        observer: '_render',
        reflectToAttribute: true
      },
      config: {
        type: Object,
        value: {},
        observer: '_render',
        reflectToAttribute: true
      }
    }
  }

  connectedCallback() {
    super.connectedCallback()
    // Set to true to make it easier to distinguish that this is a wrapper element in the DOM.
    this.wrapper = true
    // Set up this.config with defaults, then find any in upcast.
    this.config = this.defaultConfig()
    if (this.innerHTML.replace(/\s/g, '') !== '') {
      this.config = this.upcast(this.config)
    }
  }

  /*
   *Private API
   */

  // Proxy for render to the #container element.
  _render() {
    this.shadowRoot.querySelector('#container').innerHTML = `
      ${this.edit === false ? this.renderInfo(this.config) :``}
      ${this.edit === true ? `
        <form>
          ${this.renderEdit(this.config)}
          <paper-button type="submit" id="submit">submit</paper-button>
        </form>
      `:``}
    `
    if (this.edit === true) {
      this.shadowRoot.querySelector('#submit').addEventListener('click', (event) => {
        this.config.name = this.shadowRoot.querySelector('[name=name]').value
        this.config.label = this.shadowRoot.querySelector('[name=label]').value
        this.mode = 'info'
        this.config = this.onSave(previousConfig, this.shadowRoot.querySelector('form'))
      })
    }
  }

  _onRemoveClick() {
    this.remove()
  }

  _onEditClick() {
    this.edit = true
  }

  _onAddClick() {
    this.dispatchEvent(new CustomEvent('add-input', {bubbles: true}))
  }

}

export { TangyBaseWidget }
