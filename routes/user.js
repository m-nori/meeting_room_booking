
module.exports = function(model) {
  var lib = require('../lib')
    , utils = lib.utils
    , NotFound = lib.NotFound
    , User = model.User;

  return {
    index: function(req, res, next) {
      User.all(function(err, users) {
        if (err) return next(err);
        console.log(users);
        res.render('users/index', {users: users});
      });
    },

    new: function(req, res, next) {
      var user = new User({
          id: utils.getReqVal(req, 'id')
        , name: utils.getReqVal(req, 'name')
        , group: utils.getReqVal(req, 'group')
        , admin: utils.getReqVal(req, 'admin')
      });
      res.render('users/new', user);
    },

    create: function(req, res, next) {
      var user = new User(req.body);
      user.create(function(err, validationErrors) {
        if (err) return next(err);
        if (!validationErrors) {
          // ユーザ登録時はそのままログインさせる
          req.session.user = utils.createSessionUser(user);
          res.redirect('/bookings');
        }
        else {
          utils.setMessages(req, 'errors', validationErrors);
          utils.setFlash(req, user);
          res.redirect('/users/new');
        }
      });
    },

    edit: function(req, res, next) {
      var id = req.param("id");
      User.find(id, function(err, user) {
        if (err) return next(err);
        if (!user) return next(new NotFound(req.url));
        res.render('users/edit', user);
      });
    },

    update: function(req, res, next) {
      var id = req.param("id")
        , user = new User(req.body);
      user.id = id;
      user.update(function(err, validationErrors) {
        if (err) return next(err);
        if (!validationErrors) {
          utils.setMessage(req, 'success', "user info update!");
        }
        else {
          utils.setMessages(req, 'errors', validationErrors);
        }
        res.redirect('/users/' + id + '/edit');
      });
    }
  };
};

