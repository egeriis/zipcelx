import generatorCellNumber from '../../src/commons/generatorCellNumber';

describe('Cell number generator', () => {
  it('should create cell number A1', () => {
    expect(generatorCellNumber(0, 1)).toBe('A1');
  });
});
