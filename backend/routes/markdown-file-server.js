var express = require('express');
var router = express.Router();


var walk = require('walk');
var path = require('path');
var fs = require('fs');

var root = path.resolve(__dirname, '../static/markdown');


function isMarkdownFile(filename) {
  return path.extname(filename) === ".md";
}

router.get('/', function (req, res) {
  var markdownFiles = [];
  var walker = walk.walk('static/markdown', { followLinks: false });
  walker.on('file', function(root, stat, next) {
    if (isMarkdownFile(stat.name)) {
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

router.get('/', function(req, res, next) {
  var links = [];
  fs.readdir(root, function(err, files) {
    files.forEach(function(file) {
      res.write(file);
      console.log(file);
    });
  });
});

module.exports = router;
