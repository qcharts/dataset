import state from './state'
let store = Object.create(null)
class Cell extends Object {
  constructor(data, option) {
    super()
    store.__option = option
    for (let key in data) {
      if (key.indexOf('__') !== 0) {
        this[key] = data[key]
      }
    }
    store.__state = state.default
  }
  get value() {
    return this[store.__option['value']]
  }
  get text() {
    return this[store.__option['text']]
  }
  get option() {
    return store.__option
  }
  get state() {
    return store.__state
  }
  set state(name) {
    store.__state = state[name]
  }
}
export default Cell
