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
            <mwc-button icon="date_range" on-click="addThis"><span id="tangy-date-widget">Input - Date</span></mwc-button><br>
            <mwc-button icon="text_fields" on-click="addThis"><span id="tangy-text-widget">Input - Text</span></mwc-button><br>
            <mwc-button icon="timer" on-click="addThis"><span id="tangy-time-widget">Input - Time</span></mwc-button><br>
            <mwc-button icon="looks_one" on-click="addThis"><span id="tangy-number-widget">Input - Number</span></mwc-button>
            <mwc-button icon="looks_one" on-click="addThis"><span id="tangy-partial-date-widget">Partial Date</span></mwc-button>
          </div>
        </div>
        <div>
          <h4>Location</h4>
          <div class="element-list">
              <mwc-button icon="add_location" on-click="addThis"><span id="tangy-gps-widget">GPS</span></mwc-button><br>
              <mwc-button icon="location_city" on-click="addThis"><span id="tangy-location-widget">Location</span></mwc-button>
          </div>
        </div>
        <div>
          <h4>Lists</h4>
          <div class="element-list">
              <mwc-button icon="check_box" on-click="addThis"><span id="tangy-checkbox-widget">Checkbox</span></mwc-button><br>
              <mwc-button icon="check_box_outline_blank" on-click="addThis"><span id="tangy-checkboxes-widget">Checkbox Group</span></mwc-button><br>
              <mwc-button icon="arrow_drop_down_circle" on-click="addThis"><span id="tangy-select-widget">Dropdown (select)</span></mwc-button><br>
              <mwc-button icon="radio_button_unchecked" on-click="addThis"><span id="tangy-radio-buttons-widget">Radio Buttons</span></mwc-button><br>
          </div>
        </div>
        <div>
          <h4>Misc</h4>
          <div class="element-list">
            <mwc-button icon="image" on-click="addThis"><span id="tangy-image-widget">Image</span></mwc-button><br>
            <mwc-button icon="code" on-click="addThis"><span id="tangy-box-widget">HTML content container</span></mwc-button><br>
            <mwc-button icon="attach_money" on-click="addThis"><span id="tangy-template-widget">HTML template</span></mwc-button><br>
            <mwc-button icon="filter_center_focus" on-click="addThis"><span id="tangy-qr-widget">QR Code Scanner</span></mwc-button><br>
            <mwc-button icon="question_answer" on-click="addThis"><span id="tangy-eftouch-widget">EF Touch</span></mwc-button><br>
            <mwc-button icon="speaker" on-click="addThis"><span id="tangy-acasi-widget">Acasi</span></mwc-button><br>
            <mwc-button icon="av_timer"on-click="addThis"><span id="tangy-timed-widget" >Timed Grid</span></mwc-button><br>
            <mwc-button icon="grid_on"on-click="addThis"><span id="tangy-untimed-grid-widget" >Untimed Grid</span></mwc-button><br>
            <mwc-button icon="thumbs_up_down"on-click="addThis"><span id="tangy-consent-widget" >Consent</span></mwc-button><br>
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
