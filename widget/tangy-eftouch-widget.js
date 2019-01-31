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
      inputSound: '',
      transitionSound: '',
      transitionDelay: '',
      transitionMessage: '',
      warningMessage: '',
      warningTime: '',
      timeLimit: '',
      autoProgress: false,
      required: false,
      disabled: false,
      hidden: false
    };
  }

  upcast(config, element) {
    return {
      ...config,
      ...element.getProps(),
      optionsMarkup: element.innerHTML
    };
  }

  downcast(config) {
    return `
      <tangy-eftouch
        name="${config.name}"
        label="${config.label}"
        input-sound="${config.inputSound}"
        transition-sound="${config.transitionSound}"
        transition-delay="${config.transitionDelay}"
        transition-message="${config.transitionMessage}"
        warning-message="${config.warningMessage}"
        warning-time="${config.warningTime}"
        time-limit="${config.timeLimit}"
        ${config.autoProgress ? 'auto-progress' : ''}
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
      >
        ${config.optionsMarkup}
      </tangy-eftouch>
    `;
  }

  renderInfo(config) {
    return `<div class="element-header"><div><mwc-icon>question_answer</mwc-icon></div><div id="element-name">${
      config.name
    }</div></div>
    ${this.downcast(config)}`;
  }

  renderEdit(config) {
    return `<h2>Add EFTouch element</h2>
    <tangy-form id="tangy-eftouch">
      <tangy-form-item id="tangy-eftouch">
        <template type="tangy-form-item">
          <tangy-input name="name" label="Variable name" value="${
            config.name
          }" required></tangy-input>
          <tangy-input name="label" label="Label" value="${
            config.label
          }"></tangy-input>
          <tangy-input name="input-sound" label="Input sound" value="${
            config.inputSound
          }"></tangy-input>
          <tangy-input name="transition-sound" label="Transition sound" value="${
            config.transitionSound
          }"></tangy-input>
          <tangy-input name="transition-delay" label="Transition delay" value="${
            config.transitionDelay
          }" type="number"></tangy-input>
          <tangy-input name="transition-message" label="Transition message" value="${
            config.transitionMessage
          }"></tangy-input>
          <tangy-input name="warning-time" label="Warning time" value="${
            config.warningTime
          }"></tangy-input>
          <tangy-input name="warning-message" label="Warning message" value="${
            config.warningMessage
          }"></tangy-input>
          <tangy-input name="time-limit" label="Time limit" value="${
            config.timeLimit
          }"></tangy-input>
          <tangy-checkbox name="auto-progress" ${
            config.autoProgress ? 'value="on"' : ''
          }>auto-progress</tangy-checkbox>
          <tangy-checkbox name="required" ${
            config.required ? 'value="on"' : ''
          }>Required</tangy-checkbox>
          <tangy-checkbox name="disabled" ${
            config.disabled ? 'value="on"' : ''
          }>Disabled</tangy-checkbox>
          <tangy-checkbox name="hidden" ${
            config.hidden ? 'value="on"' : ''
          }>Hidden</tangy-checkbox>
          <tangy-eftouch-widget-layout name="options-markup">
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
    <tr><td><strong>Hint:</strong></td><td>${config.hint}</td></tr>
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
      <tr><td><strong>Disabled:</strong></td><td>${config.disabled}</td></tr>
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
      inputSound: formEl.values['input-sound'],
      transitionDelay: formEl.values['transition-delay'],
      transitionSound: formEl.values['transition-sound'],
      transitionMessage: formEl.values['transition-message'],
      warningMessage: formEl.values['warning-message'],
      warningTime: formEl.values['warning-time'],
      timeLimit: formEl.values['time-limit'],
      autoProgress: formEl.values['auto-progress'] === 'on' ? true : false,
      required: formEl.values.required === 'on' ? true : false,
      hidden: formEl.values.hidden === 'on' ? true : false,
      disabled: formEl.values.disabled === 'on' ? true : false,
      optionsMarkup: formEl.values['options-markup']
    };
  }
}

window.customElements.define('tangy-eftouch-widget', TangyEftouchWidget);
window.tangyFormEditorWidgets.define(
  'tangy-eftouch-widget',
  'tangy-eftouch',
  TangyEftouchWidget
);
