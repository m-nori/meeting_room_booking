
module.exports = function(mongoose) {
  var lib = require('../lib')
    , utils = lib.utils
    , Validator = lib.Validator
    , ValidationError = lib.ValidationError
    , sanitize =  require('validator').sanitize
    ;

  var roomSchema =  mongoose.Schema({
      name: { type: String }
    , place: { type: String }
    , maximum: { type: Number }
    , order: { type: Number }
    , created_at: {type: Date, default: Date.now()}
    , updated_at: {type: Date, default: Date.now()}
  });

  // id
  roomSchema.virtual('id').get(function() {
    return this._id.toHexString();
  });

  // validator
  roomSchema.pre('save', function(next){
    var validator = new Validator();
    utils.sanitizeObject(this);
    this.maximum = sanitize(this.maximum).toInt();
    this.order = sanitize(this.order).toInt();
    validator.check(this.name, "name is required").notEmpty();
    validator.check(this.place, "place is required").notEmpty();
    validator.check(this.maximum, "maximum is number").isInt();
    validator.check(this.maximum, "maximum is 0 or higher").min(0);
    validator.check(this.order, "order is number").isInt();
    validator.check(this.order, "order is 0 or higher").min(0);
    if (validator.getErrors().length !== 0) {
      next(new ValidationError(validator.getErrors()));
    }
    else {
      next();
    }
  });

  var Room = mongoose.model('Room', roomSchema);
  return Room;
}

