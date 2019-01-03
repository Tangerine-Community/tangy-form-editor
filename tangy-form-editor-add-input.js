import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/sortable-list/sortable-list.js'
import {Button} from "@material/mwc-button"

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
          display: flex;
          padding: 15px;
          margin: 15px;
          width:100%;
          justify-content:space-between;
        }
      </style>
      <paper-card>
      <div>
      <h2>Inputs</h2>
        <mwc-button icon="date_range" id="tangy-date-widget" label="Input - Date" on-click="addThis"></mwc-button><br>
        <mwc-button icon="text_fields"  id="tangy-text-widget" on-click="addThis">Input - Text</mwc-button><br>
        <mwc-button icon="timer" id="tangy-time-widget" on-click="addThis">Input - Time</mwc-button><br>
        <mwc-button icon="looks_1" id="tangy-number-widget" on-click="addThis">Input - Number</mwc-button>
      </div>
      <div>
        <h2>Location</h2>
        <mwc-button icon="add_location" id="tangy-gps-widget" on-click="addThis">GPS</mwc-button><br>
        <mwc-button icon="location_city" id="tangy-location-widget" on-click="addThis">Location</mwc-button>
      </div>
      <div>
        <h2>Lists</h2>
        <mwc-button icon="check_box" id="tangy-checkbox-widget" on-click="addThis">Checkbox</mwc-button><br>
        <mwc-button icon="check_box_outline" id="tangy-checkboxes-widget" on-click="addThis">Checkbox Group</mwc-button><br>
        <mwc-button icon="arrow_drop_down" id="tangy-select-widget" on-click="addThis">Dropdown (select)</mwc-button>
      </div>
      <div>
        <h2>Misc</h2>
        <mwc-button icon="question_answer" id="tangy-eftouch-widget" on-click="addThis">EF Touch</mwc-button><br>
        <mwc-button icon="chevron_left" id="tangy-box-widget" on-click="addThis">HTML content container</mwc-button><br>
        <mwc-button icon="radio_button_unchecked" id="tangy-radio-buttons-widget" on-click="addThis">Radio Buttons</mwc-button><br>
        <mwc-button icon="av_timer" id="tangy-timed-widget" on-click="addThis">Timed Grid</mwc-button>
      </div>
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
