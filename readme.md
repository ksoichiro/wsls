# wsls

> Special 'ls' to list projects in your workspace.

[![Build Status](https://travis-ci.org/ksoichiro/wsls.svg?branch=master)](https://travis-ci.org/ksoichiro/wsls)
[![Build status](https://ci.appveyor.com/api/projects/status/r7df934xjle7sw97?svg=true)](https://ci.appveyor.com/project/ksoichiro/wsls)

Sometimes I want to check my old project but

- it's hard to remember what is was...
- it's boring to check if it's a temporary project or not (should I remove it..?)
- it's boring to check if it's my project or git-cloned project.
- etc.

This CLI tool is a solution for it.

## Install

```console
$ git clone https://github.com/ksoichiro/wsls
$ cd wsls
$ npm link
```

## Usage

```console
$ wsls ~/workspace
G git-project
H mercurial-project
S subversion-project
- other-project
```

## License

MIT &copy; Soichiro Kashima
