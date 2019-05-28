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
import './widget/tangy-template-widget.js'
import './widget/tangy-email-widget.js'
import './widget/tangy-qr-widget.js'
import './widget/tangy-consent-widget.js'
import './widget/tangy-untimed-grid-widget.js'

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
    this.shadowRoot.addEventListener('copy-input', (event) => this.copyInput(event.target))
    this.shadowRoot.addEventListener('edit-input', (event) => this.editInput())
    this.shadowRoot.addEventListener('submit-input', (event) => this.submitInput())
    this.wrap(this.querySelector('template').innerHTML)
  }

  // Iterate through declared Editor Widgets and wrap them around their corresponding claimed elements.
  wrap(markup) {
    const template = document.createElement('template')
    template.innerHTML = markup

    // Wrap all nodes (1 level deep) with their corresponding widget elements.
    template.content.childNodes.forEach(childNode => {
      if (childNode.nodeName !== '#text') {
        let foundWidget = window.tangyFormEditorWidgets.widgets
          .find(widgetInfo => {
            widgetInfo.claimElement.indexOf(childNode.tagName.toLowerCase()) === 0
          })
        if (foundWidget) {
          const widgetEl = document.createElement(foundWidget.widgetName)
          widgetEl.setAttribute('widget', '')
          widgetEl.setAttribute('mode', this.print ? 'MODE_PRINT' : 'MODE_INFO')
          wrap(childNode, widgetEl)
        }
      }
    })

    // Wrap all unclaimed nodes with tangy-box.
    template.content.childNodes.forEach(node => {
      if(
        (node.hasAttribute && !node.hasAttribute('widget'))
        ||
        (node.nodeName === '#text' && !!node.wholeText.replace(/ /g, '').replace(/\s+/g,''))
      ) {
        const tangyEl = document.createElement('tangy-box')
        wrap(node, tangyEl)
        const widgetEl = document.createElement('tangy-box-widget')
        wrap(tangyEl, widgetEl)
      }
    })
    this.shadowRoot.innerHTML = `
      <style>
        #add-button {
          margin-top: 10px;
        }
        .tangy-action-buttons{
          color: var(--accent-text-color);
          background-color: var(--accent-color);
          font-size: 12px;
          font-weight: 500;
          height: 2rem;
        }
      </style>
      <paper-button id="add-button" class="tangy-action-buttons">
        <iron-icon icon="add"></iron-icon>
        Insert Here
      </paper-button>
      <sortable-list style="width: 100%">${template.innerHTML}</sortable-list>
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

  copyInput(el) {
    let clone = el.cloneNode()
    clone.innerHTML = el.innerHTML
    clone.children[0].setAttribute('name', 'widget_'+ UUID())
    el.after(clone)
    clone._onEditClick()
    setTimeout(_ => clone.scrollIntoView({ behavior: 'smooth', block: 'start', inline: "nearest" }), 50)
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

// TODO: Create a utilities class for this function? It is a duplicate from tangy-form-editor-reducer
function UUID(separator) {
  if (typeof separator === 'undefined') {
    separator = '';
  }
  var self = {};
  var lut = [];
  for (var i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
  }
  /**
   * Generates a UUID
   * @returns {string}
   */
  self.generate = function (separator) {
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + separator +
      lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + separator + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + separator +
      lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + separator + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
      lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
  };
  return self.generate(separator);
}

window.customElements.define('tangy-form-condensed-editor', TangyFormCondensedEditor);
