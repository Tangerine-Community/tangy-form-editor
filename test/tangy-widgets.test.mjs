// `node --test test/` — the WCT pages beside this file cannot run: polymer-cli's dev server loads
// `spdy` -> `http-deceiver`, which calls `process.binding('http_parser')`, removed from Node years
// ago. The registry is pure logic with one `window` touch, so it is covered here instead.
import { test } from 'node:test'
import assert from 'node:assert/strict'

// The module has no exports — it only hangs an instance off `window`. Import it once against a
// stub, then build a fresh registry per test from that instance's own constructor.
globalThis.window = {}
await import('../tangy-widgets.js')
const TangyFormEditorWidgets = globalThis.window.tangyFormEditorWidgets.constructor

function freshRegistry () { return new TangyFormEditorWidgets() }

test('define() records a widget', () => {
  const registry = freshRegistry()
  class Widget {}
  registry.define('tangy-text-widget', 'tangy-input', Widget)
  assert.deepEqual(registry.widgets, [
    { widgetName: 'tangy-text-widget', claimElement: 'tangy-input', widgetClass: Widget }
  ])
})

// ⛔ THE TRAP THIS GUARD EXISTS FOR. `tangy-form-condensed-editor.js:112-116` finds a widget by
// `childNode.matches(widgetInfo.claimElement)` and then creates `foundWidget.widgetName`. When the
// two are equal the wrapper matches its own claim, so `wrap()` puts the element inside a copy of
// itself on every pass. A registration error must fail at registration, not at render — and
// `define` is the only door into the registry, which is why the guard lives here and not in the
// editor. Once input types can be registered by group scripts, nothing else catches this.
test('define() refuses a widget named after the element it claims', () => {
  const registry = freshRegistry()
  assert.throws(
    () => registry.define('tangy-digest', 'tangy-digest', class {}),
    /must differ/
  )
  assert.deepEqual(registry.widgets, [], 'the bad registration must not be recorded')
})

test('define() allows a widget that claims a different tag', () => {
  const registry = freshRegistry()
  class Widget {}
  registry.define('tangy-digest-widget', 'tangy-digest', Widget)
  assert.equal(registry.widgets.length, 1)
})

// A widget that passes a label is offering itself to the "Add Elements" palette. The 31 core
// widgets pass none, so they are recorded exactly as before and the hardcoded palette markup keeps
// listing them — only registrations that ask for a button get one.
test('define() carries an optional label and icon for the palette', () => {
  const registry = freshRegistry()
  class Widget {}
  registry.define('tangy-digest-widget', 'tangy-digest', Widget, { label: 'Usage digest', icon: 'insights' })
  assert.deepEqual(registry.widgets, [{
    widgetName: 'tangy-digest-widget',
    claimElement: 'tangy-digest',
    widgetClass: Widget,
    label: 'Usage digest',
    icon: 'insights'
  }])
})

test('define() without options records no label, so the palette ignores it', () => {
  const registry = freshRegistry()
  registry.define('tangy-text-widget', 'tangy-input', class {})
  assert.equal(registry.widgets[0].label, undefined)
  assert.equal('label' in registry.widgets[0], false, 'no empty key on an unlabelled widget')
})
