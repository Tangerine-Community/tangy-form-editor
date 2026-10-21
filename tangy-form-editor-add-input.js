import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import "@material/mwc-button"

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
            <mwc-button icon="text_fields" on-click="addThis" id="tangy-text-widget">Text</mwc-button><br>
            <mwc-button icon="looks_one" on-click="addThis" id="tangy-number-widget">Number</mwc-button><br>
            <mwc-button icon="email" on-click="addThis" id="tangy-email-widget">Email</mwc-button><br>
            <mwc-button icon="keyboard" on-click="addThis" id="tangy-keyboard-input-widget">On-screen keyboard</mwc-button><br>
          </div>
          <h4>Date/Time</h4>
          <div class="element-list">
            <mwc-button icon="event" on-click="addThis" id="tangy-date-widget">Date</mwc-button><br>
            <mwc-button icon="date_range" on-click="addThis" id="tangy-partial-date-widget">Partial Date</mwc-button><br>
            <mwc-button icon="date_range" on-click="addThis" id="tangy-ethio-date-widget">Ethiopian Date</mwc-button><br>
            <mwc-button icon="timer" on-click="addThis" id="tangy-time-widget">Time</mwc-button><br>
          </div>
          <h4>Location</h4>
          <div class="element-list">
              <mwc-button icon="add_location" on-click="addThis" id="tangy-gps-widget">GPS</mwc-button><br>
              <mwc-button icon="location_city" on-click="addThis" id="tangy-location-widget">Location</mwc-button>
          </div>
        </div>
        <div>
          <h4>Lists</h4>
          <div class="element-list">
            <mwc-button icon="check_box_outline_blank" on-click="addThis" id="tangy-checkboxes-widget">Checkbox Group</mwc-button><br>
            <mwc-button icon="radio_button_unchecked" on-click="addThis" id="tangy-radio-buttons-widget">Radio Buttons</mwc-button><br>
            <mwc-button icon="table_rows" on-click="addThis" id="tangy-radio-blocks-widget">Radio Blocks</mwc-button><br>
            <mwc-button icon="arrow_drop_down_circle" on-click="addThis" id="tangy-select-widget">Dropdown (select)</mwc-button><br>
          </div>
          <h4>Boolean</h4>
          <div class="element-list">
            <mwc-button icon="check_box" on-click="addThis" id="tangy-checkbox-widget">Checkbox</mwc-button><br>
            <mwc-button icon="toggle_on" on-click="addThis" id="tangy-toggle-widget">Toggle Button</mwc-button><br>
          </div>
        </div>
        <div>
          <h4>Media</h4>
          <div class="element-list">
            <mwc-button icon="image" on-click="addThis" id="tangy-image-widget">Image</mwc-button><br>
            <mwc-button icon="photo" on-click="addThis" id="tangy-photo-capture-widget">Photo Capture</mwc-button><br>
            <mwc-button icon="videocam" on-click="addThis" id="tangy-video-capture-widget">Video Capture</mwc-button><br>
            <mwc-button icon="play_arrow" on-click="addThis" id="tangy-audio-playback-widget">Audio Playback</mwc-button><br>
            <mwc-button icon="settings_voice" on-click="addThis" id="tangy-audio-recording-widget">Audio Recording</mwc-button><br>
            <mwc-button icon="graphic_eq" on-click="addThis" id="tangy-audio-recording-nlp-widget">Audio Recording NLP</mwc-button><br>
          </div>
          <h4>Html Containers</h4>
          <div class="element-list">
            <mwc-button icon="code" on-click="addThis" id="tangy-box-widget">HTML content container</mwc-button><br>
            <mwc-button icon="attach_money" on-click="addThis" id="tangy-template-widget">HTML template</mwc-button><br>
            <mwc-button icon="repeat" on-click="addThis" id="tangy-input-groups-widget">Repeatable HTML Group</mwc-button><br>
          </div>
        </div>
        <div>
          <h4>Specialty</h4>
          <div class="element-list" id="specialty-list">
            <mwc-button icon="brush" on-click="addThis" id="tangy-signature-widget">Signature</mwc-button><br>
            <mwc-button icon="thumbs_up_down"on-click="addThis" id="tangy-consent-widget" >Consent</mwc-button><br>
            <mwc-button icon="filter_center_focus" on-click="addThis" id="tangy-qr-widget">QR Code Scanner</mwc-button><br>
            <mwc-button icon="question_answer" on-click="addThis" id="tangy-eftouch-widget">EF Touch</mwc-button><br>
            <mwc-button icon="speaker" on-click="addThis" id="tangy-acasi-widget">Acasi</mwc-button><br>
            <mwc-button icon="av_timer"on-click="addThis" id="tangy-timed-widget" >Timed Grid</mwc-button><br>
            <mwc-button icon="grid_on"on-click="addThis" id="tangy-untimed-grid-widget" >Untimed Grid</mwc-button><br>
            <mwc-button icon="fence" on-click="addThis" id="tangy-gate-widget" >Conditional Gate</mwc-button><br>
            <mwc-button icon="auto_read_play" on-click="addThis" id="tangy-prompt-box-widget">Prompt Box</mwc-button><br>
          </div>
        </div>
      </div>

      </paper-card>
    `;
  }

  connectedCallback() {
    super.connectedCallback()
    this.addRegisteredWidgetButtons()
  }

  /**
   * Add a button for every registered widget that offered a label, so an input type can come from
   * outside this package.
   *
   * The markup above lists the core types and keeps doing so — a widget only appears here if its
   * `define()` call passed `{label}`, which the 31 core registrations do not. That is what lets a
   * group's `alternative-scripts.js`, loaded after the editor's own bundle, contribute an input
   * type: the registry is already populated by then, and this element is built fresh on each "+"
   * click rather than once at startup.
   *
   * Anything added lands under Specialty. A widget already named in the markup is skipped, so a
   * core type that later starts passing a label is not listed twice.
   */
  addRegisteredWidgetButtons() {
    const list = this.shadowRoot.getElementById('specialty-list')
    const registry = window.tangyFormEditorWidgets
    if (!list || !registry) return
    for (const widget of registry.widgets) {
      if (!widget.label) continue
      if (this.shadowRoot.getElementById(widget.widgetName)) continue
      const button = document.createElement('mwc-button')
      // `addThis` reads `event.target.id`; a click inside mwc-button's shadow root retargets to the
      // button itself, which is what the annotated `on-click` handlers above already rely on.
      button.id = widget.widgetName
      button.setAttribute('icon', widget.icon || 'extension')
      button.textContent = widget.label
      button.addEventListener('click', (event) => this.addThis(event))
      list.appendChild(button)
      list.appendChild(document.createElement('br'))
    }
  }

  addThis(event) {
    // @TODO use window.tangyFormWEditorWidgets
    //const widgetElInfo = window.tangyFormEditorWidgets.widgets.find(widgetInfo => widgetInfo.claimElement === event.target.id)
    const wrapperEl = document.createElement(event.target.id)
    wrapperEl.setAttribute('mode', 'MODE_EDIT')
    wrapperEl.setAttribute('files-endpoint', this.getAttribute('files-endpoint'))

    if (event.target.id == 'tangy-location-widget') {
      const locationListsMetadata = this.getAttribute('location-lists-metadata')
      if (locationListsMetadata) {
        wrapperEl.setAttribute("location-lists-metadata", locationListsMetadata);
      }
    }
    
    if (this.hasAttribute('hide-skip-if')) wrapperEl.setAttribute('hide-skip-if', '')
    if (this.hasAttribute('hide-show-if')) wrapperEl.setAttribute('hide-show-if', '')
    this.after(wrapperEl)
    setTimeout(() => {
        wrapperEl.scrollIntoView({ behavior: 'smooth', block: 'start', inline: "nearest"})
      }, 100
    )

    this.remove()
  }

}

window.customElements.define('tangy-form-editor-add-input', TangyFormEditorAddInput);
