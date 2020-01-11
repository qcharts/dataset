import Cell from './Cell'
//import filterClone from 'filter-clone'
import state from './state'
class Dataset {
  constructor(data, option) {
    this.data = data
    this.option = option
    this.__deps = []
    this.__rows = []
    this.data.forEach(item => {
      if (!item.__cell) {
        //select 场景使用
        item.__cell = new Cell(item)
      }
    })
    this.__rows = getArrData(this.data, option.row, Row, option.col)
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
    let arr = this.data.filter(item => name.indexOf(item[rowKey]) !== -1)
    return new Dataset(arr, this.option)
  }
  addDep(dep) {
    this.__deps.push(dep)
  }
}
function getArrData(data = [], key = '*', Cls, sortKey) {
  let resArr = []
  if (key === '*') {
    let list = new Cls('*')
    data.forEach(item => {
      list.push(item.__cell)
    })
    resArr.push(list.sort(keySort))
  } else {
    let keys = Object.create(null)
    data.forEach(item => {
      if (!keys[item[key]]) {
        keys[item[key]] = new Cls(item[key])
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
class Row extends BaseList {}

export default Dataset
