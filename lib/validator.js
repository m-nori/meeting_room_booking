var Validator =  require('validator').Validator;

Validator.prototype.error =  function(msg) {
  this._errors.push(msg);
};

Validator.prototype.getErrors =  function() {
  return this._errors;
};

module.exports = Validator;
