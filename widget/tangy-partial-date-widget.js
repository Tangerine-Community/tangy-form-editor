import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import 'tangy-form/tangy-form.js';
import 'tangy-form/input/tangy-partial-date.js';
import 'tangy-form/input/tangy-input.js';
import { TangyBaseWidget } from '../tangy-base-widget.js';

class TangyPartialDateWidget extends TangyBaseWidget {
  get claimElement() {
    return 'tangy-partial-date';
  }

  get defaultConfig() {
    return {
      name: '',
      label: '',
      hintText: '',
      required: true,
      disabled: false,
      hidden: false,
      tangyIf: '',
      validIf: '',
      futureDateErrorText: '',
      missingDateErrorText: '',
      invalidDateErrorText: '',
      questionNumber: '',
      minYear: 2010,
      maxYear: 2019,
      disallowFutureDate: false,
      allowUnknownDay: false,
      allowUnknownMonth: false,
      allowUnknownYear: false,
      showTodayButton: true
    };
  }

  upcast(config, element) {
    // @TODO We have to do that final thing for tangyIf because it's not declared a prop in TangyInput.props thus won't get picked up by TangyInput.getProps().
    return {
      ...config,
      ...element.getProps(),
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
      <tangy-partial-date
        name="${config.name}"
        label="${config.label}"
        hint-text="${config.hintText}"
        future-date-error-text="${config.futureDateErrorText}"
        missing-date-error-text="${config.missingDateErrorText}"
        invalid-date-error-text="${config.invalidDateErrorText}"
        question-number="${config.questionNumber}"
        min-year="${config.minYear}"
        max-year="${config.maxYear}"
        ${config.tangyIf === "" ? "" : `tangy-if="${config.tangyIf.replace(/"/g, '&quot;')}"`}
        ${config.validIf === "" ? "" : `valid-if="${config.validIf.replace(/"/g, '&quot;')}"`}
        ${config.required ? 'required' : ''}
        ${config.disabled ? 'disabled' : ''}
        ${config.hidden ? 'hidden' : ''}
        ${config.showTodayButton ? 'show-today-button' : ''}
        ${config.allowUnknownDay ? 'allow-unknown-day' : ''}
        ${config.allowUnknownMonth ? 'allow-unknown-month' : ''}
        ${config.allowUnknownYear ? 'allow-unknown-year' : ''}
        ${config.disallowFutureDate ? 'disallow-future-date' : ''}
      >
      </tangy-partial-date>
    `;
  }
  renderPrint(config) {
    return `
    <table>
      <tr><td><strong>Question number:</strong></td><td>${config.questionNumber}</td></tr>
      <tr><td><strong>Prompt:</strong></td><td>${config.label}</td></tr>
      <tr><td><strong>Variable Name:</strong></td><td>${config.name}</td></tr>
      <tr><td><strong>Hint:</strong></td><td>${config.hintText}</td></tr>
      <tr><td><strong>Required:</strong></td><td>${config.required}</td></tr>
      <tr><td><strong>Disabled:</strong></td><td>${config.disabled}</td></tr>
      <tr><td><strong>Hidden:</strong></td><td>${config.hidden}</td></tr>
      <tr><td><strong>Show today button:</strong></td><td>${config.showTodayButton}</td></tr>
      <tr><td><strong>Allow unknown day:</strong></td><td>${config.allowUnknownDay}</td></tr>
      <tr><td><strong>Allow unknown month:</strong></td><td>${config.allowUnknownMonth}</td></tr>
      <tr><td><strong>Allow unknown year:</strong></td><td>${config.allowUnknownYear}</td></tr>
      <tr><td><strong>Disallow future date:</strong></td><td>${config.disallowFutureDate}</td></tr>
      <tr><td><strong>Invalid date error text:</strong></td><td>${config.invalidDateErrorText}</td></tr>
      <tr><td><strong>Missing date error text:</strong></td><td>${config.missingDateErrorText}</td></tr>
      <tr><td><strong>Future date error text:</strong></td><td>${config.futureDateErrorText}</td></tr>
      <tr><td><strong>Minimum year:</strong></td><td>${config.minYear}</td></tr>
      <tr><td><strong>Maximum year:</strong></td><td>${config.maxYear}</td></tr>\
    </table>
    <hr/>
    `;
  }
 
  renderInfo(config) {
    const icon = this.shadowRoot.querySelector('#icon').innerHTML=`<span class="header-text"><mwc-icon>looks_one</mwc-icon><span>`
    const name = this.shadowRoot.querySelector('#name').innerHTML=`<span class="header-text">${config.name}</span>`
    return `${icon} ${name}${config.options.length > 0 ? this.downcast(config) : ''}`;
  }

  renderEdit(config) {
    return `<h2>Add Partial Date</h2>
    <tangy-form id="tangy-partial-date">
      <tangy-form-item id="tangy-partial-date">
        <template type="tangy-form-item">

        <h3>General Settings</h3>
        
          <tangy-input
            name="name"
            valid-if="input.value.match(/^[a-zA-Z].{1,}[a-zA-Z0-9\-_]$/)"
            inner-label="Variable name"
            hint-text="Enter the variable name that you would like displayed on all data outputs. Valid variable names start with a letter (a-z) with proceeding characters consisting of letters (a-z), underscore (_), dash (-), and numbers (0-9)."
            value="${config.name}"
            required>
          </tangy-input>

          <tangy-input
            name="question-number"
            inner-label="Question number"
            hint-text="Enter the question number"
            value="${config.questionNumber}">
          </tangy-input>

          <tangy-input
            name="label"
            inner-label="Label"
            hint-text="Enter the Question or Statement Text"
            value="${config.label}">
          </tangy-input>

          <tangy-input
            name="hintText"
            inner-label="Hint text"
            hint-text="Enter hint text."
            value="${config.hintText}">
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

          <br>

          <h3>General Configuration</h3>

          <tangy-checkbox 
            name="required" 
            ${config.required ? 'value="on"' : ''}>
            Required
          </tangy-checkbox>

          <tangy-checkbox
            name="disabled"
            ${config.disabled ? 'value="on"' : ''}>
            Disabled
          </tangy-checkbox>

          <tangy-checkbox
            name="hidden" ${config.hidden ? 'value="on"' : ''}>
            Hidden
          </tangy-checkbox>

          <tangy-checkbox
            name="show-today-button"
            ${config.showTodayButton ? 'value="on"' : ''}>
            Show today button
          </tangy-checkbox>

          <br>

          <h3>Date Behavior</h3>
      
          <tangy-checkbox
            name="allow-unknown-day"
            ${config.allowUnknownDay ? 'value="on"' : ''}>
            Allow unknown day
          </tangy-checkbox>

          <tangy-checkbox
            name="allow-unknown-month"
            ${config.allowUnknownMonth ? 'value="on"' : ''}>
            Allow unknown month
          </tangy-checkbox>

          <tangy-checkbox
            name="allow-unknown-year" 
            ${config.allowUnknownYear ? 'value="on"' : ''}>
            Allow unknown year
          </tangy-checkbox>

          <tangy-checkbox
            name="disallow-future-date"
            ${config.disallowFutureDate ? 'value="on"' : ''}>
            Disallow future date
          </tangy-checkbox>

          <br>

          <h3>Error Messages</h3>

         <tangy-input
            name="missing-date-error-text"
            inner-label="Missing date error text"
            hint-text="Enter text to be displayed when the date is required but missing."
            value="${config.missingDateErrorText.replace(/"/g, '&quot;')}">
          </tangy-input>

          <tangy-input
            name="invalid-date-error-text"
            inner-label="Invalid date error text"
            hint-text="Enter text to be displayed when the date is invalid."
            value="${config.invalidDateErrorText.replace(/"/g, '&quot;')}">
          </tangy-input>

          <tangy-input
            name="future-date-error-text"
            inner-label="Future date error text"
            hint-text="Enter text to be displayed when the date is in the future."
            value="${config.futureDateErrorText.replace(/"/g, '&quot;')}">
          </tangy-input>
           
          <br>

          <h3>Validation</h3>

          <tangy-input
            name="min-year"
            inner-label="Minimum year"
            hint-text="Enter minimum year for the dropdowm list."
            value="${config.minYear}">
          </tangy-input>

          <tangy-input
            name="max-year"
            inner-label="Maximum year"
            hint-text="Enter maximum year for the dropdown list."
            value="${config.maxYear}">
          </tangy-input>

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
          id: 'tangy-partial-date',
          inputs: [
            {
              name: 'name',
              value: config.name
            },
            {
              name: 'label',
              value: config.label
            },
            {
              name: 'question-number',
              value: config.questionNumber
            },
            {
              name: 'hint-text',
              value: config.hintText
            },
            {
              name: 'required',
              value: config.required
            },
            {
              name: 'disabled',
              value: config.disabled
            },
            {
              name: 'hidden',
              value: config.hidden
            },
            {
              name: 'tangy-if',
              value: config.tangyIf
            },
            {
              name: 'valid-if',
              value: config.validIf
            },
            {
              name: 'allow-unknown-day',
              value: config.allowUnknownDay
            },
            {
              name: 'allow-unknown-month',
              value: config.allowUnknownMonth
            },
            {
              name: 'allow-unknown-year',
              value: config.allowUnknownYear
            },
            {
              name: 'disallow-future-date',
              value: config.disallowFutureDate
            },
            {
              name: 'show-today-button',
              value: config.showTodayButton
            },
            {
              name: 'missing-date-error-text',
              value: config.missingDateErrorText
            },
            {
              name: 'invalid-date-error-text',
              value: config.invalidDateErrorText
            },
            {
              name: 'future-date-error-text',
              value: config.futureDateErrorText
            },
            {
              name: 'min-year',
              value: config.minYear
            },
            {
              name: 'max-year',
              value: config.maxYear
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
      label: formEl.values.label,
      tangyIf: formEl.values.tangy_if,
      validIf: formEl.values.valid_if,
      required: formEl.values.required === 'on' ? true : false,
      hintText: formEl.values.hintText,
      hidden: formEl.values.hidden === 'on' ? true : false,
      disabled: formEl.values.disabled === 'on' ? true : false,
      disallowFutureDate: formEl.values.disallowFutureDate === 'on' ? true : false,
      allowUnknownDay: formEl.values.allowUnknownDay === 'on' ? true : false,
      allowUnknownMonth: formEl.values.allowUnknownMonth === 'on' ? true : false,
      allowUnknownYear: formEl.values.allowUnknownYear === 'on' ? true : false,
      showTodayButton: formEl.values.showTodayButton === 'on' ? true : false,
      minYear: formEl.values.minYear,
      maxYear: formEl.values.maxYear,
      questionNumber: formEl.values.questionNumber,
      futureDateErrorText: formEl.values.futureDateErrorText,
      missingDateErrorText: formEl.values.missingDateErrorText,
      invalidDateErrorText: formEl.values.invalidDateErrorText
    }
  }
}

window.customElements.define('tangy-partial-date-widget', TangyPartialDateWidget);
window.tangyFormEditorWidgets.define(
  'tangy-partial-date-widget',
  'tangy-partial-date',
  TangyPartialDateWidget
);
