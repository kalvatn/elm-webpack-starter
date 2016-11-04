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

FileManager.tree = function(root, directory) {
  if (!directory) {
    directory = '';
  }
  var info = FileManager.info(root, directory);
  if (info.error) {
    return {};
  }
  var tree = FileManager.info(root, directory);

  tree.files = [];
  var absolutePath = path.join(root, directory);
  FileManager.list(root, directory).forEach(function(file) {
    if (file.isDirectory) {
      tree.files.push(FileManager.tree(path.join(root, directory), file.name));
    } else {
      tree.files.push(file);
    }
  });
  return tree;
};

FileManager.mkdir = function(directory) {
  return fs.mkdirSync(directory);
};

FileManager.rmdir = function(directory) {
  return fs.rmdirSync(directory);
}

module.exports = FileManager;
