"use strict";

var _require = require("./util"),
    asyncFulfilledTask = _require.asyncFulfilledTask,
    asyncRejectedTask = _require.asyncRejectedTask; // 核心：看谁跑的快


var fulfilledPromise = Promise.race([1, new Set(), asyncFulfilledTask(1, 2000)]);
console.log(fulfilledPromise);
fulfilledPromise.then(function (res) {
  console.log(res);
});
var rejectPromise = Promise.race([asyncFulfilledTask(2, 2000), asyncFulfilledTask(3, 1000), asyncRejectedTask(4, 3000)]);
console.log(rejectPromise);
rejectPromise.then(function (res) {
  console.log(res);
});
var data = Promise.race([1, new Set(), 1]); // 谁先输出，为什么

console.log(data);
data.then(function (res) {
  console.log(res);
});