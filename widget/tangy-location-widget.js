import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/input/tangy-location.js'
import 'tangy-form/input/tangy-checkbox.js'
import { TangyBaseWidget } from '../tangy-base-widget.js'

class TangyLocationWidget extends TangyBaseWidget {

  get claimElement() {
    return 'tangy-location'
  }

  get defaultConfig() {
    return {
      name: '',
      required: false,
      disabled: false,
      hidden: false,
      tangyIf: '',
      showMetaData: false,
      metaDataTemplate: '',
      filterByGlobal: false,
      showLevels: ''
    }
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyLocation.props thus won't get picked up by TangyLocation.getProps().
    return {...config, ...element.getProps(), ...{
      tangyIf: element.hasAttribute('tangy-if')
        ? element.getAttribute('tangy-if')
        : '',
      metaDataTemplate: element.innerHTML
    }}
  }

  downcast(config) {
    return `
      <tangy-location 
        name="${config.name}"
        ${config.tangyIf === "" ? "" : `tangy-if="${config.tangyIf}"`}
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
        ${config.filterByGlobal ? 'required' : ''}
        show-levels="${config.showLevels}"
        ${config.showMetaData ? 'show-meta-data' : ''}
      >
        ${config.metaDataTemplate}
      </tangy-location>
    `
  }
  
  renderInfo(config) {
    return `<div class="element-header"><div><mwc-icon>location_city</mwc-icon></div><div id="element-name">${config.name}</div></div>
    ${this.downcast(config)}`
  }

  renderEdit(config) {
    return `<h2>Add Location Element</h2>
    <tangy-form id="tangy-location">
      <tangy-form-item>
        <tangy-input name="name" label="Variable name" value="${config.name}" required></tangy-input>
        <tangy-checkbox name="filterByGlobal" ${config.filterByGlobal ? 'value="on"' : ''}>Filter by locations in the user profile?</tangy-checkbox>
        <tangy-input name="showLevels" label="Show levels (ex. county,subcounty)" value="${config.showLevels}"></tangy-input>
        <tangy-input name="tangy_if" label="Show if" value="${config.tangyIf}"></tangy-input>
        <tangy-checkbox name="required" ${config.required ? 'value="on"' : ''}>Required</tangy-checkbox>
        <tangy-checkbox name="disabled" ${config.disabled ? 'value="on"' : ''}>Disabled</tangy-checkbox>
        <tangy-checkbox name="hidden" ${config.hidden ? 'value="on"' : ''}>Hidden</tangy-checkbox>
        <tangy-checkbox name="show-meta-data" ${config.showMetaData ? 'value="on"' : ''}>show meta-data</tangy-checkbox>
        <tangy-input name="meta-data-template" label="Meta-data template" value="${config.metaDataTemplate}"></tangy-input>
      </tangy-form-item>
    </tangy-form>
    `
  }

  onSubmit(config, formEl) {
    return {
      ...config,
      name: formEl.response.items[0].inputs.find(input => input.name === 'name').value,
      required: formEl.response.items[0].inputs.find(input => input.name === 'required').value === 'on' ? true : false,
      hidden: formEl.response.items[0].inputs.find(input => input.name === 'hidden').value === 'on' ? true : false,
      disabled: formEl.response.items[0].inputs.find(input => input.name === 'disabled').value === 'on' ? true : false,
      tangyIf: formEl.response.items[0].inputs.find(input => input.name === 'tangy_if').value,
      filterByGlobal: formEl.response.items[0].inputs.find(input => input.name === 'filterByGlobal').value,
      showLevels: formEl.response.items[0].inputs.find(input => input.name === 'showLevels').value,
      showMetaData: formEl.response.items[0].inputs.find(input => input.name === 'show-meta-data').value === 'on' ? true : false,
      metaDataTemplate: formEl.response.items[0].inputs.find(input => input.name === 'meta-data-template').value,
    }
  }

}

window.customElements.define('tangy-location-widget', TangyLocationWidget);
window.tangyFormEditorWidgets.define('tangy-location-widget', 'tangy-location', TangyLocationWidget);
