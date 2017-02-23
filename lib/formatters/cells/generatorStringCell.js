'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.escape');

var _lodash2 = _interopRequireDefault(_lodash);

var _generatorCellNumber = require('../../commons/generatorCellNumber');

var _generatorCellNumber2 = _interopRequireDefault(_generatorCellNumber);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (index, value, rowIndex) {
  return '<c r="' + (0, _generatorCellNumber2.default)(index, rowIndex) + '" t="inlineStr"><is><t>' + (0, _lodash2.default)(value) + '</t></is></c>';
};