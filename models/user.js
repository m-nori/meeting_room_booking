
module.exports.model = function(redis) {
  var User = require('klass')(function (o) {
    this.id = o.id || "";
    this.password = o.password || "";
    this.name = o.name || "";
    this.group = o.group || "";
    this.admin = o.admin || false;
  })
    .statics({
      key: function(id) {
        return 'uid:' + id;
      },

      del: function(id, fn){
        redis.del(User.key(id), function(err){
          fn(err);
        });
      },

      get: function(id, fn){
        redis.get(User.key(id), function(err,res) {
          if (err || !res) {
            fn(err, null);
          } else {
            var user = new User(JSON.parse(res));
            fn(err, user);
          }
        });
      }
    })
    .methods({
      save: function(fn) {
        var self = this;
        redis.setnx(User.key(self.id), JSON.stringify(self), function(err, result) {
          fn(err, result);
        });
      },

      auth: function(password) {
        if (typeof password === 'undefined' || password !== this.password) {
          console.log("auth fail!");
          return false;
        }
        console.log("auth success!");
        return true;
      }
    });
  return User;
}

