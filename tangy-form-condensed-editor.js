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
    this.shadowRoot.querySelector('#container').innerHTML = this.markupToCondensed(value)
  }

  get markup() {
    return this.condensedToMarkup(this.shadowRoot.querySelector('container').innerHTML)
  }

  static get properties() {
    return {
    }
  }

  connectedCallback() {
    super.connectedCallback()
  }

  markupToCondensed(markup) {
    const template = document.createElement('template')
    template.innerHTML = markup
    const config = [...template.content.querySelectorAll('[name]')].map(el => el.getProps())
    return `
      ${config.map(elConfig => `
        <${elConfig.tagName.toLowerCase()}-editor name="${elConfig.name}" config="${JSON.stringify(elConfig)}></${elConfig.tagName.toLowerCase()}-editor>
      `).join('')}
    ` 
  }

  condensedToMarkup() {
    return this.shadowRoot.querySelector('#container').innerHTML

  }

}

window.customElements.define('tangy-form-condensed-editor', TangyFormCondensedEditor);
