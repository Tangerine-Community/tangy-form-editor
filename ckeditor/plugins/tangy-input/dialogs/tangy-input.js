CKEDITOR.dialog.add( 'tangy-input', function( editor ) {
	return {
		title: 'Edit Tangy Form',
		minWidth: 200,
		minHeight: 100,
		contents: [
			{
				id: 'info',
				elements: [
					{
						id: 'tangyIf',
						type: 'text',
						label: 'Show if',
						width: '300px',
						setup: function( widget ) {
							this.setValue( widget.data.tangyIf );
						},
						commit: function( widget ) {
							widget.setData( 'tangyIf', this.getValue() );
						}
					},
					{
						id: 'type',
						type: 'select',
						label: 'Type',
						width: '100%',
						items: [
							[ 'text', 'text' ],
							[ 'number', 'number' ],
							[ 'email', 'email' ],
							[ 'date', 'date' ],
							[ 'time', 'time' ],
							[ 'password', 'password' ],
						],
						setup: function( widget ) {
							this.setValue( widget.data.type );
						},
						commit: function( widget ) {
							widget.setData( 'type', this.getValue() );
						}
					},
					{
						id: 'required',
						type: 'select',
						label: 'Required',
						width: '100%',
						items: [
							[ 'not-required', 'not-required' ],
							[ 'required', 'required' ],
						],
						setup: function( widget ) {
							this.setValue( widget.data.required );
						},
						commit: function( widget ) {
							widget.setData( 'required', this.getValue() );
						}
					},
					{
						id: 'name',
						type: 'text',
						validate: function() {
							if (this.getValue().match(/^[A-Za-z0-9_]+$/) === null) {
								return 'Variable Name may only contain a-z, A-Z, 0-9, and _ characters'
							}
						},
						label: 'Variable Name',
						width: '100%',
						setup: function( widget ) {
							this.setValue( widget.data.name );
						},
						commit: function( widget ) {
							widget.setData( 'name', this.getValue() );
						}
					},
					{
						id: 'label',
						type: 'text',
						label: 'label',
						width: '100%',
						setup: function( widget ) {
							this.setValue( widget.data.label );
						},
						commit: function( widget ) {
							widget.setData( 'label', this.getValue() );
						}
					},
					{
						id: 'min',
						type: 'text',
						label: 'min <br><br>Note you must set type to "number" for this to work.',
						width: '100%',
						setup: function( widget ) {
							this.setValue( widget.data.min );
						},
						commit: function( widget ) {
							widget.setData( 'min', this.getValue() );
						}
					},
					{
						id: 'max',
						type: 'text',
						label: 'max <br><br>Note you must set type to "number" for this to work.',
						width: '100%',
						setup: function( widget ) {
							this.setValue( widget.data.max );
						},
						commit: function( widget ) {
							widget.setData( 'max', this.getValue() );
						}
					}
				]
			}
		]
	};
} );
