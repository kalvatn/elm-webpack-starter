var express = require('express');
var router = express.Router();

var walk = require('walk');
var path = require('path');
var fs = require('fs');

var pageRootRelative = 'static/md'
var pageRootAbsolute = path.join(__dirname, '../', pageRootRelative);

function isMarkdownFile(filename) {
  return path.extname(filename) === '.md';
}


router.get('/edit', function(req, res) {
  var themes = [];
  var keymaps = [];
  var modes = [];
  fs.readdirSync(path.join(__dirname, '../', 'node_modules/codemirror/theme')).forEach(function(file) {
    themes.push(file.replace(path.extname(file), ''));
  });

  fs.readdirSync(path.join(__dirname, '../', 'node_modules/codemirror/keymap')).forEach(function(file) {
    keymaps.push(file.replace(path.extname(file), ''));
  });

  fs.readdirSync(path.join(__dirname, '../', 'node_modules/codemirror/mode')).forEach(function(file) {
    modes.push(file);
  });
  res.render('markdown/edit', { themes : themes, keymaps : keymaps, modes : modes });
});

router.get('/', function (req, res) {
  var markdownFiles = [];
  var walker = walk.walk(pageRootRelative, { followLinks: false });
  walker.on('file', function(root, stat, next) {
    if (isMarkdownFile(stat.name)) {
      markdownFiles.push(root.replace(pageRootRelative, '') + '/' + stat.name);
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
  var content = req.body.content.trim();
  console.log(content);
  if (filename.startsWith(pageRootAbsolute)) {
    fs.writeFile(filename, content, function (err) {
      if (err) {
        res.status(500).send('error saving file : ' + err);
      } else {
        res.status(200).send('saved');
      }
    });
  } else {
    res.status(500).send('invalid file path');
  }
});


module.exports = router;
