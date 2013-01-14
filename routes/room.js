
module.exports = function(model) {
  var lib = require('../lib')
    , utils = lib.utils
    , NotFound = lib.NotFound
    , Room = model.Room;

  return {
    index: function(req, res, next) {
      Room.find({}, null, {sort:{order: 1}}, function(err, rooms) {
        if (err) return next(err);
        console.log(rooms);
        res.render('rooms/index', {rooms: rooms});
      });
    },

    new: function(req, res, next) {
      var room = new Room({
          name: utils.getReqVal(req, 'name')
        , place: utils.getReqVal(req, 'place')
        , maximum: utils.getReqVal(req, 'maximum')
        , order: utils.getReqVal(req, 'order')
      });
      res.render('rooms/new', room);
    },

    create: function(req, res, next) {
      var room = new Room(req.body);
      room.save(function(err) {
        if (err) {
          if (err.name === 'ValidationError') {
            utils.setMessages(req, 'errors', err.messages);
            utils.setFlash(req, room);
            return res.redirect('back');
          }
          else {
            return next(err);
          }
        }
        res.redirect('rooms');
      });
    },

    edit: function(req, res, next) {
      var id = req.param("id");
      Room.findById(id, function(err, room) {
        if (err) return next(err);
        if (!room) return next(new NotFound(req.url));
        res.render('rooms/edit', room);
      });
    },

    update: function(req, res, next) {
      var id = req.param("id");
      Room.findById(id, function(err, room) {
        if (err) return next(err);
        if (!room) return next(new NotFound(req.url));
        room.name = req.body.name;
        room.place = req.body.place;
        room.maximum = req.body.maximum;
        room.order = req.body.order;
        room.updated_at = Date.now();
        room.update();
        room.save(function(err) {
          if (err) {
            if (err.name === 'ValidationError') {
              utils.setMessages(req, 'errors', err.messages);
              utils.setFlash(req, room);
              return res.redirect('back');
            }
            else {
              return next(err);
            }
          }
          utils.setMessage(req, 'success', "room info update!");
          res.redirect('rooms/' + id + '/edit');
        });
      });
    },

    destroy: function(req, res, next) {
      var id = req.param("id");
      Room.findByIdAndRemove(id, function(err, room) {
        if (err) return next(err);
        if (!room) return next(new NotFound(req.url));
        res.redirect('rooms');
      })
    }
  };
};

