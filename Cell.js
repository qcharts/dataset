import state from './state'
class Cell extends Object {
  constructor(data, option) {
    super()
    this.__store = Object.create(null)
    this.__store.__option = option
    for (let key in data) {
      if (key.indexOf('__') !== 0) {
        this[key] = data[key]
      }
    }
    this.__store.__state = state.default
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
  }
}
export default Cell
