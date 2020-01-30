import Cell from './Cell'
import { Row, Col } from './Row'
import { mixinEvent } from './event'
class Dataset extends Array {
  constructor(data, option) {
    super()
    data.forEach((item, i) => {
      let cell = item
      if (!(item instanceof Cell)) {
        cell = new Cell(item, option, this)
      } else {
        cell.datasets.push(this)
      }
      this[i] = cell
    })
    this.__store = Object.create(null)
    let store = this.__store
    store.__option = option
    store.__deps = []
    store.__rows = []
    store.__rows = getArrData(this, option)
    mixinEvent(this)
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
      arr.dataset = this
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
  resetState(state = 'default') {
    let res = []
    this.forEach(cell => {
      if (cell.state !== state) {
        res.push(cell)
        cell.state = state
      }
    })
    this.dispatchEvent('change', { type: 'reset', data: res })
  }
  selectRows(name) {
    let rowKey = this.option.row
    let arr = []
    this.forEach(item => {
      if (name.indexOf(item.data[rowKey]) !== -1) {
        arr.push(item)
      }
    })
    return new Dataset(arr, this.option)
  }
  addDep(dep) {
    this.__store.__deps.push(dep)
  }
}
function getArrData(data = [], option) {
  let { row: key, col: sortKey } = option
  let resArr = []
  if (key === '*') {
    let list = new Row('*', option)
    data.forEach(item => {
      list.push(item)
    })
    resArr.push(list.sort(keySort))
  } else {
    let keys = Object.create(null)
    data.forEach(item => {
      let data = item.__store.data
      if (!keys[data[key]]) {
        keys[data[key]] = new Row(data[key], option)
      }
      keys[data[key]].push(item)
    })
    for (let key in keys) {
      let curRow = keys[key].sort(keySort)
      resArr.push(curRow)
    }
  }
  resArr.forEach((list, m) => {
    list.dataset = data
    list.forEach((cell, n) => {
      cell.row = m
      cell.col = n
    })
  })
  return resArr
  function keySort(a, b) {
    if (sortKey) {
      return a.data[sortKey] > b.data[sortKey] ? 1 : -1
    }
  }
}

export default Dataset
