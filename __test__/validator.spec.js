import validator from '../src/validator';
import {
  MISSING_KEY_FILENAME,
  INVALID_TYPE_FILENAME,
  INVALID_TYPE_SHEET,
  INVALID_TYPE_SHEET_DATA
} from '../src/commons/constants';
import baseConfig from './baseConfig';

const configDescription = expect.objectContaining({
  filename: expect.any(String),
  sheet: expect.objectContaining({
    data: expect.arrayContaining(baseConfig.sheet.data)
  })
});
const errorObjectDescription = expect.objectContaining({
  error: expect.any(String),
});

console.error = jest.genMockFn();

describe('Validator', () => {
  it('Should ensure that being called with correct config', () => {
    expect(baseConfig).toEqual(configDescription);
  });

  it('If validation is successfull return true', () => {
    expect(validator(baseConfig)).toBe(true);
  });

  it('If validation fails it should throw new Error', () => {
    let config = {};
    expect(() => validator(config)).toThrow();
  });

  describe('Filename Validator', () => {
    it('Should be a property of the config', () => {
      let config = Object.assign({}, config);
      delete config.filename;
      expect(() => validator(config)).toThrow(MISSING_KEY_FILENAME);
    });
  });

  describe('Sheet data', () => {
    it('Should ensure that sheet data key is an array', () => {
      let config = Object.assign({}, baseConfig, { sheet: { data: { test: 'test'} } });
      expect(() => validator(config)).toThrow(INVALID_TYPE_SHEET);
    });

    it('Should ensure each of the childs is an array', () => {
      let config = Object.assign({}, baseConfig, { sheet: { data: [{test: 'demo'}] } });
      expect(() => validator(config)).toThrow(INVALID_TYPE_SHEET_DATA);
    });
  })
});
