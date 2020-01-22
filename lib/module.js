import escape from 'lodash.escape';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

var CELL_TYPE_STRING = 'string';
var CELL_TYPE_NUMBER = 'number';
var validTypes = [CELL_TYPE_STRING, CELL_TYPE_NUMBER];

var MISSING_KEY_FILENAME = 'Zipclex config missing property filename';
var INVALID_TYPE_FILENAME = 'Zipclex filename can only be of type string';
var INVALID_TYPE_SHEET = 'Zipcelx sheet data is not of type array';
var INVALID_TYPE_SHEET_DATA = 'Zipclex sheet data childs is not of type array';

var WARNING_INVALID_TYPE = 'Invalid type supplied in cell config, falling back to "string"';

var childValidator = function childValidator(array) {
  return array.every(function (item) {
    return Array.isArray(item);
  });
};

var validator = (function (config) {
  if (!config.filename) {
    console.error(MISSING_KEY_FILENAME);
    return false;
  }

  if (typeof config.filename !== 'string') {
    console.error(INVALID_TYPE_FILENAME);
    return false;
  }

  if (!Array.isArray(config.sheet.data)) {
    console.error(INVALID_TYPE_SHEET);
    return false;
  }

  if (!childValidator(config.sheet.data)) {
    console.error(INVALID_TYPE_SHEET_DATA);
    return false;
  }

  return true;
});

var generateColumnLetter = function generateColumnLetter(colIndex) {
  if (typeof colIndex !== 'number') {
    return '';
  }

  var prefix = Math.floor(colIndex / 26);
  var letter = String.fromCharCode(97 + colIndex % 26).toUpperCase();
  if (prefix === 0) {
    return letter;
  }
  return generateColumnLetter(prefix - 1) + letter;
};

var generatorCellNumber = (function (index, rowNumber) {
  return '' + generateColumnLetter(index) + rowNumber;
});

var generatorStringCell = (function (index, value, rowIndex) {
  return '<c r="' + generatorCellNumber(index, rowIndex) + '" t="inlineStr"><is><t>' + escape(value) + '</t></is></c>';
});

var generatorNumberCell = (function (index, value, rowIndex) {
  return '<c r="' + generatorCellNumber(index, rowIndex) + '"><v>' + value + '</v></c>';
});

var formatCell = (function (cell, index, rowIndex) {
  if (validTypes.indexOf(cell.type) === -1) {
    console.warn(WARNING_INVALID_TYPE);
    cell.type = CELL_TYPE_STRING;
  }

  return cell.type === CELL_TYPE_STRING ? generatorStringCell(index, cell.value, rowIndex) : generatorNumberCell(index, cell.value, rowIndex);
});

var formatRow = (function (row, index) {
  // To ensure the row number starts as in excel.
  var rowIndex = index + 1;
  var rowCells = row.map(function (cell, cellIndex) {
    return formatCell(cell, cellIndex, rowIndex);
  }).join('');

  return '<row r="' + rowIndex + '">' + rowCells + '</row>';
});

var generatorRows = (function (rows) {
  return rows.map(function (row, index) {
    return formatRow(row, index);
  }).join('');
});

var workbookXML = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<workbook xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:mx=\"http://schemas.microsoft.com/office/mac/excel/2008/main\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:mv=\"urn:schemas-microsoft-com:mac:vml\" xmlns:x14=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/main\" xmlns:x14ac=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac\" xmlns:xm=\"http://schemas.microsoft.com/office/excel/2006/main\"><workbookPr/><sheets><sheet state=\"visible\" name=\"Sheet1\" sheetId=\"1\" r:id=\"rId3\"/></sheets><definedNames/><calcPr/></workbook>";

var workbookXMLRels = "<?xml version=\"1.0\" ?>\n<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">\n<Relationship Id=\"rId3\" Target=\"worksheets/sheet1.xml\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\"/>\n</Relationships>";

var rels = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\"><Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"xl/workbook.xml\"/></Relationships>";

var contentTypes = "<?xml version=\"1.0\" ?>\n<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">\n<Default ContentType=\"application/xml\" Extension=\"xml\"/>\n<Default ContentType=\"application/vnd.openxmlformats-package.relationships+xml\" Extension=\"rels\"/>\n<Override ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\" PartName=\"/xl/worksheets/sheet1.xml\"/>\n<Override ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\" PartName=\"/xl/workbook.xml\"/>\n</Types>";

var templateSheet = "<?xml version=\"1.0\" ?>\n<worksheet xmlns=\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\" xmlns:mc=\"http://schemas.openxmlformats.org/markup-compatibility/2006\" xmlns:mv=\"urn:schemas-microsoft-com:mac:vml\" xmlns:mx=\"http://schemas.microsoft.com/office/mac/excel/2008/main\" xmlns:r=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\" xmlns:x14=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/main\" xmlns:x14ac=\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac\" xmlns:xm=\"http://schemas.microsoft.com/office/excel/2006/main\"><sheetData>{placeholder}</sheetData></worksheet>";

var generateXMLWorksheet = function generateXMLWorksheet(rows) {
  var XMLRows = generatorRows(rows);
  return templateSheet.replace('{placeholder}', XMLRows);
};

var zipcelx = (function (config) {
  if (!validator(config)) {
    throw new Error('Validation failed.');
  }

  var zip = new JSZip();
  var xl = zip.folder('xl');
  xl.file('workbook.xml', workbookXML);
  xl.file('_rels/workbook.xml.rels', workbookXMLRels);
  zip.file('_rels/.rels', rels);
  zip.file('[Content_Types].xml', contentTypes);

  var worksheet = generateXMLWorksheet(config.sheet.data);
  xl.file('worksheets/sheet1.xml', worksheet);

  return zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }).then(function (blob) {
    FileSaver.saveAs(blob, config.filename + '.xlsx');
  });
});

export default zipcelx;
export { generateXMLWorksheet };
