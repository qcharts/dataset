import filterClone from 'filter-clone'
import state from './state'
class Cell {
  constructor(data) {
    this.data = filterClone(data, [], ['__cell'])
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
