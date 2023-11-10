// adapted from github copilot, needs cleaning

import { it, describe, before } from 'mocha';
import findPackageJsonPaths from '../../utils';
import { gitRepoSamplesDir } from '../../extension';
import * as assert from 'assert';
import * as fs from 'fs';
// import * as vscode from 'vscode';
import * as path from 'path';

console.log(`Current directory: ${process.cwd()}`);
describe('concat', () => {
  assert.deepStrictEqual([1, 2, 3].concat([4, 5, 6]), [1, 2, 3, 4, 5, 6])
})

describe('findPackageJsonFiles', () => {
  let testDir: string;
  before(() => {
    testDir = path.join(process.cwd(), 'src', 'test', 'suite', 'test-data');
  })
  it('should check if the testDir directory exists', () => {
    assert(fs.existsSync(testDir));
  });
  it('the sample directory should exist', async () => {
    fs.access(gitRepoSamplesDir, fs.constants.F_OK, (err) => {
      assert.deepStrictEqual(err, null);
    })
  });

  it('should return an empty array if the directory is empty', async () => {
    let dir = path.join(testDir,'empty-dir');
    const result = await findPackageJsonPaths(dir);
    assert.deepStrictEqual(result, []);
  });

  it('should return an empty array if the directory contains only non-package.json files', async () => {
    const dir = path.join(testDir,'./non-package-dir');
    const result = await findPackageJsonPaths(dir);
    assert.deepStrictEqual(result, []);
  });
  it('should return an array of file paths for all package.json files in the directory and subdirectories', async () => {
    const result: string[] = await findPackageJsonPaths(testDir);
    assert.deepStrictEqual(result.sort(), [
      './package1/package.json',
      './package2/package.json',
      './subdir/package3/package.json',
    ].map(endPath => path.join(testDir, endPath)    ).sort());
  });
});
