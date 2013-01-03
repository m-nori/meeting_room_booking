
exports.user = function() {
  return {
    login: function(req, res, next){
      var postData = {
        userID : req.body.userID,
        password : req.body.password
      };
      var user = checkUser(postData);
      if (user) {
        req.session.userID = postData.userID.toString();
        res.redirect('/booking');
      } else {
        res.redirect('/');
      }
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

var checkUser = function(postData) {
  // TODO
  if ( typeof postData.userID !== 'undefined' && typeof postData.password !== 'undefined' && postData.password.toString() === 'test') {
    console.log('login success');
    return true;
  } else {
    console.log('login failed');
    return false;
  }
};

