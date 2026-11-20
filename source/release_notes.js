// Prints the release notes for one version as Markdown, from docs/release-notes.md (the one list of release notes, also
// shown under the Version button in Audit Pup). Used by the release workflow for the GitHub Release.
// Usage: node release_notes.js [version]   (default: the version in VERSION)
const fs=require('fs'), path=require('path');
const version=(process.argv[2]||fs.readFileSync(path.join(__dirname,'VERSION'),'utf8')).trim();
const r=require('./release_notes_md.js').read().list.find(x=>x.version===version);
if(!r) throw new Error('No entry for version '+version+' in docs/release-notes.md');
const out=[];
[['added','Added'],['fixed','Fixed'],['changed','Changed'],['includes','What this version includes']].forEach(([k,t])=>{
  if(r[k]&&r[k].length){ out.push('### '+t,'');
    // a bug fix: the title in bold, then Symptom, Cause, and Fix each on its own line
    r[k].forEach(s=>{ const l=s.split('\n'); out.push(l.length>1?'* **'+l[0]+'**<br>\n  '+l.slice(1).map(x=>x.replace(/^(\w+):/,'**$1:**')).join('<br>\n  '):'* '+s); });
    out.push(''); } });
out.push('The live site is https://jaycarterwells.github.io/audit-pup/. The same notes are under the Version button in Audit Pup (source: docs/release-notes.md). The counselor guide opens from the Users Guide button.');
console.log(out.join('\n'));
