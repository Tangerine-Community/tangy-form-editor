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
      ...this.defaultConfigCommonAttributes(),
      hintText: '',
      columns: 4,
      options: [],
      rowMarkers: false,
      optionFontSize: '',
      autoStop: ''
    };
  }

  upcast(config, element) {
    return {
      ...config,
      ...element.getProps(),
      options: [...element.querySelectorAll('option')].map(option => {
        return {
          value: option.getAttribute('value'),
          label: option.innerHTML
        };
      }),
      ...this.upcastCommonAttributes(config, element)
    };
  }

  downcast(config) {
    return `
      <tangy-untimed-grid
        ${this.downcastCommonAttributes(config)}
        hint-text="${config.hintText}"
        columns="${config.columns}"
        ${config.rowMarkers ? 'row-markers' : ''}
        ${config.optionFontSize ? `option-font-size="${config.optionFontSize}"` : ``}
        ${config.autoStop ? `auto-stop="${config.autoStop}"` : ``}

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
    <tr><td><strong>AutoStop:</strong></td><td>${config.autoStop}</td></tr>
    <tr><td><strong>Mode:</strong></td><td>${config.mode}</td></tr>
      <tr><td><strong>Columns:</strong></td><td>${config.columns}</td></tr>
      <tr><td><strong>Show Labels:</strong></td><td>${
        config.showLabels
      }</td></tr>
      <tr><td><strong>Required:</strong></td><td>${config.required}</td></tr>
      <tr><td><strong>Disabled:</strong></td><td>${config.disabled}</td></tr>
      <tr><td><strong>Hidden:</strong></td><td>${config.hidden}</td></tr>
      <tr><td><strong>Option Font Size:</strong></td><td>${config.optionFontSize}</td></tr>
      <tr><td><strong>Options:</strong></td><td><ul>${gridValues}</ul></td></tr>
    </table>
    <hr/>
    `;
  }

  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>grid_on</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `
    <tangy-form id="tangy-untimed-grid">
      <tangy-form-item id="tangy-untimed-grid">
        <template type="tangy-form-item">
          ${this.renderEditCommonAttributes(config)}
          <tangy-input name="columns" type="number" inner-label="Number of columns" value="${
            config.columns
          }"></tangy-input>
          <tangy-input name="hintText" inner-label="Hint Text" value="${
            config.hintText
          }"></tangy-input>
          <tangy-input name="autoStop" inner-label="Auto Stop" value="${
            config.autoStop ? config.autoStop : ''
          }"></tangy-input>
          <tangy-checkbox name="rowMarkers" ${
            config.rowMarkers ? 'value="on"' : ''
          }>Mark entire rows</tangy-checkbox>
         <tangy-input name="optionFontSize" hint-text="Enter the font size for the buttons on this grid (default is 0.7)." inner-label="Button font size (optional)" value="${
          config.optionFontSize
          }"></tangy-input>
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

  onSubmit(config, formEl) {
    return {
      ...config,
      ...this.onSubmitCommonAttributes(config, formEl),
      autoStop: formEl.values.autoStop,
      hintText: formEl.values.hintText,
      columns: formEl.values.columns,
      rowMarkers: formEl.values.rowMarkers === 'on' ? true : false,
      optionFontSize: formEl.values.optionFontSize,
      options: formEl.values.options.split(' ').map((item, i) => {
        return { value: i+1, label: item };
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
