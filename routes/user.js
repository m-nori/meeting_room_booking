
module.exports = function(model) {
  var utils = require('../lib').utils;
  var User = model.User;

  return {
    new: function(req, res, next) {
      var user = new User({});
      res.render('users/new', user);
    },

    create: function(req, res, next) {
      var user = new User(req.body);
      res.redirect('/');
    }
  };
};

