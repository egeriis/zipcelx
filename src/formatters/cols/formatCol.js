import Truncate from '../../util/Truncate';

// Column width measured as the number of characters of the maximum digit width of the numbers 0, 1, 2, …, 9 as rendered in the normal style's font.
// There are 4 pixels of margin padding (two on each side), plus 1 pixel padding for the gridlines.
export default (col, index) => {
  // If no width specified (0 width is not allowed as well) leave the definition empty and the width will be applied automatically.
  if (!col.width) return '';

  // To ensure the column number starts as in excel.
  const colIndex = index + 1;

  // Using the Calibri font as an example, the maximum digit width of 11 point font size is 7 pixels (at 96 dpi)
  // TODO make it configurable?
  const maximumDigitWidth = 6; // 6 is for "Calibri 12"

  // To translate from pixels to character width, use this calculation:
  // =Truncate(({pixels}-5)/{Maximum Digit Width} * 100+0.5)/100
  const characterWidth = Truncate((((col.width - 5) / maximumDigitWidth) * 100) + 0.5) / 100;

  // To translate from character width to real width, use this calculation:
  // =Truncate([{Number of Characters} * {Maximum Digit Width} + {5 pixel padding}]/{Maximum Digit Width}*256)/256
  const colWidth = Truncate((((characterWidth * maximumDigitWidth) + 5) / maximumDigitWidth) * 256) / 256;

  // `col` format is described here: https://msdn.microsoft.com/en-us/library/office/documentformat.openxml.spreadsheet.column.aspx
  return `<col min="${colIndex}" max="${colIndex}" width="${colWidth}" />`;
};
