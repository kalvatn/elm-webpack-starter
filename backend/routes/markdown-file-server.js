var express = require('express');
var router = express.Router();


var walk = require('walk');
var path = require('path');
var fs = require('fs');

var pageRootRelative = 'static/md'
var pageRootAbsolute = path.join(__dirname, "../", pageRootRelative);

function isMarkdownFile(filename) {
  return path.extname(filename) === ".md";
}

router.get('/', function (req, res) {
  var markdownFiles = [];
  var walker = walk.walk(pageRootRelative, { followLinks: false });
  walker.on('file', function(root, stat, next) {
    if (isMarkdownFile(stat.name)) {
      markdownFiles.push(root.replace(pageRootRelative, '') + "/" + stat.name);
    } else {
      console.warn('not a valid markdown file : ' + stat.name);
    }
    next();
  });

  walker.on('end', function() {
    res.send(markdownFiles);
  });

});

router.post('/save', function(req, res) {
  var filename = req.body.filename;
  var content = req.body.content;
  console.log(filename);
  console.log(content);
  console.log(pageRootAbsolute);
  if (!filename.startsWith(pageRootAbsolute)) {
    res.status(500).send("invalid file path");
    console.log(filename + " is not in markdown root path");
  }
  fs.writeFile(filename, content, function (err) {
    if(err) {
      res.status(500).send(err);
      console.err(err);
    } else {
      console.log("saved : " + req.body.filename);
    }
  });
});


module.exports = router;
