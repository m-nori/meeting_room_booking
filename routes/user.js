
module.exports = function(model) {
  var lib = require('../lib')
    , utils = lib.utils
    , NotFound = lib.NotFound
    , User = model.User;

  return {
    index: function(req, res, next) {
      User.find(function(err, users) {
        if (err) return next(err);
        console.log(users);
        res.render('users/index', {users: users});
      });
    },

    new: function(req, res, next) {
      var user = new User({
          email: utils.getReqVal(req, 'email')
        , name: utils.getReqVal(req, 'name')
        , group: utils.getReqVal(req, 'group')
        , admin: utils.getReqVal(req, 'admin')
      });
      res.render('users/new', user);
    },

    create: function(req, res, next) {
      var user = new User(req.body);
      user.save(function(err) {
        if (err) {
          if(err.code === 11000) {
            utils.setMessage(req, 'errors', "email address already exist!");
            utils.setFlash(req, user);
            return res.redirect('back');
          }
          else if (err.name === 'ValidationError') {
            utils.setMessages(req, 'errors', err.messages);
            utils.setFlash(req, user);
            return res.redirect('back');
          }
          else {
            return next(err);
          }
        }
        req.session.user = utils.createSessionUser(user);
        res.redirect('/bookings');
      });
    },

    edit: function(req, res, next) {
      var id = req.param("id");
      User.findById(id, function(err, user) {
        if (err) return next(err);
        if (!user) return next(new NotFound(req.url));
        res.render('users/edit', user);
      });
    },

    update: function(req, res, next) {
      var id = req.param("id");
      User.findById(id, function(err, user) {
        if (err) return next(err);
        if (!user) return next(new NotFound(req.url));
        user.password = req.body.password;
        user.password2 = req.body.password2;
        user.name = req.body.name;
        user.group = req.body.group;
        user.admin= req.body.admin;
        user.update();
        user.save(function(err) {
          if (err) {
            if (err.name === 'ValidationError') {
              utils.setMessages(req, 'errors', err.messages);
              utils.setFlash(req, user);
              return res.redirect('back');
            }
            else {
              return next(err);
            }
          }
          utils.setMessage(req, 'success', "user info update!");
          req.session.user = utils.createSessionUser(user);
          res.redirect('/users/' + id + '/edit');
        });
      });
    },

    destroy: function(req, res, next) {
      var id = req.param("id");
    }
  };
};

