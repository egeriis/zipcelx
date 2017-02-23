import { validTypes, CELL_TYPE_STRING } from '../../commons/constants';
import generatorStringCell from './generatorStringCell';
import generatorNumberCell from './generatorNumberCell';

export default (cell, index, rowIndex) => {
  if (validTypes.indexOf(cell.type) === -1) {
    console.warn('Invalid type supplied in cell config, falling back to "string"');
    cell.type = CELL_TYPE_STRING;
  }

  return (
    cell.type === CELL_TYPE_STRING
    ? generatorStringCell(index, cell.value, rowIndex)
    : generatorNumberCell(index, cell.value, rowIndex)
  );
};
