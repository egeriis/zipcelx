import escape from 'lodash.escape';
import generatorCellNumber from '../../commons/generatorCellNumber';

export default (index, value, rowIndex) => (`<c r="${generatorCellNumber(index, rowIndex)}" t="inlineStr"><is><t>${escape(value)}</t></is></c>`);
