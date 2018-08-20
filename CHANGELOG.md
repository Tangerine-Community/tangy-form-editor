
## v4.4.2
- Improvements for categories feature.
- Dispatch change event only when user clicks save button.

## v4.4.0
- Add ability to set value and label in options for tangy-checkoxes and tangy-radiobuttons

## v4.3.0
- Item editor now has cancel and save buttons with more logical behavior.
- tangy-form version bumped to v2.2.7.

## v4.2.3
- Make tangy-select button in ckeditor look like a select button, not a radiobutton.

## v4.2.0
- Fix an issue that was causing tangy-timed output to be missing value attributes of option elements.
- Add tangy-if field to all plugins for skip logic inline not in on-change and on-open.

## v4.1.0
- Add support for adding `right-to-left` and `hide-back-button` attributes to `<tangy-form-item>`.

## v4.0.0
- Breaking Change: Now emits `tangy-form-editor-change` event instead of `change` event.
- Feature: Can now mark items to be included on the summary tab after form completion.
- Bug: Clicking a checkbox in ckeditor would result in that checkbox being checked in the form on load. It was decided this is undesirable behavior. All values are set to "" by default.
