import validator from '../src/validator';

const config = {
  filename: 'report',
  sheet: {
    data: [
      [{
        value: 'Monkey',
        type: 'string'
      }, {
        value: 1000,
        type: 'number'
      }]
    ]
  }
};

const configDescription = expect.objectContaining({
  filename: expect.any(String),
  sheet: expect.objectContaining({
    data: expect.arrayContaining(config.sheet.data)
  })
});
const errorObjectDescription = expect.objectContaining({
  error: expect.any(String),
});

describe('Validator', () => {
  it('Should ensure that being called with correct config', () => {
    expect(config).toEqual(configDescription);
  });

  it('If validation is successfull return true', () => {
    expect(validator(config)).toBe(true);
  });

  it('If validation fails it should return object containg key error', () => {
    config.filename = 1234
    expect(validator(config)).toEqual(errorObjectDescription)
  });

  describe('Filename Validator', () => {
    it('Should be a property of the config', () => {
      delete config.filename;
      expect(validator(config).error).toEqual('Zipclex config missing propery filename');
    });

    it('Should be of type string', () => {
      config.filename = 1234
      expect(validator(config).error).toEqual('Zipclex filename can only be of type string');
    });
  });
});
