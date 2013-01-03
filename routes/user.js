
exports.login = function(req, res, next){
  var postData = {
    userID : req.body.userID,
    password : req.body.password
  };
  // TODO:ログイン処理
  if ( typeof postData.userID !== 'undefined' && typeof postData.password !== 'undefined' && postData.password.toString() === 'test') {
    //sessionにユーザーID保存
    console.log('login success');
    req.session.userID = postData.userID.toString();
    res.redirect('/booking');
  } else {
    console.log('login failed');
    res.redirect('/');
  }
};

exports.logout = function(req, res, next) {
   req.session.destroy(function(err) {
     if(err){
       console.log(err);
       next(err);
     }
     res.redirect('/');
   });
};

