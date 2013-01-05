
module.exports.root = function(){
  return {
    index: function(req, res, next) {
      if(req.session.userID) {
        res.redirect("/booking");
      }
      res.render('index');
    }
  };
};

