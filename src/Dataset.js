import Cell from "./Cell";
import { Row, Col } from "./Row";
import { mixinEvent } from "./event";
class Dataset extends Array {
  constructor(data, option) {
    super();
    this.layoutScaleFunc = this.handleLayoutScale(option.layoutScale);
    data.forEach((item, i) => {
      let cell = item;
      if (!(item instanceof Cell)) {
        cell = new Cell(item, option, this);
      } else {
        cell.datasets.push(this);
      }
      this[i] = cell;
    });
    this.__store = Object.create(null);
    let store = this.__store;
    store.__option = option;
    store.__deps = [];
    store.__rows = [];
    store.__rows = getArrData(this, option);
    mixinEvent(this);
  }
  get option() {
    return this.__store.__option;
  }
  get cols() {
    let cols = [];
    let colLen = 0;
    this.__store.__rows.forEach((row) => {
      if (row.length > colLen) {
        colLen = row.length;
      }
    });
    for (let i = 0; i < colLen; i++) {
      let arr = new Col();
      arr.dataset = this;
      this.__store.__rows.forEach((item) => {
        arr.push(item[i]);
      });
      cols.push(arr);
    }
    return cols;
  }
  get rows() {
    return this.__store.__rows;
  }
  resetState(state = "default") {
    let res = [];
    this.forEach((cell) => {
      //reset的时候不处理disabled
      if (cell.state !== state && cell.state !== "disabled") {
        res.push(cell);
        cell.state = state;
      }
    });
    this.dispatchEvent("change", { name: "reset", data: res });
  }
  selectRows(name) {
    let rowKey = this.option.row;
    let arr = [];
    this.forEach((item) => {
      if (name.indexOf(item.data[rowKey]) !== -1) {
        arr.push(item);
      }
    });
    return new Dataset(arr, this.option);
  }
  addDep(dep) {
    this.__store.__deps.push(dep);
  }
  handleLayoutScale(layoutScale) {
    if (typeof layoutScale === "string") {
      let method = layoutScale.replace(/\d+$/, "");
      let NUM = 2;
      if (method !== "sqrt" && method !== "pow" && method !== "log") {
        console.warn("layoutScale type error");
        return function (value) {
          return value;
        };
      }

      let number = layoutScale.replace(/^[a-z]+/, "");
      if (number) {
        let isNumber = /^[-+]?\d*$/.test(number);
        if (!isNumber) {
          console.warn("layoutScale type error");
          return function (value) {
            return value;
          };
        } else {
          NUM = Number(number);
        }
      }

      switch (method) {
        case "sqrt":
          this.datasetReverse = function (value) {
            return Math.pow(value, NUM);
          };
          return function (value) {
            return Math.pow(value, 1 / NUM);
          };
        case "pow":
          this.datasetReverse = function (value) {
            return Math.pow(value, 1 / NUM);
          };
          return function (value) {
            return Math.pow(value, NUM);
          };
        case "log":
          if (NUM !== 2 && NUM !== 10) {
            console.warn("layoutScale type error");
            return function (value) {
              return value;
            };
          }
          this.datasetReverse = function (value) {
            return Math.pow(NUM, value);
          };
          return function (value) {
            return Math["log" + NUM](value);
          };
        default:
          console.warn("layoutScale type error");
          return function (value) {
            return value;
          };
      }
    }
    return layoutScale;
  }
}
function getArrData(data = [], option) {
  let { row: key, col: sortKey } = option;
  let resArr = [];
  if (key === "*") {
    let list = new Row("*", option);
    data.forEach((item) => {
      list.push(item);
    });
    resArr.push(list.sort(keySort));
  } else {
    let keys = Object.create(null);
    data.forEach((item) => {
      let data = item.__store.data;
      if (!keys[data[key]]) {
        keys[data[key]] = new Row(data[key], option);
      }
      keys[data[key]].push(item);
    });
    for (let key in keys) {
      let curRow = keys[key].sort(keySort);
      resArr.push(curRow);
    }
  }
  resArr.forEach((list, m) => {
    list.dataset = data;
    list.forEach((cell, n) => {
      cell.row = m;
      cell.col = n;
    });
  });
  return resArr;
  function keySort(a, b) {
    if (sortKey) {
      return a.data[sortKey] > b.data[sortKey] ? 1 : -1;
    }
  }
}

export default Dataset;
