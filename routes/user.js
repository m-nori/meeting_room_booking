
module.exports = function(model) {
  var utils = require('../lib').utils;

  var createForm = function(req) {
    return {
        id: req.body.id || ""
      , password: req.body.password || ""
      , name: req.body.password || ""
      , group: req.body.password || ""
      , admin: req.body.password || false
    }
  }

  return {
    new: function(req, res, next) {
      var form = createForm(req);
      res.render('users/new', form);
    },

    create: function(req, res, next) {
    }
  };
};

