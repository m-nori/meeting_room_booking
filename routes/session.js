
module.exports = function(model) {
  var utils = require('../lib').utils;
  var User = model.User;

  return {
    new: function(req, res, next) {
      var user = new User({id: utils.getReqVal(req, 'id')});
      res.render('sessions/new', user);
    },

    create: function(req, res, next) {
      var id = req.body.id;
      var password = req.body.password;
      User.get(id, function(err, user) {
        if (err) return next(err);
        if (user && user.authenticate(password)) {
          req.session.uid = user.id;
          req.session.name = user.name;
          res.redirect('/booking');
        }
        else {
          utils.setMessage(req, 'errors', 'login fail')
          utils.setFlash(req, {id: id});
          res.redirect('/login');
        }
      });
    },

    destroy: function(req, res, next) {
       req.session.destroy(function(err) {
         if (err) return next(err);
         res.redirect('/login');
       });
    }
  };
};

