'use strict';

var path = require('path');
var fs = require('fs');

var FileManager = {};

FileManager.info = function(root, file) {
  try {
    var stats = fs.statSync(path.join(root, file));
    return {
      name : file,
      isDirectory : stats.isDirectory(),
      size : stats.size
    }
  } catch (e) {
    return {
      error : true
    }
  }

};
FileManager.list = function(root, directory) {
  var files = [];
  if (!FileManager.info(root, directory).error) {
    fs.readdirSync(path.join(root, directory)).forEach(function(file) {
      files.push(FileManager.info(path.join(root, directory), file));
    });
  }
  return files;
};

FileManager.tree = function(root, relativeRoot) {
  var item = {};
  item.path = relativeRoot;
  item.name = path.basename(relativeRoot);

  var stats;

  try {
    stats = fs.statSync(root);
  } catch (e) {
    return null;
  }

  if (stats.isFile()) {
    item.size = stats.size;
  } else if (stats.isDirectory()) {
    item.children = fs.readdirSync(root)
      .map(file => FileManager.tree(path.join(root, file), path.join(relativeRoot, file)))
      .filter(e => !!e);
  } else {
    return null;
  }

  return item;

};

FileManager.mkdir = function(directory) {
  return fs.mkdirSync(directory);
};

FileManager.rmdir = function(directory) {
  return fs.rmdirSync(directory);
}

module.exports = FileManager;
