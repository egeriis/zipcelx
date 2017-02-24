const childValidator = array => (
  array.reduce((bool, item) => {
    return Array.isArray(item) && bool;
  }, true)
);

export default (config) => {
  if (!config.filename) {
    return {
      error: 'Zipclex config missing propery filename'
    };
  }

  if (typeof config.filename !== 'string') {
    return {
      error: 'Zipclex filename can only be of type string'
    }
  }

  return true;
};
