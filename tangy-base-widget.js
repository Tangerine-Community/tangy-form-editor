import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'

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
    this.innerHTML = this.downcast()
    this._element = this.querySelector(this.claimElement)
    this._config = this.defaultConfig()
    this._config = this.upcast(this._config, this._element)
    return this.innerHTML
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
      widget: {
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
      _config: {
        type: Object,
        value: {},
        observer: '_render',
        reflectToAttribute: true
      }
    }
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
    if (this.edit === true) {
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
    } else {
      this.shadowRoot.querySelector('#container').innerHTML = this.renderInfo(this._config)
    }
  }

  _onSubmit() {
    this._config = this.onSubmit(this._config, this.shadowRoot.querySelector('tangy-form'))
    this.innerHTML = this.downcast(this._config)
    this.edit = false
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