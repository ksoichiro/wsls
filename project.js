'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var chalk = require('chalk');
var moment = require('moment');

const REPO_TYPE_GIT = 'git';
const REPO_TYPE_HG = 'hg';
const REPO_TYPE_SVN = 'svn';
const REPO_TYPE_NONE = 'none';

module.exports = class Project {
  constructor(filepath) {
    this.filepath = filepath;
    this.repoType = this.getRepoType(filepath);
    this.stat = fs.statSync(this.filepath);
    this.updatedAt = moment(this.stat.mtime).fromNow(true);
  }

  summary() {
    return `${this.getRepoSymbol()} ${`${this.updatedAt}             `.substring(0, 13)} ${path.basename(this.filepath)}`;
  }

  getRepoSymbol() {
    switch (this.repoType) {
    case REPO_TYPE_GIT:
      return chalk.red('G');
    case REPO_TYPE_HG:
      return chalk.gray('H');
    case REPO_TYPE_SVN:
      return chalk.blue('S');
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
};
