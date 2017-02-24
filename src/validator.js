import {
  MISSING_KEY_FILENAME,
  INVALID_TYPE_FILENAME,
  INVALID_TYPE_SHEET,
  INVALID_TYPE_SHEET_DATA
} from './commons/constants';

const childValidator = array => {
  return array.every(item => {
    return Array.isArray(item)
  });
};

export default (config) => {
  if (!config.filename) {
    return {
      error: MISSING_KEY_FILENAME
    };
  }

  if (typeof config.filename !== 'string') {
    return {
      error: INVALID_TYPE_FILENAME
    };
  }

  if (!Array.isArray(config.sheet.data)) {
    return {
      error: INVALID_TYPE_SHEET
    }
  }

  if (!childValidator(config.sheet.data)) {
    return {
      error: INVALID_TYPE_SHEET_DATA
    };
  }

  return true;
};
