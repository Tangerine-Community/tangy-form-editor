import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

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
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      prop1: {
        type: String,
        value: 'tangy-form-editor',
      },
    };
  }
}

window.customElements.define('tangy-form-editor', TangyFormEditor);
