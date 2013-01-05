
module.exports = function() {
  return {
    index: function(req, res, next) {
      res.render('bookings/index', { userID: req.session.userID } );
    }
  }
};

