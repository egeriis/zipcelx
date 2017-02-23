const childValidator = array => (
  array.reduce((bool, item) => {
    return Array.isArray(item) && bool;
  }, true)
);

export default (data) => {
  if (!Array.isArray(data)) {
    return false;
  }

  if (!childValidator(data)) {
    return false;
  }

  return true;
};
