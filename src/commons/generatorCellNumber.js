const generateColumnLetter = colIndex => (
  String.fromCharCode(97 + colIndex).toUpperCase()
);

export default (index, rowNumber) => (
  `${generateColumnLetter(index)}${rowNumber}`
);
