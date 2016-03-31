'use strict';

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var moment = require('moment');
var gitConfig = require('git-config');
var ini = require('ini');

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
    this.setRemote();
  }

  summary() {
    return `${this.pad(this.getRepoTypeName(), 3)} ${this.pad(this.remote, 10)} ${this.pad(this.updatedAt, 13)} ${path.basename(this.filepath)}`;
  }

  pad(value, max) {
    var styled = value;
    var unstyled = chalk.stripColor(value);
    var result = unstyled;
    for (var i = 0; i < max && result.length < max; i++) {
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
    if (this.repoType === REPO_TYPE_GIT) {
      let config = gitConfig.sync(path.join(this.filepath, '.git/config'));
      let origin = config['remote "origin"'];
      if (origin) {
        this.remote = this.getRemote(origin.url);
      }
    } else if (this.repoType === REPO_TYPE_HG) {
      let config = ini.parse(fs.readFileSync(path.join(this.filepath, '.hg/hgrc'), 'utf-8'));
      let defaultUrl = config.paths['default'];
      if (defaultUrl) {
        this.remote = this.getRemote(defaultUrl);
      }
    }
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
};
