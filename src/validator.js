import {
  MISSING_KEY_FILENAME,
  INVALID_TYPE_FILENAME,
  INVALID_TYPE_SHEET,
  INVALID_TYPE_SHEET_DATA
} from './commons/constants';
import ErrorHandler from './commons/ErrorHandler';

const childValidator = (array) => {
  return array.every(item => Array.isArray(item));
};

export default (config) => {
  if (!config.filename) {
    throw new ErrorHandler(MISSING_KEY_FILENAME, 'filename');
  } else if (typeof config.filename !== 'string') {
    throw new ErrorHandler(INVALID_TYPE_FILENAME, 'filename');
  } else if (!Array.isArray(config.sheet.data)) {
    throw new ErrorHandler(INVALID_TYPE_SHEET, 'sheet');
  } else if (!childValidator(config.sheet.data)) {
    throw new ErrorHandler(INVALID_TYPE_SHEET_DATA, 'sheet');
  }

  return true;
};
