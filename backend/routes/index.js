var express = require('express');
var router = express.Router();

var markdownFileServer = require('./markdown-file-server');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/markdown', markdownFileServer);

module.exports = router;
