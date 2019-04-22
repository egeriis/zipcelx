import JSZip from 'jszip';
import FileSaver from 'file-saver';

import validator from './validator';
import generatorRows from './formatters/rows/generatorRows';

import workbookXML from './templates/workbook.xml';
import workbookXMLRels from './templates/workbook.xml.rels';
import rels from './statics/rels';
import contentTypes from './templates/[Content_Types].xml';
import templateSheet from './templates/worksheet.xml';

export const generateXMLWorksheet = (rows) => {
  const XMLRows = generatorRows(rows);
  return templateSheet.replace('{placeholder}', XMLRows);
};

const generateWorkbook = (config) => {
  const zip = new JSZip();
  const sheets = config.sheets || [config.sheet];
  let contentTypeData = '';
  let workbookXMLData = '';
  let workbookXMLRelData = '';

  for (let i = 0; i < sheets.length; i += 1) {
    const id = i + 1;
    zip.file(`xl/worksheets/sheet${id}.xml`, generateXMLWorksheet(sheets[i].data));
    contentTypeData += `<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" PartName="/xl/worksheets/sheet${id}.xml"/>`;
    workbookXMLData += `<sheet name="${sheets[i].sheetName || `Sheet${id}`}" sheetId="${id}" r:id="rId${id}"/>`;
    workbookXMLRelData += `<Relationship Id="rId${id}" Target="worksheets/sheet${id}.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"/>`;
  }

  zip.file('xl/workbook.xml', workbookXML.replace('{placeholder}', workbookXMLData));
  zip.file('xl/_rels/workbook.xml.rels', workbookXMLRels.replace('{placeholder}', workbookXMLRelData));
  zip.file('[Content_Types].xml', contentTypes.replace('{placeholder}', contentTypeData));
  zip.file('_rels/.rels', rels);

  return zip;
};

export default (config) => {
  if (!validator(config)) {
    throw new Error('Validation failed.');
  }

  const zip = generateWorkbook(config);

  return zip.generateAsync({
    type: 'blob',
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }).then((blob) => {
    FileSaver.saveAs(blob, `${config.filename}.xlsx`);
  });
};
