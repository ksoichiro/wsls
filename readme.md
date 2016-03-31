# wsls

> Special 'ls' to list projects in your workspace.

[![Travis master](https://img.shields.io/travis/ksoichiro/wsls/master.svg?style=flat-square)](https://travis-ci.org/ksoichiro/wsls)
[![AppVeyor master](https://img.shields.io/appveyor/ci/ksoichiro/ws/master.svg?style=flat-square)](https://ci.appveyor.com/project/ksoichiro/ws)
[![npm](https://img.shields.io/npm/v/wsls.svg?style=flat-square)](https://www.npmjs.com/package/wsls)
![npm](https://img.shields.io/npm/l/wsls.svg?style=flat-square)

Sometimes I want to check my old project but

- it's hard to remember what is was...
- it's boring to check if it's a temporary project or not (should I remove it..?)
- it's boring to check if it's my project or git-cloned project.
- etc.

This CLI tool is a solution for it.

## Install

```console
$ npm install wsls
```

## Usage

```console
$ wsls ~/workspace
Git GitHub     a few seconds git-project
Hg  Bitbucket  a year        mercurial-project
-   -          5 days        other-project
Svn GoogleCode 10 months     subversion-project
```

## TODO

- [x] Last update
- [x] Get remote URL (Mainly git)
- [ ] Get working copy status (dirty or not)
- [ ] Main language (Possible?)

## License

MIT &copy; Soichiro Kashima
