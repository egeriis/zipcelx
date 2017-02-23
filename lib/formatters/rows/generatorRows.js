'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _formatRow = require('./formatRow');

var _formatRow2 = _interopRequireDefault(_formatRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (rows) {
  return rows.map(function (row, index) {
    return (0, _formatRow2.default)(row, index);
  }).join('');
};