CKEDITOR.plugins.add( 'tangy-input', {
	requires: 'widget',
	icons: 'tangy-input',
	init: function( editor ) {
		CKEDITOR.dialog.add( 'tangy-input', this.path + 'dialogs/tangy-input.js' );
		editor.widgets.add( 'tangy-input', {
			template:
				'<div class="tangy-input"><tangy-input></tangy-input></div>',
			button: 'Create a tangy-input',
			dialog: 'tangy-input',
			upcast: function( element ) {
				return element.name == 'div' && element.hasClass('tangy-input') ;
			},
			init: function() {
				let el = this.element.$.querySelector('tangy-input')
				this.setData('label', el.label)
				this.setData('type', el.type)
				this.setData('name', el.name)
				if (el.required) {
					this.setData('required', 'required')
				} else {
					this.setData('required', 'not-required')
				}
				var tangyIf = el.hasAttribute( 'tangy-if' ) ? el.getAttribute( 'tangy-if' ) : '';
				this.setData( 'tangyIf', tangyIf );

			},
			data: function() {
				let el = this.element.$.querySelector('tangy-input')
				el.setAttribute('type', this.data.type)
				el.setAttribute('label', this.data.label)
				el.setAttribute('name', this.data.name)
				if (this.data.required === 'required') {
					el.setAttribute('required', true)
				} else {
					el.removeAttribute('required')
				}
				if ( this.data.tangyIf !== '' )
					el.setAttribute('tangy-if', this.data.tangyIf);


			}
		} );
	}
} );
