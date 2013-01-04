
module.exports.user = function(model) {
  return {
    login: function(req, res, next){
      var id = req.body.userID;
      var password = req.body.password;
      model.User.get(id, function(err, user) {
        if (err) next(err);
        if (!user) next(new Error('user not found'));
        console.log(user);
        if(user.auth(password)) {
          req.session.userID = id;
          res.redirect('/booking');
        } else {
          res.redirect('/');
        }
      })
    },

    logout: function(req, res, next) {
       req.session.destroy(function(err) {
         if(err){
           console.log(err);
           next(err);
         }
         res.redirect('/');
       });
    }
  };
};

