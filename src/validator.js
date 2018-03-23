import {
  MISSING_KEY_FILENAME,
  INVALID_TYPE_FILENAME,
  INVALID_TYPE_SHEET,
  INVALID_TYPE_SHEET_DATA
} from './commons/constants';

const childValidator = (array) => {
  return array.every(item => Array.isArray(item));
};

export default (config) => {
  if (!config.filename) {
    throw MISSING_KEY_FILENAME;
  } else if (typeof config.filename !== 'string') {
    throw INVALID_TYPE_FILENAME;
  } else if (!Array.isArray(config.sheet.data)) {
    throw INVALID_TYPE_SHEET;
  } else if (!childValidator(config.sheet.data)) {
    throw INVALID_TYPE_SHEET_DATA;
  }

  return true;
};
