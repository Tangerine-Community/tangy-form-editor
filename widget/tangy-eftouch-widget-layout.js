import {html, PolymerElement} from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-card/paper-card.js'
import '@polymer/paper-button/paper-button.js'
import 'tangy-form/tangy-form.js'
import 'tangy-form/input/tangy-eftouch.js'
import 'tangy-form/input/tangy-input.js'

class TangyEftouchWidgetLayout extends HTMLElement {

  get props() {
    return {
      options: this._layoutToOptions(this._props.matrix)
    }
  }

  set props({options = []}) {
    this._props = {
      layout: this._optionsToLayout(options)
    }
    this.render(this._props)
  }

  render({ layout = [] }) {
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
      </style>
      <div>
        ${this._props.layout.map(row => `
          <div class="row">
            <div class="column"> row height: <input type="number" value="${row.height}"> </div>
            <div class="column"> <paper-button>add column</paper-button> </div>
            ${row.columns.map(column => `
              <div class="column">
                Image: <input type="text" value="${column.src}">
                Width: <input type="number" value="${column.width}">
                Value: <input type="text" value="${column.value}">
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
    
    `

  }

  // Given an array of options objects with option.width properties, group them into a matrix
  // where the totals of any row's option.width properties is not greater than 100.
  _optionsToLayout(options = []) {
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

  _layoutToOptions(layout = []) {
    // TODO

  }


}

window.customElements.define('tangy-eftouch-widget-layout', TangyEftouchWidgetLayout);
