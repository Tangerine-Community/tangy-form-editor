import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'

/**
 * `tangy-form-item-editor`
 * ...
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

class TangyFormItemCKEditor extends PolymerElement {
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
      <h2 style="text-align: left">Item Preview</h2>
      <paper-card style="text-align: left; margin: 0 auto; width:100%; max-width: 650px;">
        <div class="card-content">
          ${this.item.template}
        </div>
      </paper-card>
      </div>
    `

    let itemFormEl = this.shadowRoot.querySelector('.card-content form')
    if (itemFormEl) {
      // on-open-editor
      let onOpenEditorEl = document.createElement('juicy-ace-editor')
      onOpenEditorEl.setAttribute('mode', 'ace/mode/javascript')
      onOpenEditorEl.value = itemFormEl.getAttribute('on-open') 
      onOpenEditorEl.style.height = `${window.innerHeight*.6}px`
      this.shadowRoot.querySelector('#on-open-editor').appendChild(onOpenEditorEl)
      // on-change-editor
      let onChangeEditorEl = document.createElement('juicy-ace-editor')
      onChangeEditorEl.setAttribute('mode', 'ace/mode/javascript')
      onChangeEditorEl.value = itemFormEl.getAttribute('on-change') 
      onChangeEditorEl.style.height = `${window.innerHeight*.6}px`
      this.shadowRoot.querySelector('#on-change-editor').appendChild(onChangeEditorEl)
      // Form contents editor.
      this.innerHTML = ` 
        <div id="editor1" contenteditable="true" style="margin-top: 100px; padding-top: 10px">
          ${itemFormEl.innerHTML}
        </div>
      `
    }
    CKEDITOR.disableAutoInline = true;
    CKEDITOR.inline( 'editor1' );
    this.$.container.querySelector('#close').addEventListener('click', this.onCloseClick.bind(this))
    this.$.container.querySelector('#save').addEventListener('click', this.onSaveClick.bind(this))
  }

  onCloseClick(event) {
    this.dispatchEvent(new CustomEvent('close'))
  }
  onSaveClick(event) {
    const template = `
      <form
        on-open="
          ${this.shadowRoot.querySelector('#on-open-editor juicy-ace-editor').value}
        "
        on-change="
          ${this.shadowRoot.querySelector('#on-change-editor juicy-ace-editor').value}
        "
      >
        ${html_beautify(CKEDITOR.instances.editor1.getData())}
      </form>
    `
    this.dispatchEvent(new CustomEvent('save', {
      detail: Object.assign({}, this.item, {
        title: this.$.container.querySelector('#itemTitle').value,
        template 
    })}))
  }
}

window.customElements.define('tangy-form-item-ckeditor', TangyFormItemCKEditor);
