import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'

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
        const wrapperEl = document.createElement(`${el.tagName.toLowerCase()}-editor`)
        wrapperEl.setAttribute('wrapper', 'true')
        wrap(el, wrapperEl)
      })
    this.shadowRoot.innerHTML = template.innerHTML
  }

  downcast() {
    return [...this.shadowRoot.querySelectorAll('[wrapper]')].map(el => el.downcast()).join('')
  }

}

function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

window.customElements.define('tangy-form-condensed-editor', TangyFormCondensedEditor);
