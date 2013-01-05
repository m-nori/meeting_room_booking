
module.exports = function(model) {
  var utils = require('../lib').utils;

  var validateLoginForm = function(req) {
    req.assert('userID', 'Enter id').notEmpty();
    req.assert('password', 'Enter password').notEmpty();
    return req.validationErrors();
  };

  var checkUser = function(id, password, fn) {
    model.User.get(id, function(err, user) {
      var checkErrors = null;
      if (!err) {
        if (!user) {
          checkErrors = utils.createCheckErrors("user not found");
        }
        else if (!user.auth(password)) {
          checkErrors = utils.createCheckErrors("password is invalid");
        }
      }
      fn(err, checkErrors);
    });
  };

  return {
    create: function(req, res, next) {
      var validationErrors = validateLoginForm(req);
      if (validationErrors) {
        req.flash('errors', validationErrors);
        return res.redirect('/');
      }

      var id = req.body.userID;
      var password = req.body.password;
      checkUser(id, password, function(err, checkErrors) {
        if (err) return next(err);
        if (checkErrors) {
          req.flash('errors', checkErrors);
          return res.redirect('/');
        }
        req.session.userID = id;
        res.redirect('/Booking');
      })
    },

    destroy: function(req, res, next) {
       req.session.destroy(function(err) {
         if (err) return next(err);
         res.redirect('/');
       });
    }
  };
};

