import JSZip from 'jszip';
import FileSaver from 'file-saver';
import validator from './validator';
import generatorRows from './formatters/rows/generatorRows';
import workbookXML from './statics/workbook.xml';
import workbookXMLRels from './statics/workbook.xml.rels';
import rels from './statics/rels';
import contentTypes from './statics/[Content_Types].xml';
import templateSheet from './templates/worksheet.xml';

export const generateXMLWorksheet = (rows) => {
  const XMLRows = generatorRows(rows);
  return templateSheet.replace('{placeholder}', XMLRows);
};

const addWorksheets = (config, xl) => {
  const files = [];
  if (config.sheets) {
    const sheets = Object.keys(config.sheets);
    for (let i = 0; i < sheets.length; i += 1) {
      const worksheet = generateXMLWorksheet(config.sheets[sheets[i]].data);
      xl.file(`worksheets/sheet${i}.xml`, worksheet);
      files.push({ url: `worksheets/sheet${i}.xml`, sheetName: config.sheets[sheets[i]].sheetName });
    }
  } else {
    const worksheet = generateXMLWorksheet(config.sheet.data);
    xl.file('worksheets/sheet1.xml', worksheet);
    files.push('worksheets/sheet1.xml');
  }
  return files;
};

const updateStaticFiles = (files) => {
  let contentTypeData = '';
  let workbookData = '';
  let workbookRelData = '';
  for (let i = 0; i < files.length; i += 1) {
    const id = (i + 2);
    contentTypeData += `<Override ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml" PartName="/xl/${files[i].url}"/>`;
    workbookData += `<sheet state="visible" name="${files[i].sheetName}" sheetId="${i}" r:id="rId${id}" />`;
    workbookRelData += `<Relationship Id="rId${id}" Target="worksheets/sheet${i}.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet"/>`;
  }
  const updatedContentTypes = contentTypes.replace('{placeholder}', contentTypeData);
  const updatedWorkbookData = workbookXML.replace('{placeholder}', workbookData);
  const updatedWorkbookRelData = workbookXMLRels.replace('{placeholder}', workbookRelData);
  return {
    contentTypes: updatedContentTypes,
    workbookXML: updatedWorkbookData,
    workbookXMLRels: updatedWorkbookRelData,
  };
};

export default (config) => {
  if (!validator(config)) {
    throw new Error('Validation failed.');
  }

  const zip = new JSZip();
  const xl = zip.folder('xl');
  const worksheets = addWorksheets(config, xl);
  const updatedStaticFiles = updateStaticFiles(worksheets);

  xl.file('workbook.xml', updatedStaticFiles.workbookXML);
  xl.file('_rels/workbook.xml.rels', updatedStaticFiles.workbookXMLRels);
  zip.file('_rels/.rels', rels);
  zip.file('[Content_Types].xml', updatedStaticFiles.contentTypes);

  return zip.generateAsync({
    type: 'blob',
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  }).then((blob) => {
    FileSaver.saveAs(blob, `${config.filename}.xlsx`);
  });
};
