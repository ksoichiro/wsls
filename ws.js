'use strict';

var fs = require('fs');
var path = require('path');
var Project = require('./project');

module.exports = class Ws {
  constructor(cwd) {
    this.cwd = cwd;
    this.result = [];
  }

  retrieve() {
    var files = fs.readdirSync(this.cwd);
    files.forEach((filename) => {
      var dir = path.join(this.cwd, filename);
      if (fs.statSync(dir).isDirectory()) {
        this.result.push(this.inspect(filename));
      }
    });
  }

  inspect(filename) {
    // TODO Get working copy status (dirty or not)
    // TODO Main language (Possible?)
    // TODO Last update
    // TODO Get remote URL (Mainly git)
    return new Project(path.join(this.cwd, filename));
  }
};
