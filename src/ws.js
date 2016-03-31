'use strict';

import fs from 'fs';
import path from 'path';
import Project from './project';
import async from 'async';

export default class Ws {
  constructor(cwd) {
    this.cwd = cwd;
    this.result = [];
  }

  retrieve() {
    let that = this;
    let files = fs.readdirSync(this.cwd).filter((filename) => {
      let dir = path.join(that.cwd, filename);
      return fs.statSync(dir).isDirectory();
    });

    return new Promise((resolve) => {
      async.each(files, (filename, cb) => {
        let project = new Project(path.join(that.cwd, filename));
        project.retrieve().then(() => {
          that.result.push(project);
          cb();
        }).catch((err) => {
          cb(err);
        });
      }, () => {
        return resolve();
      });
    });
  }
}
