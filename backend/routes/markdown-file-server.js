var express = require('express');
var router = express.Router();

var walk = require('walk');
var path = require('path');
var fs = require('fs');

var hljs = require('highlight.js');
var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  highlight: function(code, lang) {
    if (lang) {
      return hljs.highlightAuto(code, [ lang ]).value;
    }
    return hljs.highlightAuto(code).value;
  }
});

var pageRootRelative = 'static/md'
var pageRootAbsolute = path.join(__dirname, '../', pageRootRelative);

function isMarkdownFile(filename) {
  return path.extname(filename) === '.md';
}

router.post('/parse', function(req, res) {
  if (!req.body.source) throw new Error('must provide markdown source');
  marked(req.body.source, function(err, html) {
    if (err) throw err;
    res.send(html);
  });
});


router.get('/edit', function(req, res) {
  var themes = [];
  var keymaps = [];
  var modes = [];
  var hlthemes = [];
  fs.readdirSync(path.join(__dirname, '../', 'node_modules/codemirror/theme')).forEach(function(file) {
    themes.push(file.replace(path.extname(file), ''));
  });

  fs.readdirSync(path.join(__dirname, '../', 'node_modules/codemirror/keymap')).forEach(function(file) {
    keymaps.push(file.replace(path.extname(file), ''));
  });

  fs.readdirSync(path.join(__dirname, '../', 'node_modules/codemirror/mode')).forEach(function(file) {
    modes.push(file);
  });

  fs.readdirSync(path.join(__dirname, '../', 'node_modules/highlight.js/styles')).forEach(function(file) {
    hlthemes.push(file.replace(path.extname(file), ''));
  });
  var initialData = fs.readFileSync(path.join(pageRootAbsolute, 'markdown_syntax.md'));
  res.render('markdown/edit', { themes : themes, keymaps : keymaps, modes : modes, hlthemes : hlthemes, initialData : initialData });
});

router.get('/', function (req, res) {
  var markdownFiles = [];
  var walker = walk.walk(pageRootRelative, { followLinks: false });
  walker.on('file', function(root, stat, next) {
    if (isMarkdownFile(stat.name)) {
      markdownFiles.push(root.replace(pageRootRelative, '') + '/' + stat.name);
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
  if (!filename || !content) {
    throw new Error('missing file and/or content');
  }
  fs.writeFile(path.join(pageRootAbsolute, filename + '.md'), content.trim(), function (err) {
    if (err) throw err;
    res.status(200).send('saved ' + filename);
  });
});

router.get(/load\/([a-zA-Z0-9\/]+)/, function(req, res, next) {
  console.log(req.params);
  var filename = req.params[0];

  var filepath = path.join(pageRootAbsolute, filename + '.md');
  console.log(filepath);
  fs.stat(filepath, function(err, stats) {
    if (err) {
      console.log('no such file or directory');
      res.status(404).send('no such file or directory');
    } else {
      fs.readFile(filepath, function(err, data) {
        if (err) throw err;
        res.status(200).send(data);
      });
    }
  });
});


module.exports = router;
