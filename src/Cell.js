import state from './state'
import { mixinEvent } from './event'
class Cell extends Object {
  constructor(data, option, dataset) {
    super()
    this.__store = Object.create(null)
    this.__store.state = state['default']
    this.__store.row = undefined
    this.__store.col = undefined
    this.__store.option = option
    this.__store.data = data
    this.__store.datasets = [dataset]
    this._layoutScaleFunc = dataset.layoutScaleFunc
    mixinEvent(this)
  }
  get datasets() {
    return this.__store.datasets
  }
  get data() {
    return this, this.__store.data
  }
  get value() {
    return this.__store.data[this.__store.option['value']]
  }

  get text() {
    return this.__store.data[this.__store.option['text']]
  }
  set row(num) {
    if (this.__store.row === undefined) {
      this.__store.row = num
    }
  }
  get row() {
    return this.__store.row
  }
  set col(num) {
    if (this.__store.col === undefined) {
      this.__store.col = num
    }
  }
  get col() {
    return this.__store.col
  }
  get option() {
    return this.__store.option
  }
  get state() {
    return this.__store.state
  }
  set state(name) {
    if (state[name] && this.__store.state !== state[name]) {
      this.__store.state = state[name]
      this.dispatchEvent('change', {
        name: 'cell',
        value: state[name],
        data: this
      })
      this.datasets.forEach(dataset => {
        dataset.dispatchEvent('change', {
          name: 'cell',
          value: state[name],
          data: this
        })
      })
    }
  }
  layoutScaleValue(key = 'value') {
    return typeof this._layoutScaleFunc === 'function' ? this._layoutScaleFunc(this.__store.data[this.__store.option[key]]) : this.__store.data[this.__store.option[key]]
  }
}
export default Cell
