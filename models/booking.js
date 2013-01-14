
module.exports = function(mongoose) {
  var lib = require('../lib')
    , utils =  lib.utils
    , Validator = lib.Validator
    , ValidationError = lib.ValidationError
    ;

  var bookingSchema =  mongoose.Schema({
      userId: { type: String }
    , roomId: { type: String }
    , start: { type: Date }
    , end: { type: Date }
    , created_at: {type: Date, default: Date.now()}
    , updated_at: {type: Date, default: Date.now()}
  });

  // id
  bookingSchema.virtual('id').get(function() {
    return this._id.toHexString();
  });

  // validator
  bookingSchema.pre('save', function(next){
    var validator = new Validator();
    utils.sanitizeObject(this);
    validator.check(this.userId, "user is invalid").notEmpty();
    validator.check(this.roomId, "roomId is required").notEmpty();
    validator.check(this.start, "start is date").isDate();
    validator.check(this.end, "end is date").isDate();
    if (validator.getErrors().length !== 0) {
      next(new ValidationError(validator.getErrors()));
    }
    else {
      next();
    }
  });

  var Booking = mongoose.model('Booking', bookingSchema);
  return Booking;
}

