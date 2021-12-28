"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * 返回一个成功的Promise
 * @param {*} data 
 * @param {*} delay 
 * @returns 
 */
var asyncFulfilledTask = function asyncFulfilledTask(data, delay) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(data);
    }, delay);
  });
};
/**
 * 返回一个失败的Promise
 * @param {*} data 
 * @param {*} delay 
 * @returns 
 */


var asyncRejectedTask = function asyncRejectedTask(data, delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(data);
    }, delay);
  });
};
/**
 * 判断是否是一个可迭代对象
 * @param {*} obj 
 * @returns 
 */


var canIterable = function canIterable(obj) {
  return _typeof(obj) === 'object' && obj !== null && typeof obj[Symbol.iterator] === 'function';
};

module.exports = {
  asyncFulfilledTask: asyncFulfilledTask,
  asyncRejectedTask: asyncRejectedTask,
  canIterable: canIterable
};