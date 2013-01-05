
module.exports = function(model) {
  var utils = require('../lib').utils;

  var createForm = function(req) {
    return {
        id: req.body.id || ""
      , password: req.body.password || ""
    }
  }

  var validateLoginForm = function(req) {
    req.assert('id', 'Enter id').notEmpty();
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
      fn(err, checkErrors, user);
    });
  };

  return {
    new: function(req, res, next) {
      var form = createForm(req);
      res.render('sessions/new', form);
    },

    create: function(req, res, next) {
      var form = createForm(req);
      var validationErrors = validateLoginForm(req);
      if (validationErrors) {
        req.flash('errors', validationErrors);
        return res.redirect('/login');
      }

      checkUser(form.id, form.password, function(err, checkErrors, user) {
        if (err) return next(err);
        if (checkErrors) {
          req.flash('errors', checkErrors);
          return res.redirect('/login');
        }
        req.session.uid = user.id;
        req.session.name = user.name;
        res.redirect('/booking');
      })
    },

    destroy: function(req, res, next) {
       req.session.destroy(function(err) {
         if (err) return next(err);
         res.redirect('/login');
       });
    }
  };
};

