# CHANGELOG

## v6.4.1
- Fix strange spacing for tangy partial date icon by switching icons.
- Add missing support for common label attribute of question-number.
- Fix saving of "exit clicks" setting.

## v6.4.0
- Features
  - Support for new elements and attributes in `tangy-form` v4.3.0. https://github.com/Tangerine-Community/tangy-form/blob/master/CHANGELOG.md#v430
- Fixes
  - Fix regex to allow for only valid variable names. 2 or more characters, begin with alpha, no spaces, periods, allow _ no dash
    - Issue: https://github.com/Tangerine-Community/Tangerine/issues/1566, https://github.com/Tangerine-Community/Tangerine/issues/1558, https://github.com/Tangerine-Community/Tangerine/issues/1461
    - PR: https://github.com/Tangerine-Community/tangy-form-editor/pull/77

## v6.3.1
- Fix issue causing a checkbox to have a blank label if not placing label inline.

## v6.3.0
- Added support for modifying `exit-clicks` attribute on tangy-form; this is used in conjunction with fullscreen mode.

## v6.2.1
- Bump `tangy-form` version to `v4.1.1` for API change in tangy-select, EFTouch auto-progress work, and tangy-select test regression fix.

## v6.2.0
- Added autoStop input for untimed-grid-widget. [#65](https://github.com/Tangerine-Community/tangy-form-editor/pull/65)
- Removed display of secondaryLabel in renderPrint(). [#67](https://github.com/Tangerine-Community/tangy-form-editor/pull/67) There was an non-breaking API change in tangy-form - secondaryLabel changed to optionSelectLabel in tangy-select. 

## v6.1.0
- New email input option.
- Fix issue causing tangy-if and valid-if logic to be lost on GPS inputs [#62](https://github.com/Tangerine-Community/tangy-form-editor/pull/62) 
- New widgets to support additional inputs are now easier to write and maintain with the addition of attribute helper API [#64](https://github.com/Tangerine-Community/tangy-form-editor/pull/64)

## v6.0.0
- Upgrade to tangy-form v4.0.0 which includes breaking changes for form content. See details in the [tangy-form CHANGELOG](https://github.com/Tangerine-Community/tangy-form/blob/master/CHANGELOG.md#v400).

## v5.24.0
- Bump `tangy-form` version to `v3.23.0` for `inputs.VARIABE_NAME` access in `valid-if` logic.

## v5.23.2
- Fix for tnagy partial date editing.

## v5.23.1
- Increment tangy-form by patch version to receive some updates that will help with editing `<tangy-partial-date>`.

## v5.23.0
- Add option for adding partial date inputs.

## v5.22.0
- Add an Image option for inserting content into forms using the new file list selector. [#58](https://github.com/Tangerine-Community/tangy-form-editor/pull/58) 

## v5.21.0
- Implement usage of endpoint and file-list-select element for selecting files. [#57](https://github.com/Tangerine-Community/tangy-form-editor/pull/57)

## v5.20.0
- Add ACASI widget, support for incorrect-threshold in tangy-form-item, and 'correct' attribute in tangy-radio-buttons [#56](https://github.com/Tangerine-Community/tangy-form-editor/pull/56)

## v5.19.0
- Add new eftouch features [#55](https://github.com/Tangerine-Community/tangy-form-editor/pull/55)

## v5.18.1
- Fix breaking date/number/time widgets [#54](https://github.com/Tangerine-Community/tangy-form-editor/pull/54)

## v5.18.0
- Change numbering of tangy-timed and tangy-untimed-grid options to start from 1 instead of 0.

## v5.17.0
- Added optionFontSize input for tangy-timed and tangy-untimed-grid widgets.
- Increase tangy-form version to 3.16.0 to support new optionFontSize property in tangy-form.

## v5.16.1
- Fix bug that created duplicate elements when editing a tangy-box element. 
- Enable saving the whole form when using the html editor

## v5.16.0
- Increase tangy-form version to v3.15.0

## v5.15.0
- Now when there is an error in any of your custom logic, during preview an error message will appear with an approximation to where the issue is.

## v5.14.0
- Add "on submit" logic editor [#46](https://github.com/Tangerine-Community/tangy-form-editor/pull/46)

## v5.13.2
- Remove stray button with no functionality on item details editor.
- Remove reference to clicking a + icon to add inputs.

## v5.13.1
- Add additional UI color improvements left out of last release.

## v5.13.0
- UI Color improvements. https://github.com/Tangerine-Community/tangy-form-editor/pull/44

## v5.12.0
- Add support for translations using tangy-translation

## v5.11.3
- Add support for missing show-labels attribute on tangy-timed.

## v5.11.0
- Add editors for <tangy-consent> and <tangy-untimed-grid>

## v5.10.0
- Add support for <tangy-untimed-grid>

## v5.9.0
- Add widget Copy feature.

## v5.8.0
- Add support for editing `<tangy-form-widget>`.

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
