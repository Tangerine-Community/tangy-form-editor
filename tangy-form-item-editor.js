import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import './tangy-widgets.js'
import './tangy-form-condensed-editor.js'


class TangyFormItemEditor extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        color: var(--primary-text-color);
        font-size: medium;
      }
      paper-icon-button.small {
        width: 30px;
        height: 30px;
      }
      .card-actions {
        display: flex;
        justify-content:flex-end;
        margin-top:3em;
        margin-right:6em;
        padding-bottom: 5em;
      }
      .card-actions div {
        background-color:gainsboro;
      }
      .card-actions paper-button {
        float:right;
        font-size: 20px;
      }
      paper-button {
        font-family: 'Roboto', 'Noto', sans-serif;
        font-weight: normal;
        font-size: 14px;
        -webkit-font-smoothing: antialiased;
      }
      paper-button.indigo {
        background-color: var(--paper-indigo-500);
        color: white;
        --paper-button-raised-keyboard-focus: {
          background-color: var(--paper-pink-a200) !important;
          color: white !important;
        };
      }
      paper-button.indigo:hover {
        background-color: var(--paper-indigo-400);
      }
      paper-button.green {
        background-color: var(--paper-green-500);
        color: white;
      }
      paper-button.green[active] {
        background-color: var(--paper-red-500);
      }
      .rightCategories {
        margin-left: 2em;
      }
      paper-toggle-button {
        padding-top: 10px;
      }
    </style>
    <div id="container"></div> 
    <slot></slot>

    `;
  }

  static get properties() {
    return {
      item: {
        type: Object,
        value: undefined,
        observer: 'render'
      },
      categories: {
        type: Array,
        value: false,
        reflectToAttribute: true
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    this.$.container.innerHTML = `
      <div style="text-align: center">
      <h2 style="text-align: left">Item Editor</h2>
        <div class="card-content">
          <paper-card style="text-align: left; margin: 0 auto; width:100%;" heading="Details">
          <div class="card-content">
            <paper-input id="itemTitle" value="${this.item.title}" label="title" always-float-label></paper-input>
            <p>Item id: ${this.item.id}</p>
            <p><paper-checkbox id="summary-checkbox" ${this.item.summary ? 'checked' : ''}>Show this item in the summary at the end</paper-checkbox></p>
            <p><paper-checkbox id="hide-back-button-checkbox" ${this.item.hideBackButton ? 'checked' : ''}>Hide the back button</paper-checkbox></p>
            <p><paper-checkbox id="right-to-left-checkbox" ${this.item.rightToLeft ? 'checked' : ''}>right-to-left orientation</paper-checkbox></p>
            <paper-expansion-panel header="on-open logic" id="on-open-editor"></paper-expansion-panel>
            <paper-expansion-panel header="on-change logic" id="on-change-editor"></paper-expansion-panel>
            ${this.categories ? '<paper-expansion-panel header="categories" id="categories-editor"></paper-expansion-panel>' : ''}
            </div>
          </paper-card>
          <!--<paper-card style="text-align: left; margin: 0 auto; width:100%;" heading="Elements">-->
            <tangy-form-condensed-editor>
              <template>
                ${this.item.template}
              </template>
            </tangy-form-condensed-editor>
          <!--</paper-card>-->
          </div>
        </div>
        <div class="card-actions">
          <div>
            <paper-button id="save">
              <iron-icon icon="icons:save"/></iron-icon> save 
            </paper-button>
            <paper-button id="cancel">
              <iron-icon icon="icons:cancel"/></iron-icon> cancel 
            </paper-button>
           </div>
        </div>
      
      <paper-card style="display: none; text-align: left; margin: 0 auto; width:100%;">
        <div class="card-content">
          ${this.item.template}
        </div>
      </paper-card>
      </div>
    `
    // on-open-editor
    let onOpenEditorEl = document.createElement('juicy-ace-editor')
    onOpenEditorEl.setAttribute('mode', 'ace/mode/javascript')
    onOpenEditorEl.value = this.item.onOpen 
    onOpenEditorEl.style.height = `${window.innerHeight*.6}px`
    onOpenEditorEl.addEventListener('change', _ => _.stopPropagation())
    this.shadowRoot.querySelector('#on-open-editor').appendChild(onOpenEditorEl)
    // on-change-editor
    let onChangeEditorEl = document.createElement('juicy-ace-editor')
    onChangeEditorEl.setAttribute('mode', 'ace/mode/javascript')
    onChangeEditorEl.value = this.item.onChange 
    onChangeEditorEl.style.height = `${window.innerHeight*.6}px`
    onChangeEditorEl.addEventListener('change', _ => _.stopPropagation())
    this.shadowRoot.querySelector('#on-change-editor').appendChild(onChangeEditorEl)
    // categories
    if (this.categories !== null && this.categories.length > 0) {
      let select_str = "<div class='rightCategories'>Select a category: <select id='category'>\n"
      select_str += '<option value="">Select one</option>\n';
      let categoryValue = this.item.category;
      if (typeof categoryValue !== 'undefined' && categoryValue !== null) {
        categoryValue = categoryValue.trim();
      }
      this.categories.forEach(category => {
        if (typeof categoryValue !== 'undefined' && categoryValue === category) {
          select_str += '<option value="' + category + '" selected>' + category + '</option>\n';
        } else {
          select_str += '<option value="' + category + '">' + category + '</option>\n';
        }
      })
      select_str += "</select></div>\n"
      let template = document.createElement('template');
      template.innerHTML = select_str;
      let categoriesEditor = this.shadowRoot.querySelector('#categories-editor');
      categoriesEditor.innerHTML = select_str
    }

    // Form contents editor.
    this.$.container.querySelector('#cancel').addEventListener('click', this.onCancelClick.bind(this))
    this.$.container.querySelector('#save').addEventListener('click', this.onSaveClick.bind(this))
  }

  getTemplateFromWysiwyg() {
    let wysiwygTemplateEl = document.createElement('div') 
    wysiwygTemplateEl.innerHTML = CKEDITOR.instances.editor1.getData()
    let tangyWrapperEls = []
    wysiwygTemplateEl.childNodes.forEach(node => {
      if (node.tagName && node.getAttribute('class') && node.getAttribute('class').includes('tangy')) {
        tangyWrapperEls.push(node)
      }
    })
    tangyWrapperEls.forEach(tangyWrapperEl => {
      // select element to unwrap
      //var tangyWrapperEl = document.querySelector('div');
      // get the element's parent node
      var parent = tangyWrapperEl.parentNode;
      // move all children out of the element
      while (tangyWrapperEl.firstChild) parent.insertBefore(tangyWrapperEl.firstChild, tangyWrapperEl);
      // remove the empty element
      parent.removeChild(tangyWrapperEl);
    })
    return wysiwygTemplateEl.innerHTML
  }

  onCancelClick(event) {
    const proceed = confirm('Are you sure you want to cancel?')
    if (!proceed) return
    this.dispatchEvent(new CustomEvent('cancel'))
  }

  onSaveClick(event) {
    let templateEl = document.createElement('template')
    templateEl.innerHTML = this.shadowRoot.querySelector('tangy-form-condensed-editor').markup
    // Do not allow defaults selected in the DOM for value. This will confuse.
    templateEl.content.querySelectorAll('[value]').forEach(el => {
      if (el.hasAttribute('name')) el.removeAttribute('value')
    })
    let categoryEl = this.shadowRoot.querySelector('#category');
    let categoryValue = null;
    if (categoryEl !== null) {
      categoryValue = categoryEl.value
    }
    this.dispatchEvent(new CustomEvent('save', {
      detail: Object.assign({}, this.item, {
        onOpen: this.shadowRoot.querySelector('#on-open-editor juicy-ace-editor').value,
        onChange: this.shadowRoot.querySelector('#on-change-editor juicy-ace-editor').value,
        category: categoryValue,
        title: this.$.container.querySelector('#itemTitle').value,
        summary: this.$.container.querySelector('#summary-checkbox').checked,
        hideBackButton: this.$.container.querySelector('#hide-back-button-checkbox').checked,
        rightToLeft: this.$.container.querySelector('#right-to-left-checkbox').checked,
        template: templateEl.innerHTML
    })}))
  }
}

window.customElements.define('tangy-form-item-editor', TangyFormItemEditor);
