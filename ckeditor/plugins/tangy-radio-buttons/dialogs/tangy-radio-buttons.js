CKEDITOR.dialog.add( 'tangy-radio-buttons', function( editor ) {
	return {
		title: 'Edit Tangy Radio Buttons',
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
					},
					{
						id: 'options',
						type: 'textarea',
						label: 'Options <br>Place each option on a new line. On each line specify the value of the option first, then a comma, then specify the label.<br><br>For example:<br>apple,Apples are my favorite<br>pear,Pears are my favorite<br>',
						width: '100%',
						setup: function( widget ) {
							this.setValue( 
								widget.data.options.map(option => `${option.value},${option.label}`).join('\n')
							);
						},
						commit: function( widget ) {
							widget.setData( 
								'options',
								this.getValue().split('\n').map(fragment => {
									return {
										value: fragment.substr(0, fragment.indexOf(',')),
										label: fragment.substr(fragment.indexOf(',')+1, fragment.length)
									}
								})
							)
						}
					},
					{
						id: 'label',
						type: 'textarea',
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
