import JSZip from 'jszip';
import FileSaver from 'file-saver';

import {
  validTypes,
  CELL_TYPE_STRING,
} from './constants';
import worksheetXMLTemplate from './static/worksheetXMLTemplate';
import xlRelsWorkbook from './static/xlRelsWorkbook';
import xlWorkbook from './static/xlWorkbook';
import contentTypeXML from './static/contentTypeXML';
import relsRels from './static/relsRels';

import validator from './validator';

const generateColumnLetter = colIndex => (
  String.fromCharCode(97 + colIndex).toUpperCase()
);

const generateCellNumber = (index, rowNumber) => (
  `${generateColumnLetter(index)}${rowNumber}`
);

const generateStringCell = (index, value, rowIndex) => (`<c r="${generateCellNumber(index, rowIndex)}" t="inlineStr"><is><t>${escape(value)}</t></is></c>`);

const generateNumberCell = (index, value, rowIndex) => (`<c r="${generateCellNumber(index, rowIndex)}"><v>${value}</v></c>`);

const mapCell = (cell, index, rowIndex) => {
  if (validTypes.indexOf(cell.type) === -1) {
    console.warn('Invalid type supplied in cell config, falling back to "string"');
    cell.type = CELL_TYPE_STRING;
  }

  return (
    cell.type === CELL_TYPE_STRING
    ? generateStringCell(index, cell.value, rowIndex)
    : generateNumberCell(index, cell.value, rowIndex)
  );
};

const formatXMLRow = (row, index) => {
  // To ensure the row number starts as in excel.
  const rowIndex = index + 1;
  const rowCells = row
  .map((cell, cellIndex) => mapCell(cell, cellIndex, rowIndex))
  .join('');

  return `<row r="${rowIndex}">${rowCells}</row>`;
};

export const generateXMLRows = rows => (
  rows
  .map((row, index) => formatXMLRow(row, index))
  .join('')
);

export const generateXMLWorksheet = (rows) => {
  const XMLRows = generateXMLRows(rows);
  return worksheetXMLTemplate.replace('{placeholder}', XMLRows);
};

export const excelExport = (data, reportName) => {
  if (!validator(data)) {
    console.error('Invalid data format, see \'linkToDocs\' for supported format.');
    return;
  }

  const zip = new JSZip();
  const xl = zip.folder('xl');
  xl.file('workbook.xml', xlWorkbook);
  xl.file('_rels/workbook.xml.rels', xlRelsWorkbook);
  zip.file('_rels/.rels', relsRels);
  zip.file('[Content_Types].xml', contentTypeXML);

  const worksheet = generateXMLWorksheet(data);
  xl.file('worksheets/sheet1.xml', worksheet);

  zip.generateAsync({ type: 'blob' })
    .then((blob) => {
      FileSaver.saveAs(blob, reportName);
    });
};
