import Cell from './Cell'
//import filterClone from 'filter-clone'
import Row from './Row'
let store = Object.create(null)
class Dataset extends Array {
  constructor(data, option) {
    super()
    data.forEach((item, i) => {
      item.__cell = new Cell(item, option)
      this[i] = item
    })
    store.__option = option
    store.__deps = []
    store.__rows = []
    store.__rows = getArrData(this, Row, option)
  }
  get option() {
    return store.__option
  }
  get cols() {
    let cols = []
    let colLen = 0
    store.__rows.forEach(row => {
      if (row.length > colLen) {
        colLen = row.length
      }
    })
    for (let i = 0; i < colLen; i++) {
      let arr = []
      store.__rows.forEach(item => {
        arr.push(item[i])
      })
      cols.push(arr)
    }
    return cols
  }
  get rows() {
    return store.__rows
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
    store.__deps.push(dep)
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

export default Dataset
