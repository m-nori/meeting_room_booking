
exports.root = function(req, res){
  if(req.session.userID) {
    res.redirect("/booking");
  }
  res.render('index', { title: 'Express' });
};

exports.user = require('./user');
exports.booking = require('./booking');

