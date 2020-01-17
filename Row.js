class Row extends Array {
  constructor(name, option) {
    super()
    this.__store = Object.create(null)
    this.__store.__name = name
    this.__store.__option = option
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
    //给所有子项设置state
    this.forEach(cell => {
      cell.state = state[name]
    })
  }
}
export default Row
