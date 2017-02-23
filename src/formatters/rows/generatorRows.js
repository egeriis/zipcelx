import formatRow from './formatRow';

export default rows => (
  rows
  .map((row, index) => formatRow(row, index))
  .join('')
);
