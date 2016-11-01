var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();
var index = require('./routes/index');
var users = require('./routes/users');
var markdown = require('./routes/markdown-serve-routes');
var walk = require('walk');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);
app.get('/markdown/links', function (req, res) {
  var validExtensions = [ 'md', 'mdown', 'markdown']
  var markdownFiles = [];
  var walker = walk.walk('public/markdown', { followLinks: false });
  walker.on('file', function(root, stat, next) {
    var extension = path.extname(stat.name).substring(1);
    if (validExtensions.indexOf(extension.toLowerCase()) > -1) {
      markdownFiles.push(root.substring(root.indexOf('/') +1) + '/' + stat.name);
    } else {
      console.warn('not a valid markdown file : ' + stat.name);
    }
    next();
  });

  walker.on('end', function() {
    res.send(markdownFiles);
  });

});
app.use('/markdown/edit', markdown.handler);

// app.use('/markdown2', markdown2);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
