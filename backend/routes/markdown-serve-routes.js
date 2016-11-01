'use strict';
var path = require('path');
var server = require('markdown-serve');

exports.handler = function(req, res, next) {
  if (req.method != 'GET') next();

  console.log(path.resolve(__dirname, '../public/markdown'));
  var rootDirectory = path.resolve(__dirname, '../public/markdown');
  var markdownServer = new server.MarkdownServer(rootDirectory);
  markdownServer.get(req.path, function(err, result) {
    if (err) {
      console.log(err);
      next();
      return;
    }
    res.render('markdown/edit', { markdownFile : result });
  });
}
