const childValidator = array => (
  array.reduce((bool, item) => {
    return Array.isArray(item) && bool;
  }, true)
);

export default (config) => {
  if (!Array.isArray(config.sheet.data)) {
    return false;
  }

  if (!childValidator(config.sheet.data)) {
    return false;
  }

  return true;
};
