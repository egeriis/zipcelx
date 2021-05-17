import generatorCellNumber from '../../commons/generatorCellNumber';

export default (index, value, rowIndex) => (`<c r="${generatorCellNumber(index, rowIndex)}"><v>${validateNumber(value)}</v></c>`);

const validateNumber = (value) => {
    return (isNaN(value))?  'NaN' : value;  
}