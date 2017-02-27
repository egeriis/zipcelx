'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _constants = require('./commons/constants');

var childValidator = function childValidator(array) {
  return array.every(function (item) {
    return Array.isArray(item);
  });
};

exports.default = function (config) {
  if (!config.filename) {
    console.error(_constants.MISSING_KEY_FILENAME);
    return false;
  }

  if (typeof config.filename !== 'string') {
    console.error(_constants.INVALID_TYPE_FILENAME);
    return false;
  }

  if (!Array.isArray(config.sheet.data)) {
    console.error(_constants.INVALID_TYPE_SHEET);
    return false;
  }

  if (!childValidator(config.sheet.data)) {
    console.error(_constants.INVALID_TYPE_SHEET_DATA);
    return false;
  }

  return true;
};