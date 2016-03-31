#!/usr/bin/env node
'use strict';

var ws = require('./');

var cwd = (2 < process.argv.length && process.argv[2]) || __dirname;

var workspace = new ws.Ws(cwd);
workspace.retrieve().then(function() {
  workspace.result.forEach((project) => {
    console.log(project.summary());
  });
}).catch(function(err) {
  console.log('error: ' + err);
});
