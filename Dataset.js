import Cell from './Cell'
import { Row, Col } from './Row'
class Dataset extends Array {
  constructor(data, option) {
    super()
    data.forEach((item, i) => {
      item.__cell = new Cell(item, option)
      this[i] = item
    })
    this.__store = Object.create(null)
    let store = this.__store
    store.__option = option
    store.__deps = []
    store.__rows = []
    store.__rows = getArrData(this, Row, option)
  }
  get option() {
    return this.__store.__option
  }
  get cols() {
    let cols = []
    let colLen = 0
    this.__store.__rows.forEach(row => {
      if (row.length > colLen) {
        colLen = row.length
      }
    })
    for (let i = 0; i < colLen; i++) {
      let arr = new Col()
      this.__store.__rows.forEach(item => {
        arr.push(item[i])
      })
      cols.push(arr)
    }
    return cols
  }
  get rows() {
    return this.__store.__rows
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
    this.__store.__deps.push(dep)
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
      let curRow = keys[key].sort(keySort)
      resArr.push(curRow)
    }
  }
  resArr.forEach((list, m) => {
    list.forEach((cell, n) => {
      cell.__store.row = m
      cell.__store.col = n
    })
  })
  return resArr
  function keySort(a, b) {
    if (sortKey) {
      return a[sortKey] > b[sortKey] ? 1 : -1
    }
  }
}

export default Dataset
