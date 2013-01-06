var utils = require('./utils');

module.exports.loginRequired = function(req, res, next) {
  if(req.session.user) {
    console.log("logind");
    return next();
  }
  utils.setMessage(req, 'warnings', 'please login');
  res.redirect("/login");
};

