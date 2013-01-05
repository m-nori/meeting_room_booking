var utils = require('./utils');
var requiredLoginMessage = utils.createCheckErrors("please login");

module.exports.loginRequired = function(req, res, next) {
  if(req.session.uid) {
    console.log("logind");
    return next();
  }
  req.flash('warnings', requiredLoginMessage);
  res.redirect("/login");
};

