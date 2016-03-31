#!/usr/bin/env node
'use strict';

import path from 'path';
import { Ws } from './';

let cwd = (2 < process.argv.length && process.argv[2]) || path.dirname(__dirname);

let workspace = new Ws(cwd);
workspace.retrieve().then(function() {
  workspace.result.forEach((project) => {
    console.log(project.summary());
  });
}).catch((err) => {
  console.log('error: ' + err);
});
