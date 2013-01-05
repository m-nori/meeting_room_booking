
var createCheckError = function(msg) {
  var error = {
      param: ''
    , msg: msg
    , value: ''
  }
  return error;
};

module.exports.createCheckErrors = function(msg) {
  var error = createCheckError(msg);
  return [error];
};

