import filterClone from 'filter-clone'
import state from './state'
class Cell extends Object {
  constructor(data) {
    super()
    for (let key in data) {
      if (key.indexOf('__') !== 0) {
        this[key] = data[key]
      }
    }
    this.__state = state.default
  }
  get state() {
    return this.__state
  }
  set state(name) {
    this.__state = state[name]
  }
}
export default Cell
