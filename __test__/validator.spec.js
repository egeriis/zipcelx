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

describe('Sheet Data validator', () => {
  it('Should ensure that Data passed is an Array', () => {
    expect(validator(config)).toBe(true);
  });
  it('Should ensure that argument Data\'s childs is arrays', () => {
    expect(validator(config)).toBe(true);
  });
});
