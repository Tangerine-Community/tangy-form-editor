import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-textarea.js';
import 'tangy-form/tangy-form.js';
import 'tangy-form/input/tangy-untimed-grid.js';
import 'tangy-form/input/tangy-input.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangyUntimedGridWidget extends TangyBaseWidget {
  get claimElement() {
    return 'tangy-untimed-grid';
  }

  get defaultConfig() {
    return {
      name: '',
      hintText: '',
      columns: 4,
      options: [],
      required: false,
      disabled: false,
      hidden: false,
      rowMarkers: false,
      tangyIf: '',
      validIf: ''
    };
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyTimed.props thus won't get picked up by TangyTimed.getProps().
    return {
      ...config,
      ...element.getProps(),
      options: [...element.querySelectorAll('option')].map(option => {
        return {
          value: option.getAttribute('value'),
          label: option.innerHTML
        };
      }),
      tangyIf: element.hasAttribute('tangy-if')
        ? element.getAttribute('tangy-if').replace(/&quot;/g, '"')
        : '',
      validIf: element.hasAttribute('valid-if')
        ? element.getAttribute('valid-if').replace(/&quot;/g, '"')
        : ''
    };
  }

  downcast(config) {
    return `
      <tangy-untimed-grid
        name="${config.name}"
        hint-text="${config.hintText}"
        columns="${config.columns}"
        ${config.rowMarkers ? 'row-markers' : ''}
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
        ${config.tangyIf === "" ? "" : `tangy-if="${config.tangyIf.replace(/"/g, '&quot;')}"`}
        ${config.validIf === "" ? "" : `valid-if="${config.validIf.replace(/"/g, '&quot;')}"`}
      >
      ${config.options
        .map(
          option => `
        <option value="${option.value}">${option.label}</option>
      `
        )
        .join('')}
      </tangy-untimed-grid>
    `;
  }
  renderPrint(config) {
    let str = '';
    config.options.map(option => {
      str += `${option.label}, `;
    });
    const gridValues = str.substring(0, str.length - 1);
    return `
   
    <table>
    <tr><td><strong>Variable Name:</strong></td><td>${config.name}</td></tr>
    <tr><td><strong>Hint:</strong></td><td>${config.hintText}</td></tr>
    <tr><td><strong>Mode:</strong></td><td>${config.mode}</td></tr>
      <tr><td><strong>Columns:</strong></td><td>${config.columns}</td></tr>
      <tr><td><strong>Show Labels:</strong></td><td>${
        config.showLabels
      }</td></tr>
      <tr><td><strong>Required:</strong></td><td>${config.required}</td></tr>
      <tr><td><strong>Disabled:</strong></td><td>${config.disabled}</td></tr>
      <tr><td><strong>Hidden:</strong></td><td>${config.hidden}</td></tr>
      <tr><td><strong>Options:</strong></td><td><ul>${gridValues}</ul></td></tr>
    </table>
    <hr/>
    `;
  }

  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>av_timer</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `<h2>Add Timed Grid</h2>
    <tangy-form id="tangy-untimed-grid">
      <tangy-form-item id="tangy-untimed-grid">
        <template type="tangy-form-item">
          <tangy-input name="name" valid-if="input.value.match(/^[a-zA-Z].{1,}[a-zA-Z0-9\-_]$/)" 
            hint-text="Enter the variable name that you would like displayed on all data outputs. Valid variable names start with a letter (a-z) with proceeding characters consisting of letters (a-z), underscore (_), dash (-), and numbers (0-9)."
            inner-label="Variable name" value="${
              config.name
            }" required></tangy-input>
          <tangy-input name="columns" type="number" inner-label="Number of columns" value="${
            config.columns
          }"></tangy-input>
          <tangy-input name="hintText" inner-label="Hint Text" value="${
            config.hintText
          }"></tangy-input>
          <tangy-input name="tangy_if" inner-label="Show if" value="${config.tangyIf.replace(/"/g, '&quot;')}"></tangy-input>
          <tangy-input name="valid_if" inner-label="Valid if" value="${config.validIf.replace(/"/g, '&quot;')}"></tangy-input>
          <tangy-checkbox name="rowMarkers" ${
            config.rowMarkers ? 'value="on"' : ''
          }>Mark entire rows</tangy-checkbox>
          <tangy-checkbox name="required" ${
            config.required ? 'value="on"' : ''
          }>Required</tangy-checkbox>
          <tangy-checkbox name="disabled" ${
            config.disabled ? 'value="on"' : ''
          }>Disabled</tangy-checkbox>
          <tangy-checkbox name="hidden" ${
            config.hidden ? 'value="on"' : ''
          }>Hidden</tangy-checkbox>
          <tangy-input name="options"
            hint-text="Enter the options to be displayed for the grid separated by spaces."
            inner-label="Options (Each option separated by a space)" value="${config.options
            .map(option => `${option.label}`)
            .join(' ')}"></tangy-input>
        </template>
      </tangy-form-item>
    </tangy-form>
    `;
  }

  editResponse(config) {
    return {
      form: {
        complete: false
      },
      items: [
        {
          id: 'tangy-timed',
          inputs: [
            {
              name: 'name',
              value: config.name
            },
            {
              name: 'label',
              value: config.label
            }
          ]
        }
      ]
    };
  }

  onSubmit(config, formEl) {
    return {
      ...config,
      name: formEl.values.name,
      hintText: formEl.values.hintText,
      columns: formEl.values.columns,
      rowMarkers: formEl.values.rowMarkers === 'on' ? true : false,
      required: formEl.values.required === 'on' ? true : false,
      hidden: formEl.values.hidden === 'on' ? true : false,
      disabled: formEl.values.disabled === 'on' ? true : false,
      tangyIf: formEl.values.tangy_if,
      validIf: formEl.values.valid_if,
      options: formEl.values.options.split(' ').map((item, i) => {
        return { value: i, label: item };
      })
    };
  }
}

window.customElements.define('tangy-untimed-grid-widget', TangyUntimedGridWidget);
window.tangyFormEditorWidgets.define(
  'tangy-untimed-grid-widget',
  'tangy-untimed-grid',
  TangyUntimedGridWidget
);
