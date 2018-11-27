CKEDITOR.dialog.add( 'tangy-timed', function( editor ) {
	return {
		title: 'Edit a Grid Test',
		minWidth: 300,
		minHeight: 100,
		contents: [
      {
        id: 'tab-basic',
        label: 'Basic Settings',
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
						id: 'options',
						type: 'textarea',
						label: 'Options',
						width: '100%',
						setup: function( widget ) {
							this.setValue( widget.data.options );
						},
						commit: function( widget ) {
							widget.setData( 'options', this.getValue() );
						}
					},
					{
						id: 'duration',
						type: 'text',
						label: 'duration in seconds',
						width: '100%',
						setup: function( widget ) {
							this.setValue( widget.data.duration );
						},
						commit: function( widget ) {
							widget.setData( 'duration', this.getValue() );
						}
					},
					{
						id: 'columns',
						type: 'text',
						label: 'columns',
						width: '100%',
						setup: function( widget ) {
							this.setValue( widget.data.columns );
						},
						commit: function( widget ) {
							widget.setData( 'columns', this.getValue() );
						}
					}
        ]
      },
      {
        id: 'tab-adv',
        label: 'Advanced Settings',
        elements: [
          {
            id: 'scoreBaseline',
            type: 'text',
            label: 'Baseline score',
            width: '100%',
            setup: function( widget ) {
              this.setValue( widget.data.scoreBaseline );
            },
            commit: function( widget ) {
              widget.setData( 'scoreBaseline', this.getValue() );
            }
          },
          {
            id: 'scoreTarget',
            type: 'text',
            label: 'Target score',
            width: '100%',
            setup: function( widget ) {
              this.setValue( widget.data.scoreTarget );
            },
            commit: function( widget ) {
              widget.setData( 'scoreTarget', this.getValue() );
            }
          },
          {
            id: 'scoreSpread',
            type: 'text',
            label: 'Spread score',
            width: '100%',
            setup: function( widget ) {
              this.setValue( widget.data.scoreSpread );
            },
            commit: function( widget ) {
              widget.setData( 'scoreSpread', this.getValue() );
            }
          }
        ]
      }
    ]
	};
} );
