
var createMessage = function(messages, type) {
  var buf;
  if(!messages || messages == "") return '';
  buf = '<div class= "alert ' + type + '">';
  buf += '<button type= "button" class= "close" data-dismiss= "alert">&times;</button>';
  messages.forEach(function(message) {
    buf += '<h5>';
    buf += message;
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
  res.locals.uid = req.session.user ? req.session.user.id : "";
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
    },

    createUserLink: function(uid) {
      var buf;
      if (uid !== "") {
        buf = '<a href= "/logout" class= "navbar-link" >logout</a>';
      }
      else {
        buf = '<a href= "/sessions/new" class= "navbar-link" >login</a>';
      }
      return buf;
    }
  };
};

