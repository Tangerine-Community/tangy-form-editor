import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/sortable-list/sortable-list.js'
import 'juicy-ace-editor/juicy-ace-editor-module.js'
import {tangyFormEditorReducer} from './tangy-form-editor-reducer.js'
import './tangy-form-item-editor.js'
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
    </style>
    <!-- FORM ITEM LISTING -->
    <div id="container"></div>
    <div id="editor-region">
      <slot></slot>
    </div>
 hi
    `;
  }

  static get properties() {
    return {
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
          },
          items: []
        },
        /*reflectToAttribute: true,*/
        observer: 'render'
      }
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.store = Redux.createStore(
      tangyFormEditorReducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
    this.unsubscribe = this.store.subscribe(state => this.formJson = state)
    this.render()
  }

  render() {
    const state = this.formJson 
    if (state.openItem === '') { 
      // Unbind event listeners.
      if (this.$.container.innerHTML !== '') {
        this.$.container
          .querySelector('.item-create')
          .removeEventListener('click', this.onItemCreateClick.bind(this))
        this.$.container
          .querySelector('sortable-list')
          .removeEventListener('sort-finish', this.onSortFinish.bind(this))
        this.$.container
          .querySelectorAll('.edit-item')
          .forEach(item => item.addEventListener('click', this.onSortableClick.bind(this)))
      }
      this.innerHTML = ``
      this.$.container.innerHTML = `
        <paper-input label="Form Title" value="${state.form.title}"></paper-input>
        <paper-icon-button
            icon="add-circle-outline"
            class="item-create">
        </paper-icon-button>

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
              </div>
            </div>
          </paper-card>
        </div>
      `
      // Bind event listeners.
      this.$.container
        .querySelector('sortable-list')
        .addEventListener('sort-finish', this.onSortFinish.bind(this))
      this.$.container
        .querySelectorAll('.edit-item')
        .forEach(item => item.addEventListener('click', this.onSortableClick.bind(this)))
      this.$.container
        .querySelector('.item-create')
        .addEventListener('click', this.onItemCreateClick.bind(this))
      this.$.container
        .querySelector('paper-input')
        .addEventListener('value-changed', this.onFormTitleChange.bind(this))
    } else {
      this.$.container.innerHTML = ''
      this.innerHTML = `
        <tangy-form-item-editor></tangy-form-item-editor>
      `
      //this.querySelector('tangy-item-editor').addEventListener
      this.querySelector('tangy-form-item-editor').item = state.items.find(item => item.id === state.openItem)
      this.querySelector('tangy-form-item-editor').addEventListener('save', this.onItemEditorSave.bind(this))
      this.querySelector('tangy-form-item-editor').addEventListener('close', this.onItemEditorClose.bind(this))
    }
  }

  onFormTitleChange(event) {
    let value = event.target.value
    clearTimeout(this.debouncedFormTitleInput)
    this.debouncedFormTitleInput = setTimeout(_ => {
      this.store.dispatch({type: 'FORM_TITLE_UPDATE', payload: value})
    }, 2000)
  }

  onItemEditorSave(event) {
    this.store.dispatch({type: 'ITEM_UPDATE', payload: event.detail})
  }

  onItemEditorClose(event) {
    this.store.dispatch({type: 'ITEM_CLOSE'})

  }

  onItemCreateClick() {
    this.store.dispatch({type: 'ITEM_CREATE'})
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
