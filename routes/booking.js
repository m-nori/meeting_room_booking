
module.exports.booking = function() {
  return {
    index: function(req, res, next) {
      res.render('booking', { userID: req.session.userID } );
    }
  }
};

