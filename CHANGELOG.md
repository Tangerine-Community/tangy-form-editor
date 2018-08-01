
## v4.1.0
- Add support for adding `right-to-left` and `hide-back-button` attributes to `<tangy-form-item>`.

## v4.0.0
- Breaking Change: Now emits `tangy-form-editor-change` event instead of `change` event.
- Feature: Can now mark items to be included on the summary tab after form completion.
- Bug: Clicking a checkbox in ckeditor would result in that checkbox being checked in the form on load. It was decided this is undesirable behavior. All values are set to "" by default.
