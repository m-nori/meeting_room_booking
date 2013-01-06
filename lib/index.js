
var util = require('util');
function NotFound(path) {
  Error.call(this, 'Not Found')
  Error.captureStackTrace(this, this.constructor);
  this.name = 'NotFound';
  this.path = path;
}
util.inherits(NotFound, Error);

module.exports.NotFound = NotFound;
module.exports.utils = require('./utils');
module.exports.helpers = require('./helpers');
module.exports.Validator = require('./validator');

