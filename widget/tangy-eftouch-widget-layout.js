import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/tangy-form.js'
import 'tangy-form/input/tangy-eftouch.js'
import 'tangy-form/input/tangy-input.js'

class TangyEftouchWidgetLayout extends PolymerElement {

  teplate() {
    return html``
  }

  connectedCallback() {
    this.name = this.getAttribute('name')
    this.value = this.innerHTML
  }

  static get _props() {
    return ['name', 'value']
  }

  get value() {
    return this._layoutToOptions(this.layout)
  }

  set value(optionsMarkup = '') {
    if (optionsMarkup) {
      this.innerHTML = optionsMarkup
    }
    this.layout = this._optionsToLayout()
  }

  get layout() {
    return this._layout
  }
  
  set layout(layout) {
    this._layout = layout
    const violation = this._detectViolation(this._layout)
    this.render(this._layout, violation)
  }

  render(layout = [], violation = '') {
    this.innerHTML = `
      <style>
        .column {
          width: 250px;
          background: #EEE;
          margin: 15px;
          padding: 15px;
        }
        .row {
          display: flex;
        }
        .violation {
          border: solid 5px red;
          padding: 15px;
          margin: 15px;
        }
      </style>
      ${violation !== '' ? `
        <div class="violation">
          ${violation}
        </div>
      ` : ''}
      <div>
        ${layout.map((row, rowNumber) => `
          <div class="row">
            <div class="column"> 
              Row height: <input row-number="${rowNumber}" type="number" name="height" value="${row.height}"> <br>
            </div>
            ${row.columns.map((column, columnNumber) => `
              <div class="column">
                Image: <input type="text" row-number="${rowNumber}" column-number="${columnNumber}" name="src" value="${column.src}"><br>
                Width: <input type="number" row-number="${rowNumber}" column-number="${columnNumber}" name="width" value="${column.width}"><br>
                Value: <input type="text" row-number="${rowNumber}" column-number="${columnNumber}" name="value" value="${column.value}"><br>
              </div>
            `).join('')}
            <div class="column">
              <paper-button class="add-column" row-number="${rowNumber}">add column</paper-button>
            </div>
          </div>
        `).join('')}
        <paper-button class="add-row">add row</paper-button>
      </div>
    
    `
    this.addEventListener('change', (ev) => this.changeLayout({
      rowNumber: ev.target.hasAttribute('row-number') ? parseInt(ev.target.getAttribute('row-number')) : undefined,
      columnNumber: ev.target.hasAttribute('column-number') ? parseInt(ev.target.getAttribute('column-number')) : undefined,
      propertyName: ev.target.getAttribute('name'),
      propertyValue: ev.target.value
    }))
    this.querySelectorAll('.add-column').forEach(addColumnButton => {
      addColumnButton.addEventListener('click', (event) => this.addColumn(parseInt(event.target.getAttribute('row-number'))))
    })
    this.querySelector('.add-row').addEventListener('click', (event) => this.addRow())
  }

  changeLayout({
    rowNumber = 0,
    columnNumber = undefined,
    propertyName = '',
    propertyValue = ''
  }) {
    if (propertyName === 'height') {
      this.layout = this.layout.map((row, i) => rowNumber === i
        ? {...row, height: propertyValue}
        : row
      )
    } else {
      this.layout = this.layout.map((row, i) => rowNumber !== i
        ? row
        : {
          ...row, 
          columns: row.columns.map((column, i) => columnNumber !== i
            ? column 
            : {...column, [propertyName]: propertyValue}
          )
        }
      )
    }
  }

  addColumn(rowNumber = 0) {
    this.layout = this.layout.map((row, i) => i === rowNumber 
      ? {
          ...row, 
          columns: [
            ...row.columns, 
            {
              src: '', 
              width: 0, 
              value: ''
            }
          ] 
        }
      : row
    ) 
  }
  
  addRow() {
    this.layout = [ ...this.layout, { height: 0, columns: [] } ]
  }
    
  _detectViolation(layout) {
    let violationMessage = ''
    // Look for a row whose sum of columns widths is greater than 100.
    // Is the sum of rows height greater than 100?


  }

  _layoutToOptions(layout = []) {
    const options = layout.reduce((options, row) => [
      ...options,
      ...row.columns.map(column => { 
        return { 
          ...column,
          height: row.height 
        } 
      })
    ], [])
    return options.map(option => `<option value="${option.value}" height="${option.height}" width="${option.width}" src="${option.src}"></options>`).join('')
  }

  // Given an array of options objects with option.width properties, group them into a matrix
  // where the totals of any row's option.width properties is not greater than 100.
  _optionsToLayout() {
    const options = [...this.querySelectorAll('option')].map(option => {
      return {
        width: parseInt(option.getAttribute('width')),
        height: parseInt(option.getAttribute('height')),
        src: option.getAttribute('src'),
        value: option.getAttribute('value')
      }
    })
    const { layout } = options.reduce((acc, option) => option.width + acc.rowWidth > 100
        ? {
            rowWidth: 0 + option.width,
            rowIndex: acc.rowIndex + 1,
            layout: [...acc.layout, { height: option.height, columns: [ option ] }]
          }
        : {
            rowWidth: acc.rowWidth + option.width,
            rowIndex: acc.rowIndex,
            layout: acc.layout.map((row, rowIndex) => rowIndex === acc.rowIndex 
              ? { height: option.height, columns: [...row.columns, option] } 
              : row
            )
          }
        , {
          rowWidth: 0,
          rowIndex: 0, 
          layout: [ 
            { 
              height: 0,
              columns: [] 
            } 
          ] 
        } 
      )
    return layout 
  }

}

window.customElements.define('tangy-eftouch-widget-layout', TangyEftouchWidgetLayout);
