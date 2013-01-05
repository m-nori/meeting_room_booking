
var createMessage = function(flash, type) {
  // flashに入れると配列にくるまれる？
  var messages = flash[0];
  if(!messages) return '';
  var buf = '<div class= "alert ' + type + '">';
  buf += '<button type= "button" class= "close" data-dismiss= "alert">&times;</button>';
  messages.forEach(function(message) {
    console.log(message);
    buf += '<h5>';
    buf += message.msg;
    buf += '</h5>';
  })
  buf += '</div>';
  return buf;
};

var errors = function(req, res) {
  return createMessage(req.flash('errors'), 'alert-error');
};

var warnings = function(req, res) {
  return createMessage(req.flash('warnings'), '');
};

var success = function(req, res) {
  return createMessage(req.flash('success'), 'alert-success');
};

module.exports = function(req, res, next) {
  res.locals.errors = errors(req, res);
  res.locals.warnings = warnings(req, res);
  res.locals.success = success(req, res);
  next();
};

