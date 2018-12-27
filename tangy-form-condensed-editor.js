import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/sortable-list/sortable-list.js'
import './tangy-form-editor-add-input.js'
import './widget/tangy-text-widget.js'
import './widget/tangy-number-widget.js'
import './widget/tangy-eftouch-widget.js'
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
    window.tangyFormEditorWidgets.widgets.forEach(widgetInfo => {
      template.content.querySelectorAll(widgetInfo.claimElement)
        .forEach(matchingEl => {
            const widgetEl = document.createElement(widgetInfo.widgetName)
            wrap(matchingEl, widgetEl)
        })
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
