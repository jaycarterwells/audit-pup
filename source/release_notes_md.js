// Reads docs/release-notes.md, the one list of release notes (Carter, November 20, 2026). The build puts it into the
// page's What's new list, and release_notes.js gives one version's section to the GitHub Release, so both say the same.
// Format: "## <version>, <Month> <day>, <year>", then "### Added", "### Fixed", "### Changed", or
// "### What this version includes", each followed by "* " items. A last "## Earlier test copies" section is one paragraph.
// Anything else fails loudly, so a mistyped heading never drops notes without a word.
const fs=require('fs'), path=require('path');
const FILE=path.join(__dirname,'..','docs','release-notes.md');
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const SECTIONS={'Added':'added','Fixed':'fixed','Changed':'changed','What this version includes':'includes'};
function parse(md){
  const list=[]; let rel=null, sec=null, earlier=null, inEarlier=false, n=0;
  const fail=(why,line)=>{ throw new Error(`docs/release-notes.md line ${n}: ${why}: ${line}`); };
  for(const raw of md.split('\n')){
    n++; const line=raw.trim(); if(!line) continue;
    if(line.startsWith('# ')){ if(n>1) fail('only the first line may be a "# " title',line); continue; }
    if(line==='## Earlier test copies'){ inEarlier=true; rel=null; sec=null; earlier=''; continue; }
    let m=line.match(/^## (\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?), ([A-Z][a-z]+) (\d{1,2}), (\d{4})$/);
    if(m){ if(inEarlier) fail('versions go above "Earlier test copies"',line);
      const mo=MONTHS.indexOf(m[2]); if(mo<0) fail('the month is not spelled out',line);
      if(list.some(r=>r.version===m[1])) fail('this version is listed twice',line);
      rel={version:m[1], date:`${m[4]}-${String(mo+1).padStart(2,'0')}-${m[3].padStart(2,'0')}`}; list.push(rel); sec=null; continue; }
    if(line.startsWith('##')){
      m=line.match(/^### (.+)$/);
      if(!m || !rel || !SECTIONS[m[1]]) fail('a heading must be "## <version>, <Month> <day>, <year>" or one of ### '+Object.keys(SECTIONS).join(', ### '),line);
      sec=SECTIONS[m[1]]; if(rel[sec]) fail('this section is listed twice in one version',line); rel[sec]=[]; continue; }
    if(inEarlier){ earlier+=(earlier?' ':'')+line; continue; }
    if(!rel) continue;                                  // the introduction above the first version
    if(line.startsWith('* ')){ if(!sec) fail('an item must be under a ### heading',line); rel[sec].push(line.slice(2).trim()); continue; }
    if(sec && rel[sec].length){ rel[sec][rel[sec].length-1]+=' '+line; continue; }   // an item that wraps onto a second line
    fail('text under a version must be a "* " item',line);
  }
  for(const r of list) if(!Object.values(SECTIONS).some(k=>r[k]&&r[k].length)) throw new Error('docs/release-notes.md: version '+r.version+' has no items');
  return { list, earlier: earlier||'' };
}
function read(){ return parse(fs.readFileSync(FILE,'utf8')); }
module.exports={ parse, read, FILE };
