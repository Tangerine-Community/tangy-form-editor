class TangyFormEditorWidgets {
  constructor() {
    this.widgets = []
  }
  // `options` is how a widget offers itself to the "Add Elements" palette: `{label, icon}`. The
  // core widgets pass none and stay listed by the palette's own markup, so a registration only gets
  // a button when it asks for one. That is what lets a group script loaded after the editor — an
  // `alternative-scripts.js` shipped by a module — add an input type without touching this package.
  define(widgetName, claimElement, widgetClass, options = {}) {
    // A widget must not be named after the element it claims. tangy-form-condensed-editor's wrap()
    // finds a widget by matching the node against claimElement and then creates widgetName, so when
    // the two are equal the wrapper matches its own claim and the element ends up nested inside a
    // copy of itself on every pass. Throwing here fails the registration at load time, where the
    // mistake is, rather than silently at render.
    if (widgetName === claimElement) {
      throw new Error(`tangy-form-editor: widget name must differ from the element it claims (${widgetName})`)
    }
    this.widgets.push({
      widgetName,
      claimElement,
      widgetClass,
      // Spread rather than assign, so an unlabelled widget keeps the exact shape it had before.
      ...(options.label ? { label: options.label } : {}),
      ...(options.icon ? { icon: options.icon } : {})
    })
  }
}

// Protect against this being declared more than once and thus possibly overriding some declared widgets.
if (!window.tangyFormEditorWidgets) {
  window.tangyFormEditorWidgets = new TangyFormEditorWidgets()
}