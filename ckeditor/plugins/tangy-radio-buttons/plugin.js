CKEDITOR.plugins.add( 'tangy-radio-buttons', {
	requires: 'widget',
	icons: 'tangy-radio-buttons',
	init: function( editor ) {
		CKEDITOR.dialog.add( 'tangy-radio-buttons', this.path + 'dialogs/tangy-radio-buttons.js' );
		editor.widgets.add( 'tangy-radio-buttons', {
			allowedContent:
				'div(!tangy-radio-buttons,align-left,align-right,align-center){width};' +
				'div(!tangy-radio-buttons-content); h2(!tangy-radio-buttons-title); tangy-section();',
			requiredContent: 'div(tangy-radio-buttons)',
			template:
				'<tangy-radio-buttons></tangy-radio-buttons>',
			button: 'Create a tangy-radio-buttons',
			dialog: 'tangy-radio-buttons',
			upcast: function( element ) {
				return element.name == 'tangy-radio-buttons' ;
			},
			init: function() {
				this.setData('label', this.element.$.label)
				this.setData('name', this.element.$.name)
				if (this.element.$.required) {
					this.setData('required', 'required')
				} else {
					this.setData('required', 'not-required')
				}
				let options = [].slice.call(this.element.$.querySelectorAll('option'))
					.map(optionEl => {
						return {
							value: optionEl.getAttribute('value'),
							label: optionEl.innerText
						}
					})
				this.setData('options', options)
				var tangyIf = this.element.hasAttribute( 'tangy-if' ) ? this.element.getAttribute( 'tangy-if' ) : '';
				this.setData( 'tangyIf', tangyIf );
			},
			data: function() {
				this.element.$.setAttribute('label', this.data.label)
				this.element.$.setAttribute('name', this.data.name)
				if (this.data.required === 'required') {
					this.element.$.setAttribute('required', true)
				} else {
					this.element.$.removeAttribute('required')
				}
				this.element.$.innerHTML = ''
				this.data.options.forEach((option, i) => {
					if (option == '') return
					let optionEl = document.createElement('option')
					optionEl.value = option.value
					optionEl.innerText = option.label
					this.element.$.appendChild(optionEl)
				})
				if ( this.data.tangyIf !== '' )
					this.element.setAttribute('tangy-if', this.data.tangyIf);

				// Don't force render if not connected to DOM yet on first create.
				if (this.element.$.shadowRoot) {
					this.element.$.render()
				}
			}
		} );
	}
} );
