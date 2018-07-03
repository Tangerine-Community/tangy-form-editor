# \<tangy-form-editor\>

## Install
Global dependencies: redux

```
npm install --save tangy-form-editor
```

## Usage

```html

<tangy-form-editor></tangy-form-editor>

<script>
    // A custom function you write to save state.
    const saveState = state => {
        // Some logic for your app to save state. Watch out for parallel saves. Consider RxJS.
    }

    // Get the element.
    tangyFormEditorEl = document.querySelector('tangy-form-editor')

    // Open the form.
    tangyFormEditorEl.store.dispatch({
        type: 'FORM_OPEN',
        payload: {
          editMode: 'ckeditor', 
          openItem: '',
          form: {
            id: 'form1',
            title: 'Form 1'
          },
          items: [
            {
              id: 'item1',
              title: 'Item 1',
              summary: false,
              hideNextButton: false,
              hideBackButton: true,
              fileContents: `<tangy-input name="input1" label="Input 1"></tangy-input>`
            },
            {
              id: 'item2',
              title: 'Item 2',
              summary: false,
              hideNextButton: true,
              hideBackButton: false,
              fileContents: `<tangy-input name="input2" label="Input 2"></tangy-input> <br>
                              <tangy-complete-button>submit</tangy-complete-button>`
            },
            {
              id: 'item3',
              title: 'Item 3 - Summary',
              summary: true,
              hideNextButton: true,
              hideBackButton: true,
              fileContents: `Thanks for filling out our form!`
            }
          ]
        }
    })

    // Save state when the editor changes state.
    tangyFormEditorEl.store.subscribe(state => saveState(state))
</script>
```

## Develop
```
git clone git@github.com:tangerine-community/tangy-form-editor
cd tangy-form-editor
npm install
npm install --save @polymer/cli
# Serve up the demo.
polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

## Trademark and License
Tangerine is a registered trademark of [RTI International](https://rti.org). This software is licensed under the [GPLv3 License](https://www.gnu.org/licenses/gpl-3.0.en.html).
