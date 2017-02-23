'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _formatCell = require('../cells/formatCell');

var _formatCell2 = _interopRequireDefault(_formatCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (row, index) {
  // To ensure the row number starts as in excel.
  var rowIndex = index + 1;
  var rowCells = row.map(function (cell, cellIndex) {
    return (0, _formatCell2.default)(cell, cellIndex, rowIndex);
  }).join('');

  return '<row r="' + rowIndex + '">' + rowCells + '</row>';
};