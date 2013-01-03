"use strict";
var express = require('express')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io')
  , connect = require("express/node_modules/connect")
  , RedisStore = require('connect-redis')(express)
  , sessionStore = new RedisStore()
  , Session = express.session.Session;

var app = module.exports = express();
app.configure(function() {
    app.set('port', process.env.PORT || 3000);

    //セッションの署名に使われるキー
    app.set('secretKey', 'mySecret');

    //cookieにexpressのsessionIDを保存する際のキー
    app.set('cookieSessionKey', 'sid');

    //POSTの値を受け取れるようにする
    app.use(express.bodyParser());

    //expressでセッション管理を行う
    app.use(express.cookieParser(app.get('secretKey')));
    app.use(express.session({
        key : app.get('cookieSessionKey'),
        secret : app.get('secretKey'),
        store : sessionStore
    }));
    
    //テスト用
    app.set("sessionStore",sessionStore);
});

// 環境変数でcookie名を変更
var header_cookiename = 'cookie';
app.configure('test', function() {
    header_cookiename = 'x-set-cookie';
});

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

//ログイン処理
app.post('/user/login', function(req, res) {
    var postData = {
        userID : req.body.userID,
        password : req.body.password
    };
    //passがtestならログイン成功させる
    if ( typeof postData.userID !== 'undefined' && typeof postData.password !== 'undefined' && postData.password.toString() === 'test') {
        //sessionにユーザーID保存
        req.session.userID = postData.userID.toString();
        res.redirect('/chat');
    }
    else {
        console.log('login failed');
        res.redirect('/');
    }
});

//ログアウト処理
app.get('/user/logout',function(req,res){
     req.session.destroy(function(err) {
         if(err){
             console.log(err);
         }
         res.redirect('/');
     });
});

//チャットページ
app.get('/chat', function(req, res) {
    //セッションにuserIDがあったらログイン済みとする
    if ( typeof req.session.userID !== 'undefined' && req.session.userID) {
        res.sendfile(__dirname + '/chat.html');
    }
    else {
        res.redirect('/');
    }
});

io = io.listen(http.createServer(app).listen(app.get('port')), function() {
    console.log("Express server & socket.io listening on port " + app.get('port'));
});

//socket.ioのコネクションを許可する前にexpressのセッションIDを元にログイン済みか確認する
io.set('authorization', function(handshakeData, callback) {
    var header_cookie = handshakeData.headers[header_cookiename];
    if (header_cookie) {
        //cookieを取得
        var cookie = require('cookie').parse(decodeURIComponent(header_cookie));
        cookie = connect.utils.parseSignedCookies(cookie, app.get('secretKey'));
        var sessionID = cookie[app.get('cookieSessionKey')];
        // セッションをから取得
        sessionStore.get(sessionID, function(err, session) {
            if (err) {
                //セッションが取得できなかったら
                console.dir(err);
                callback(err.message, false);
            }
            else if (!session||!session.userID) {
                console.log('session not found');
                callback('session not found', false);
            }
            else {
                console.log("authorization success");

                // socket.ioからもセッションを参照できるようにする
                handshakeData.cookie = cookie;
                handshakeData.sessionID = sessionID;
                handshakeData.sessionStore = sessionStore;
                handshakeData.session = new Session(handshakeData, session);

                callback(null, true);
            }
        });
    }
    else {
        //cookieが見つからなかった時
        return callback('cookie not found', false);
    }
});

var count=0;
io.sockets.on('connection', function(socket) {
    console.log(count++);
    // Expressのセッションをsocket.ioから参照する
    console.log('session data', socket.handshake.session);
    
    socket.on("chat", function(message) {
        io.sockets.emit("message", socket.handshake.session.userID + ' ' + message);
    });

    //Expressのセッションを定期的に更新する
    var sessionReloadIntervalID = setInterval(function() {
        socket.handshake.session.reload(function() {
            socket.handshake.session.touch().save();
        });
    }, 60 * 2 * 1000);
    socket.on("disconnect", function(message) {
        console.log(count--);
        clearInterval(sessionReloadIntervalID);
    });
});
