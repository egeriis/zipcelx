const childValidator = array => {
  return array.every(item => {
    return Array.isArray(item)
  });
};

export default (config) => {
  if (!config.filename) {
    return {
      error: 'Zipclex config missing propery filename'
    };
  }

  if (typeof config.filename !== 'string') {
    return {
      error: 'Zipclex filename can only be of type string'
    };
  }

  if (!Array.isArray(config.sheet.data)) {
    return {
      error: 'Zipcelx sheet data is not of type array'
    }
  }

  if (!childValidator(config.sheet.data)) {
    return {
      error: 'Zipclex sheet data childs is not of type array'
    };
  }

  return true;
};
