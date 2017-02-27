import { WARNING_INVALID_TYPE } from '../../../src/commons/constants';
import formatCell from '../../../src/formatters/cells/formatCell';

console.warn = jest.genMockFn();

const cells = [{
  value: 'Monkey',
  type: 'string'
}, {
  value: 1000,
  type: 'number'
}];

describe('Format Cell', () => {
  describe('Cell type catch and fallback', () => {
    it('Should make a fallback to type string, if invalid type was supplied', () => {
      const cell = Object.assign({}, cells[0], { type: 'date' });
      formatCell(cell);
      expect(console.warn).toBeCalledWith(WARNING_INVALID_TYPE);
    });
  });
});
