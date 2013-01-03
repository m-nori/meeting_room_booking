
var redis;
exports.init = function(db) {
  redis = db;
};

var getKey = function(id) {
  return 'uid:' + id;
}

var User = exports.User = function(o){
  //o is an optional object
  var o = o || 0;
  this.id = o.id || "";
  this.password = o.password || "";
  this.name = o.name || "";
  this.group = o.group || "";
  this.admin = o.admin || false;
  return this;
};

User.prototype.save = function(fn){
  var self = this;
  redis.setnx(getKey(self.id), JSON.stringify(self), function(err, result) {
    fn(err);
  });
  return this;
};

exports.delete = function(id, fn){
  redis.del(getKey(id), function(err){
    fn(err);
  });
};

exports.get = function(id, fn){
  redis.get(getKey(id), function(err,res) {
    if (err || !res) {
      fn(err, null);
    } else {
      var user = new User(JSON.parse(res));
      fn(err, user);
    }
  });
};


