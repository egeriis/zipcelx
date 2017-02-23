import generatorCellNumber from '../../commons/generatorCellNumber';

export default (index, value, rowIndex) => (`<c r="${generatorCellNumber(index, rowIndex)}"><v>${value}</v></c>`);
