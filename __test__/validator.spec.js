import validator from '../src/validator';

const data = [
  [{
    value: 'Monkey',
    type: 'string'
  }, {
    value: 1000,
    type: 'number'
  }]
];

describe('Data validator', () => {
  it('Should ensure that Data passed is an Array', () => {
    expect(validator(data)).toBe(true);
  });
  it('Should ensure that argument Data\'s childs is arrays', () => {
    expect(validator(data)).toBe(true);
  });
});
