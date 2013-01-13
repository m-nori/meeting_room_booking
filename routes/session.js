
module.exports = function(model) {
  var utils = require('../lib').utils
    , User = model.User;

  return {
    new: function(req, res, next) {
      var user = new User({email: utils.getReqVal(req, 'email')});
      console.log(user);
      res.render('sessions/new', user);
    },

    create: function(req, res, next) {
      var email = req.body.email
        , password = req.body.password;
      User.findOne({email: email}, function(err, user) {
        if (err) return next(err);
        if (user && user.authenticate(password)) {
          req.session.user = utils.createSessionUser(user);
          res.redirect('/bookings');
        }
        else {
          utils.setMessage(req, 'errors', 'login fail');
          utils.setFlash(req, {email: email});
          res.redirect('back');
        }
      });
    },

    destroy: function(req, res, next) {
       req.session.destroy(function(err) {
         if (err) return next(err);
         res.redirect('/');
       });
    }
  };
};

