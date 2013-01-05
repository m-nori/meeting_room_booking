
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
  , expressValidator = require("express-validator")
  , redis = require('redis')
  , flash = require('connect-flash')
  , lib = require('./lib')
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
  // その他拡張
  app.use(flash());
  app.use(expressValidator);
  // 動的ヘルパ消えてるから自作
  app.use(lib.helpers);
  // ルーティング
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
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
app.locals({
  title: 'Meeting Room Booking'
});

/**
 * Routes Setting
 */
var client = redis.createClient();
var model = require('./models/model')(client);
var routes = {
    root: require('./routes/root')()
  , session: require('./routes/session')(model)
  , booking: require('./routes/booking')()
};
var middles = [lib.middles.loginRequired];
app.get('/', routes.root.index);
app.get('/login', routes.session.new);
app.post('/login', routes.session.create);
app.get('/logout', routes.session.destroy);
app.get('/booking', middles, routes.booking.index);

/**
 * Server Start
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

