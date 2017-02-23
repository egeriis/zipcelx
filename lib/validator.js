"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var childValidator = function childValidator(array) {
  return array.reduce(function (bool, item) {
    return Array.isArray(item) && bool;
  }, true);
};

exports.default = function (data) {
  if (!Array.isArray(data)) {
    return false;
  }

  if (!childValidator(data)) {
    return false;
  }

  return true;
};