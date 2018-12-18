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
			}
    }
  }

  connectedCallback() {
		super.connectedCallback()
		this.upcast()
	}

	upcast() {
		this.config = this.querySelector('tangy-input').getProps()
		this.render()
	}

	downcast() {
		const config = this.config
		return `
			<tangy-input name="${config.name}" label="${config.label}"></tangy-input>
		`
	}
	
	render() {
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
					margin: 15px;
					padding: 15px;
					width: 100%;
					-webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
					-moz-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
					-ms-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
					-o-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
					box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
					-webkit-transition: all 0.25s ease-in-out;
					-moz-transition: all 0.25s ease-in-out;
					-ms-transition: all 0.25s ease-in-out;
					-o-transition: all 0.25s ease-in-out;
					transition: all 0.25s ease-in-out;
				}
				:host:hover {
					-webkit-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
					-moz-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
					-ms-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
					-o-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
					box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
				}
			</style>
			type: Text Input<br>
			variable name: ${this.config.name}<br>
			label: ${this.config.label}
		` 
	}

}

window.customElements.define('tangy-input-editor', TangyInputEditor);
