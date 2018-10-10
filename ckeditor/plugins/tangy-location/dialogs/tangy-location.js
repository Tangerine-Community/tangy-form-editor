CKEDITOR.dialog.add( 'tangy-location', function( editor ) {
	return {
		title: 'Edit Tangy Location',
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
						id: 'filterByGlobal',
						type: 'select',
						label: 'Filter by locations in the user profile?',
						width: '100%',
						items: [
							[ 'no', 'no' ],
							[ 'yes', 'yes' ]
						],
						setup: function( widget ) {
							this.setValue( widget.data.filterByGlobal );
						},
						commit: function( widget ) {
							widget.setData( 'filterByGlobal', this.getValue() );
						}
					},
					{
						id: 'showLevels',
						type: 'text',
						label: 'Show levels (ex. county,subcounty)',
						width: '100%',
						setup: function( widget ) {
							this.setValue( widget.data.showLevels );
						},
						commit: function( widget ) {
							widget.setData( 'showLevels', this.getValue() );
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
						validate: function() {
							if (this.getValue().match(/^[A-Za-z0-9_]+$/) === null) {
								return 'Variable Name may only contain a-z, A-Z, 0-9, and _ characters'
							}
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
					}
				]
			}
		]
	};
} );
