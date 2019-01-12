import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/sortable-list/sortable-list.js'
import './tangy-form-editor-add-input.js'
import './widget/tangy-text-widget.js'
import './widget/tangy-number-widget.js'
import './widget/tangy-eftouch-widget.js'
import './widget/tangy-checkbox-widget.js'
import './widget/tangy-checkboxes-widget.js'
import './widget/tangy-timed-widget.js'
import './widget/tangy-radio-buttons-widget.js'
import './widget/tangy-select-widget.js'
import './widget/tangy-gps-widget.js'
import './widget/tangy-location-widget.js'
import './widget/tangy-date-widget.js'
import './widget/tangy-time-widget.js'
import './widget/tangy-box-widget.js'
import './widget/tangy-text-generic-widget.js'
import './widget/tangy-email-widget.js'

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
        .pink {
          --mdc-theme-on-primary: white;
          --mdc-theme-primary: #e9437a;
          --mdc-theme-on-secondary: white;
          --mdc-theme-secondary: #e9437a;
          opacity: 0.5;
        }
        mwc-fab {
          bottom: -42px;
          position: absolute;
          right: -42px;
        }
      </style>
      <div id="container"></div>
    `;
  }

  set markup(value) {
    this.wrap(value)
  }

  get markup() {
    return this.unwrap()
  }

  static get properties() {
    return {
      print: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      }
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.shadowRoot.addEventListener('add-input', (event) => this.addInput(event))
    this.shadowRoot.addEventListener('edit-input', (event) => this.editInput(event))
    this.shadowRoot.addEventListener('submit-input', (event) => this.submitInput(event))

    this.wrap(this.querySelector('template').innerHTML)
  }

  // Iterate through declared Editor Widgets and wrap them around their corresponding claimed elements.
  wrap(markup) {
    const template = document.createElement('template')
    template.innerHTML = markup
    window.tangyFormEditorWidgets.widgets.forEach(widgetInfo => {
      template.content.querySelectorAll(widgetInfo.claimElement)
        .forEach(matchingEl => {
            const widgetEl = document.createElement(widgetInfo.widgetName)
            widgetEl.setAttribute('mode', this.print ? 'MODE_PRINT' : 'MODE_INFO')
            wrap(matchingEl, widgetEl)
        })
    })
    this.shadowRoot.innerHTML = `<sortable-list style="width: 100%">${template.innerHTML}</sortable-list>
    
    ${markup.trim() ? "" : "<div style='margin-top: 3em; padding: 5px; background-color:#F09AB9; font-size:24px;'>Click the red + icon on the right to add inputs.</div>"} 
      `
    this.shadowRoot.querySelector('#add-item-button') ? this.shadowRoot.querySelector('#add-item-button').addEventListener('click', this.addInput.bind(this)): null
    this.shadowRoot.querySelector('sortable-list').addEventListener('sort-finish', this.onSortFinish.bind(this))
  }

  // Iterate through widgets and unwrap them by calling TangyWidget.downcast() to convert them to HTML.
  unwrap() {
    return [...this.shadowRoot.querySelectorAll('[widget]')].map(el => el.downcast(el._config)).join('')
  }

  addInput(event) {
    if (event.target.after) {
      event.target.after(document.createElement('tangy-form-editor-add-input'))
    } else {
      // making the first element
      event.target.querySelector('sortable-list').appendChild(document.createElement('tangy-form-editor-add-input'))
    }
  }

  editInput(event) {
    this.shadowRoot.querySelector('sortable-list').disabled=true
  }

  submitInput(event) {
    this.dispatchEvent(new CustomEvent('tangy-form-condensed-editor-changed', {bubbles: true}))
    this.shadowRoot.querySelector('sortable-list').disabled=false
  }

  onSortFinish(event) {
    this.dispatchEvent(new CustomEvent('tangy-form-condensed-editor-changed', {bubbles: true}))
  }

}

function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

window.customElements.define('tangy-form-condensed-editor', TangyFormCondensedEditor);
