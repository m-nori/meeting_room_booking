
var createMessage = function(msg) {
  return msg;
};

var sanitize =  require('validator').sanitize;

module.exports.sanitizeObject = function(obj) {
  for(key in obj) {
    if (key) {
      // とりあえずstringにはtrimとxss無効化を行う
      if (typeof obj[key] === 'string') {
        obj[key] = sanitize(obj[key]).trim();
        obj[key] = sanitize(obj[key]).xss();
      }
    }
  }
};

module.exports.getReqVal = function(req, name) {
  // flashから取ると配列に入って帰ってくる。
  return req.body[name] || req.flash(name)[0] || "";
};

module.exports.createSessionUser = function(user) {
  return { id: user.id, name: user.name, admin: user.admin };
};

module.exports.createMessages = function(msg) {
  var error = createMessage(msg);
  return [error];
};

module.exports.setMessage = function(req, type, msg) {
  var message = createMessage(msg);
  req.flash(type, [message]);
};

module.exports.setMessages = function(req, type, messages) {
  req.flash(type, messages);
};

module.exports.setFlash = function(req, obj) {
  for(key in obj) {
    if (key && typeof obj[key] === 'string') {
      console.log("flash:" + key + ":" + obj[key]);
      req.flash(key, obj[key]);
    }
  }
}

