
module.exports = function(model) {
  var utils = require('../lib').utils
    , User = model.User;

  return {
    new: function(req, res, next) {
      var user = new User({id: utils.getReqVal(req, 'id')});
      res.render('sessions/new', user);
    },

    create: function(req, res, next) {
      var id = req.body.id
        , password = req.body.password;
      User.find(id, function(err, user) {
        if (err) return next(err);
        if (user && user.authenticate(password)) {
          req.session.user = utils.createSessionUser(user);
          res.redirect('/bookings');
        }
        else {
          utils.setMessage(req, 'errors', 'login fail');
          utils.setFlash(req, {id: id});
          res.redirect('/sessions/new');
        }
      });
    },

    destroy: function(req, res, next) {
       req.session.destroy(function(err) {
         if (err) return next(err);
         res.redirect('/sessions/new');
       });
    }
  };
};

