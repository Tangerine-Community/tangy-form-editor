class TangyFormEditorWidgets {
  constructor() {
    this.widgets = []
  }
  define(elementName, widgetClass) {
    this.widgets.push({
      elementName,
      widgetClass
    })
  }
}

// Protect against this being declared more than once and thus possibly overriding some declared widgets.
if (!window.tangyFormEditorWidgets) {
  window.tangyFormEditorWidgets = new TangyFormEditorWidgets()
}