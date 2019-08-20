import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import 'tangy-form/input/tangy-select.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangyGpsWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-gps';
  }

  get defaultConfig() {
    return {
      ...this.defaultConfigCommonAttributes(),
      hintText: ''
    };
  }

  upcast(config, element) {
    return {
      ...this.upcastCommonAttributes(config, element),
      hintText: element.hasAttribute('hint-text') ? element.getAttribute('hint-text') : ''
    };
  }

  downcast(config) {
    return `
      <tangy-gps 
        ${this.downcastCommonAttributes(config)}
        hint-text="${config.hintText}"
      ></tangy-gps>
    `;
  }
  renderPrint(config) {
    return `
    <table>
      <tr><td><strong>Variable Name:</strong></td><td>${config.name}</td></tr>
      <tr><td><strong>Hint:</strong></td><td>${config.hintText}</td></tr>
      <tr><td><strong>Hide Accuracy Distance:</strong></td><td>${
        config.hideAccuracyDistance
      }</td></tr>
      <tr><td><strong>Hide Accuracy Level:</strong></td><td>${
        config.hideAccuracyLevel
      }</td></tr>
      <tr><td><strong>Hide Coordinates:</strong></td><td>${
        config.hideCoordinates
      }</td></tr>
      <tr><td><strong>Reference Latitude:</strong></td><td>${
        config.referenceLatitude
      }</td></tr>
      <tr><td><strong>Reference Longitude:</strong></td><td>${
        config.referenceLongitude
      }</td></tr>
      <tr><td><strong>In Geofence:</strong></td><td>${
        config.inGeofence
      }</td></tr>
      <tr><td><strong>Valid Max Delta:</strong></td><td>${
        config.validMaxDelta
      }</td></tr>
      <tr><td><strong>Required:</strong></td><td>${config.required}</td></tr>
      <tr><td><strong>Disabled:</strong></td><td>${config.disabled}</td></tr>
      <tr><td><strong>Hidden:</strong></td><td>${config.hidden}</td></tr>
    </table>
    <hr/>
    `;
  }

  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>add_location</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `
      <tangy-form id="tangy-gps">
        <tangy-form-item>
          ${this.renderEditCommonAttributes(config)}
          <tangy-input name="hintText"
            inner-label="Hint Text"
            value="${
              config.hintText
            }">
          </tangy-input>
        </tangy-form-item>
      </tangy-form>
    `
  }

  onSubmit(config, formEl) {
    return {
      ...this.onSubmitCommonAttributes(config, formEl),
      hintText: formEl.values.hintText
    }
  }
}

window.customElements.define('tangy-gps-widget', TangyGpsWidget);
window.tangyFormEditorWidgets.define(
  'tangy-gps-widget',
  'tangy-gps',
  TangyGpsWidget
);
