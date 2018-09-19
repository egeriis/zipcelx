import {
  MISSING_KEY_FILENAME,
  INVALID_TYPE_FILENAME,
  INVALID_TYPE_SHEET,
  INVALID_TYPE_SHEET_DATA,
  MISSING_SHEET_PROPERTY,
} from './commons/constants';

const childValidator = (array) => {
  return array.every(item => Array.isArray(item));
};

export default (config) => {
  if (!config.filename) {
    console.error(MISSING_KEY_FILENAME);
    return false;
  }

  if (typeof config.filename !== 'string') {
    console.error(INVALID_TYPE_FILENAME);
    return false;
  }

  if (config.sheet) {
    if (!Array.isArray(config.sheet.data)) {
      console.error(INVALID_TYPE_SHEET);
      return false;
    }

    if (!childValidator(config.sheet.data)) {
      console.error(INVALID_TYPE_SHEET_DATA);
      return false;
    }
  }

  if (config.sheets) {
    const sheets = Object.keys(config.sheets);
    if (!sheets.length > 0) {
      console.error(INVALID_TYPE_SHEET);
      return false;
    }

    if (!Array.isArray(config.sheets[sheets[0]].data)) {
      console.error(INVALID_TYPE_SHEET);
      return false;
    }

    if (!childValidator(config.sheets[sheets[0]].data)) {
      console.error(INVALID_TYPE_SHEET_DATA);
      return false;
    }
  }

  if (!config.sheet && !config.sheets) {
    console.error(MISSING_SHEET_PROPERTY);
    return false;
  }

  return true;
};
