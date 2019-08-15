import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import 'tangy-form/tangy-form.js';
import 'tangy-form/input/tangy-eftouch.js';
import 'tangy-form/input/tangy-input.js';
import './tangy-eftouch-widget-layout.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangyEftouchWidget extends TangyBaseWidget {
  get claimElement() {
    return 'tangy-eftouch';
  }

  get defaultConfig() {
    return {
      name: '',
      label: '',
      optionsMarkup: '',
      openSound: '',
      inputSound: '',
      transitionSound: '',
      transitionDelay: '',
      transitionMessage: '',
      warningMessage: '',
      warningTime: '',
      timeLimit: '',
      tangyIf: '',
      validIf: '',
      autoProgress: false,
      required: false,
      hidden: false,
      multiSelect: false,
      requiredCorrect: false,
      ifIncorrectThenHighlightCorrect: false,
      noCorrections: false
    };
  }

  upcast(config, element) {
    return {
      ...config,
      ...element.getProps(),
      ...{
        multiSelect: element.hasAttribute('multi-select'),
        requiredCorrect: element.hasAttribute('required-correct'),
        ifIncorrectThenHighlightCorrect: element.hasAttribute('if-incorrect-then-highlight-correct'),
        noCorrections: element.hasAttribute('no-corrections'),
        openSound: element.hasAttribute('open-sound') ? element.getAttribute('open-sound') : '',
        tangyIf: element.hasAttribute('tangy-if')
          ? element.getAttribute('tangy-if').replace(/&quot;/g, '"')
          : '',
        validIf: element.hasAttribute('valid-if')
          ? element.getAttribute('valid-if').replace(/&quot;/g, '"')
          : '',
        optionsMarkup: element.innerHTML
      }
    };
  }

  downcast(config) {
    return `
      <tangy-eftouch
        name="${config.name}"
        label="${config.label}"
        open-sound="${config.openSound}"
        input-sound="${config.inputSound}"
        transition-sound="${config.transitionSound}"
        transition-delay="${config.transitionDelay}"
        transition-message="${config.transitionMessage}"
        warning-message="${config.warningMessage}"
        warning-time="${config.warningTime}"
        time-limit="${config.timeLimit}"
        ${config.tangyIf === "" ? "" : `tangy-if="${config.tangyIf.replace(/"/g, '&quot;')}"`}
        ${config.validIf === "" ? "" : `valid-if="${config.validIf.replace(/"/g, '&quot;')}"`}
        ${config.autoProgress ? 'auto-progress' : ''}
        ${config.required ? 'required' : ''}
        ${config.hidden ? 'hidden' : ''}
        ${config.multiSelect ? 'multi-select' : ''}
        ${config.requiredCorrect ? 'required-correct' : ''}
        ${config.ifIncorrectThenHighlightCorrect ? 'if-incorrect-then-highlight-correct' : ''}
        ${config.noCorrections ? 'no-corrections' : ''}
      >
        ${config.optionsMarkup}
      </tangy-eftouch>
    `;
  }

  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>question_answer</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name} 
      <style>tangy-eftouch {position: static} </style> 
      ${this.downcast(config)}
    `;
  }

  renderEdit(config) {
    return `
    <tangy-form id="tangy-eftouch">
      <tangy-form-item id="tangy-eftouch">
        <template type="tangy-form-item">
        <style>
        label {
          margin: 15px 0px 5px 15px;
          display: block;
          width: 100%;
          color: #333;
          font-weight: heavy;
          font-size: 1.2em;
        }
        file-list-select {
          margin: 0px 0px 0px 10px;
        }
        </style>
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
          <tangy-input
            name="label"
            inner-label="Label"
            value="${
              config.label
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
            hint-text="Enter any conditional validation logic."
            value="${config.validIf.replace(/"/g, '&quot;')}">
          </tangy-input>
          <label for="open-sound">Open sound</label>
          <file-list-select name="open-sound" endpoint="${this.getAttribute('files-endpoint')}" value="${
            config.openSound ? config.openSound : ''
          }"></file-list-select>
          <label for="input-sound">Input sound</label>
          <file-list-select name="input-sound" endpoint="${this.getAttribute('files-endpoint')}" value="${
            config.inputSound ? config.inputSound : ''
          }"></file-list-select>
          <label for="transition-sound">Transition sounds</label>
          <file-list-select name="transition-sound" endpoint="${this.getAttribute('files-endpoint')}" value="${
            config.transitionSound ? config.transitionSound : ''
          }"></file-list-select>
          <tangy-input name="transition-delay" inner-label="Transition delay" value="${
            config.transitionDelay
          }" type="number"></tangy-input>
          <tangy-input name="transition-message" inner-label="Transition message" value="${
            config.transitionMessage
          }"></tangy-input>
          <tangy-input name="warning-time" inner-label="Warning time" value="${
            config.warningTime
          }"></tangy-input>
          <tangy-input name="warning-message" inner-label="Warning message" value="${
            config.warningMessage
          }"></tangy-input>
          <tangy-input name="time-limit" inner-label="Time limit" value="${
            config.timeLimit
          }"></tangy-input>
          <tangy-checkbox name="auto-progress" ${
            config.autoProgress ? 'value="on"' : ''
          }>auto-progress</tangy-checkbox>
          <tangy-checkbox name="required" ${
            config.required ? 'value="on"' : ''
          }>Required</tangy-checkbox>
          <tangy-checkbox name="hidden" ${
            config.hidden ? 'value="on"' : ''
          }>Hidden</tangy-checkbox>
          <tangy-checkbox name="multi-select" ${
            config.multiSelect ? 'value="on"' : ''
          }>multi-select</tangy-checkbox>
          <tangy-checkbox name="required-correct" ${
            config.requiredCorrect ? 'value="on"' : ''
          }>Required correct</tangy-checkbox>
          <tangy-checkbox name="if-incorrect-then-highlight-correct" ${
            config.ifIncorrectThenHighlightCorrect ? 'value="on"' : ''
          }>If incorrect selection, then highlight correct answers.</tangy-checkbox>
          <tangy-checkbox name="no-corrections" ${
            config.noCorrections ? 'value="on"' : ''
          }>No corrections allowed</tangy-checkbox>
          <tangy-eftouch-widget-layout files-endpoint="${this.getAttribute('files-endpoint')}" name="options-markup">
            ${config.optionsMarkup}
          </tangy-eftouch-widget-layout>
        </template>
      </tangy-form-item>
    </tangy-form>
    `;
  }

  renderPrint(config) {
    return `
   
    <table>
    <tr><td><strong>Variable Name:</strong></td><td>${config.name}</td></tr>
    <tr><td><strong>Variable Label:</strong></td><td>${config.label}</td></tr>
    <tr><td><strong>Input Sound:</strong></td><td>${config.inputSound}</td></tr>
    <tr><td><strong>Transition Sound:</strong></td><td>${
      config.transitionSound
    }</td></tr>
      <tr><td><strong>Transition Delay:</strong></td><td>${
        config.transitionDelay
      }</td></tr>
      <tr><td><strong>Transition Message:</strong></td><td>${
        config.transitionMessage
      }</td></tr>
      <tr><td><strong>Warning Time:</strong></td><td>${
        config.warningTime
      }</td></tr>
      <tr><td><strong>Warning Message:</strong></td><td>${
        config.warningMessage
      }</td></tr>
      <tr><td><strong>Time Limit:</strong></td><td>${config.timeLimit}</td></tr>
      <tr><td><strong>Auto Progress:</strong></td><td>${
        config.autoProgress
      }</td></tr>
      <tr><td><strong>Required:</strong></td><td>${config.required}</td></tr>
      <tr><td><strong>Hidden:</strong></td><td>${config.hidden}</td></tr>
      <tr><td><strong>Options Markup:</strong></td><td><ul>${
        config.optionsMarkup
      }</ul></td></tr>
    </table>
    <hr/>
    `;
  }
  onSubmit(config, formEl) {
    return {
      ...config,
      name: formEl.values.name,
      label: formEl.values.label,
      inputSound: formEl.querySelector('tangy-form-item').querySelector('[name=input-sound]').value,
      transitionDelay: formEl.values['transition-delay'],
      transitionSound: formEl.querySelector('tangy-form-item').querySelector('[name=transition-sound]').value,
      transitionMessage: formEl.values['transition-message'],
      warningMessage: formEl.values['warning-message'],
      warningTime: formEl.values['warning-time'],
      timeLimit: formEl.values['time-limit'],
      autoProgress: formEl.values['auto-progress'] === 'on' ? true : false,
      required: formEl.values.required === 'on' ? true : false,
      hidden: formEl.values.hidden === 'on' ? true : false,
      openSound: formEl.querySelector('tangy-form-item').querySelector('[name=open-sound]').value,
      multiSelect: formEl.values['multi-select'] === 'on' ? true : false,
      requiredCorrect: formEl.values['required-correct'] === 'on' ? true : false,
      ifIncorrectThenHighlightCorrect: formEl.values['if-incorrect-then-highlight-correct'] === 'on' ? true : false,
      noCorrections: formEl.values['no-corrections'] === 'on' ? true : false,
      optionsMarkup: formEl.values['options-markup'],
      tangyIf: formEl.response.items[0].inputs.find(
        input => input.name === 'tangy_if'
      ).value,
      validIf: formEl.response.items[0].inputs.find(
        input => input.name === 'valid_if'
      ).value
    };
  }
}

window.customElements.define('tangy-eftouch-widget', TangyEftouchWidget);
window.tangyFormEditorWidgets.define(
  'tangy-eftouch-widget',
  'tangy-eftouch',
  TangyEftouchWidget
);
