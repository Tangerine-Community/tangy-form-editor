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
          <li id="tangy-checkbox-widget" on-click="addThis">Checkbox</li>
          <li id="tangy-checkboxes-widget" on-click="addThis">Checkbox Group</li>
          <li id="tangy-select-widget" on-click="addThis">Dropdown (select)</li>
          <li id="tangy-eftouch-widget" on-click="addThis">EF Touch</li>
          <li id="tangy-gps-widget" on-click="addThis">GPS</li>
          <li id="tangy-box-widget" on-click="addThis">HTML content container</li>
          <li id="tangy-date-widget" on-click="addThis">Input - Date</li>
          <li id="tangy-text-widget" on-click="addThis">Input - Text</li>
          <li id="tangy-time-widget" on-click="addThis">Input - Time</li>
          <li id="tangy-number-widget" on-click="addThis">Input - Number</li>
          <li id="tangy-location-widget" on-click="addThis">Location</li>
          <li id="tangy-radio-buttons-widget" on-click="addThis">Radio Buttons</li>
          <li id="tangy-timed-widget" on-click="addThis">Timed Grid</li>
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
    setTimeout(() => {
        wrapperEl.scrollIntoView({ behavior: 'smooth', block: 'start', inline: "nearest"})
      }, 100
    )

    this.remove()
  }

}

window.customElements.define('tangy-form-editor-add-input', TangyFormEditorAddInput);
