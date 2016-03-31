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
    return new Promise(function(resolve, reject) {
      var files = fs.readdirSync(that.cwd);
      async.each(files, function(filename, cb) {
        var dir = path.join(that.cwd, filename);
        if (fs.statSync(dir).isDirectory()) {
          let project = new Project(path.join(that.cwd, filename));
          project.retrieve().then(function() {
            that.result.push(project);
            cb();
          }).catch(function(err) {
            cb(err);
          });
        } else {
          cb();
        }
      }, function done() {
        return resolve();
      });
    });
  }
};
