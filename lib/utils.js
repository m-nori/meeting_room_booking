
var createMessage = function(msg) {
  var message = {
      param: ''
    , msg: msg
    , value: ''
  }
  return message;
};

module.exports.getReqVal = function(req, name) {
  // flashから取ると配列に入って帰ってくる。
  return req.body[name] || req.flash(name)[0] || "";
};

module.exports.createMessages = function(msg) {
  var error = createMessage(msg);
  return [error];
};

module.exports.setMessage = function(req, type, msg) {
  var message = createMessage(msg);
  req.flash(type, [message]);
};

module.exports.setFlash = function(req, obj) {
  for(key in obj) {
    if (key) req.flash(key, obj[key]);
  }
}

