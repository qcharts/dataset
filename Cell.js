import state from './state'
import { mixinEvent } from './event'
class Cell extends Object {
  constructor(data, option) {
    super()
    this.__store = Object.create(null)
    this.__store.state = state['default']
    this.__store.row = undefined
    this.__store.col = undefined
    this.__store.option = option
    this.__store.data = data
    mixinEvent(this)
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
    this.__store.state = state[name]
  }
}
export default Cell
