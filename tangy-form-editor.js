import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/sortable-list/sortable-list.js'
import '@polymer/paper-toggle-button/paper-toggle-button.js'
import 'juicy-ace-editor/juicy-ace-editor-module.js'
import 'dr-niels-paper-expansion-panel/paper-expansion-panel.js'
import {tangyFormEditorReducer} from './tangy-form-editor-reducer.js'
import './tangy-form-item-editor.js'
import './tangy-form-html-editor.js'
import './tangy-form-item-ckeditor.js'
import 'tangy-form/tangy-form.js'

/**
 * `tangy-form-editor`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class TangyFormEditor extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        color: var(--primary-text-color);
        font-size: medium;
      }
      :host([show-preview]) .show-preview {
        display: none;
      }
      :host(:not([show-preview])) .hide-preview {
        display: none;
      }
      :host(:not([show-preview])) #form-preview {
        display: none;
      }
    </style>
    <!-- FORM ITEM LISTING -->
    <div id="container"></div>
    <div id="editor-region">
      <slot></slot>
    </div>
    <div id="form-preview"></div>
    `;
  }

  static get properties() {
    return {
      showPreview: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      formJson: {
        type: Object,
        value: {
          editMode: 'ckeditor', 
          openItem: '',
          form: {
            id: 'form1',
            title: 'Form 1',
            linearMode: true,
            hideDisabledItems: true,
            hasSummary: true,
            onOpen: '',
            onChange: ''
          },
          items: []
        },
        /*reflectToAttribute: true,*/
        observer: 'formJsonUpdate'
      }
    };
  }

  get formHtml() {
    return this.renderFormHtml(this.store.getState())
  }

  set formHtml(templateHtml) {
    let template = document.createElement('div')
    template.innerHTML = templateHtml
    // Load from innerHTML
    let items = []
    template.querySelectorAll('tangy-form-item').forEach(el => items.push(Object.assign({}, el.getProps(), {template: el.template})))
    this.formJson = Object.assign({}, this.formJson, {
      form: Object.assign(
         {}, 
         template.querySelector('tangy-form').getProps(),
         {
           title: template.querySelector('tangy-form').getAttribute('title'),
           onOpen: template.querySelector('tangy-form').getAttribute('on-open'),
           onChange: template.querySelector('tangy-form').getAttribute('on-change')
         }
      ),
      items
    })
    // Clear innerHTML because we need to make way for the item editor which will use CKEditor... and CKEditor will not work in shadowRoot.
  }

  connectedCallback() {
    super.connectedCallback();
    this.store = Redux.createStore(
      tangyFormEditorReducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
    this.unsubscribe = this.store.subscribe(_ => {
      this.render(this.store.getState())
      this.dispatchEvent(new CustomEvent('change', {
        detail: this.renderFormHtml(this.store.getState())
      }))
    })
    if (this.innerHTML !== '') {
      this.formHtml = this.innerHTML
      this.innerHTML = ''
    } else {
      // Load from this.formJson inline.
      this.store.dispatch({type: 'FORM_OPEN', payload: this.formJson})
    }
  }

  formJsonUpdate(formJson) {
    if (this.store) this.store.dispatch({type: 'FORM_OPEN', payload: formJson})
  }

  render(state) {
    if (state.openItem === '') { 
      this.innerHTML = ''
      // Unbind event listeners.
      if (this.$.container.querySelector('.item-create')) {
        this.$.container
          .querySelector('.item-create')
          .removeEventListener('click', this.onItemCreateClick.bind(this))
      }
      if (this.$.container.querySelector('sortable-list')) {
        this.$.container
          .querySelector('sortable-list')
          .removeEventListener('sort-finish', this.onSortFinish.bind(this))
      }
      this.$.container.innerHTML = `
        <div style="float: right;">
          <paper-button
              class="form-html-edit">
              <iron-icon icon="editor:mode-edit"></iron-icon>
              Edit HTML
          </paper-button>
          <paper-button
              class="show-preview">
              <iron-icon icon="av:play-circle-filled"></iron-icon>
              Preview
          </paper-button>
          <paper-button
              class="hide-preview">
              <iron-icon icon="av:pause-circle-filled"></iron-icon>
              Preview
          </paper-button>
          <paper-button
              class="save-form">
              <iron-icon icon="icons:save"></iron-icon>
              Save 
          </paper-button>
        </div>
        <h2>Form Editor</h2>
        <paper-input label="Form Title" id="form-title" value="${state.form.title}"></paper-input>
        <paper-expansion-panel header="on-open logic" id="on-open-editor"></paper-expansion-panel>
        <paper-expansion-panel header="on-change logic" id="on-change-editor"></paper-expansion-panel>
        
        <sortable-list>
        ${state.items.map(item => `
          <paper-card
            class="sortable"
            data-item-id="${item.id}"
            data-item-title="${item.title}">
            <div class="card-content">
              <h2>${item.title}</h2>
            </div>
            <div class="card-actions">
              <paper-icon-button
                icon="editor:drag-handle">
              </paper-icon-button>
              <paper-icon-button
                class="edit-item"
                data-item-id="${item.id}"
                icon="editor:mode-edit">
              </paper-icon-button>
            </div>
          </paper-card>
        `).join('')}
        </sortable-list>
        <paper-button
            class="item-create">
            <iron-icon icon="add-circle-outline"></iron-icon>
            Add item 
        </paper-button>
      `

      let onOpenEditorEl = document.createElement('juicy-ace-editor')
      onOpenEditorEl.setAttribute('mode', 'ace/mode/javascript')
      //onOpenEditorEl.value = itemFormEl.getAttribute('on-open') 
      onOpenEditorEl.value = state.form.onOpen 
      onOpenEditorEl.style.height = `${window.innerHeight*.6}px`
      this.shadowRoot.querySelector('#on-open-editor').appendChild(onOpenEditorEl)
      // on-change-editor
      let onChangeEditorEl = document.createElement('juicy-ace-editor')
      onChangeEditorEl.setAttribute('mode', 'ace/mode/javascript')
      onChangeEditorEl.value = state.form.onChange 
      onChangeEditorEl.style.height = `${window.innerHeight*.6}px`
      this.shadowRoot.querySelector('#on-change-editor').appendChild(onChangeEditorEl)
      // Bind event listeners.
      this.$.container
        .querySelector('sortable-list')
        .addEventListener('sort-finish', this.onSortFinish.bind(this))
      this.$.container
        .querySelectorAll('.edit-item')
        .forEach(item => item.addEventListener('click', this.onSortableClick.bind(this)))
      this.$.container
        .querySelector('.show-preview')
        .addEventListener('click', this.togglePreview.bind(this))
      this.$.container
        .querySelector('.hide-preview')
        .addEventListener('click', this.togglePreview.bind(this))
      this.$.container
        .querySelector('.save-form')
        .addEventListener('click', this.onSaveFormClick.bind(this))



      this.$.container
        .querySelector('.item-create')
        .addEventListener('click', this.onItemCreateClick.bind(this))
      this.$.container
        .querySelector('.form-html-edit')
        .addEventListener('click', this.onFormHtmlEditClick.bind(this))
      this.$['form-preview'].innerHTML = `
        <h2>Form preview</h2>
        ${this.renderFormHtml(state)}
      `
    } else if (state.openItem === 'form.html') {
      this.$['form-preview'].innerHTML = ``
      this.innerHTML = ''
      this.$.container.innerHTML = `
        <tangy-form-html-editor></tangy-form-html-editor>
      `
      this.$.container.querySelector('tangy-form-html-editor').form = {
        title: state.form.title,
        markup: this.renderFormHtml(state) 
      }
      this.$.container.querySelector('tangy-form-html-editor').addEventListener('save', this.onFormHtmlEditorSave.bind(this))
      this.$.container.querySelector('tangy-form-html-editor').addEventListener('close', this.onFormHtmlEditorClose.bind(this))
    } else if (state.openItem !== '' && state.editMode === 'ace-editor') {
      this.innerHTML = ''
      this.$.container.innerHTML = `
        <paper-toggle-button></paper-toggle-button> WYSIWYG
        <tangy-form-item-editor></tangy-form-item-editor>
      `
      this.$.container.querySelector('tangy-form-item-editor').item = state.items.find(item => item.id === state.openItem)
      this.$.container.querySelector('tangy-form-item-editor').addEventListener('save', this.onItemEditorSave.bind(this))
      this.$.container.querySelector('tangy-form-item-editor').addEventListener('close', this.onItemEditorClose.bind(this))
      this.$.container.querySelector('paper-toggle-button').addEventListener('click', this.onWysiwygToggle.bind(this))
      this.$['form-preview'].innerHTML = ``
    } else if (state.openItem !== '' && state.editMode === 'ckeditor') {
      this.$.container.innerHTML = ''
      this.innerHTML = `
        <paper-toggle-button checked></paper-toggle-button> WYSIWYG
        <tangy-form-item-ckeditor></tangy-form-item-ckeditor>
      `
      this.querySelector('tangy-form-item-ckeditor').item = state.items.find(item => item.id === state.openItem)
      this.querySelector('tangy-form-item-ckeditor').addEventListener('save', this.onItemEditorSave.bind(this))
      this.querySelector('tangy-form-item-ckeditor').addEventListener('close', this.onItemEditorClose.bind(this))
      this.querySelector('paper-toggle-button').addEventListener('click', this.onWysiwygToggle.bind(this))
      this.$['form-preview'].innerHTML = ``
    }
  }

  renderFormHtml(state) {
    return `
      <tangy-form id="${state.form.id}" title="${state.form.title}"
        on-open="
          ${state.form.onOpen}
        "
        on-change="
          ${state.form.onChange}
        "
      >
        ${state.items.map(item => `
          <tangy-form-item id="${item.id}" title="${item.title}"${(item.hideBackButton) ? ` hide-back-button` : ''}${(item.summary) ? ` summary` : ``}${(item.rightToLeft) ? ` right-to-left` : ''}>
            <template>
              ${item.template}
            </template>
          </tangy-form-item>
        `).join('')}
      </tangy-form>
    `
  }

  togglePreview() {
    if (this.showPreview) {
      this.showPreview = false 
    } else {
      this.showPreview = true
      setTimeout(_ => this.shadowRoot.querySelector('#form-preview').scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  }

  onWysiwygToggle(event) {
    this.store.dispatch({type: 'WYSIWYG_TOGGLE'})
  }

  onItemEditorSave(event) {
    this.store.dispatch({type: 'ITEM_UPDATE', payload: event.detail})
  }

  onSaveFormClick(event) {
    this.store.dispatch({type: 'FORM_UPDATE', payload: {
      title: this.shadowRoot.querySelector('#form-title').value,
      onOpen: this.shadowRoot.querySelector('#on-open-editor juicy-ace-editor').value,
      onChange: this.shadowRoot.querySelector('#on-change-editor juicy-ace-editor').value
    }})
  }


  onItemEditorClose(event) {
    this.store.dispatch({type: 'ITEM_CLOSE'})
  }

  onItemEditorClose(event) {
    this.store.dispatch({type: 'ITEM_CLOSE'})
  }


  onItemCreateClick() {
    this.store.dispatch({type: 'ITEM_CREATE'})
  }

  onFormHtmlEditorSave(event) {
    this.formHtml = event.detail
    //this.store.dispatch({type: '_UPDATE', payload: event.detail})
  }

  onFormHtmlEditorClose(event) {
    this.store.dispatch({type: 'ITEM_CLOSE'})
  }

  onFormHtmlEditClick() {
    this.store.dispatch({type: 'FORM_EDIT'})
  }
  onSortFinish(event) {
    this.store.dispatch({
      type: 'SORT_ITEMS', 
      payload: [].slice.call(this.$.container.querySelectorAll('.sortable'))
        .map(sortableEl => sortableEl.dataset.itemId)
    })
  }

  onSortableClick(event) {
    this.store.dispatch({
      type: 'ITEM_OPEN',
      payload: event.target.dataset.itemId
    })
  }

}

window.customElements.define('tangy-form-editor', TangyFormEditor);
