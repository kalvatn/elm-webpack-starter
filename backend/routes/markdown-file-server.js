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
