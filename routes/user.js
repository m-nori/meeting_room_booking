
module.exports = function(model) {
  var utils = require('../lib').utils;

  return {
    new: function(req, res, next) {
      res.render('users/new');
    },

    create: function(req, res, next) {
    }
  };
};

