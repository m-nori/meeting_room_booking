
var errors = function(req, res) {
  // flashに入れると配列にくるまれる？
  var messages = req.flash('errors')[0];
  if(!messages) return '';
  console.log(messages);
  var buf = '<div class= "alert alert-error">';
  buf += '<button type= "button" class= "close" data-dismiss= "alert">&times;</button>';
  messages.forEach(function(message) {
    console.log(message);
    buf += '<h4>';
    buf += message.msg;
    buf += '</h4>';
  })
  buf += '</div>';
  return buf;
};

module.exports = function(req, res, next) {
  res.locals.errors = errors(req, res);
  next();
};

