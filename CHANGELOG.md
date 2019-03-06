# CHANGELOG

## v5.7.0
- Add ability to work with `<tangy-qr>` elements for scanning QR Codes. 

## v5.6.0
- Increase tangy-form version to v3.8.0

## v5.5.1
- Fix issue where if you remove an input from an item and then click back, the item is not saved.
- Bump tangy-form to v3.7.1 to fix long tangy lists that are cut off. 

## v5.5.0
- Add hint text to all Widget edit screens.
- Sanitize input of variable names to ensure they don't break forms.

## v5.4.2
- Enforce consistent usage of styles by utilizing CSS variables.

## v5.4.1
- Enforce consistent usage of styles by utilizing CSS variables.

## v5.4.0
- New 'Valid if' on all widgets.
- Set rows and mark all rows on tangy-timed.
- Fix some widgets having issues with tangy-if.
- Fix tangy location widget's filter by global setting.

## v5.3.1
- Convert both text nodes and unclaimed elements by widgets to tangy-box widgets.
- Fix a bug where tangy-code would end up removing its value if not edited.
- Change "Back to Forms Listing" to "Back to Items Listing".
- Fix undefined values for tangy-timed options and remove unused label on tangy-timed.

## v5.3.0
- bug fixes
  - Dragging Add Widget before Submitting it closes the widget without save https://github.com/Tangerine-Community/Tangerine/issues/1283
  - Unclosed tags in html container can break form https://github.com/Tangerine-Community/Tangerine/issues/1289
  - time on grids cannot be changes and is always 60 seconds https://github.com/Tangerine-Community/Tangerine/issues/1301
  - Min and Max for input number cannot be saved through the interface https://github.com/Tangerine-Community/Tangerine/issues/1297
  - `undefined` should not be the default value in on-change/on-open editor https://github.com/Tangerine-Community/Tangerine/issues/1317
  - If you use a double quote in on change logic the form breaks https://github.com/Tangerine-Community/Tangerine/issues/1185
- Most widgets now have a "hint" field you can add.

## v5.2.0
- CSS improvements and general consistency improvements around save buttons.
- Added ability to edit metadata related output of a tangy-location element.

## v5.1.0
- `<tangy-form-editor print>` will show the form in print mode now. Each widget has an additional `renderPrint` method they can implement to provide markup for the print view.

## v5.0.0
- An entirely new Item editor experience replacing CKEditor.
- Editing a top level form now places "on-change" and "on-open" in an expandable "adanced" section.
- Now support for adding the "fullscreen" attribute to forms that editors want to add the tangy-form fullscreen experience to.
- Support for editing `<tangy-eftouch>` elements.

## v4.10.0
- added score fields and created Advanced tab for them in the tangy-timed plugin.

## v4.9.0
- Add support for filterByGlobal in the tangy-location plugin

## v4.8.0
- Bumped to tangy-form v2.9.0 which adds more elements that we'll make plugins for later.

## v4.7.0
- Bumped to tangy-form v2.6.0 which makes which space more compact in forms.

## v4.6.6
- CKEDITOR dialogs allowed variable name to be characters that would break tangy-form. Now there is validation for allowed characters. 

## v4.6.5
- Minor update to tangy-form that fixes editing of tangy-timed

## v4.6.0
- Update tangy-form.

## v4.5.0
- Feature: Add support for editing min and max of tangy-input

## v4.4.7
- Bug fix: Grids are not rendered in assessments #1039 https://github.com/Tangerine-Community/Tangerine/issues/1039

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
