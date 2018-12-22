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
      this.innerHTML = `<${this.claimElement}></${this.claimElement}>`
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
  renderEdit(config) {
    return `<input name="${config.name}>`
  }

  // On save of edit form, return updated _config.
  onSave(config, formEl) {
    return { ...config, name: formEl.querySelector([name=base]).value }
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
    this.shadowRoot.querySelector('#container').innerHTML = `
      ${this.edit === false ? this.renderInfo(this._config) :``}
      ${this.edit === true ? `
        <form>
          ${this.renderEdit(this._config)}
          <paper-button type="submit" id="submit">submit</paper-button>
        </form>
      `:``}
    `
    if (this.edit === true) {
      this.shadowRoot.querySelector('#submit').addEventListener('click', (event) => {
        this._config.name = this.shadowRoot.querySelector('[name=name]').value
        this._config.label = this.shadowRoot.querySelector('[name=label]').value
        this.mode = 'info'
        this._config = this.onSave(this._config, this.shadowRoot.querySelector('form'))
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
