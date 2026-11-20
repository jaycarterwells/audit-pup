// Every answer sheet note a student can see must say everything the sheet says (Mary Ryan's review, November 2026: a
// note copied by hand had dropped "Line 13 = 69; Line 15 = -2,805"). For each note the sheet writes as "N9: ...", every
// number of two or more digits in it must also be in the page's text for that note: the step-hint text (var X_N9 in
// source/cases/<case>.js) or the note's own answer key text (notes.N9.key). The sheet text comes from LibreOffice's
// plain text export, which keeps a note's continuation lines indented.
//   node tests/sheet_notes.js <case> <answer_sheet.txt>
const fs=require('fs'), path=require('path');
const { expect }=require('./expect');
const { loadEngine }=require('./engine');
const [caseId, txtFile]=process.argv.slice(2);
const E=loadEngine(), K=E.CASES.find(c=>c.id===caseId);
const src=fs.readFileSync(path.join(__dirname,'..','source','cases',caseId+'.js'),'utf8');
const pre=caseId.charAt(0).toUpperCase()+'_';
// the sheet's notes: a line "N9: text" starts one; indented lines after it continue it
const notes={}; let cur=null;
for(const l of fs.readFileSync(txtFile,'utf8').split(/\r?\n/)){
  const m=l.match(/^\s*(N\d+\w?|NP|NN):\s*(.*)$/);
  if(m){ cur=m[1]; notes[cur]=(notes[cur]||'')+' '+m[2]; continue; }
  if(cur && /^\s{2,}\S/.test(l)) notes[cur]+=' '+l.trim(); else if(l.trim()) cur=null;
}
const nums=t=>(t.match(/\(?-?[\d,]*\d\)?/g)||[]).map(x=>x.replace(/[(),-]/g,'')).filter(x=>x.length>=2);
let checked=0;
for(const [id,t] of Object.entries(notes)){
  if(id==='NN') continue;   // the TS Note reminder is shown as the TS Note box, with its own example
  const v=src.match(new RegExp('var '+pre+id+'="([^"]*)"')), N=K.notes[id];
  const page=[v&&v[1], N&&N.key, N&&N.coach].filter(Boolean).join(' ');
  if(!page){ expect(`${caseId} ${id}: the sheet's note is shown somewhere on the page`, false, 'no '+pre+id+' and no notes.'+id); continue; }
  const missing=[...new Set(nums(t).filter(n=>!nums(page).includes(n)))];
  checked++;
  expect(`${caseId} ${id}: every number in the sheet's note is in the page's text`, !missing.length, 'missing '+missing.join(', ')+' | sheet: '+t.trim());
}
console.log(`${caseId}: ${checked} answer sheet notes checked against the page's text`);
