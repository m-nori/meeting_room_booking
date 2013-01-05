
module.exports.root = function(){
  return {
    index: function(req, res, next) {
      if(req.session.userID) {
        res.redirect("/booking");
      }
      console.log(req.flash('errors'));
      res.render('index', { errors: req.flash('errors') });
    }
  };
};

