import assert from 'assert';
import generatorRows from '../src/formatters/rows/generatorRows';
import { generateXMLWorksheet } from '../src/zipcelx';

const data = [
  [{
    value: 'Monkey',
    type: 'string'
  }, {
    value: 1000,
    type: 'number'
  }]
];

describe('XML Formatter', () => {
  const rowsXML = `<row r="1"><c r="A1" t="inlineStr"><is><t>Monkey</t></is></c><c r="B1"><v>1000</v></c></row>`;

  it('Should map row arrays to XML markup', () => {
    assert.strictEqual(generatorRows(data), rowsXML);
  })

  it('Should generate and XML Worksheet from template', () => {
    const expectedXML = [
      '<?xml version="1.0" ?>',
      `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main"><sheetData>${rowsXML}</sheetData></worksheet>`
    ].join('\n');
    assert.strictEqual(generateXMLWorksheet(data), expectedXML);
  })
});
