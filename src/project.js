'use strict';

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import moment from 'moment';
import gitConfig from 'git-config';
import ini from 'ini';
import SvnClient from 'svn-spawn';

const REPO_TYPE_GIT = 'git';
const REPO_TYPE_HG = 'hg';
const REPO_TYPE_SVN = 'svn';
const REPO_TYPE_NONE = 'none';

export default class Project {
  constructor(filepath) {
    this.filepath = filepath;
    this.repoType = this.getRepoType(filepath);
    this.stat = fs.statSync(this.filepath);
    this.updatedAt = moment(this.stat.mtime).fromNow(true);
  }

  retrieve() {
    return this.setRemote();
  }

  summary() {
    return `${this.pad(this.getRepoTypeName(), 3)} ${this.pad(this.remote, 10)} ${this.pad(this.updatedAt, 13)} ${path.basename(this.filepath)}`;
  }

  pad(value, max) {
    let styled = value;
    let unstyled = chalk.stripColor(value);
    let result = unstyled;
    for (let i = 0; i < max && result.length < max; i++) {
      result += ' ';
    }
    return styled + result.substring(unstyled.length);
  }

  getRepoTypeName() {
    switch (this.repoType) {
    case REPO_TYPE_GIT:
      return chalk.red('Git');
    case REPO_TYPE_HG:
      return chalk.gray('Hg');
    case REPO_TYPE_SVN:
      return chalk.blue('Svn');
    default:
      return '-';
    }
  }

  isGit(filepath) {
    return fs.existsSync(path.join(filepath, '.git'));
  }

  isHg(filepath) {
    return fs.existsSync(path.join(filepath, '.hg'));
  }

  isSvn(filepath) {
    return fs.existsSync(path.join(filepath, '.svn'));
  }

  getRepoType(filepath) {
    if (this.isGit(filepath)) {
      return REPO_TYPE_GIT;
    } else if (this.isHg(filepath)) {
      return REPO_TYPE_HG;
    } else if (this.isSvn(filepath)) {
      return REPO_TYPE_SVN;
    } else {
      return REPO_TYPE_NONE;
    }
  }

  setRemote() {
    this.remote = '-';
    let that = this;
    return new Promise((resolve) => {
      if (that.repoType === REPO_TYPE_GIT) {
        let config = gitConfig.sync(path.join(that.filepath, '.git/config'));
        let origin = config['remote "origin"'];
        if (origin) {
          that.remote = that.getRemote(origin.url);
        }
        return resolve();
      } else if (that.repoType === REPO_TYPE_HG) {
        let config = ini.parse(fs.readFileSync(path.join(that.filepath, '.hg/hgrc'), 'utf-8'));
        let defaultUrl = config.paths['default'];
        if (defaultUrl) {
          that.remote = that.getRemote(defaultUrl);
        }
        return resolve();
      } else if (that.repoType === REPO_TYPE_SVN) {
        that.getSvnInfo().then((data) => {
          that.remote = that.getRemote(data.url);
          return resolve();
        });
      } else {
        return resolve();
      }
    });
  }

  getRemote(url) {
    if (-1 < url.indexOf('github.com')) {
      return 'GitHub';
    } else if (-1 < url.indexOf('bitbucket.org')) {
      return 'Bitbucket';
    } else if (-1 < url.indexOf('code.google.com')
      || -1 < url.indexOf('googlecode.com')) {
      return 'GoogleCode';
    } else {
      return 'other';
    }
  }

  getSvnInfo() {
    let that = this;
    return new Promise((resolve, reject) => {
      let client = new SvnClient({ cwd: that.filepath });
      client.getInfo((err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }
}
