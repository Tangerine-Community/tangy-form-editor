// The Layout and Option pictures fields, driven through the real widgets in a browser: open the edit
// card, pick a value in the select, submit, and read the attributes the widget wrote into the form.
// test/option-layout-fields.test.mjs covers the helpers under node; this covers the wiring.
//
// LOCAL ONLY. The repo's `npm test` (polymer test / WCT) does not run on current Node, and this repo
// has no karma of its own, so this runs on tangy-form's installed karma with this repo as basePath:
//   cd "../tangy-form" && npx karma start <a copy of tangy-form/karma.conf.cjs with basePath set to
//   this repo, files = this spec, and esbuild nodePaths = ["../tangy-form/node_modules"] for chai>
import { assert } from 'chai'
// The inputs the edit card is built from; the editor app registers them in tangy-form-editor.js.
import 'tangy-form/tangy-form.js'
import 'tangy-form/input/tangy-input.js'
import 'tangy-form/input/tangy-select.js'
import 'tangy-form/input/tangy-checkbox.js'
import 'tangy-form/input/tangy-checkboxes.js'
import 'tangy-form/input/tangy-radio-buttons.js'
import 'tangy-form/input/tangy-radio-blocks.js'
import '../tangy-widgets.js'
import '../widget/tangy-radio-buttons-widget.js'
import '../widget/tangy-radio-blocks-widget.js'
import '../widget/tangy-checkboxes-widget.js'

const frames = (n = 2) => new Promise((resolve) => {
  const step = () => (--n <= 0 ? resolve() : requestAnimationFrame(step))
  requestAnimationFrame(step)
})

let stamped = []
const mount = (html) => {
  const host = document.createElement('div')
  host.innerHTML = html
  document.body.appendChild(host)
  stamped.push(host)
  return host.firstElementChild
}

const WIDGETS = [
  { widget: 'tangy-radio-buttons-widget', input: 'tangy-radio-buttons', imageDisplay: false },
  { widget: 'tangy-radio-blocks-widget', input: 'tangy-radio-blocks', imageDisplay: true },
  { widget: 'tangy-checkboxes-widget', input: 'tangy-checkboxes', imageDisplay: true },
]
const OPTIONS = '<option value="t">t</option><option value="g">g</option>'
const widgetFor = ({ widget, input }, attrs = '') =>
  mount(`<${widget}><${input} name="q1"${attrs}>${OPTIONS}</${input}></${widget}>`)

const openEdit = async (el) => {
  el.shadowRoot.querySelector('#edit-button').click()
  await frames()
  return el.shadowRoot.querySelector('tangy-form-item')
}
// Pick a value the way an author does: change the <select> inside tangy-select.
const pick = (formItem, name, value) => {
  const select = formItem.querySelector(`tangy-select[name=${name}]`).shadowRoot.querySelector('select')
  select.value = value
  select.dispatchEvent(new Event('change'))
}
// Submit the edit card and wait for the widget to write the form; fail loudly if it never does.
const submit = async (formItem) => {
  const widget = formItem.getRootNode().host
  const saved = new Promise((resolve) => widget.addEventListener('submit-input', resolve, { once: true }))
  formItem.clickedComplete()
  const invalid = [...formItem.querySelectorAll('[invalid]')].map((el) => el.getAttribute('name'))
  await Promise.race([saved, frames(20).then(() => assert.fail(`edit card did not submit; invalid: ${invalid}`))])
}
const written = (el, input) => el.querySelector(input)
const noJunk = (node) => assert.notMatch(node.outerHTML, /="(undefined|null)"/, 'wrote "undefined" or "null"')

suite('option layout fields in the widgets', () => {
  teardown(() => { stamped.forEach((host) => host.remove()); stamped = [] })

  for (const spec of WIDGETS) {
    suite(spec.widget, () => {
      test('the edit card preselects the layout the form already has', async () => {
        const el = widgetFor(spec, ' layout="squares" image-display="top"')
        const formItem = await openEdit(el)
        assert.equal(formItem.querySelector('tangy-select[name=layout]').value, 'squares')
        const display = formItem.querySelector('tangy-select[name=imageDisplay]')
        if (spec.imageDisplay) assert.equal(display.value, 'top')
        else assert.isNull(display, 'radio buttons offer no option pictures field')
      })

      test('choosing a layout writes it into the form, and it reopens chosen', async () => {
        const el = widgetFor(spec)
        let formItem = await openEdit(el)
        pick(formItem, 'layout', 'fit')
        if (spec.imageDisplay) pick(formItem, 'imageDisplay', 'fill')
        await submit(formItem)
        const input = written(el, spec.input)
        assert.equal(input.getAttribute('layout'), 'fit')
        if (spec.imageDisplay) assert.equal(input.getAttribute('image-display'), 'fill')
        noJunk(input)
        formItem = await openEdit(el)
        assert.equal(formItem.querySelector('tangy-select[name=layout]').value, 'fit')
      })

      test('choosing List (and Beside) removes the attributes', async () => {
        const el = widgetFor(spec, ' layout="wrap" image-display="top"')
        const formItem = await openEdit(el)
        pick(formItem, 'layout', 'list')
        if (spec.imageDisplay) pick(formItem, 'imageDisplay', 'beside')
        await submit(formItem)
        const input = written(el, spec.input)
        assert.isFalse(input.hasAttribute('layout'), 'layout kept')
        assert.isFalse(input.hasAttribute('image-display'), 'image-display kept')
        noJunk(input)
      })

      test('saving an untouched item keeps the layout', async () => {
        const el = widgetFor(spec, ' layout="wrap"')
        await submit(await openEdit(el))
        assert.equal(written(el, spec.input).getAttribute('layout'), 'wrap')
      })
    })
  }

  test('a checkbox option picture is written into the form and reopens in its field', async () => {
    const el = mount(`<tangy-checkboxes-widget><tangy-checkboxes name="q1">
      <option value="a" image="./assets/apple.png">Apple</option><option value="b">Bean</option>
    </tangy-checkboxes></tangy-checkboxes-widget>`)
    let formItem = await openEdit(el)
    const items = () => formItem.querySelector('tangy-list').shadowRoot.querySelectorAll('tangy-list-item')
    assert.equal(items()[0].querySelector('[name=image]').value, './assets/apple.png')
    assert.equal(items()[1].querySelector('[name=image]').value, '', 'an option with no picture shows an empty field')
    items()[1].querySelector('[name=image]').value = './assets/bean.png'
    await submit(formItem)
    const options = el.querySelectorAll('tangy-checkboxes option')
    assert.equal(options[0].getAttribute('image'), './assets/apple.png')
    assert.equal(options[1].getAttribute('image'), './assets/bean.png')
    noJunk(el.querySelector('tangy-checkboxes'))
    formItem = await openEdit(el)
    assert.equal(items()[1].querySelector('[name=image]').value, './assets/bean.png')
  })
})
