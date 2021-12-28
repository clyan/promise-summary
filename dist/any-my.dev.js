"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = require("./util"),
    asyncFulfilledTask = _require.asyncFulfilledTask,
    asyncRejectedTask = _require.asyncRejectedTask,
    canIterable = _require.canIterable;

Promise.any = function (iterable) {
  if (!canIterable(iterable)) {
    if (iterable === undefined) {
      throw new TypeError("".concat(iterable, " is not iterable (cannot read property Symbol(Symbol.iterator))"));
    } else {
      throw new TypeError("".concat(_typeof(iterable), "  ").concat(iterable, " is not iterable (cannot read property Symbol(Symbol.iterator))"));
    }
  }

  return new Promise(function (resolve, reject) {
    var count = 0;

    for (var i = 0; i < iterable.length; i++) {
      Promise.resolve(iterable[i]).then(function (data) {
        return resolve(data);
      }, function (error) {
        count++;

        if (count === iterable.length) {
          resolve(error);
          throw new AggregateError("All promises were rejected");
        }
      });
    }
  });
};

var fulfilledPromise = Promise.any([1, new Set(), asyncFulfilledTask(1, 2000)]);
console.log(fulfilledPromise);
fulfilledPromise.then(function (res) {
  console.log(res);
});
var rejectPromise = Promise.any([asyncFulfilledTask(2, 2000), asyncFulfilledTask(3, 1000), asyncRejectedTask(4, 3000)]);
console.log(rejectPromise);
rejectPromise.then(function (res) {
  console.log(res);
}); // const  rejectPromiseAll = Promise.any([asyncRejectedTask(2, 2000), asyncRejectedTask(3, 1000), asyncRejectedTask(4, 3000)])
// console.log(rejectPromiseAll)
// rejectPromise.then((res) => {
//     console.log(res+"11111")
// })

var data = Promise.any([1, new Set(), 1]); // 谁先输出，为什么

console.log(data);
data.then(function (res) {
  console.log(res);
});
Promise.any([]);