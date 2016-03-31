'use strict';

var fs = require('fs');
var path = require('path');
var Project = require('./project');
var async = require('async');

module.exports = class Ws {
  constructor(cwd) {
    this.cwd = cwd;
    this.result = [];
  }

  retrieve() {
    let that = this;
    var files = fs.readdirSync(this.cwd).filter(function(filename) {
      var dir = path.join(that.cwd, filename);
      return fs.statSync(dir).isDirectory();
    });

    return new Promise(function(resolve, reject) {
      async.each(files, function(filename, cb) {
        let project = new Project(path.join(that.cwd, filename));
        project.retrieve().then(function() {
          that.result.push(project);
          cb();
        }).catch(function(err) {
          cb(err);
        });
      }, function done() {
        return resolve();
      });
    });
  }
};
