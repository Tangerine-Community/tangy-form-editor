# \<tangy-form-editor\>

## Install
Global dependencies: redux

```
npm install --save tangy-form-editor
```

## Usage
Encapsulate a `tangy-form` with `tangy-form-editor` then listen for the `tangy-form-editor`'s `change` event for updates on the form HTML.

```html
<tangy-form-editor>
  <tangy-form id="field-demo" title="Field Demo">
    <tangy-form-item id="text_inputs_1" title="Text Inputs 1">
      <form>
        <tangy-input name="text_input_1" label="This is an input for text." type="text"></tangy-input>
      </form>
    </tangy-form-item>
    <tangy-form-item id="text_inputs_2" title="Text Inputs 2">
      <form>
        <tangy-input name="text_input_2" label="This is an input for text that is required." type="text" error-message="This is required." required></tangy-input>
      </form>
    </tangy-form-item> 
    <tangy-form-item id="summary" summary title="Summary">
      <form>
        Thank you for taking our survey.
      </form>
    </tangy-form-item> 
  </tangy-form>
</tangy-form-editor>
<script>
  // You can listen for changes.
  document.querySelector('tangy-form-editor').addEventListener('change', event => console.log(event.detail))
  // Or at any point you can get the current formHtml from the formHtml property.
  console.log(document.querySelector('tangy-form-editor').formHtml)
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
Note, IE and Firefox tests will fail.

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.

## Browser Compatibility
The combination of CKEditor breaking when used in Shadow DOM and Firefox / IE shadow DOM support is still behind a flag, this means this element does not currently work in Firefox and IE.

## Trademark and License
Tangerine is a registered trademark of [RTI International](https://rti.org). This software is licensed under the [GPLv3 License](https://www.gnu.org/licenses/gpl-3.0.en.html).
