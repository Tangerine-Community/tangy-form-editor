// Author text (label, hint, error, warning, image URL) as the editor writes it into a form.
// An editor round trip used to write a missing value out as the word "undefined" or "null",
// which the form then showed on screen. Neither is something an author typed.
export function cleanText(value) {
  const text = value == null ? '' : String(value)
  const word = text.trim()
  return word === 'undefined' || word === 'null' ? '' : text
}

// `name="text"`, or nothing at all when there is no text to write.
export function textAttribute(name, value) {
  const text = cleanText(value)
  return text === '' ? '' : `${name}="${text}"`
}
