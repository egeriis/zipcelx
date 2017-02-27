import formatRow from '../../../src/formatters/rows/formatRow';

const data = [
  [{
    value: 'Monkey',
    type: 'string'
  }, {
    value: 1000,
    type: 'number'
  }]
];
const expectedXML = '<row r="1"><c r="A1" t="inlineStr"><is><t>Monkey</t></is></c><c r="B1"><v>1000</v></c></row>';

describe('Format Row', () => {
  it('Should create one row from given data', () => {
    expect(formatRow(data[0], 0)).toBe(expectedXML);
  });
});
