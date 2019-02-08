import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/sortable-list/sortable-list.js'
import {Fab} from '@material/mwc-fab'
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
    return html``;
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
    this.shadowRoot.addEventListener('add-input', (event) => this.addInput(event.target))
    this.shadowRoot.addEventListener('edit-input', (event) => this.editInput())
    this.shadowRoot.addEventListener('submit-input', (event) => this.submitInput())
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
    this.shadowRoot.innerHTML = `
      <style>
        #add-button-container {
          position: relative;
        }
        #add-button {
          --mdc-theme-on-primary: white;
          --mdc-theme-primary: #e9437a;
          --mdc-theme-on-secondary: white;
          --mdc-theme-secondary: #e9437a;
          opacity: 0.5;
          position: absolute;
          bottom: -27px;
          right: -14px;
          z-index: 1;
        }
      </style>
      <div id="add-button-container">
        <mwc-fab icon="add" id="add-button">add</mwc-fab>
      </div>
      <sortable-list style="width: 100%">${template.innerHTML}</sortable-list>
      ${markup.trim() 
        ? "" 
        : `
          <div style='margin-top: 3em; padding: 5px; background-color:#F09AB9; font-size:24px;'>
            Click the red + icon on the right to add inputs.
          </div>
        `
      } 
    `
    this.shadowRoot.querySelector('#add-button').addEventListener('click', (event) => this.addInput())
    this.shadowRoot.querySelector('sortable-list').addEventListener('sort-finish', (event) => this.onSortFinish(event))
  }

  // Iterate through widgets and unwrap them by calling TangyWidget.downcast() to convert them to HTML.
  unwrap() {
    return [...this.shadowRoot.querySelectorAll('[widget]')].map(el => el.downcast(el._config)).join('')
  }

  addInput(insertAfterEl) {
    if (this.shadowRoot.querySelector('tangy-form-editor-add-input')) {
      return this.shadowRoot.querySelector('tangy-form-editor-add-input').remove()
    }
    if (insertAfterEl) {
      insertAfterEl.after(document.createElement('tangy-form-editor-add-input'))
    } else {
      // making the first element
      this.shadowRoot.querySelector('sortable-list').prepend(document.createElement('tangy-form-editor-add-input'))
    }
    setTimeout(_ => this.shadowRoot.querySelector('tangy-form-editor-add-input').scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    this.shadowRoot.querySelector('sortable-list').disabled=true
  }

  editInput() {
    this.shadowRoot.querySelector('sortable-list').disabled=true
  }

  submitInput() {
    this.dispatchEvent(new CustomEvent('tangy-form-condensed-editor-changed', {bubbles: true}))
    this.shadowRoot.querySelector('sortable-list').disabled=false
  }

  onSortFinish() {
    this.dispatchEvent(new CustomEvent('tangy-form-condensed-editor-changed', {bubbles: true}))
  }

}

function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

window.customElements.define('tangy-form-condensed-editor', TangyFormCondensedEditor);
