CKEDITOR.dialog.add( 'tangy-gps', function( editor ) {
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
						label: 'Variable Name',
						width: '100%',
						setup: function( widget ) {
							this.setValue( widget.data.name );
						},
						commit: function( widget ) {
							widget.setData( 'name', this.getValue() );
						}
					}
				]
			}
		]
	};
} );
