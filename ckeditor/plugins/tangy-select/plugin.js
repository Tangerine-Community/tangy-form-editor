CKEDITOR.plugins.add( 'tangy-select', {
	requires: 'widget',
	icons: 'tangy-select',
	init: function( editor ) {
		CKEDITOR.dialog.add( 'tangy-select', this.path + 'dialogs/tangy-select.js' );
		editor.widgets.add( 'tangy-select', {
			allowedContent:
				'div(!tangy-select,align-left,align-right,align-center){width};' +
				'div(!tangy-select-content); h2(!tangy-select-title); tangy-section();',
			requiredContent: 'div(tangy-select)',
			template:
				'<tangy-select></tangy-select>',
			button: 'Create a tangy-select',
			dialog: 'tangy-select',
			upcast: function( element ) {
				return element.name == 'tangy-select' ;
			},
			init: function() {
				this.setData('label', this.element.$.label)
				this.setData('name', this.element.$.name)
				if (this.element.$.required) {
					this.setData('required', 'required')
				} else {
					this.setData('required', 'not-required')
				}
				let optionEls = this.element.$.querySelectorAll('option')
				let optionsString = ''
				optionEls.forEach(optionEl => optionsString += `${optionEl.innerText}\n`)
				this.setData('options', optionsString)
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
				let options = this.data.options.split('\n')
				options.forEach((option, i) => {
					if (option == '') return
					let optionEl = document.createElement('option')
					optionEl.value = i
					optionEl.innerText = option
					this.element.$.appendChild(optionEl)
				})
				// Don't force render if not connected to DOM yet on first create.
				if (this.element.$.shadowRoot) {
					this.element.$.render()
				}
				if ( this.data.tangyIf !== '' )
					this.element.setAttribute('tangy-if', this.data.tangyIf);

			}
		} );
	}
} );
