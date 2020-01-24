import state from './state'
import { mixinEvent } from './event'
import CellData from './CellData'
class Cell extends Object {
  constructor(data, option) {
    super()
    let myData = null
    if (data instanceof CellData) {
      //重新重组dataset 例如 selectRows
      myData = data
    } else if (data instanceof Cell) {
      myData = data.__store.data
    } else {
      //新建
      myData = new CellData(data, option)
    }
    myData.__store.cells.push(this)
    this.__store = Object.create(null)
    this.__store.row = null
    this.__store.col = null
    this.__store.data = myData
    mixinEvent(this)
  }
  get value() {
    return this.__store.data[this.option['value']]
  }
  get text() {
    return this.__store.data[this.option['text']]
  }
  get row() {
    return this.__store.row
  }
  get col() {
    return this.__store.col
  }
  get option() {
    return this.__store.data.option
  }
  get state() {
    return this.__store.data.state
  }
  set state(name) {
    this.__store.data.state = state[name]
    this.__store.data.cells.forEach(cell => {
      cell.dispatchEvent('change', { type: 'cell', data: cell })
    })
  }
}
export default Cell
