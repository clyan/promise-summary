"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Promise.resolve = function (data) {
  if (data instanceof Promise) {
    return data;
  }

  if (_typeof(data) === 'object' && Object.prototype.hasOwnProperty.call(data, 'then')) {}
};