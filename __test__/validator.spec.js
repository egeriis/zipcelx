import validator from '../src/validator';
import {
  MISSING_KEY_FILENAME,
  INVALID_TYPE_FILENAME,
  INVALID_TYPE_SHEET,
  INVALID_TYPE_SHEET_DATA
} from '../src/commons/constants';

const baseConfig = {
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
    data: expect.arrayContaining(baseConfig.sheet.data)
  })
});
const errorObjectDescription = expect.objectContaining({
  error: expect.any(String),
});

describe('Validator', () => {
  it('Should ensure that being called with correct config', () => {
    expect(baseConfig).toEqual(configDescription);
  });

  it('If validation is successfull return true', () => {
    expect(validator(baseConfig)).toBe(true);
  });

  it('If validation fails it should return object containg key error', () => {
    let config = Object.assign({}, baseConfig, {filename: 1234});
    expect(validator(config)).toEqual(errorObjectDescription)
  });

  describe('Filename Validator', () => {
    it('Should be a property of the config', () => {
      let config = Object.assign({}, config);
      delete config.filename;
      expect(validator(config).error).toEqual(MISSING_KEY_FILENAME);
    });

    it('Should be of type string', () => {
      let config = Object.assign({}, config, {filename: 1234});
      expect(validator(config).error).toEqual(INVALID_TYPE_FILENAME);
    });
  });

  describe('Sheet data', () => {
    it('Should ensure that sheet data key is an array', () => {
      let config = Object.assign({}, baseConfig, { sheet: { data: { test: 'test'} } });
      expect(validator(config).error).toEqual(INVALID_TYPE_SHEET);
    });

    it('Should ensure each of the childs is an array', () => {
      let config = Object.assign({}, baseConfig, { sheet: { data: [{test: 'demo'}] } });
      expect(validator(config).error).toEqual(INVALID_TYPE_SHEET_DATA);
    });
  })
});
