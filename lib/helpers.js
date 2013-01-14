
// 動的ビューヘルパ
module.exports.dynamic = function(req, res, next) {
  var getFlashMessage = function(req, type) {
    return req.flash(type)[0];
  };
  res.locals.error = getFlashMessage(req, 'errors');
  res.locals.warning = getFlashMessage(req, 'warnings');
  res.locals.success = getFlashMessage(req, 'success');
  res.locals.uid = req.session.user ? req.session.user.id : "";
  res.locals.adminUser = req.session.user ? req.session.user.admin : "";
  next();
};

// 静的ビューヘルパ
module.exports.statics = function(info) {
  return {
    title: info.title,

    createMessage: function (messages, type) {
      var buf;
      console.log("createMessage:" + messages);
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
    }
  };
};

