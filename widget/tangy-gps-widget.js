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
      name: '',
      hintText: '',
      required: false,
      disabled: false,
      hidden: false,
      tangyIf: '',
      validIf: ''
    };
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyGPS.props thus won't get picked up by TangyGPS.getProps().
    return {
      ...config,
      ...element.getProps(),
      ...{
        tangyIf: element.hasAttribute('tangy-if')
          ? element.getattribute('tangy-if').replace(/&quot;/g, '"')
          : '',
        validIf: element.hasAttribute('valid-if')
          ? element.getattribute('valid-if').replace(/&quot;/g, '"')
          : ''
      }
    };
  }

  downcast(config) {
    return `
      <tangy-gps 
        name="${config.name}"
        hint-text="${config.hintText}"
        ${config.tangyIf === "" ? "" : `tangy-if="${config.tangyIf.replace(/"/g, '&quot;')}"`}
        ${config.validIf === "" ? "" : `valid-if="${config.validIf.replace(/"/g, '&quot;')}"`}
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
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
    return `<div class="element-header"><div><mwc-icon>add_location</mwc-icon></div><div id="element-name">${
      config.name
    }</div></div>
    ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `<h2>Add GPS Element</h2>
    <tangy-form id="tangy-gps">
      <tangy-form-item>
        <tangy-input
          name="name"
          valid-if="input.value.match(/^[a-zA-Z].{1,}[a-zA-Z0-9\-_]$/)"
          inner-label="Variable name"
          hint-text="Enter the variable name that you would like displayed on all data outputs. Valid variable names start with a letter (a-z) with proceeding characters consisting of letters (a-z), underscore (_), dash (-), and numbers (0-9)."
          value="${
            config.name
          }"
          required>
        </tangy-input>
        <tangy-input name="hintText"
          inner-label="Hint Text"
          value="${
            config.hintText
          }">
        </tangy-input>
        <tangy-input
          name="tangy_if"
          inner-label="Show if"
          hint-text="Enter any conditional display logic. (e.g. getValue('isEmployee') === true)"
          value="${config.tangyIf.replace(/"/g, '&quot;')}">
        </tangy-input>
        <tangy-input
          name="valid_if"
          inner-label="Valid if"
          hint-text="Enter any conditional validation logic. (e.g. input.value.length > 5)"
          value="${config.validIf.replace(/"/g, '&quot;')}">
        </tangy-input>
        <tangy-checkbox name="required" ${
          config.required ? 'value="on"' : ''
        }>Required</tangy-checkbox>
        <tangy-checkbox name="disabled" ${
          config.disabled ? 'value="on"' : ''
        }>Disabled</tangy-checkbox>
        <tangy-checkbox name="hidden" ${
          config.hidden ? 'value="on"' : ''
        }>Hidden</tangy-checkbox>
      </tangy-form-item>
    </tangy-form>
    `;
  }

  onSubmit(config, formEl) {
    return {
      ...config,
      name: formEl.response.items[0].inputs.find(input => input.name === 'name')
        .value,
      required:
        formEl.response.items[0].inputs.find(input => input.name === 'required')
          .value === 'on'
          ? true
          : false,
      hintText: formEl.values.hintText,
      hidden:
        formEl.response.items[0].inputs.find(input => input.name === 'hidden')
          .value === 'on'
          ? true
          : false,
      disabled:
        formEl.response.items[0].inputs.find(input => input.name === 'disabled')
          .value === 'on'
          ? true
          : false,
      tangyIf: formEl.response.items[0].inputs.find(
        input => input.name === 'tangy_if'
      ).value,
      validIf: formEl.response.items[0].inputs.find(
        input => input.name === 'valid_if'
      ).value
    };
  }
}

window.customElements.define('tangy-gps-widget', TangyGpsWidget);
window.tangyFormEditorWidgets.define(
  'tangy-gps-widget',
  'tangy-gps',
  TangyGpsWidget
);
