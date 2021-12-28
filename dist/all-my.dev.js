"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = require("./util"),
    asyncFulfilledTask = _require.asyncFulfilledTask,
    asyncRejectedTask = _require.asyncRejectedTask,
    canIterable = _require.canIterable;

Promise.all = function (iterable) {
  if (!canIterable(iterable)) {
    if (iterable === undefined) {
      throw new TypeError("".concat(iterable, " is not iterable (cannot read property Symbol(Symbol.iterator))"));
    } else {
      throw new TypeError("".concat(_typeof(iterable), "  ").concat(iterable, " is not iterable (cannot read property Symbol(Symbol.iterator))"));
    }
  }

  return new Promise(function (resolve, reject) {
    var result = [];

    for (var i = 0; i < iterable.length; i++) {
      Promise.resolve(iterable[i]).then(function (data) {
        result.push(data);

        if (result.length === iterable.length) {
          resolve(result);
        }
      }, function (error) {
        return reject(error);
      });
    }
  });
};

var fulfilledPromise = Promise.all([1, new Set(), asyncFulfilledTask(1, 2000)]);
console.log(fulfilledPromise);
fulfilledPromise.then(function (res) {
  console.log(res);
});
var rejectPromise = Promise.all([1, new Set(), asyncRejectedTask(1, 2000)]);
console.log(rejectPromise);
rejectPromise.then(function (res) {
  console.log(res);
});
var data = Promise.all([1, new Set(), 1]); // 谁先输出

console.log(data);
console.log(1);
data.then(function (res) {
  console.log(res);
});