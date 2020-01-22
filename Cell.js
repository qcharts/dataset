import state from './state'
import { mixinEvent } from './event'
class Cell extends Object {
  constructor(data, option) {
    super()
    this.__store = Object.create(null)
    this.__store.__option = option
    this.__store.row = null
    this.__store.col = null
    for (let key in data) {
      if (key.indexOf('__') !== 0) {
        this[key] = data[key]
      }
    }
    this.__store.__state = state.default
    mixinEvent(this)
  }
  get row() {
    return this.__store.row
  }
  get col() {
    return this.__store.col
  }
  get value() {
    return this[this.__store.__option['value']]
  }
  get text() {
    return this[this.__store.__option['text']]
  }
  get option() {
    return this.__store.__option
  }
  get state() {
    return this.__store.__state
  }
  set state(name) {
    this.__store.__state = state[name]
    this.dispatchEvent('change', { type: 'cell', data: this })
  }
}
export default Cell
