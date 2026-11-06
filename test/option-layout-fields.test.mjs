// tangy-form lays out radio buttons, radio blocks and checkboxes with `layout` and shows option
// pictures with `image-display`. The editor had no field for either, and its save wrote back only
// the attributes it knew, so a hand-typed `layout="squares"` vanished the next time the item was saved.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  upcastOptionLayout,
  downcastOptionLayout,
  renderEditOptionLayout,
  onSubmitOptionLayout,
} from '../option-layout-fields.js'

const element = (attrs) => ({ getAttribute: (name) => (name in attrs ? attrs[name] : null) })

test('upcast reads layout and image-display from the form element', () => {
  assert.deepEqual(upcastOptionLayout(element({ layout: 'squares', 'image-display': 'fill' })), { layout: 'squares', imageDisplay: 'fill' })
})

test('upcast of an element with neither attribute gives the defaults', () => {
  assert.deepEqual(upcastOptionLayout(element({})), { layout: 'list', imageDisplay: 'beside' })
})

test('downcast writes the layout and image display an author chose', () => {
  assert.equal(downcastOptionLayout({ layout: 'fit', imageDisplay: 'top' }), 'layout="fit" image-display="top"')
})

test('downcast writes nothing for the defaults or a missing value', () => {
  for (const config of [{ layout: 'list', imageDisplay: 'beside' }, {}, { layout: 'undefined', imageDisplay: null }]) {
    assert.equal(downcastOptionLayout(config), '', JSON.stringify(config))
  }
})

test('a layout survives an editor round trip', () => {
  const written = downcastOptionLayout({ layout: 'squares', imageDisplay: 'fill' })
  const attrs = Object.fromEntries(written.split(' ').map((pair) => pair.replace(/"/g, '').split('=')))
  assert.deepEqual(upcastOptionLayout(element(attrs)), { layout: 'squares', imageDisplay: 'fill' })
})

test('the edit form offers every layout, preselecting the current one', () => {
  const html = renderEditOptionLayout({ layout: 'wrap' })
  assert.match(html, /<tangy-select name="layout" value="wrap"/)
  for (const layout of ['list', 'wrap', 'squares', 'fit']) assert.ok(html.includes(`<option value="${layout}">`), layout)
  assert.ok(!html.includes('name="imageDisplay"'), 'radio buttons have no image display')
})

test('the edit form offers image display only when asked, preselecting the current one', () => {
  const html = renderEditOptionLayout({ layout: 'list', imageDisplay: 'top' }, { imageDisplay: true })
  assert.match(html, /<tangy-select name="imageDisplay" value="top"/)
  for (const display of ['beside', 'top', 'fill']) assert.ok(html.includes(`<option value="${display}">`), display)
})

test('submit reads the chosen layout and image display back', () => {
  const values = { layout: 'squares', imageDisplay: 'fill' }
  const formEl = { querySelector: (selector) => ({ value: values[selector.match(/name=(\w+)/)[1]] }) }
  assert.deepEqual(onSubmitOptionLayout(formEl, { imageDisplay: true }), values)
  assert.deepEqual(onSubmitOptionLayout(formEl), { layout: 'squares' })
})

// The widgets are Polymer elements and cannot load under node, so these read their source.
const source = (file) => readFileSync(new URL(`../widget/${file}`, import.meta.url), 'utf8')
const wiring = {
  'tangy-radio-buttons-widget.js': false,
  'tangy-radio-blocks-widget.js': true,
  'tangy-checkboxes-widget.js': true,
}

for (const [file, imageDisplay] of Object.entries(wiring)) {
  test(`${file} reads, writes, edits and submits the layout fields`, () => {
    const src = source(file)
    for (const call of ['upcastOptionLayout(element)', 'downcastOptionLayout(config)']) assert.ok(src.includes(call), call)
    const option = imageDisplay ? ', { imageDisplay: true }' : ''
    assert.ok(src.includes(`renderEditOptionLayout(config${option})`), 'renderEdit')
    assert.ok(src.includes(`onSubmitOptionLayout(formEl${option})`), 'onSubmit')
  })
}

test('the checkboxes widget keeps an option picture through the editor', () => {
  const src = source('tangy-checkboxes-widget.js')
  assert.ok(src.includes('image: option.getAttribute("image")'), 'upcast')
  assert.ok(src.includes("textAttribute('image', option.image)"), 'downcast')
  assert.ok(src.includes('name="image"') && src.includes('value="${cleanText(option.image)}"'), 'edit field')
})

// Only the values tangy-form knows are ever read, offered or written, so a hand-edited or hostile
// value (a quote, an unknown word) falls back to the default instead of landing in the form or edit card.
test('upcast ignores a layout or image display tangy-form does not know', () => {
  assert.deepEqual(upcastOptionLayout(element({ layout: 'bogus', 'image-display': 'x" onclick="y' })), { layout: 'list', imageDisplay: 'beside' })
})

test('downcast writes nothing for a value outside the allowed lists', () => {
  assert.equal(downcastOptionLayout({ layout: 'squares" onclick="y', imageDisplay: 'sideways' }), '')
})

test('the edit form preselects the default when the current value is not allowed', () => {
  const html = renderEditOptionLayout({ layout: 'a"b', imageDisplay: 'c"d' }, { imageDisplay: true })
  assert.match(html, /<tangy-select name="layout" value="list"/)
  assert.match(html, /<tangy-select name="imageDisplay" value="beside"/)
  assert.ok(!html.includes('a"b') && !html.includes('c"d'))
})
