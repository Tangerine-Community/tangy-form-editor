import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/sortable-list/sortable-list.js'
import '@polymer/paper-toggle-button/paper-toggle-button.js'
import 'juicy-ace-editor/juicy-ace-editor-module.js'
import 'dr-niels-paper-expansion-panel/paper-expansion-panel.js'
import { tangyFormEditorReducer } from './tangy-form-editor-reducer.js'
import './tangy-form-item-editor.js'
import './tangy-form-html-editor.js'
import './tangy-code.js'
import 'tangy-translate'


//   <!-- Tangy Elements -->
import 'tangy-form/tangy-form.js';
import 'tangy-form/input/tangy-box.js';
import 'tangy-form/input/tangy-input.js';
import 'tangy-form/input/tangy-timed.js';
import 'tangy-form/input/tangy-untimed-grid.js';
import 'tangy-form/input/tangy-checkbox.js';
import 'tangy-form/input/tangy-checkboxes.js';
import 'tangy-form/input/tangy-radio-buttons.js';
import 'tangy-form/input/tangy-select.js';
import 'tangy-form/input/tangy-location.js';
import 'tangy-form/input/tangy-gps.js';
import 'tangy-form/input/tangy-acasi.js';
import 'tangy-form/input/tangy-eftouch.js';
import 'tangy-form/input/tangy-photo-capture.js';
import 'tangy-form/input/tangy-qr.js';
import 'tangy-form/input/tangy-consent.js';

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
        paper-input {
          --paper-input-container-underline-focus: {
            border-color:var(--accent-color);
          } 
        }
        .rightCategories {
          margin-left: 2em;
        }
        .tangy-spacer{
          flex: 1 1 auto;
        }
        .sortable{
          display:inline-flex;
          cursor: move;
           margin-left: 4px;
           margin-bottom: 10px;
           width:100%;
        }
        .list-item-text{
          padding-top: 0.9rem;
          font-size: 128%;
          font-weight: bold
        }
        .tangy-icons{
          background-color:var(--accent-text-color);
          color:var(--lighter-accent-color);
        }
        .tangy-action-buttons{
          color: var(--accent-text-color);
          background-color: var(--accent-color);
          font-size: 12px;
          font-weight: 500;
          height: 2rem;
        }
        paper-icon-button{
          margin-top: 0.4rem;
        }
        .form-actions-container{
          display: flex; 
          justify-content: space-between;
        }
        .form-actions{
          margin-top: 1rem;
        }
        sortable-list {
          width: 100%;
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
      print: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      showPreview: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      categories: {
        type: Array,
        value: false,
        reflectToAttribute: true
      }
    };
  }

  get formHtml() {
    const state = this.store.getState();
    return `
      <tangy-form id="${state.form.id}" title="${state.form.title}" category="${
      state.form.category
    }"
        ${state.form.fullscreen ? ` fullscreen` : ''}
        on-open="
          ${state.form.onOpen}
        "
        on-change="
          ${state.form.onChange}
        "
      >
        ${state.items
          .map(
            item => `
          <tangy-form-item id="${item.id}" 
            title="${item.title}"
            ${item.hideBackButton ? ` hide-back-button` : ''}${
              item.summary ? ` summary` : ``
            }${item.hideBackButton ? ` hide-back-button` : ``}${
              item.rightToLeft ? ` right-to-left` : ''
            }
            on-open="
              ${item.onOpen}
            "
            on-change="
              ${item.onChange}
            "
            category="
              ${item.category}
            "
          >
            <template>
              ${item.template}
            </template>
          </tangy-form-item>
        `).join('')}
      </tangy-form>
    `
  }

  set formHtml(templateHtml) {
    let template = document.createElement('template')
    template.innerHTML = templateHtml
    // Load from innerHTML
    let items = []
    template.content.querySelectorAll('tangy-form-item').forEach(el => items.push(Object.assign({}, 
      el.getProps(), 
      {
        template: (el.querySelector('template')) ? el.querySelector('template').innerHTML : el.innerHTML,
        onOpen: el.hasAttribute('on-open') ? el.getAttribute('on-open') : '',
        onChange: el.hasAttribute('on-change') ? el.getAttribute('on-change') : '',
        category: el.hasAttribute('category') ? el.getAttribute('category') : '',
        summary: el.hasAttribute('summary'),
        rightToLeft: el.hasAttribute('right-to-left'),
        hideBackButton: el.hasAttribute('hide-back-button')
      }
    )))
    let formJson = Object.assign({}, this.formJson, {
      form: Object.assign(
         {}, 
         template.content.querySelector('tangy-form').getProps(),
         {
           title: template.content.querySelector('tangy-form').getAttribute('title'),
           fullscreen: template.content.querySelector('tangy-form').hasAttribute('fullscreen'),
           onOpen: template.content.querySelector('tangy-form').hasAttribute('on-open')
            ? template.content.querySelector('tangy-form').getAttribute('on-open')
            : '',
           onChange: template.content.querySelector('tangy-form').hasAttribute('on-change')
             ? template.content.querySelector('tangy-form').getAttribute('on-change')
             : '',
           category: template.content.querySelector('tangy-form').hasAttribute('category')
            ? template.content.querySelector('tangy-form').getAttribute('category')
            : ''
         }
      ),
      items
    })
    this.store.dispatch({type: 'FORM_OPEN', payload: formJson})
  }

  connectedCallback() {
    super.connectedCallback();
    this.store = Redux.createStore(
      tangyFormEditorReducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
    this.unsubscribe = this.store.subscribe(_ => {
      this.render(this.store.getState())
    })
    if (this.querySelector('template')) {
      this.formHtml = this.querySelector('template').innerHTML
      this.innerHTML = ''
    } else {
      // Load from this.formJson inline.
      this.store.dispatch({type: 'FORM_OPEN', payload: this.formJson})
    }
    if (this.hasAttribute('print')) {
      this.store.dispatch({type: 'FORM_PRINT'})
    }
  }

  render(state) {
    if (state.print) {
      this.$.container.innerHTML = `
        <h1>${state.form.title}</h1> 
        ${state.items.map(item => `
          <h2>${item.title}</h2>
          <tangy-form-condensed-editor print>
            <template>
              ${item.template}
            </template>
          </tangy-form-condensed-editor>
        `).join('')}
      `
      return
    }
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
        <div class="form-actions-container">
          <span style="width:40%;">
            <paper-input label="Form Title" id="form-title" value="${
              state.form.title
            }"></paper-input>
          </span>
          
          <span class="form-actions">
            <paper-button
                class="form-html-edit tangy-action-buttons">
                <iron-icon icon="icons:code"></iron-icon>
                ${t('Edit HTML')}
            </paper-button>
            <paper-button
                class="show-preview tangy-action-buttons">
                <iron-icon icon="image:remove-red-eye"></iron-icon>
                ${t('Preview')}
            </paper-button>
            <paper-button
                class="hide-preview tangy-action-buttons">
                <iron-icon icon="av:pause-circle-filled"></iron-icon>
                 ${t('Preview')}
            </paper-button>
            <paper-button
                class="save-form tangy-action-buttons">
                <iron-icon icon="icons:save"></iron-icon>
                 ${t('Save')}
            </paper-button>
            <paper-button
                class="advanced tangy-action-buttons">
                <iron-icon icon="icons:settings"></iron-icon>
                Advanced 
            </paper-button>
          </span>
        </div>
        <paper-expansion-panel header="advanced settings" id="main-expansion-panel">
          <paper-checkbox style="margin:15px;" id="fullscreen-checkbox" ${
            state.form.fullscreen ? 'checked' : ''
          }>${t('Enable fullscreen mode')}</paper-checkbox>
          <paper-expansion-panel header="on-open logic" id="on-open-editor"></paper-expansion-panel>
          <paper-expansion-panel header="on-change logic" id="on-change-editor"></paper-expansion-panel>
        </paper-expansion-panel>
        </paper-expansion-panel>
        
        <sortable-list >
        ${state.items
          .map(
            item => `
          <paper-card
            class="sortable"
            data-item-id="${item.id}"
            data-item-title="${item.title}">
            <span >
                <span 
                  data-item-id="${item.id}"
                >
                  <paper-icon-button data-item-id="${
                    item.id
                  }" icon="icons:reorder"></paper-icon-button></span>
                  </span>
            
                <span class="tangy-spacer list-item-text">${
                  item.title
                }</span>
                
                <span>
                <a class="tangy-icons item-edit"
                  data-item-id="${item.id}"
                >
                  <paper-icon-button data-item-id="${
                    item.id
                  }" icon="editor:mode-edit"></paper-icon-button></a>
                  
                <a
                  class="tangy-icons item-delete"
                  data-item-id="${item.id}"
                >
                  <paper-icon-button data-item-id="${
                    item.id
                  }" icon="icons:delete"></paper-icon-button></a>
                  </span>
            
          </paper-card>
        `
          )
          .join('')}
        </sortable-list>
        <div>
          <paper-button
              class="item-create tangy-action-buttons">
              <iron-icon icon="add-circle-outline"></iron-icon>
              ${t('Add item')}
          </paper-button>
        </div>
        
      `

      let onOpenEditorEl = document.createElement('juicy-ace-editor')
      onOpenEditorEl.setAttribute('mode', 'ace/mode/javascript')
      //onOpenEditorEl.value = itemFormEl.getAttribute('on-open') 
      onOpenEditorEl.value = state.form.onOpen  ? state.form.onOpen.replace(/&#34;/g, '"') : ''
      onOpenEditorEl.style.height = `${window.innerHeight*.6}px`
      onOpenEditorEl.addEventListener('change', _ => _.stopPropagation())
      this.shadowRoot.querySelector('#on-open-editor').appendChild(onOpenEditorEl)
      // on-change-editor
      let onChangeEditorEl = document.createElement('juicy-ace-editor')
      onChangeEditorEl.setAttribute('mode', 'ace/mode/javascript')
      onChangeEditorEl.value = state.form.onChange  ? state.form.onChange.replace(/&#34;/g, '"') : ''
      onChangeEditorEl.style.height = `${window.innerHeight*.6}px`
      onChangeEditorEl.addEventListener('change', _ => _.stopPropagation())
      this.shadowRoot.querySelector('#on-change-editor').appendChild(onChangeEditorEl)

      // Bind event listeners.
      this.$.container
        .querySelector('.advanced')
        .addEventListener('click', this.onClickAdvancedSettings.bind(this))
      this.$.container
        .querySelector('#fullscreen-checkbox')
        .addEventListener('click', this.onFullscreenCheckboxClick.bind(this))
      this.$.container
        .querySelector('sortable-list')
        .addEventListener('sort-finish', this.onSortFinish.bind(this))
      this.$.container
        .querySelectorAll('.item-edit')
        .forEach(item => item.addEventListener('click', this.onItemEditClick.bind(this)))
      this.$.container
        .querySelectorAll('.item-delete')
        .forEach(item => item.addEventListener('click', this.onItemDeleteClick.bind(this)))
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
        ${this.formHtml}
      `
    } else if (state.openItem === 'form.html') {
      this.$['form-preview'].innerHTML = ``
      this.innerHTML = ''
      this.$.container.innerHTML = `
        <tangy-form-html-editor></tangy-form-html-editor>
      `
      this.$.container.querySelector('tangy-form-html-editor').form = {
        title: state.form.title,
        markup: this.formHtml 
      }
      this.$.container.querySelector('tangy-form-html-editor').addEventListener('save', this.onFormHtmlEditorSave.bind(this))
      this.$.container.querySelector('tangy-form-html-editor').addEventListener('close', this.onFormHtmlEditorCancel.bind(this))
    } else if (state.openItem !== '') {
      this.$.container.innerHTML = ''
      this.innerHTML = `
        <tangy-form-item-editor></tangy-form-item-editor>
      `
      this.querySelector('tangy-form-item-editor').categories = this.categories
      this.querySelector('tangy-form-item-editor').item = state.items.find(item => item.id === state.openItem)
      this.querySelector('tangy-form-item-editor').addEventListener('save', this.onItemEditorSave.bind(this))
      this.querySelector('tangy-form-item-editor').addEventListener('cancel', this.onItemEditorCancel.bind(this))

      this.$['form-preview'].innerHTML = ``
    }
  }

  togglePreview() {
    if (this.showPreview) {
      this.showPreview = false 
    } else {
      this.showPreview = true
      setTimeout(_ => this.shadowRoot.querySelector('#form-preview').scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }
  }

  dispatchChangeEvent() {
    this.dispatchEvent(new CustomEvent('tangy-form-editor-change', {
      detail: this.formHtml
    }))
  }

  onItemEditorSave(event) {
    this.store.dispatch({type: 'ITEM_UPDATE', payload: event.detail})
    this.dispatchChangeEvent()
  }

  onSaveFormClick(event) {
    let categoryEl = this.shadowRoot.querySelector('#category');
    let categoryValue = null;
    if (typeof categoryEl !== 'undefined' && categoryEl !== null) {
      categoryValue = categoryEl.value
    }
    this.store.dispatch({type: 'FORM_UPDATE', payload: {
      title: this.shadowRoot.querySelector('#form-title').value,
      onOpen: this.shadowRoot.querySelector('#on-open-editor juicy-ace-editor').value.replace(/"/g, '&#34;'),
      onChange: this.shadowRoot.querySelector('#on-change-editor juicy-ace-editor').value.replace(/"/g, '&#34;'),
      category: categoryValue
    }})
    this.dispatchChangeEvent()
  }

  onItemEditorCancel(event) {
    this.store.dispatch({type: 'ITEM_CLOSE'})
  }


  onItemCreateClick() {
    this.store.dispatch({type: 'ITEM_CREATE'})
  }

  onFormHtmlEditorSave(event) {
    this.formHtml = event.detail
    //this.store.dispatch({type: '_UPDATE', payload: event.detail})
  }

  onFormHtmlEditorCancel(event) {
    this.store.dispatch({type: 'ITEM_CLOSE'})
  }

  onFormHtmlEditClick() {
    this.store.dispatch({type: 'FORM_EDIT'})
  }

  onFullscreenCheckboxClick() {
    this.store.dispatch({type: 'TOGGLE_FULLSCREEN'})
  }

  onSortFinish(event) {
    this.store.dispatch({
      type: 'SORT_ITEMS', 
      payload: [].slice.call(this.$.container.querySelectorAll('.sortable'))
        .map(sortableEl => sortableEl.dataset.itemId)
    })
  }

  onItemEditClick(event) {
    this.store.dispatch({
      type: 'ITEM_OPEN',
      payload: event.target.dataset.itemId
    })
  }

  onItemDeleteClick(event) {
    const shouldDelete = confirm('Are you sure you want to delete this item?')
    if (!shouldDelete) return
    this.store.dispatch({
      type: 'ITEM_DELETE',
      payload: event.target.dataset.itemId
    })
  }
  onClickAdvancedSettings(){
    this.$.container.querySelector('#main-expansion-panel').opened=!this.$.container.querySelector('#main-expansion-panel').opened; 
  }
}

window.customElements.define('tangy-form-editor', TangyFormEditor);
