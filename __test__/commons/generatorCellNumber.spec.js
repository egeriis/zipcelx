import generatorCellNumber from '../../src/commons/generatorCellNumber';

describe('Cell number generator', () => {
  it('should create cell number A1', () => {
    expect(generatorCellNumber(0, 1)).toBe('A1');
  });

  it('should create cell number AD3', () => {
    expect(generatorCellNumber(29, 3)).toBe('AD3');
  });

  it('should create cell number BAR7', () => {
    expect(generatorCellNumber(1395, 7)).toBe('BAR7');
  });

  it('should create cell number FOOBAR44', () => {
    expect(generatorCellNumber(78407931, 44)).toBe('FOOBAR44');
  });
});
