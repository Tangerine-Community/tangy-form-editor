import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'

class TangyInputEditor extends PolymerElement {

  static get template() {
		return html`
			<style>
				:host {
					display: block;
					width: 100%;
				}
				paper-card {
					display: block;
					margin: 15px;
					padding: 15px;
					width: 100%;
				}
			</style>
			<paper-card>
				<div class="card-content" id="container"></div>
				<div class="card-actions">
					<paper-button id="remove-button" on-click="onRemoveClick">remove</paper-button>
					<paper-button id="edit-button" on-click="onEditClick">edit</paper-button>
				</div>	
			</paper-card>
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
		this.mode = 'info'
		this.render()
	}

	downcast() {
		const config = this.config
		return `
			<tangy-input name="${config.name}" label="${config.label}"></tangy-input>
		`
	}
	
	render() {
		this.shadowRoot.querySelector('#container').innerHTML = `
			${this.mode === 'info' ? `
				type: Text Input<br>
				variable name: ${this.config.name}<br>
				label: ${this.config.label}
			`:``}
			${this.mode === 'edit' ? `
				<form>
					<p>
						Variable name:
						<paper-input name="name" value="${this.config.name}"></paper-input>
					</p>
					<p>
						Label:
						<paper-input name="label" value="${this.config.label}"></paper-input>
					</p>
					<paper-button type="submit" id="submit">submit</paper-button>
				</form>
			`:``}
		` 
		if (this.mode === 'edit') {
			this.shadowRoot.querySelector('#submit').addEventListener('click', (event) => {
				this.config.name = this.shadowRoot.querySelector('[name=name]').value
				this.config.label = this.shadowRoot.querySelector('[name=label]').value
				this.mode = 'info'
				this.render()
			})
		}
	}

	onRemoveClick() {
		this.remove()
	}

	onEditClick() {
		this.mode = 'edit'
		this.render()

	}

}

window.customElements.define('tangy-input-editor', TangyInputEditor);
