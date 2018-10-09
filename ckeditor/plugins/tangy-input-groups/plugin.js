/**
 * Copyright (c) 2014-2018, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 *
 * Simple CKEditor Widget (Part 2).
 *
 * Created out of the CKEditor Widget SDK:
 * http://docs.ckeditor.com/ckeditor4/docs/#!/guide/widget_sdk_tutorial_2
 */

// Register the plugin within the editor.
CKEDITOR.plugins.add( 'tangy-input-groups', {
	// This plugin requires the Widgets System defined in the 'widget' plugin.
	requires: 'widget',

	// Register the icon used for the toolbar button. It must be the same
	// as the name of the widget.
	icons: 'tangy-input-groups',

	// The plugin initialization logic goes inside this method.
	init: function( editor ) {
		// Register the editing dialog.
		CKEDITOR.dialog.add( 'tangy-input-groups', this.path + 'dialogs/tangy-input-groups.js' );

		// Register the tangy-input-groups widget.
		editor.widgets.add( 'tangy-input-groups', {
			// Allow all HTML elements, classes, and styles that this widget requires.
			// Read more about the Advanced Content Filter here:
			// * http://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_advanced_content_filter
			// * http://docs.ckeditor.com/ckeditor4/docs/#!/guide/plugin_sdk_integration_with_acf
			allowedContent:
				'div(!tangy-input-groups,align-left,align-right,align-center){tangyIf};' +
				'div(!tangy-input-groups-content); h2(!tangy-input-groups-title)',

			// Minimum HTML which is required by this widget to work.
			requiredContent: 'div(tangy-input-groups)',

			// Define two nested editable areas.
			editables: {
				content: {
					selector: '.content'
				}
			},

			// Define the template of a new Simple Box widget.
			// The template will be used when creating new instances of the Simple Box widget.
			template:
				'<tangy-input-groups><div class="content"></div></tangy-input-groups>',

			// Define the label for a widget toolbar button which will be automatically
			// created by the Widgets System. This button will insert a new widget instance
			// created from the template defined above, or will edit selected widget
			// (see second part of this tutorial to learn about editing widgets).
			//
			// Note: In order to be able to translate your widget you should use the
			// editor.lang.tangy-input-groups.* property. A string was used directly here to simplify this tutorial.
			button: 'Create an input group',

			// Set the widget dialog window name. This enables the automatic widget-dialog binding.
			// This dialog window will be opened when creating a new widget or editing an existing one.
			dialog: 'tangy-input-groups',

			upcast: function( element ) {
				return element.name == 'tangy-input-groups';
			},

			init: function() {
				var tangyIf = this.element.hasAttribute( 'tangy-if' ) ? this.element.getAttribute( 'tangy-if' ) : '';
				this.setData( 'tangyIf', tangyIf );
				this.setData('name', this.element.getAttribute('name'))
			},

			data: function() {
				// Check whether "tangyIf" widget data is set and remove or set "tangyIf" CSS style.
				// The style is set on widget main element (div.tangy-input-groups).
				if ( this.data.tangyIf !== '' )
					this.element.setAttribute('tangy-if', this.data.tangyIf);

				this.element.setAttribute('name', this.data.name);
			}
		} );
	}
} );
