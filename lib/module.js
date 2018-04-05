import escape from 'lodash.escape';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

const CELL_TYPE_STRING = 'string';
const CELL_TYPE_NUMBER = 'number';
const validTypes = [CELL_TYPE_STRING, CELL_TYPE_NUMBER];

const MISSING_KEY_FILENAME = 'Zipcelx config missing property filename';
const MISSING_KEY_TITLE = 'Zipcelx config missing property sheet title';
const INVALID_TYPE_FILENAME = 'Zipcelx filename can only be of type string';
const INVALID_TYPE_TITLE = 'Zipcelx sheet title is not of type string';
const INVALID_TYPE_SHEET = 'Zipcelx sheet data is not of type array';

const WARNING_INVALID_TYPE = 'Invalid type supplied in cell config, falling back to "string"';

var validator = (config) => {
  if (!config.filename) {
    console.error(MISSING_KEY_FILENAME);
    return false;
  }

  if (typeof config.filename !== 'string') {
    console.error(INVALID_TYPE_FILENAME);
    return false;
  }

  for (let i = 0; i < config.sheets.length; i++) {
    if (!config.sheets[i].title) {
      console.error(MISSING_KEY_TITLE);
      return false;
    }

    if (typeof config.sheets[i].title !== 'string') {
      console.error(INVALID_TYPE_TITLE);
      return false;
    }

    if (!Array.isArray(config.sheets[i].data)) {
      console.error(INVALID_TYPE_SHEET);
      return false;
    }
  }

  return true;
};

const generateColumnLetter = (colIndex) => {
  if (typeof colIndex !== 'number') {
    return '';
  }

  const prefix = Math.floor(colIndex / 26);
  const letter = String.fromCharCode(97 + (colIndex % 26)).toUpperCase();
  if (prefix === 0) {
    return letter;
  }
  return generateColumnLetter(prefix - 1) + letter;
};

var generatorCellNumber = (index, rowNumber) => (
  `${generateColumnLetter(index)}${rowNumber}`
);

var generatorStringCell = (index, value, rowIndex) => (`<c r="${generatorCellNumber(index, rowIndex)}" t="inlineStr"><is><t>${escape(value)}</t></is></c>`);

var generatorNumberCell = (index, value, rowIndex) => (`<c r="${generatorCellNumber(index, rowIndex)}"><v>${value}</v></c>`);

var formatCell = (cell, index, rowIndex) => {
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

var formatRow = (row, index) => {
  // To ensure the row number starts as in excel.
  const rowIndex = index + 1;
  const rowCells = row
  .map((cell, cellIndex) => formatCell(cell, cellIndex, rowIndex))
  .join('');

  return `<row r="${rowIndex}">${rowCells}</row>`;
};

var generatorRows = rows => (
  rows
  .map((row, index) => formatRow(row, index))
  .join('')
);

var workbookXML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main"><workbookPr/><sheets>{placeholder}</sheets><definedNames/><calcPr/></workbook>`;

var workbookXMLRels = `<?xml version="1.0" ?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
{placeholder}
</Relationships>`;

var rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

var contentTypes = `<?xml version="1.0" ?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default ContentType="application/xml" Extension="xml"/>
<Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/>
{placeholder}
<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml" PartName="/xl/workbook.xml"/>
</Types>`;

var templateSheet = `<?xml version="1.0" ?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:mv="urn:schemas-microsoft-com:mac:vml" xmlns:mx="http://schemas.microsoft.com/office/mac/excel/2008/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac" xmlns:xm="http://schemas.microsoft.com/office/excel/2006/main"><sheetData>{placeholder}</sheetData></worksheet>`;

const generateXMLWorkbook = (config, xl, zip) => {
  let workbookXMLSheets = '';
  let workbookXMLRelsSheets = '';
  let contentTypesSheets = '';

  config.sheets.forEach((sheet, index) => {
    workbookXMLSheets = workbookXMLSheets.concat(`<sheet state="visible" name="${sheet.title}" sheetId="${index + 1}" r:id="rId${index + 3}"/>`);
    workbookXMLRelsSheets = workbookXMLRelsSheets.concat(`<Relationship Id="rId${index + 3}" Target="worksheets/sheet${index + 1}.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"/>`);
    contentTypesSheets = contentTypesSheets.concat(`<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" PartName="/xl/worksheets/sheet${index + 1}.xml"/>`);
  });

  xl.file('workbook.xml', workbookXML.replace('{placeholder}', workbookXMLSheets));
  xl.file('_rels/workbook.xml.rels', workbookXMLRels.replace('{placeholder}', workbookXMLRelsSheets));
  zip.file('[Content_Types].xml', contentTypes.replace('{placeholder}', contentTypesSheets));
  zip.file('_rels/.rels', rels);
};

const generateXMLWorksheet = (rows) => {
  const XMLRows = generatorRows(rows);
  return templateSheet.replace('{placeholder}', XMLRows);
};

var zipcelx = (config) => {
  if (!validator(config)) {
    throw new Error('Validation failed.');
  }

  const zip = new JSZip();
  const xl = zip.folder('xl');

  generateXMLWorkbook(config, xl, zip);

  config.sheets.forEach((sheet, index) => {
    const worksheet = generateXMLWorksheet(sheet.data);
    xl.file(`worksheets/sheet${index + 1}.xml`, worksheet);
  });

  return zip.generateAsync({ type: 'blob' })
    .then((blob) => {
      FileSaver.saveAs(blob, `${config.filename}.xlsx`);
    });
};

export default zipcelx;
export { generateXMLWorksheet };
