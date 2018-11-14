// Math.trunc is not supported by IE11
// https://stackoverflow.com/questions/44576098
export default (x) => {
  if (Math.trunc) {
    return Math.trunc(x);
  }
  if (isNaN(x)) {
    return NaN;
  }
  if (x > 0) {
    return Math.floor(x);
  }
  return Math.ceil(x);
};
