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
          text-align:left;
        }
        paper-card {
          padding: 15px;
          margin-bottom: 15px;
          width:98%;
          background-color:lightgrey;
        }
        .element-list {
            text-align:left;
        }
        .add-elements-header {
          display: flex;
          justify-content:center;
          align-items: center;
        }
        #container {
          display: flex;
          width:100%;
          justify-content:space-between;
          background-color:lightgrey;
        }
        mwc-icon {
          vertical-align: center;
        }
        mwc-button span {
          text-decoration: underline;
        }

      </style>
      <paper-card>
      <div class="add-elements-header"><mwc-icon>note_add</mwc-icon><div>Add Elements</div></div>
      <div id="container">
        <div>
          <h4>Inputs</h4>
          <div class="element-list">
            <mwc-button icon="date_range" on-click="addThis" id="tangy-date-widget">Date</mwc-button><br>
            <mwc-button icon="calendar_today" on-click="addThis" id="tangy-partial-date-widget">Partial Date</mwc-button><br>
            <mwc-button icon="text_fields" on-click="addThis" id="tangy-text-widget">Text</mwc-button><br>
            <mwc-button icon="timer" on-click="addThis" id="tangy-time-widget">Time</mwc-button><br>
            <mwc-button icon="looks_one" on-click="addThis" id="tangy-number-widget">Number</mwc-button><br>
            <mwc-button icon="email" on-click="addThis" id="tangy-email-widget">Email</mwc-button><br>
          </div>
        </div>
        <div>
          <h4>Location</h4>
          <div class="element-list">
              <mwc-button icon="add_location" on-click="addThis" id="tangy-gps-widget">GPS</mwc-button><br>
              <mwc-button icon="location_city" on-click="addThis" id="tangy-location-widget">Location</mwc-button>
          </div>
        </div>
        <div>
          <h4>Lists</h4>
          <div class="element-list">
              <mwc-button icon="check_box" on-click="addThis" id="tangy-checkbox-widget">Checkbox</mwc-button><br>
              <mwc-button icon="check_box_outline_blank" on-click="addThis" id="tangy-checkboxes-widget">Checkbox Group</mwc-button><br>
              <mwc-button icon="arrow_drop_down_circle" on-click="addThis" id="tangy-select-widget">Dropdown (select)</mwc-button><br>
              <mwc-button icon="radio_button_unchecked" on-click="addThis" id="tangy-radio-buttons-widget">Radio Buttons</mwc-button><br>

              </div>
        </div>
        <div>
          <h4>Misc</h4>
          <div class="element-list">
            <mwc-button icon="image" on-click="addThis" id="tangy-image-widget">Image</mwc-button><br>
            <mwc-button icon="brush" on-click="addThis" id="tangy-signature-widget">Signature</mwc-button><br>
            <mwc-button icon="code" on-click="addThis" id="tangy-box-widget">HTML content container</mwc-button><br>
            <mwc-button icon="attach_money" on-click="addThis" id="tangy-template-widget">HTML template</mwc-button><br>
            <mwc-button icon="filter_center_focus" on-click="addThis" id="tangy-qr-widget">QR Code Scanner</mwc-button><br>
            <mwc-button icon="question_answer" on-click="addThis" id="tangy-eftouch-widget">EF Touch</mwc-button><br>
            <mwc-button icon="speaker" on-click="addThis" id="tangy-acasi-widget">Acasi</mwc-button><br>
            <mwc-button icon="av_timer"on-click="addThis" id="tangy-timed-widget" >Timed Grid</mwc-button><br>
            <mwc-button icon="grid_on"on-click="addThis" id="tangy-untimed-grid-widget" >Untimed Grid</mwc-button><br>
            <mwc-button icon="thumbs_up_down"on-click="addThis" id="tangy-consent-widget" >Consent</mwc-button><br>
          </div>
        </div>
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
    wrapperEl.setAttribute('mode', 'MODE_EDIT')
    wrapperEl.setAttribute('files-endpoint', this.getAttribute('files-endpoint'))
    this.after(wrapperEl)
    setTimeout(() => {
        wrapperEl.scrollIntoView({ behavior: 'smooth', block: 'start', inline: "nearest"})
      }, 100
    )

    this.remove()
  }

}

window.customElements.define('tangy-form-editor-add-input', TangyFormEditorAddInput);
