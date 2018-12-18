import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'

class TangyInputEditor extends PolymerElement {

  static get template() {
    return html`
      <style>
        :host {
          display: block;
          color: var(--primary-text-color);
          font-size: medium;
        }
      </style>
      <div id="container"></div>
    `;
  }

  static get properties() {
    return {
			name: {
				type: String,
				value: ''
			},
      config: {
				type: Object,
				value: {},
				observer: 'render'
			}
    }
  }

  connectedCallback() {
    super.connectedCallback()
	}
	
	render() {
		this.shadowRoot.innerHTML = 'TAngy Input Editor...'
	}

}

window.customElements.define('tangy-input-editor', TangyInputEditor);
