'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateXMLWorksheet = undefined;

var _jszip = require('jszip');

var _jszip2 = _interopRequireDefault(_jszip);

var _fileSaver = require('file-saver');

var _fileSaver2 = _interopRequireDefault(_fileSaver);

var _validator = require('./validator');

var _validator2 = _interopRequireDefault(_validator);

var _generatorRows = require('./formatters/rows/generatorRows');

var _generatorRows2 = _interopRequireDefault(_generatorRows);

var _workbook = require('./statics/workbook.xml');

var _workbook2 = _interopRequireDefault(_workbook);

var _workbookXml = require('./statics/workbook.xml.rels');

var _workbookXml2 = _interopRequireDefault(_workbookXml);

var _rels = require('./statics/rels');

var _rels2 = _interopRequireDefault(_rels);

var _Content_Types = require('./statics/[Content_Types].xml');

var _Content_Types2 = _interopRequireDefault(_Content_Types);

var _worksheet = require('./templates/worksheet.xml');

var _worksheet2 = _interopRequireDefault(_worksheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateXMLWorksheet = exports.generateXMLWorksheet = function generateXMLWorksheet(rows) {
  var XMLRows = (0, _generatorRows2.default)(rows);
  return _worksheet2.default.replace('{placeholder}', XMLRows);
};

exports.default = function (config) {
  if (!(0, _validator2.default)(config)) {
    return;
  }

  var zip = new _jszip2.default();
  var xl = zip.folder('xl');
  xl.file('workbook.xml', _workbook2.default);
  xl.file('_rels/workbook.xml.rels', _workbookXml2.default);
  zip.file('_rels/.rels', _rels2.default);
  zip.file('[Content_Types].xml', _Content_Types2.default);

  var worksheet = generateXMLWorksheet(config.sheet.data);
  xl.file('worksheets/sheet1.xml', worksheet);

  zip.generateAsync({ type: 'blob' }).then(function (blob) {
    _fileSaver2.default.saveAs(blob, config.filename + '.xlsx');
  });
};