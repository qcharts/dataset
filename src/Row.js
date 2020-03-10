import { mixinEvent } from './event'
import state from './state'
class List extends Array {
  constructor(name, option) {
    super()
    this.__store = Object.create(null)
    this.__store.__name = name
    this.__store.__option = option
    this.__store.dataset = null
    mixinEvent(this)
  }
  get data() {
    let arr = []
    this.forEach(cell => {
      arr.push(cell.data)
    })
    return arr
  }
  set dataset(arr) {
    this.__store.dataset = arr
  }
  get dataset() {
    return this.__store.dataset
  }
  get name() {
    return this.__store.__name
  }
  get option() {
    return this.__store.__option
  }
  get state() {
    //遍历子项，查看状态是否统一
    let sta = this[0].state
    for (let i = 1; i < this.length; i++) {
      if (this[i].state !== sta) {
        sta = 'mixed'
        break
      }
    }
    return sta
  }
  set state(name) {
    if (state[name] && this.state !== state[name]) {
      //给所有子项设置state
      this.forEach(cell => {
        cell.state = state[name]
      })
      let dispatchOption = null
      if (this instanceof Row) {
        dispatchOption = { name: 'row', value: state[name], data: this }
      } else if (this instanceof Col) {
        dispatchOption = { name: 'col', value: state[name], data: this }
      }
      this.dispatchEvent('change', dispatchOption)
      this.dataset && this.dataset.dispatchEvent('change', dispatchOption)
    }
  }
}
class Row extends List {}
class Col extends List {}
export { Row, Col }
