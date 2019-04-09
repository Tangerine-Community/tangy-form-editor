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
      
      .rightCategories {
        margin-left: 2em;
      }
     
      .tangy-spacer{
        flex: 1 1 auto;
      }
      .span-spacer{
        margin-left:10px;
      }
      .card-header{
        display:flex;
        height: 20px;
        height:34px;
        padding-top:10px;
        background:var(--primary-color-lighter);
        color:var(--accent-text-color);
        border-radius: 5px 5px 0px 0px
      }
      #edit-button{
        margin-right:10px;
        cursor: pointer;
      }
      paper-card {
        text-align: left; 
        width:98%;
        margin: 30px 0px 0px;
      }

      .card-content {
        text-align: left;
        padding: 15px;
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
      
      
      .gray-background{
        background:#ebebeb;
      }
      .tangy-action-buttons{
        color: var(--accent-text-color);
        background-color: var(--accent-color);
        font-size: 12px;
        font-weight: 500;
        height: 2rem;
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
      <div>
        <div>
          <paper-button id="back-to-forms" 
            class="tangy-action-buttons">
            <iron-icon icon="arrow-back"></iron-icon>
            ${t('Back')}
          </paper-button>
        </div>
        
      </div>
      <paper-card>
        <div class="card-header">
          <span class="span-spacer"><iron-icon id="item-icon" icon="icons:assignment"></iron-icon></span>
          <span class="span-spacer">${this.item.id}</span>
          <span class="tangy-spacer span-spacer">${t('Item Details')}</span>
          <span id="edit-button"><iron-icon icon="create"></iron-icon></span>
        </div>
        <div class="card-content gray-background">
          <div id="details-content-edit">
            <paper-input id="itemTitle" value="${this.item.title}" label="title" always-float-label></paper-input>
            <p>Item id: ${this.item.id}</p>
            <p><paper-checkbox id="summary-checkbox" ${this.item.summary ? 'checked' : ''}>${t('Show this item in the summary at the end')}</paper-checkbox></p>
            <p><paper-checkbox id="hide-back-button-checkbox" ${this.item.hideBackButton ? 'checked' : ''}>${t('Hide the back button')}</paper-checkbox></p>
            <p><paper-checkbox id="right-to-left-checkbox" ${this.item.rightToLeft ? 'checked' : ''}>${t('right-to-left orientation')}</paper-checkbox></p>
            <paper-expansion-panel header="on-open logic" id="on-open-editor"></paper-expansion-panel>
            <paper-expansion-panel header="on-change logic" id="on-change-editor"></paper-expansion-panel>
            ${this.categories ? '<paper-expansion-panel header="categories" id="categories-editor"></paper-expansion-panel>' : ''}
          </div>
          <div id="details-content-view">
            ${this.item.title}<br/>
            <p><paper-checkbox disabled id="summary-checkbox" ${this.item.summary ? 'checked' : ''}>${t('Show this item in the summary at the end')}</paper-checkbox></p>
            <p><paper-checkbox disabled id="hide-back-button-checkbox" ${this.item.hideBackButton ? 'checked' : ''}>${t('Hide the back button')}</paper-checkbox></p>
            <p><paper-checkbox disabled id="right-to-left-checkbox" ${this.item.rightToLeft ? 'checked' : ''}>right-to-left orientation</paper-checkbox></p>
          </div>
        </div>
        <div id="details-content-edit-actions" class="card-actions-edit">
          <paper-button class="tangy-action-buttons" id="save" style="float:right" role="button" tabindex="0" animated="" elevation="0">${t('Submit')}</paper-button>
        </div>
        <div id="details-content-view-actions" class="card-actions">
           <paper-button id="edit-button"><iron-icon icon="create"></iron-icon>${t('edit')}</paper-button>
        </div>
      </paper-card>
        
     <tangy-form-condensed-editor>
        <template>
          ${this.item.template}
        </template>
      </tangy-form-condensed-editor>
      </div>
    `
    if (!this.edit) {
      this.$.container.querySelector('#details-content-edit').style = 'display:none'
      this.$.container.querySelector('#details-content-edit-actions').style = 'display:none'
    } else {
      this.$.container.querySelector('#details-content-view').style = 'display:none'
      // this.$.container.querySelector('#details-content-view-actions').style = 'display:none'
      // this.$.container.querySelector('#details-card').style = "display:block"

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

  onBackToForms(event) {
    this.save()
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
