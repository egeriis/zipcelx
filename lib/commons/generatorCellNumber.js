"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var generateColumnLetter = function generateColumnLetter(colIndex) {
  return String.fromCharCode(97 + colIndex).toUpperCase();
};

exports.default = function (index, rowNumber) {
  return "" + generateColumnLetter(index) + rowNumber;
};