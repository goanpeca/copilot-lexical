#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const isCI = process.env.CI || process.env.GITHUB_ACTIONS;
const localPath = 'file:../jupyter-ui/packages/lexical';
const npmVersion = 'latest';

const targetVersion = isCI ? npmVersion : localPath;

if (pkg.dependencies['@datalayer/jupyter-lexical'] !== targetVersion) {
  pkg.dependencies['@datalayer/jupyter-lexical'] = targetVersion;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`Set @datalayer/jupyter-lexical to: ${targetVersion}`);
}
