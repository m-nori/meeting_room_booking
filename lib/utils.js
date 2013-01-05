
var createCheckError = function(msg) {
  var error = {
      param: ''
    , msg: msg
    , value: ''
  }
  return error;
};

module.exports.getReqVal = function(req, name) {
  return req.body[name] || req.flash(name)[0] || "";
};

module.exports.createCheckErrors = function(msg) {
  var error = createCheckError(msg);
  return [error];
};

