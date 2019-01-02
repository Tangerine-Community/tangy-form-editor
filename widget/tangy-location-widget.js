import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/input/tangy-select.js'
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
      filterByGlobal: false,
      showLevels: ''
    }
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyLocation.props thus won't get picked up by TangyLocation.getProps().
    return {...config, ...element.getProps(), ...{
      tangyIf: element.hasAttribute('tangy-if')
        ? element.getAttribute('tangy-if')
        : ''
    }}
  }

  downcast(config) {
    return `
      <tangy-location 
        name="${config.name}"
        tangy-if="${config.tangyIf}"
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
        ${config.filterByGlobal ? 'required' : ''}
        showLevels="${config.showLevels}"
      ></tangy-location>
    `
  }
  
  renderInfo(config) {
    return `<strong>Variable name: ${config.name}, Type: Location</strong> <br/>
    ${this.downcast(config)}`
  }

  renderEdit(config) {
    // Will fail in tests if you don't test for tangy-form-editor element
    if (document.querySelector('tangy-form-editor')) {
      // disable dragging
      document.querySelector('tangy-form-editor')
        .querySelector('tangy-form-item-editor')
        .shadowRoot.querySelector('#container')
        .querySelector('paper-card')
        .querySelector('tangy-form-condensed-editor')
        .shadowRoot.querySelector('sortable-list')
        .disabled=true
    }
    return `<h2>Add Location Element</h2>
    <tangy-form id="tangy-location">
      <tangy-form-item>
        <tangy-input name="name" label="Variable name" value="${config.name}" required></tangy-input>
        <tangy-checkbox name="filterByGlobal" ${config.filterByGlobal ? 'value="on"' : ''}>Filter by locations in the user profile?</tangy-checkbox>
        <tangy-input name="showLevels" label="Show levels (ex. county,subcounty)" value="${config.tangyIf}"></tangy-input>
        <tangy-input name="tangy_if" label="Show if" value="${config.tangyIf}"></tangy-input>
        <tangy-checkbox name="required" ${config.required ? 'value="on"' : ''}>Required</tangy-checkbox>
        <tangy-checkbox name="disabled" ${config.disabled ? 'value="on"' : ''}>Disabled</tangy-checkbox>
        <tangy-checkbox name="hidden" ${config.hidden ? 'value="on"' : ''}>Hidden</tangy-checkbox>
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
      showLevels: formEl.response.items[0].inputs.find(input => input.name === 'showLevels').value
    }
  }

}

window.customElements.define('tangy-location-widget', TangyLocationWidget);
window.tangyFormEditorWidgets.define('tangy-location-widget', 'tangy-location', TangyLocationWidget);
