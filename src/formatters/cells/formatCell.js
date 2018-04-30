import { validTypes, CELL_TYPE_STRING, WARNING_INVALID_TYPE } from '../../commons/constants';
import generatorStringCell from './generatorStringCell';
import generatorNumberCell from './generatorNumberCell';

export default (cell, index, rowIndex) => {
  let cellType = cell.type;

  if (validTypes.indexOf(cellType) === -1) {
    console.warn(WARNING_INVALID_TYPE);
    cellType = CELL_TYPE_STRING;
  }

  return (
    cellType === CELL_TYPE_STRING
    ? generatorStringCell(index, cell.value, rowIndex)
    : generatorNumberCell(index, cell.value, rowIndex)
  );
};
