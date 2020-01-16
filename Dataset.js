import Cell from './Cell'
//import filterClone from 'filter-clone'
import state from './state'
class Dataset extends Array {
  constructor(data, option) {
    super()
    data.forEach((item, i) => {
      item.__cell = new Cell(item)
      this[i] = item
    })
    this.__option = option
    this.__deps = []
    this.__rows = []
    this.__rows = getArrData(this, Row, option)
  }
  get option() {
    return this.__option
  }
  get cols() {
    let cols = []
    let colLen = 0
    this.__rows.forEach(row => {
      if (row.length > colLen) {
        colLen = row.length
      }
    })
    for (let i = 0; i < colLen; i++) {
      let arr = []
      this.__rows.forEach(item => {
        arr.push(item[i])
      })
      cols.push(arr)
    }
    return cols
  }
  get rows() {
    return this.__rows
  }
  selectRows(name) {
    let rowKey = this.option.row
    let arr = []
    this.forEach(item => {
      if (name.indexOf(item[rowKey]) !== -1) {
        arr.push(item)
      }
    })
    return new Dataset(arr, this.option)
  }
  addDep(dep) {
    this.__deps.push(dep)
  }
}
function getArrData(data = [], Cls, option) {
  let { row: key, col: sortKey } = option
  let resArr = []
  if (key === '*') {
    let list = new Cls('*', option)
    data.forEach(item => {
      list.push(item.__cell)
    })
    resArr.push(list.sort(keySort))
  } else {
    let keys = Object.create(null)
    data.forEach(item => {
      if (!keys[item[key]]) {
        keys[item[key]] = new Cls(item[key], option)
      }
      keys[item[key]].push(item.__cell)
    })
    for (let key in keys) {
      resArr.push(keys[key].sort(keySort))
    }
  }
  return resArr
  function keySort(a, b) {
    if (sortKey) {
      return a.data[sortKey] > b.data[sortKey] ? 1 : -1
    }
  }
}
class BaseList extends Array {
  constructor(name, option) {
    super()
    this.__name = name
    this.__option = option
  }
  get name() {
    return this.__name
  }
  get option() {
    return this.__option
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
class Row extends BaseList {}

export default Dataset
