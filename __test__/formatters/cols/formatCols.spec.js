import formatCol from '../../../src/formatters/cols/formatCol';
import baseConfig from '../../baseConfig';

// 150px turns into 25 excel points according to the formulas in Microsoft docs (see Column Width chapter)
// https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.column.aspx
const expectedXML = '<col min="1" max="1" width="25" />';

describe('Format Col', () => {
  it('Should create one column from given data', () => {
    expect(formatCol(baseConfig.sheet.cols[0], 0)).toBe(expectedXML);
  });
});
