import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-button/paper-button.js";
import "tangy-form/input/tangy-location.js";
import "tangy-form/input/tangy-checkbox.js";
import { TangyBaseWidget } from "../tangy-base-widget.js";

class TangyLocationWidget extends TangyBaseWidget {

  get claimElement() {
    return "tangy-location";
  }

  get defaultConfig() {
    return {
      ...this.defaultConfigCoreAttributes(),
      ...this.defaultConfigQuestionAttributes(),
      ...this.defaultConfigConditionalAttributes(),
      ...this.defaultConfigValidationAttributes(),
      ...this.defaultConfigAdvancedAttributes(),
      ...this.defaultConfigUnimplementedAttributes(),
      showMetaData: false,
      metaDataTemplate: "",
      filterByGlobal: false,
      showLevels: "",
      locationSrc: ""
    };
  }

  upcast(config, element) {
    return {
      ...config,
      ...element.getProps(),
      ...this.upcastCoreAttributes(config, element),
      ...this.upcastQuestionAttributes(config, element),
      ...this.upcastConditionalAttributes(config, element),
      ...this.upcastValidationAttributes(config, element),
      ...this.upcastAdvancedAttributes(config, element),
      ...this.upcastUnimplementedAttributes(config, element),
      metaDataTemplate: element.innerHTML,
      locationListMetadata: element.locationListMetadata
    };
  }

  downcast(config) {
    return `
      <tangy-location 
        ${this.downcastCoreAttributes(config)}
        ${this.downcastQuestionAttributes(config)}
        ${this.downcastConditionalAttributes(config)}
        ${this.downcastValidationAttributes(config)}
        ${this.downcastAdvancedAttributes(config)}
        ${this.downcastUnimplementedAttributes(config)}
        show-levels="${config.showLevels}"
        ${config.filterByGlobal ? "filter-by-global" : ""}
        ${config.showMetaData ? "show-meta-data" : ""}
        location-src=${config.locationSrc}
      >
        ${config.metaDataTemplate}
      </tangy-location>
    `;
  }

  renderPrint(config) {
    return `
    <table>
      <tr><td><strong>Location Levels:</strong></td><td>${config.showLevels}</td></tr>
      <tr><td><strong>Variable Name:</strong></td><td>${config.name}</td></tr>
      <tr><td><strong>Label:</strong></td><td>${config.label}</td></tr>
      <tr><td><strong>Hint:</strong></td><td>${config.hintText}</td></tr>
      <tr><td><strong>Required:</strong></td><td>${config.required}</td></tr>
      <tr><td><strong>Disabled:</strong></td><td>${config.disabled}</td></tr>
      <tr><td><strong>Hidden:</strong></td><td>${config.hidden}</td></tr>
    </table>
    <hr/>
    `;
  }

  renderInfo(config) {
    const icon = (this.shadowRoot.querySelector(
      "#icon"
    ).innerHTML = `<span class="header-text"><mwc-icon>location_city</mwc-icon><span>`);
    const name = (this.shadowRoot.querySelector(
      "#name"
    ).innerHTML = `<span class="header-text">${config.name}</span>`);
    return `${icon} ${name} ${this.downcast(config)}`;
  }

  renderEdit(config) {
    const action = config.name ? "Edit" : "Add";
    return `
      <h2>${action} Location</h2>
      <tangy-form id="tangy-input">
        <tangy-form-item>
          <template>
            <paper-tabs selected="0">
                <paper-tab>Question</paper-tab>
                <paper-tab>Conditional Display</paper-tab>
                <paper-tab>Validation</paper-tab>
                <paper-tab>Advanced</paper-tab>
            </paper-tabs>
            <iron-pages selected="">
                <div>
                  ${this.renderEditCoreAttributes(config)}
                  ${this.renderEditQuestionAttributes(config)}
                  <div class="container">
                    <h3>Select the location list to use for this input</h3>
                    <div>Changing the list will clear the entry for Filter by Location</div>
                    <tangy-select class="location-src-select" name="location-src" value="${config.locationSrc}">
                      ${this.renderLocationListMetadataSelect()}
                    </tangy-select>
                  </div>
                  <div class="container">
                    <h3>Select the checkboxes below to limit the levels that will appear in the list</h3>
                    <div>If none are selected, all levels will appear in the list</div>
                    <tangy-checkboxes name="showLevels" value='${this.getShowLevelTangyCheckboxesValue()}'>
                      ${this.renderShowLevelsCheckboxes()}
                    </tangy-checkboxes>
                  </div>
                  <tangy-checkbox name="show-meta-data" ${
                    config.showMetaData ? 'value="on"' : ""
                  }>show meta-data</tangy-checkbox>
                  <tangy-input name="meta-data-template" label="Meta-data template" inner-label="enter metadata that will appear" value="${
                    config.metaDataTemplate
                  }"></tangy-input>
                  <tangy-checkbox name="filterByGlobal" ${
                    config.filterByGlobal ? 'value="on"' : ""
                  }>Filter by locations in the user profile?</tangy-checkbox>
                </div>
                <div>
                  ${this.renderEditConditionalAttributes(config)}
                </div>
                <div>
                  ${this.renderEditValidationAttributes(config)}
                </div>
                <div>
                  ${this.renderEditAdvancedAttributes(config)}
                </div>
            </iron-pages>
          </template>
        </tangy-form-item>
      </tangy-form>
    `;
  }

  afterRenderEdit() {
    this.shadowRoot
      .querySelector("#container")
      .querySelector("tangy-form")
      .querySelector("tangy-form-item")
      .querySelector("iron-pages")
      .querySelector("tangy-select.location-src-select")
      .addEventListener('change', this.onLocationSrcChange.bind(this));
  }

  renderLocationListMetadataSelect() {
    let options = ''
    let locationListMetadata = JSON.parse(this.getAttribute('location-list-metadata'))
    if (locationListMetadata) {
      for (let location of locationListMetadata) {
        options = `${options}
        <option value="${location.path}">${location.name}</option>`
      }
    }
    return options;
  }

  renderShowLevelsCheckboxes() {
    let options = ''
    let locationListMetadata = JSON.parse(this.getAttribute('location-list-metadata'))
    if (locationListMetadata) {
      const locationList = Object.values(locationListMetadata).find(l => l.path == this._config.locationSrc)
      for (let level of locationList.levels) {
          options = `${options}
          <option value="${level}">${level}</option>`
      }
    }
    return options;
  }

  onLocationSrcChange(event) {
    // If showLevels is set, we need to clear it when the locationSrc changes 
    // since the levels are probably not in the new locationSrc
    if (event.target.value != this._config.locationSrc) {
      this._config.locationSrc = event.target.value
      this._config.showLevels = ''

      // Should this be done another way?
      this._render();
    }
  }

  // converts a comma separated string of values into a tangy-checkboxes value
  getShowLevelTangyCheckboxesValue() {
    let values = []

    if (this._config.showLevels) {
      let selectedLevels = this._config.showLevels.split(',')
      let locationListMetadata = JSON.parse(this.getAttribute('location-list-metadata'))
      if (locationListMetadata) {
        const locationList = Object.values(locationListMetadata).find(l => l.path == this._config.locationSrc)
        for (let level of locationList.levels) {
          values.push(
            {
              "name": level,
              "value": selectedLevels.includes(level) ? "on" : ""
            }
          )
        }
      }
    }

    return JSON.stringify(values)
  }

  // converts a tangy-checkboxes value into a comma separated string of values
  getShowLevelValueString(formEl) {
    let values = []
    let input = formEl.response.items[0].inputs.find(
      (input) => input.name === "showLevels")
    if (input) {
      for (let v of input.value) {
        if (v.value == 'on') {
          values.push(v.name)
        }
      }
    }
    return values.join(',')
  }

  onSubmit(config, formEl) {
    return {
      ...config,
      ...this.onSubmitCoreAttributes(config, formEl),
      ...this.onSubmitQuestionAttributes(config, formEl),
      ...this.onSubmitConditionalAttributes(config, formEl),
      ...this.onSubmitValidationAttributes(config, formEl),
      ...this.onSubmitAdvancedAttributes(config, formEl),
      ...this.onSubmitUnimplementedAttributes(config, formEl),
      locationSrc: 
        formEl.response.items[0].inputs.find(
          (input) => input.name === "location-src"
        ).value,
      filterByGlobal:
        formEl.response.items[0].inputs.find(
          (input) => input.name === "filterByGlobal"
        ).value === "on"
          ? true
          : false,
      showLevels: this.getShowLevelValueString(formEl),
      showMetaData:
        formEl.response.items[0].inputs.find(
          (input) => input.name === "show-meta-data"
        ).value === "on"
          ? true
          : false,
      metaDataTemplate: formEl.response.items[0].inputs.find(
        (input) => input.name === "meta-data-template"
      ).value,
    };
  }
}

window.customElements.define("tangy-location-widget", TangyLocationWidget);
window.tangyFormEditorWidgets.define(
  "tangy-location-widget",
  "tangy-location",
  TangyLocationWidget
);
