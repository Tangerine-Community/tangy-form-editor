import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/sortable-list/sortable-list.js'
import '@polymer/paper-toggle-button/paper-toggle-button.js'
import 'juicy-ace-editor/juicy-ace-editor-module.js'
import 'dr-niels-paper-expansion-panel/paper-expansion-panel.js'
import {tangyFormEditorReducer} from './tangy-form-editor-reducer.js'
import './tangy-form-item-editor.js'
import './tangy-form-html-editor.js'
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
      .rightCategories {
        margin-left: 2em;
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
        reflectToAttribute: true },
      categories: {
        type: Array,
        value: false,
        reflectToAttribute: true
      }
    }
      
  }

  get formHtml() {
    const state = this.store.getState()
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
          <tangy-form-item id="${item.id}" 
            title="${item.title}"
            ${(item.hideBackButton) ? ` hide-back-button` : ''}${(item.summary) ? ` summary` : ``}${(item.hideBackButton) ? ` hide-back-button` : ``}${(item.rightToLeft) ? ` right-to-left` : ''}
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
        onOpen: el.getAttribute('on-open'),
        onChange: el.getAttribute('on-change'),
        category: el.getAttribute('category'),
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
           onOpen: template.content.querySelector('tangy-form').getAttribute('on-open'),
           onChange: template.content.querySelector('tangy-form').getAttribute('on-change'),
           category: template.content.querySelector('tangy-form').getAttribute('category')
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
      this.dispatchEvent(new CustomEvent('tangy-form-editor-change', {
        detail: this.formHtml
      }))
    })
    if (this.querySelector('template')) {
      this.formHtml = this.querySelector('template').innerHTML 
      this.innerHTML = ''
    } else {
      // Load from this.formJson inline.
      this.store.dispatch({type: 'FORM_OPEN', payload: this.formJson})
    }
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
        <paper-expansion-panel header="categories" id="categories-editor"></paper-expansion-panel>
        <div style="float: right; position:relative;">
          <i>
            Drag items to reorder 
          </i>
          <iron-icon 
            icon="icons:subdirectory-arrow-left"
            style="position: absolute; z-index: 999; bottom: -30px; right: 0px;"
          ></iron-icon>
        </div>
        <sortable-list style="text-align: center">
        ${state.items.map(item => `
          <paper-card
            style="cursor: move; margin: 15px;"
            class="sortable"
            data-item-id="${item.id}"
            data-item-title="${item.title}">
            <div class="card-content">
              <h2>${item.title}</h2>
            </div>
            <div class="card-actions">
              <paper-button
                class="item-edit"
                data-item-id="${item.id}"
              >
                <paper-icon-button data-item-id="${item.id}" icon="editor:mode-edit"></paper-icon-button>
                edit
              </paper-button>
              <paper-button
                class="item-delete"
                data-item-id="${item.id}"
              >
                <paper-icon-button data-item-id="${item.id}" icon="icons:delete"></paper-icon-button>
                delete
              </paper-button>
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
      onOpenEditorEl.addEventListener('change', _ => _.stopPropagation())
      this.shadowRoot.querySelector('#on-open-editor').appendChild(onOpenEditorEl)
      // on-change-editor
      let onChangeEditorEl = document.createElement('juicy-ace-editor')
      onChangeEditorEl.setAttribute('mode', 'ace/mode/javascript')
      onChangeEditorEl.value = state.form.onChange 
      onChangeEditorEl.style.height = `${window.innerHeight*.6}px`
      onChangeEditorEl.addEventListener('change', _ => _.stopPropagation())
      this.shadowRoot.querySelector('#on-change-editor').appendChild(onChangeEditorEl)

      // categories
      if (this.categories.length > 0) {
        let select_str = "<div class='rightCategories'>Select a category: <select id='category'>\n"
        select_str += '<option value="">Select one</option>\n';
        let categoryValue = state.form.category
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
        let selectEl = template.content.childNodes;
        let categoriesEditor = this.shadowRoot.querySelector('#categories-editor');
        console.log("selectEl" + selectEl)
        categoriesEditor.innerHTML = select_str
      } else {
        let spanEl = document.createElement("span");
        spanEl.textContent = "No categories - you must add them to app-config.json";
        this.shadowRoot.querySelector('#categories-editor').appendChild(spanEl)
      }


      // Bind event listeners.
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
      this.$.container.querySelector('tangy-form-html-editor').addEventListener('cancel', this.onFormHtmlEditorCancel.bind(this))
    } else if (state.openItem !== '') {
      this.$.container.innerHTML = ''
      this.innerHTML = `
        <tangy-form-item-editor></tangy-form-item-editor>
      `
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

  onItemEditorSave(event) {
    this.store.dispatch({type: 'ITEM_UPDATE', payload: event.detail})
    this.store.dispatch({type: 'ITEM_CLOSE', payload: event.detail})
  }

  onSaveFormClick(event) {
    this.store.dispatch({type: 'FORM_UPDATE', payload: {
      title: this.shadowRoot.querySelector('#form-title').value,
      onOpen: this.shadowRoot.querySelector('#on-open-editor juicy-ace-editor').value,
      onChange: this.shadowRoot.querySelector('#on-change-editor juicy-ace-editor').value,
      category: this.shadowRoot.querySelector('#category').value
    }})
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
}

window.customElements.define('tangy-form-editor', TangyFormEditor);
