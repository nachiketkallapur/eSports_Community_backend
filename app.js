var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var playerRouter = require('./routes/player');
var companyRouter = require('./routes/company');
var clanRouter = require('./routes/clan');
var loginRouter = require('./routes/login');
var youtubeRouter = require('./routes/youtube');
var gameRouter = require('./routes/game');
var citystateRouter = require('./routes/citystate');
// var specificPlayerRouter = require('./routes/specificPlayer');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/player',playerRouter);
// app.use('/player/:username/',specificPlayerRouter);
app.use('/company',companyRouter);
app.use('/clan',clanRouter);
app.use('/youtube',youtubeRouter);
app.use('/game',gameRouter);
app.use('/citystate',citystateRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
