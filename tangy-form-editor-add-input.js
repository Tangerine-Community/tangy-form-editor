import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/sortable-list/sortable-list.js'

/**
 * `tangy-form-item-editor`
 * ...
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

class TangyFormEditorAddInput extends PolymerElement {

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          color: var(--primary-text-color);
          font-size: medium;
        }
        paper-card {
          padding: 15px;
          margin: 15px;
        }
      </style>
      <paper-card>
        <ul>
          <li id="tangy-text-widget" on-click="addThis">Text Input</li>
          <li id="tangy-number-widget" on-click="addThis">Number Input</li>
          <li id="tangy-eftouch-widget" on-click="addThis">EF Touch</li>
        </ul>
      </paper-card>
    `;
  }

  connectedCallback() {
    super.connectedCallback()
  }

  addThis(event) {
    // @TODO use window.tangyFormWEditorWidgets
    //const widgetElInfo = window.tangyFormEditorWidgets.widgets.find(widgetInfo => widgetInfo.claimElement === event.target.id)
    const wrapperEl = document.createElement(event.target.id)
    wrapperEl.setAttribute('edit', '')
    this.after(wrapperEl)
    wrapperEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    this.remove()
  }

}

window.customElements.define('tangy-form-editor-add-input', TangyFormEditorAddInput);
