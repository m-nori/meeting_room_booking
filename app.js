
/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io')
  , connect = require("express/node_modules/connect")
  , RedisStore = require('connect-redis')(express)
  , Session = express.session.Session
  , redis = require('redis')
  , mongoose = require('mongoose')
  , flash = require('connect-flash')
  , resource  =  require('express-resource')
  , lib = require('./lib')
  , utils = require('./lib').utils
  , NotFound = lib.NotFound
  ;

var app = express();

/**
 * App Setting
 */
app.configure(function(){
  //セッションの署名に使われるキー
  app.set('secretKey', 'mySecret');
  //cookieにexpressのsessionIDを保存する際のキー
  app.set('cookieSessionKey', 'sid');
  // 基本設定
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  // セッション周り
  app.use(express.cookieParser(app.get('secretKey')));
  app.use(express.session({
    key : app.get('cookieSessionKey'),
    secret : app.get('secretKey'),
    store : new RedisStore(),
    cookie: {
      maxAge: 3 * 60 * 60 * 1000,    // 3 hours
      httpOnly: false
    }
  }));
  app.use(flash());
  // 動的ヘルパ消えてるから自作
  app.use(lib.helpers.dynamic);
  // 認証チェック
  app.use(function(req, res, next) {
    var target = /^\/bookings.*$/;
    if (!req.url.match(target)) return next();
    if (req.session.user) return next();
    utils.setMessage(req, 'warnings', 'please login');
    return res.redirect('/sessions/new');
  });
  // ルーティング
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
  // エラーハンドリング
  app.use(function(err, req, res, next) {
    if (req.xhr) {
      res.json(500, {message: err.message, stack: err.stack});
    }
    else if (err instanceof NotFound) {
      res.render('err/404', {status: 404, path: err.path});
    }
    else {
      return next(err);
    }
  });
});

/**
 * Development Setting
 */
app.configure('development', function(){
  app.use(express.errorHandler());
});

/**
 * Helper Setting
 */
app.locals(lib.helpers.statics());

/**
 * Routes Setting
 */
mongoose.connect('mongodb://localhost/test');
var redisClient = redis.createClient();
var model = require('./models/model')(mongoose, redisClient);
var sessionRoute  = require('./routes/session')(model);
app.resource('', require('./routes/root')());
app.resource('sessions', sessionRoute, { id: 'id' });
app.resource('users', require('./routes/user')(model), { id: 'id' });
app.resource('bookings', require('./routes/booking')(), { id: 'id' });

/**
 * Server Start
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

