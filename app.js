var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var connect = require('connect');
var bodyParser = require('body-parser');
var multer = require('multer');

var userDao = require("./dao/userDao");
var routes = require('./routes/index');
var users = require('./routes/users');

var fs = require("fs");
var cp = require("child_process");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(multer());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(session({
//  key: 'session',
//  secret: 'keyboardcat'
// }));

app.use(express.static(path.join(__dirname, 'public')));




app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var num = 0;

var ls_douyu,ls_huomao,ls_huya,ls_panda,ls_zhanqi;        //child_process

var flag = 0;
setInterval(function(){
  flag++;
  console.log(flag*10);
},10000);

setInterval(function () {
    (ls_douyu)?ls_douyu.kill('SIGINT'):(console.log("douyu already end"));
    (ls_huomao)?ls_huomao.kill('SIGINT'):(console.log("huomao already end"));
    (ls_huya)?ls_huya.kill('SIGINT'):(console.log("huya already end"));
    (ls_panda)?ls_panda.kill('SIGINT'):(console.log("panda already end"));
    (ls_zhanqi)?ls_zhanqi.kill('SIGINT'):(console.log("panda already end"));

  console.log("pachong start");
  if(num == 0){
    userDao.copyTable("actual1");
  }else{
    userDao.updateData("data/data"+num+".txt","actual" + num,num);
  }

  num++;
  var name = "actual" + num;

  //spawn的参数必须有[]，即使只有一个参数，也要加[]
  setTimeout(function () {
    var time1 = new Date();
    ls_huya = cp.spawn("phantomjs", ["spider/pc_huya.js", "data"+num+".txt"]);
    ls_huya.on("close", function (code) {
      var time2 = new Date();
      console.log("huya costs " + (time2.getSeconds() - time1.getSeconds()));
      if (code == 1) {
        console.log('child process异常结束。');
      } else {

      }
    });
  }, 25000);

  setTimeout(function () {
    var time1 = new Date();
    var ls_huomao = cp.spawn("phantomjs", ["spider/pc_huomao.js", "data"+num+".txt"]);
    ls_huomao.on("close", function (code) {
      var time2 = new Date();
      console.log("huomao costs " + (time2.getSeconds() - time1.getSeconds()));
      if (code == 1) {
        console.log('child process异常结束。');
      } else {

      }
    });
  }, 35000);

  setTimeout(function () {
    var time1 = new Date();
    var ls_zhanqi = cp.spawn("phantomjs", ["spider/pc_zhanqi.js", "data"+num+".txt"]);
    ls_zhanqi.on("close", function (code) {
      var time2 = new Date();
      console.log("zhanqi costs " + (time2.getSeconds() - time1.getSeconds()));
      if (code == 1) {
        console.log('child process异常结束。');
      } else {

      }
    });
  }, 43000);


  setTimeout(function () {
    var time1 = new Date();
    var ls_panda = cp.spawn("phantomjs", ["spider/pc_panda.js", "data"+num+".txt"]);
    ls_panda.on("close", function (code) {
      var time2 = new Date();
      console.log("panda costs " + (time2.getSeconds() - time1.getSeconds()));
      if (code == 1) {
        console.log('child process异常结束。');
      } else {

      }
    });
  }, 50000);

  setTimeout(function () {
    var time1 = new Date();
    var ls_douyu = cp.spawn("phantomjs", ["spider/pc_douyu.js", "data"+num+".txt"]);
    ls_douyu.on("close", function (code) {
      var time2 = new Date();
      console.log("douyu costs "+(time2.getSeconds() - time1.getSeconds()));
      if (code == 1) {
        console.log('child process异常结束。');
      } else {

      }
    });
  }, 60000);

}, 120000);


module.exports = app;
