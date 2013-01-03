
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
  , expressLayouts = require('express-ejs-layouts')
  , expressValidator = require("express-validator")
  , redis = require('redis')
  , lib = require('./lib')
  ;

var app = express();
var db = redis;

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
  app.set('view engine', 'ejs');
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
  app.use(expressLayouts);
  app.use(expressValidator);
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
 * Routes Setting
 */
var routes = {
    root: require('./routes/root').root()
  , user: require('./routes/user').user()
  , booking: require('./routes/booking').booking()
};
app.get('/', routes.root.index);
app.post('/login', routes.user.login);
app.get('/logout', routes.user.logout);
app.get('/booking', lib.middles.loginRequired, routes.booking.index);

/**
 * Server Start
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

