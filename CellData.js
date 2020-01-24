import state from './state'
class CellData extends Object {
  constructor(data, option) {
    super()
    this.__store = Object.create(null)
    this.__store.__option = option
    //存放使用到该数据的cells
    this.__store.cells = []
    for (let key in data) {
      if (key.indexOf('__') !== 0) {
        this[key] = data[key]
      }
    }
    this.__store.origin = data
    this.__store.__state = state.default
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
export default CellData
