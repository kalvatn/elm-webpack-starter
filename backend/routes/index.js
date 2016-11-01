var express = require('express');
var router = express.Router();

var markdown = require('./markdown-serve-handler');
var markdownFileServer = require('./markdown-file-server');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.use('/markdown', markdownFileServer);
router.use('/markdown/edit', markdown.handler);

module.exports = router;
