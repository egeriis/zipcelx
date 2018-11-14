import formatCol from './formatCol';

export default (cols) => {
  const result = cols && cols.map((col, index) => formatCol(col, index)).join('');
  // `cols` format is described here: https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.columns.aspx
  return result ? `<cols>${result}</cols>` : '';
};
