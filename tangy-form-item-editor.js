import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'

/**
 * `tangy-form-item-editor`
 * ...
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

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
      <paper-card style="text-align: left; margin: 0 auto; width:100%; max-width: 650px;">
        <div class="card-content">
          <paper-input id="itemTitle" value="${this.item.title}" label="title" always-float-label></paper-input>
          <paper-expansion-panel header="on-open logic" id="on-open-editor"></paper-expansion-panel>
          <paper-expansion-panel header="on-change logic" id="on-change-editor"></paper-expansion-panel>
          <paper-toggle-button checked>WYSIWYG</paper-toggle-button> 
          <slot></slot>
        </div>
        <div class="card-actions">
          <paper-icon-button
            data-item-src="[[itemFilename]]"
            data-item-id="[[itemId]]"
            id="close"
            icon="icons:arrow-back"/>
            >
          </paper-icon-button>
          <paper-icon-button
              data-item-src="[[itemFilename]]"
              data-item-id="[[itemId]]"
              id="save"
              icon="icons:save"
              >
          </paper-icon-button>
        </div>
      </paper-card>
      <paper-card style="display: none; text-align: left; margin: 0 auto; width:100%; max-width: 650px;">
        <div class="card-content">
          ${this.item.template}
        </div>
      </paper-card>
      </div>
    `
    this.shadowRoot
      .querySelector('paper-toggle-button')
      .addEventListener('click', event => {
        if(event.target.hasAttribute('checked')) {
          this.showWysiwyg(html_beautify(this.querySelector('juicy-ace-editor').value))
        } else {
          this.showAce(html_beautify(CKEDITOR.instances.editor1.getData()))
        }
      })
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
    // Form contents editor.
    this.showWysiwyg(this.item.template)
    this.$.container.querySelector('#close').addEventListener('click', this.onCloseClick.bind(this))
    this.$.container.querySelector('#save').addEventListener('click', this.onSaveClick.bind(this))
  }

  showWysiwyg(template) {
    this.innerHTML = `
      <div id="editor1" contenteditable="true" style="margin-top: 100px; padding-top: 10px">
        ${template}
      </div>
    `
    CKEDITOR.disableAutoInline = true
    CKEDITOR.config.autoParagraph = false
    CKEDITOR.config.startupFocus = 'start'
    const instance = CKEDITOR.inline( 'editor1' )
    this.$.container.querySelector('#close').addEventListener('click', this.onCloseClick.bind(this))
    this.$.container.querySelector('#save').addEventListener('click', this.onSaveClick.bind(this))
  }

  showAce(template) {
    let juicyAceEditorEl = document.createElement('juicy-ace-editor')
    juicyAceEditorEl.setAttribute('mode', 'ace/mode/html')
    juicyAceEditorEl.value = template 
    juicyAceEditorEl.style.height = `${window.innerHeight*.6}px`
    this.innerHTML = ''
    this.appendChild(juicyAceEditorEl)
  }

  onCloseClick(event) {
    this.dispatchEvent(new CustomEvent('close'))
  }

  onSaveClick(event) {
    this.dispatchEvent(new CustomEvent('save', {
      detail: Object.assign({}, this.item, {
        onOpen: this.shadowRoot.querySelector('#on-open-editor juicy-ace-editor').value,
        onChange: this.shadowRoot.querySelector('#on-change-editor juicy-ace-editor').value,
        title: this.$.container.querySelector('#itemTitle').value,
        template: html_beautify(CKEDITOR.instances.editor1.getData())
    })}))
  }
}

window.customElements.define('tangy-form-item-editor', TangyFormItemEditor);
