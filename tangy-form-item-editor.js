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
      paper-card {
        display: flex;
        justify-content: space-between;
        text-align: left; 
        width:98%;
        margin: 30px 0px 0px;
        padding: 15px;
      }
      paper-card .display {
        display: flex;
        justify-content: space-between;
        text-align: left; 
        width:98%;
        margin: 30px 0px 0px;
        padding: 15px;
      }
      .card-content {
        text-align: left;
        padding: 2px;
        width: 100%;
      }
      
      .card-actions {
         border-top: none;
      }
      .card-actions-edit {
        margin-top:3em;
        margin-right:3em;
        margin-bottom: 100px;
      }
      .card-actions-edit paper-button {
        float:right;
        line-height: 1em;
        background: var(--accent-color);
      }
      .element-header {
        color: #9AB9F0;
        /*font-size: 2em;*/
        /*opacity: 0.3;*/
        margin-left: .7em;
        margin-bottom: 1.5em;
        display: flex;
        justify-content:start;
        align-items: center;
      }
      mwc-icon {
        color:black;
        /*opacity:1.0;*/
        /*margin-right:1em;*/
        position: absolute;
        left: -16px;
        top: -16px;
        background-color: #B9F09A;
      }
      #element-name {
        position: absolute;
        top: -12px;
      }
      #header {
        display: flex;
        justify-content: space-between;
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
      <div id="header">
        <div><h2 style="text-align: left">Item Editor</h2></div>
        <div><paper-button raised id="back-to-forms" >Back to Form Listing</paper-button></div>
      </div>
      <paper-card id="details-card">
        <div class="card-content">
          <div class="element-header"><div><mwc-icon>category</mwc-icon></div><div id="element-name">${this.item.id}</div></div>
          <h3 style="text-align: left">Item Details</h3>
          <div id="details-content-edit">
            <paper-input id="itemTitle" value="${this.item.title}" label="title" always-float-label></paper-input>
            <p>Item id: ${this.item.id}</p>
            <p><paper-checkbox id="summary-checkbox" ${this.item.summary ? 'checked' : ''}>Show this item in the summary at the end</paper-checkbox></p>
            <p><paper-checkbox id="hide-back-button-checkbox" ${this.item.hideBackButton ? 'checked' : ''}>Hide the back button</paper-checkbox></p>
            <p><paper-checkbox id="right-to-left-checkbox" ${this.item.rightToLeft ? 'checked' : ''}>right-to-left orientation</paper-checkbox></p>
            <paper-expansion-panel header="on-open logic" id="on-open-editor"></paper-expansion-panel>
            <paper-expansion-panel header="on-change logic" id="on-change-editor"></paper-expansion-panel>
            ${this.categories ? '<paper-expansion-panel header="categories" id="categories-editor"></paper-expansion-panel>' : ''}
          </div>
          <div id="details-content-view">
            ${this.item.title}<br/>
            <p><paper-checkbox disabled id="summary-checkbox" ${this.item.summary ? 'checked' : ''}>Show this item in the summary at the end</paper-checkbox></p>
            <p><paper-checkbox disabled id="hide-back-button-checkbox" ${this.item.hideBackButton ? 'checked' : ''}>Hide the back button</paper-checkbox></p>
            <p><paper-checkbox disabled id="right-to-left-checkbox" ${this.item.rightToLeft ? 'checked' : ''}>right-to-left orientation</paper-checkbox></p>
          </div>
        </div>
       
        <div id="details-content-edit-actions" class="card-actions-edit">
            <paper-button id="save" style="float:right" role="button" tabindex="0" animated="" elevation="0">Submit</paper-button>
        </div>

        <div id="details-content-view-actions" class="card-actions">
            <paper-button id="edit-button">edit</paper-button>
        </div>

      </paper-card>
        
      <tangy-form-condensed-editor>
        <template>
          ${this.item.template}
        </template>
      </tangy-form-condensed-editor>
      
      <paper-card style="display: none; text-align: left; margin: 0 auto; width:100%;">
        <div class="card-content">
          ${this.item.template}
        </div>
      </paper-card>
      </div>
    `
    if (!this.edit) {
      this.$.container.querySelector('#details-content-edit').style = 'display:none'
      this.$.container.querySelector('#details-content-edit-actions').style = 'display:none'
    } else {
      this.$.container.querySelector('#details-content-view').style = 'display:none'
      this.$.container.querySelector('#details-content-view-actions').style = 'display:none'
      this.$.container.querySelector('#details-card').style = "display:block"

    }
    this.$.container.querySelector('#back-to-forms').addEventListener('click', this.onBackToForms.bind(this))
    this.$.container.querySelector('#edit-button').addEventListener('click', this._onEditClick.bind(this))

    // on-open-editor
    let onOpenEditorEl = document.createElement('juicy-ace-editor')
    onOpenEditorEl.setAttribute('mode', 'ace/mode/javascript')
    // Convert HTML double quote character to standard double quote character.
    onOpenEditorEl.value = this.item.onOpen ? this.item.onOpen.replace(/&#34;/g, '"') : ''
    onOpenEditorEl.style.height = `${window.innerHeight*.6}px`
    onOpenEditorEl.addEventListener('change', _ => _.stopPropagation())
    this.shadowRoot.querySelector('#on-open-editor').appendChild(onOpenEditorEl)
    // on-change-editor
    let onChangeEditorEl = document.createElement('juicy-ace-editor')
    onChangeEditorEl.setAttribute('mode', 'ace/mode/javascript')
    // Convert HTML double quote character to standard double quote character.
    onChangeEditorEl.value = this.item.onChange ? this.item.onChange.replace(/&#34;/g, '"') : ''
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

    this.$.container.querySelector('#save').addEventListener('click', this.save.bind(this))
    this.shadowRoot.querySelector('tangy-form-condensed-editor').addEventListener('tangy-form-condensed-editor-changed', this.save.bind(this))
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
      // get the element's parent node
      var parent = tangyWrapperEl.parentNode;
      // move all children out of the element
      while (tangyWrapperEl.firstChild) parent.insertBefore(tangyWrapperEl.firstChild, tangyWrapperEl);
      // remove the empty element
      parent.removeChild(tangyWrapperEl);
    })
    return wysiwygTemplateEl.innerHTML
  }

  onBackToForms(event) {
    this.dispatchEvent(new CustomEvent('cancel'))
  }

  save() {
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
        // Convert standard double quote character to safe HTML double quote character.
        onOpen: this.shadowRoot.querySelector('#on-open-editor juicy-ace-editor').value.replace(/"/g, '&#34;'),
        onChange: this.shadowRoot.querySelector('#on-change-editor juicy-ace-editor').value.replace(/"/g, '&#34;'),
        category: categoryValue,
        title: this.$.container.querySelector('#itemTitle').value,
        summary: this.$.container.querySelector('#summary-checkbox').checked,
        hideBackButton: this.$.container.querySelector('#hide-back-button-checkbox').checked,
        rightToLeft: this.$.container.querySelector('#right-to-left-checkbox').checked,
        template: templateEl.innerHTML
    })}))
  }

  _onEditClick() {
    // this.dispatchEvent(new CustomEvent('edit-input', {bubbles: true}))
    this.edit = true
    this.render()
  }

  onAddClick() {
    let addInputEl = this.$.container.querySelector("tangy-form-editor-add-input");
    let condensedEditor = this.$.container.querySelector('tangy-form-condensed-editor').shadowRoot
    !addInputEl ? condensedEditor.dispatchEvent(new CustomEvent('add-input', {bubbles: true, composed: true})):this.$.container.querySelector(".card-content").removeChild(addInputEl)
  }

}

window.customElements.define('tangy-form-item-editor', TangyFormItemEditor);
