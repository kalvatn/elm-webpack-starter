var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');

var root = path.resolve(__dirname, '../public/markdown');


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
