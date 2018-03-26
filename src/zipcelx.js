import JSZip from 'jszip';
import FileSaver from 'file-saver';

import validator from './validator';
import generatorRows from './formatters/rows/generatorRows';

import workbookXML from './statics/workbook.xml';
import workbookExplanationXML from './statics/workbookExplanation.xml';
import workbookXMLRels from './statics/workbook.xml.rels';
import rels from './statics/rels';
import contentTypes from './statics/[Content_Types].xml';
import templateSheet from './templates/worksheet.xml';

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

  xl.file('_rels/workbook.xml.rels', workbookXMLRels);
  zip.file('_rels/.rels', rels);
  zip.file('[Content_Types].xml', contentTypes);

  if(config.sheets.explanation === null) {
    xl.file('workbook.xml', workbookXML);
  } else {
    xl.file('workbook.xml', workbookExplanationXML);
  }

  const worksheet = generateXMLWorksheet(config.sheet.body);
  xl.file('worksheets/sheet1.xml', worksheet);

  if(config.sheets.explanation === null) {
    var worksheet2 = generateXMLWorksheet(config.sheets.explanation);
    xl.file('worksheets/sheet2.xml', worksheet2);
  }

  return zip.generateAsync({ type: 'blob' })
    .then((blob) => {
      FileSaver.saveAs(blob, `${config.filename}.xlsx`);
    });
};
