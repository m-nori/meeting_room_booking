
module.exports = function(mongoose) {
  var lib = require('../lib')
    , utils =  lib.utils
    , Validator = lib.Validator
    , ValidationError = lib.ValidationError
    ;

  var userSchema =  mongoose.Schema({
      email: { type: String, index: {unique: true} }
    , password: { type: String }
    , password2: { type: String }
    , name: { type: String }
    , group: { type: String }
    , admin: { type: String, default: "" }
    , created_at: {type: Date, default: Date.now()}
    , updated_at: {type: Date, default: Date.now()}
  });

  // id
  userSchema.virtual('id').get(function() {
    return this._id.toHexString();
  });

  // validator
  userSchema.pre('save', function(next){
    var validator = new Validator();
    utils.sanitizeObject(this);
    validator.check(this.email, "email is invalid").isEmail();
    validator.check(this.password, "password is required").notEmpty();
    validator.check(this.password2, "password2 is required").notEmpty();
    validator.check(this.password2, "password is invalid").equals(this.password);
    validator.check(this.name, "name is required").notEmpty();
    validator.check(this.group, "group is required").notEmpty();
    if (this.admin !== "") {
      validator.check(this.admin, "admin is invalid").equals("on");
    }
    if (validator.getErrors().length !== 0) {
      next(new ValidationError(validator.getErrors()));
    }
    else {
      next();
    }
  });

  // authenticate
  userSchema.methods.authenticate = function(password) {
    if (typeof password === 'undefined' || password !== this.password) {
      console.log("auth fail!");
      return false;
    }
    console.log("auth success!");
    return true;
  };

  var User = mongoose.model('User', userSchema);
  return User;
}

