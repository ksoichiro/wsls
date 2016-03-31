import test from 'ava';
import assert from 'assert';
import { Ws } from '../src';
import fs from 'fs';
import path from 'path';
var temp = require('temp').track();

test('1 Git repository', t => {
  let tempDir = temp.mkdirSync('foo');
  fs.mkdirSync(path.join(tempDir, 'bar'));
  fs.mkdirSync(path.join(tempDir, 'bar', '.git'));
  fs.writeFileSync(path.join(tempDir, 'bar', '.git', 'config'), `[remote "origin"]
  url = git@github.com/ksoichiro/foo.git
`);
  let workspace = new Ws(tempDir);
  return workspace.retrieve().then(() => {

    assert(workspace.result);
    assert(workspace.result.length === 1);
    let p = workspace.result[0];
    assert(p.repoType === 'git');
    assert(p.updatedAt === 'a few seconds');

    t.pass();
  });
});
