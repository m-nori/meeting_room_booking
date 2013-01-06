
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
  if (res.session && res.session.user) {
    res.locals.uid = res.session.user.id;
  }
  else {
    res.locals.uid = "";
  }
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
      console.log(uid);
      if (uid !== "") {
        buf = '<a href= "/users/' + uid + '/edit" >';
        buf += uid;
        buf += '</a>';
      }
      else {
        buf = '<a href= "/sessions/new" >login</a>';
      }
      return buf;
    }
  };
};

