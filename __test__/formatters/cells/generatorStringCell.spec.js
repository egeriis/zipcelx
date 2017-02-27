import generatorStringCell from '../../../src/formatters/cells/generatorStringCell';

const expectedXML = '<c r="A1" t="inlineStr"><is><t>Test</t></is></c>';

describe('Cell of type String', () => {
  it('Should create a new xml markup cell', () => {
    expect(generatorStringCell(0, 'Test', 1)).toBe(expectedXML);
  });
});
