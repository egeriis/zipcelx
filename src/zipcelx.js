import JSZip from 'jszip';
import FileSaver from 'file-saver';

import validator from './validator';
import generatorRows from './formatters/rows/generatorRows';

import workbookXML from './templates/workbook.xml';
import workbookXMLRels from './templates/workbook.xml.rels';
import rels from './statics/rels';
import contentTypes from './templates/[Content_Types].xml';
import templateSheet from './templates/worksheet.xml';

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

export const generateXMLWorksheet = (rows) => {
  const XMLRows = generatorRows(rows);
  return templateSheet.replace('{placeholder}', XMLRows);
};

export default (config) => {
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
