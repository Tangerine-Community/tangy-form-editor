CKEDITOR.plugins.add( 'tangy-checkboxes', {
	requires: 'widget',
	icons: 'tangy-checkboxes',
	init: function( editor ) {
		CKEDITOR.dialog.add( 'tangy-checkboxes', this.path + 'dialogs/tangy-checkboxes.js' );
		editor.widgets.add( 'tangy-checkboxes', {
			allowedContent:
				'div(!tangy-checkboxes,align-left,align-right,align-center){width};' +
				'div(!tangy-checkboxes-content); h2(!tangy-checkboxes-title); tangy-section();',
			requiredContent: 'div(tangy-checkboxes)',
			template:
				'<tangy-checkboxes></tangy-checkboxes>',
			button: 'Create a tangy-checkboxes element',
			dialog: 'tangy-checkboxes',
			upcast: function( element ) {
				return element.name == 'tangy-checkboxes' ;
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
