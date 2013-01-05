
var createMessage = function(messages, type) {
  if(!messages || messages == "") return '';
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

var getFlashMessage = function(req, type) {
  // flashに入れると配列にくるまれる？
  return req.flash(type)[0];
};

module.exports.dynamic = function(req, res, next) {
  res.locals.errors = getFlashMessage(req, 'errors');
  res.locals.warnings = getFlashMessage(req, 'warnings');
  res.locals.success = getFlashMessage(req, 'success');
  next();
};

module.exports.statics = function() {
  return {
    title: "Meeting Room Booking",
    createErrorMessage: function(messages) {
      return createMessage(messages, 'alert-error');
    },

    createWarningMessage: function(messages) {
      return createMessage(messages, '');
    },

    createSuccessMessage:  function(messages) {
      return createMessage(messages, 'alert-success');
    }
  };
};

