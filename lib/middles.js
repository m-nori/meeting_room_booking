
module.exports.loginRequired = function(req, res, next) {
  if(req.session.userID) {
    return next();
  }
  res.redirect("/");
};

