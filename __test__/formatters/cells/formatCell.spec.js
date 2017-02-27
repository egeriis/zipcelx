import { WARNING_INVALID_TYPE } from '../../../src/commons/constants';
import formatCell from '../../../src/formatters/cells/formatCell';
import { expectedXML as cellStringXML } from './generatorStringCell.spec.js';

console.warn = jest.genMockFn();

const cells = [{
  value: 'Test',
  type: 'string'
}, {
  value: 1000,
  type: 'number'
}];

describe('Format Cell', () => {
  describe('Should create a cell of type sting', () => {
    it('Should fallback to string if invalid type was supplied', () => {
      const cell = Object.assign({}, cells[0], { type: 'date' });
      formatCell(cell);
      expect(console.warn).toBeCalledWith(WARNING_INVALID_TYPE);
      expect(formatCell(cell, 0, 1)).toBe(cellStringXML);
    });

    it('Create cell of type string', () => {
      expect(formatCell(cells[0], 0, 1)).toBe(cellStringXML);
    });
  });

});
