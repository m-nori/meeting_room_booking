
module.exports = function(redis) {
  var utils = require('../lib').utils
    , Validator = require('../lib').Validator;

  var User = require('klass')(function (o) {
    this.id = o.id || "";
    this.password = o.password || "";
    this.password2 = o.password2 || "";
    this.name = o.name || "";
    this.group = o.group || "";
    this.admin = o.admin || "";
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
        var key = User.key(id);
        redis.get(key, function(err,res) {
          if (err) return fn(err, null);
          if (!res) {
            err = new Error("not found");
            return fn(err, null);
          }
          var user = new User(JSON.parse(res));
          fn(err, user);
        });
      }
    })
    .methods({
      validation: function() {
        var validator = new Validator();
        validator.check(this.id, "id is required").notEmpty();
        validator.check(this.password, "password is required").notEmpty();
        validator.check(this.password2, "password2 is required").notEmpty();
        validator.check(this.password2, "password2 is invalid").equals(this.password);
        validator.check(this.name, "name is required").notEmpty();
        validator.check(this.group, "group is required").notEmpty();
        if (this.admin !== "") {
          validator.check(this.admin, "admin is invalid").equals("on");
        }
        return validator.getErrors();
      },

      save: function(fn) {
        var self = this
          , key = User.key(self.id)
          , validationErrors;
        utils.sanitizeObject(self);
        validationErrors = self.validation();
        if (validationErrors.length !== 0) {
          return fn(null, validationErrors, null);
        }
        redis.setnx(key, JSON.stringify(self), function(err, result) {
          // キーが存在した場合0が帰ってくる
          if (!result) {
            validationErrors = utils.createMessages("id is already in use");
            return fn(null, validationErrors, null);
          }
          fn(null, null, self);
        });
      },

      authenticate: function(password) {
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

