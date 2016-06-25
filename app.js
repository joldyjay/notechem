var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer'); //文件上传
//var mongoose = require('mongoose');
var mysql  = require('mysql');
var session = require('express-session');
var nunjucks = require('nunjucks');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/users');
var flash = require('connect-flash');
var verify = require('./routes/verify');

global.dbHandel = require('./database/dbHandel');
var app = express();
app.use(session({
  secret: 'secret',
  cookie:{ 
    maxAge: 1000*60*30
  }
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("html",require("ejs").__express); // or   app.engine("html",require("ejs").renderFile);
//app.set("view engine","ejs");
app.set('view engine', 'html');

//--nunjucks engine
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//--上传文件--
// 权限检查
function addPermissionChecking(handler) {
  return function(req, res, next) {
    // 假设用户信息保存在req.currentUser中
    if (req.currentUser) {
      handler.apply(this, arguments);
    } else {
      next('权限不足');
    }
  };
}

app.use(
  '/upload',
  addPermissionChecking(
    multer({
      dest: './public/upload/',
      rename: function () {
        var now = new Date();
        // 重命名为 年+月+日+时+分+秒+5位随机数
        return now.getFullYear() +
          ( '0' + (now.getMonth() + 1) ).slice(-2) +
          ( '0' + now.getDate() ).slice(-2) +
          ( '0' + now.getHours() ).slice(-2) +
          ( '0' + now.getMinutes() ).slice(-2) +
          ( '0' + now.getSeconds() ).slice(-2) +
          parseInt(10000 + Math.random() * 90000);
      }
    })
  )
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.use(flash());
/*
app.use(function(req,res,next){
  res.locals.user = req.session ? req.session.user : '';
  var err = req.session.error;
  delete req.session.error;
  var error = req.flash('error');
  res.locals.error = error.length?error:null;
  res.locals.message = "";
  if(err){
    res.locals.message =err;
  }
  var suc = req.session.success;
  res.locals.success = '';
  if(suc){
    res.locals.success = suc;
  }
  next();
});*/
app.use(function(req, res, next){
  var err = req.flash('error'),
      success = req.flash('success');
  res.locals.message = "";
  res.locals.user = req.session ? req.session.user : '';
  res.locals.message = err.length ? err : null;
  res.locals.success = success.length ? success : null;
  next();
});
//--页面url地址
app.use('/', routes);  // 即为为路径 / 设置路由
app.use('/users', users); // 即为为路径 /users 设置路由
app.use('/login',routes); // 即为为路径 /login 设置路由
app.use('/register',routes); // 即为为路径 /register 设置路由
app.use('/home',routes); // 即为为路径 /home 设置路由
app.use("/logout",routes); // 即为为路径 /logout 设置路由

app.listen(3001);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace'
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//app.use(express.static(__dirname + "/public"));
module.exports = app;
