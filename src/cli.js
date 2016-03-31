#!/usr/bin/env node
'use strict';

import { Ws } from './';

let cwd = (2 < process.argv.length && process.argv[2]) || __dirname;

let workspace = new Ws(cwd);
workspace.retrieve().then(function() {
  workspace.result.forEach((project) => {
    console.log(project.summary());
  });
}).catch((err) => {
  console.log('error: ' + err);
});
