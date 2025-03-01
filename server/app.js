var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let db = require('./database')
let cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRouter');
var authRouter = require('./routes/AuthRouter');
var otpRouter = require('./routes/otpRouter');
var projectRouter = require('./routes/getProjectDetailsRouter');
const validateTokenRouter = require('./routes/validateTokenRouter');
const lcAuthUsersRouter = require('./routes/lcAuthUsersRouter');

var app = express();

app.use(cors());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/otp', otpRouter);
app.use('/projects', projectRouter);
app.use('/validateToken', validateTokenRouter);
app.use('/lc_users', lcAuthUsersRouter);

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
