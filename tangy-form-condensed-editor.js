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
    this.markupToCondensed(value)
  }

  get markup() {
    return this.condensedToMarkup()
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
    debugger
    this.shadowRoot.querySelector('#container').innerHTML = `
      ${config.map(elConfig => `
        <${elConfig.tagName.toLowerCase()}-editor name="${elConfig.name}"></${elConfig.tagName.toLowerCase()}-editor>
      `).join('')}
    ` 
    this.shadowRoot.querySelector('#container')
      .querySelectorAll('[name]')
      .forEach(editorInputEl => {
        editorInputEl.config = config.find(configEl => configEl.name === editorInputEl.name)
      })

  }

  condensedToMarkup() {
    const config = [...this.shadowRoot.querySelectorAll('[name]')].map(el => el.getProps())
    const template = document.createElement('div')
    template.innerHTML = `
      ${config.map(elConfig => `
        <${elConfig.tagName.toLowerCase().replace('-editor', '')} name="${elConfig.name}"></${elConfig.tagName.toLowerCase().replace('-editor','')}>
      `).join('')}
    `
    template
      .querySelectorAll('[name]')
      .forEach(templateEl => {
        templateEl.setProps(config.find(configEl => configEl.name === templateEl.getAttribute('name')).config)
      })
    return template.innerHTML


  }

}

function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

window.customElements.define('tangy-form-condensed-editor', TangyFormCondensedEditor);
