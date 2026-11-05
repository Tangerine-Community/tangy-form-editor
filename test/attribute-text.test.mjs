// `node --test test/` — an editor round trip used to write a missing value out as the word
// "undefined" or "null" (label="undefined", error-text="null", image="undefined"). Forms then showed
// that word to the person filling them in, and a broken-image icon for the picture.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { cleanText, textAttribute } from '../attribute-text.js'

test('cleanText keeps text an author typed', () => {
  assert.equal(cleanText('Pick one'), 'Pick one')
  assert.equal(cleanText('0'), '0')
  assert.equal(cleanText('Not null today'), 'Not null today')
})

test('cleanText turns a missing value, or the words "undefined" and "null", into empty text', () => {
  for (const missing of [undefined, null, '', 'undefined', 'null', ' undefined ']) {
    assert.equal(cleanText(missing), '', JSON.stringify(missing))
  }
})

test('textAttribute writes name="value" for real text', () => {
  assert.equal(textAttribute('label', 'Status'), 'label="Status"')
})

test('textAttribute writes nothing for a missing value', () => {
  for (const missing of [undefined, null, '', 'undefined', 'null']) {
    assert.equal(textAttribute('error-text', missing), '', JSON.stringify(missing))
  }
})

// The widgets are Polymer elements and cannot load under node, so these read their source:
// every author-text attribute they write, and every edit-form value they prefill, must go
// through the helpers above. A raw `="${config.x}"` is what wrote "undefined" before.
const source = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')

test('the base widget writes question number, label, hint, error and warning text only through textAttribute', () => {
  const raw = source('tangy-base-widget.js').match(/(question-number|label|hint-text|error-text|warn-text)="\$\{config\.\w+\}"/g)
  assert.equal(raw, null, `raw attribute writes left: ${raw}`)
})

test('the base widget edit form prefills warning and error text through cleanText', () => {
  const raw = source('tangy-base-widget.js').match(/value="\$\{config\.(warnText|errorText|label|hintText|questionNumber)( \|\| '')?\}"/g)
  assert.equal(raw, null, `raw prefills left: ${raw}`)
})

test('the radio blocks widget writes an option image and sound only when there is one', () => {
  const raw = source('widget/tangy-radio-blocks-widget.js').match(/(image|sound)="\$\{option\.(image|sound)\}"/g)
  assert.equal(raw, null, `raw option writes left: ${raw}`)
})
