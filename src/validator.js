import {
  MISSING_KEY_FILENAME,
  INVALID_TYPE_FILENAME,
  INVALID_TYPE_SHEET,
  INVALID_TYPE_SHEET_DATA,
  INVALID_TYPE_SHEET_NAME,
  MISSING_SHEET_PROPERTY,
  INVALID_SHEET_PROPERTY,
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

  if (config.sheet && config.sheets) {
    console.error(INVALID_SHEET_PROPERTY);
    return false;
  }

  if (!config.sheet && !config.sheets) {
    console.error(MISSING_SHEET_PROPERTY);
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
    if (!config.sheets.length > 0) {
      console.error(INVALID_TYPE_SHEET);
      return false;
    }

    for (let i = 0; i < config.sheets.length; i += 1) {
      if (config.sheets[i].filename && typeof config.sheets[i].filename !== 'string') {
        console.error(INVALID_TYPE_SHEET_NAME);
        return false;
      }

      if (!Array.isArray(config.sheets[i].data)) {
        console.error(INVALID_TYPE_SHEET);
        return false;
      }

      if (!childValidator(config.sheets[i].data)) {
        console.error(INVALID_TYPE_SHEET_DATA);
        return false;
      }
    }
  }

  return true;
};
