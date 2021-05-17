import generatorNumberCell from '../../../src/formatters/cells/generatorNumberCell';

export const expectedXML = '<c r="A1"><v>1000</v></c>';
export const expectedErrorXML = '<c r="A1"><v>NaN</v></c>';

describe('Cell of type Number', () => {
  it('Should create a new xml markup cell', () => {
    expect(generatorNumberCell(0, 1000, 1)).toBe(expectedXML);
  });

  it('Should create a new xml markup cell with NaN when there is not a number', () => {
    expect(generatorNumberCell(0, '</v></c><c><v>text', 1)).toBe(expectedErrorXML);
  });
});

