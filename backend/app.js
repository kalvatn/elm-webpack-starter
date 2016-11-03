'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
var routes = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));


app.use('/modules/highlight', express.static(path.join(__dirname, 'node_modules/highlight.js/')));
app.use('/modules/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')));
app.use('/modules/marked', express.static(path.join(__dirname, 'node_modules/marked/')));
app.use('/modules/codemirror', express.static(path.join(__dirname, 'node_modules/codemirror/')));
app.use('/modules/jquery', express.static(path.join(__dirname, 'node_modules/jquery/')));


app.use('/', routes);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  // show error stacktraces in development env
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
