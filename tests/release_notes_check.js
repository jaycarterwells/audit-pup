// The release notes (docs/release-notes.md) follow Carter's format (November 20, 2026). The file must read cleanly, and
// every bug fix from 0.19.1 on is a 3 to 5 word title, then Symptom, Cause, and Fix lines, each sentence capitalized.
// This proves the rule catches the mistakes it is for. Developer test: run by tests/dev_test.sh and tests/run_all.sh.
const path=require('path');
const { expect }=require('./expect');
const N=require(path.join(__dirname,'..','source','release_notes_md.js'));
const notes=N.read();
expect('docs/release-notes.md reads cleanly and lists versions', notes.list.length>0);
const good='Corrected PDF read again\nSymptom: A PDF was not checked.\nCause: The picker kept the file.\nFix: The picker is cleared.';
expect('a well-formed fix passes', N.bugFixProblem(good)==='', N.bugFixProblem(good));
const bad={
  'a lowercase start after Symptom': good.replace('Symptom: A','Symptom: a'),
  'a lowercase second sentence': good.replace('kept the file.','kept the file. it was old.'),
  'a title of 2 words': good.replace('Corrected PDF read again','PDF fixed'),
  'a title of 6 words': good.replace('Corrected PDF read again','The corrected PDF is read again'),
  'a missing Cause line': good.replace(/\nCause:[^\n]*/,''),
  'the lines out of order': 'Corrected PDF read again\nCause: The picker kept the file.\nSymptom: A PDF was not checked.\nFix: The picker is cleared.',
  'one paragraph, as before 0.19.1': 'Symptom: a PDF was not checked. Cause: the picker kept it. Fix: it is cleared.',
};
for(const [what,item] of Object.entries(bad)) expect('the rule refuses '+what, N.bugFixProblem(item)!=='', 'accepted');
const md=v=>`# T\n\n## ${v}, November 21, 2026\n\n### Fixed\n\n* Symptom: a PDF was not checked. Cause: the picker kept it. Fix: it is cleared.\n`;
let threw=false; try{ N.parse(md('0.19.2')); }catch(e){ threw=true; }
expect('the build refuses an old-style fix in a new version', threw);
threw=false; try{ N.parse(md('0.19.0')); }catch(e){ threw=true; }
expect('versions before 0.19.1 keep their old wording', !threw);
console.log('release notes format checked');
