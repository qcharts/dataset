import Cell from './Cell'
import filterClone from 'filter-clone'
import state from './state'
class Dataset {
  constructor(data, option) {
    this.data = data
    this.option = option
    this.__deps = []
    this.__cols = []
    this.__rows = []
    let cellData = filterClone(data)
    cellData.forEach(item => {
      item.__cell = new Cell(item)
    })
    this.__rows = getArrData(cellData, option.row, Row)
    this.__cols = getArrData(cellData, option.col, Col)
  }
  get cols() {
    return this.__cols
  }
  get rows() {
    return this.__rows
  }
  addDep(dep) {
    this.__deps.push(dep)
  }
}
function getArrData(data = [], key = '*', Cls) {
  let resArr = []
  if (key === '*') {
    let list = new Cls('*')
    data.forEach(item => {
      list.push(item.__cell)
    })
    resArr.push(list)
  } else {
    let keys = Object.create(null)
    data.forEach(item => {
      if (!keys[item[key]]) {
        keys[item[key]] = new Cls(item[key])
      }
      keys[item[key]].push(item.__cell)
    })
    for (let key in keys) {
      resArr.push(keys[key])
    }
  }
  return resArr
}
class BaseList extends Array {
  constructor(name) {
    super()
    this.name = name
  }
  get state() {
    //遍历子项，查看状态是否统一
    let sta = this[0].state
    for (let i = 1; i < this.length; i++) {
      if (this[i].state !== state) {
        sta = state.mixed
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
class Col extends BaseList {}
class Row extends BaseList {}

export default Dataset
