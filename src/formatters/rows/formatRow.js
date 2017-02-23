import formatCell from '../cells/formatCell';

export default (row, index) => {
  // To ensure the row number starts as in excel.
  const rowIndex = index + 1;
  const rowCells = row
  .map((cell, cellIndex) => formatCell(cell, cellIndex, rowIndex))
  .join('');

  return `<row r="${rowIndex}">${rowCells}</row>`;
};
