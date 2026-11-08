// Prints the release notes for one version as Markdown, taken from the CHANGELOG list in the template
// (the same notes counselors see under the Version button). Used by the release workflow.
// Usage: node release_notes.js [version]   (default: the version in VERSION)
const fs=require('fs'), path=require('path');
const dir=__dirname;
const version=(process.argv[2]||fs.readFileSync(path.join(dir,'VERSION'),'utf8')).trim();
const tpl=fs.readFileSync(path.join(dir,'audit-pup-template.html'),'utf8');
const start=tpl.indexOf('var CHANGELOG=['), end=tpl.indexOf('];',start);
if(start<0||end<0) throw new Error('CHANGELOG list not found in the template');
const list=Function('return '+tpl.slice(start+'var CHANGELOG='.length,end+1))();
const r=list.find(x=>x.version===version);
if(!r) throw new Error('No CHANGELOG entry for version '+version);
const out=[];
[['added','Added'],['fixed','Fixed'],['changed','Changed'],['includes','What this version includes']].forEach(([k,t])=>{
  if(r[k]&&r[k].length){ out.push('### '+t,''); r[k].forEach(s=>out.push('* '+s)); out.push(''); } });
out.push('The live site is https://jaycarterwells.github.io/audit-pup/. The counselor guide is in docs/chromebook-guide.md.');
console.log(out.join('\n'));
