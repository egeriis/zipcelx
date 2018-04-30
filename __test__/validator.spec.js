import validator from '../src/validator';
import {
  MISSING_KEY_TITLE,
  MISSING_KEY_FILENAME,
  INVALID_TYPE_FILENAME,
  INVALID_TYPE_SHEET,
  INVALID_TYPE_TITLE
} from '../src/commons/constants';
import baseConfig from './baseConfig';

const configDescription = expect.objectContaining({
  filename: expect.any(String),
  sheets: expect.arrayContaining(baseConfig.sheets),
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

  it('If validation fails it should call console.error', () => {
    let config = Object.assign({}, baseConfig, { filename: 1234 });
    validator(config)
    expect(console.error).toBeCalled();
  });

  describe('Filename Validator', () => {
    it('Should be a property of the config', () => {
      let config = Object.assign({}, config);
      delete config.filename;
      expect(validator(config)).toBe(false);
      expect(console.error).toBeCalledWith(MISSING_KEY_FILENAME);
    });
  });

  describe('Sheet title', () => {
    it('Should ensure that sheet title is not missing', () => {
      let config = Object.assign({}, baseConfig);
      delete config.sheets[0].title;
      expect(validator(baseConfig)).toBe(false);
      expect(console.error).toBeCalledWith(MISSING_KEY_TITLE);
    });

    it('Should ensure title sheet title has the type of a sting', () => {
      let config = Object.assign({}, baseConfig, { sheets: [{ title: 1234 }] });
      expect(validator(config)).toBe(false);
      expect(console.error).toBeCalledWith(INVALID_TYPE_TITLE);
    });
  });

  describe('Sheet data', () => {
    it('Should ensure that sheet data key is an array', () => {
      let config = Object.assign({}, baseConfig, { sheets: [{ title: 'test', data: 'test'}] });
      expect(validator(config)).toBe(false);
      expect(console.error).toBeCalledWith(INVALID_TYPE_TITLE);
    });
  })
});
