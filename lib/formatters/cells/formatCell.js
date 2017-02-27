'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('../../commons/constants');

var _generatorStringCell = require('./generatorStringCell');

var _generatorStringCell2 = _interopRequireDefault(_generatorStringCell);

var _generatorNumberCell = require('./generatorNumberCell');

var _generatorNumberCell2 = _interopRequireDefault(_generatorNumberCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (cell, index, rowIndex) {
  if (_constants.validTypes.indexOf(cell.type) === -1) {
    console.warn(_constants.WARNING_INVALID_TYPE);
    cell.type = _constants.CELL_TYPE_STRING;
  }

  return cell.type === _constants.CELL_TYPE_STRING ? (0, _generatorStringCell2.default)(index, cell.value, rowIndex) : (0, _generatorNumberCell2.default)(index, cell.value, rowIndex);
};