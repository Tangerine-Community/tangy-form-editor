import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/sortable-list/sortable-list.js'
import './tangy-form-editor-add-input.js'

/**
 * `tangy-form-item-editor`
 * ...
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

class TangyFormCondensedEditor extends PolymerElement {

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          color: var(--primary-text-color);
          font-size: medium;
        }
      </style>
      <div id="container"></div>
    `;
  }

  set markup(value) {
    this.upcast(value)
  }

  get markup() {
    return this.downcast()
  }

  static get properties() {
    return {
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.upcast(this.querySelector('template').innerHTML)
  }

  upcast(markup) {
    const template = document.createElement('template')
    template.innerHTML = markup
    template.content.querySelectorAll('[name]')
      .forEach(el => {
        const widgetElInfo = window.tangyFormEditorWidgets.widgets.find(widgetInfo => widgetInfo.claimElement === el.tagName.toLowerCase())
        if (widgetElInfo) {
          const widgetEl = document.createElement(widgetElInfo.widgetName)
          wrap(el, widgetEl)
        }
      })
    this.shadowRoot.innerHTML = `<sortable-list>${template.innerHTML}</sortable-list>`
    this.shadowRoot.addEventListener('add-input', (event) => this.addInput(event))
  }

  downcast() {
    return [...this.shadowRoot.querySelectorAll('[widget]')].map(el => el.downcast(el._config)).join('')
  }

  addInput(event) {
    event.target.after(document.createElement('tangy-form-editor-add-input'))
  }

}

function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

window.customElements.define('tangy-form-condensed-editor', TangyFormCondensedEditor);
