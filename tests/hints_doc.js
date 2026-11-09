// docs/hints.md (the hints page for reviewers) matches the case files. Fix: node source/tools/hints_report.js
const fs=require('fs'), path=require('path');
const { expect } = require('./expect');
const { report } = require('../source/tools/hints_report');
const file=path.join(__dirname,'..','docs','hints.md');
expect('docs/hints.md matches every hint in the case files', fs.existsSync(file) && fs.readFileSync(file,'utf8')===report(), 'run: node source/tools/hints_report.js');
console.log('docs/hints.md checked');
