// Every case, in Node with the reading engine (no browser). For each case:
//  1. answer key: the answer sheet in cases/<case>/ still has the fingerprint recorded in answer_key.json, every
//     row names a line the case reads, and every step's expected values in the page are the answer key's
//     (a no-change step must equal the step it is compared to);
//  2. case.json lists the page's steps;
//  3. each step's correct PDF passes every line of its own step;
//  4. every printout against every step: a step's own printout (or one with the same return) passes; any other
//     printout fails, or passes only with the wrong-step warning. A wrong PDF must never pass silently.
//     A wrong printout's "Did you pick the right step?" box names the printout's own step, and only steps it may pass.
// Answer key notes (filing status, IP PIN, ...) are checked through the page by cases_steps.js.
// Usage: node engine_cases.js [--case baylor]
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const { expect } = require('./expect');
const { loadEngine, readPdf, check, pickCases } = require('./engine');
const { loadCases } = require('./cases');
(async()=>{
  const E=loadEngine(), all=loadCases();
  expect('every case on the page has a case.json, and every case.json is on the page', E.CASES.map(c=>c.id).sort().join()===all.map(c=>c.id).sort().join(),
    `page: ${E.CASES.map(c=>c.id)}; case.json: ${all.map(c=>c.id)}`);
  for(const c of pickCases(all)){
    const t0=Date.now(), K=E.useCase(c.id);
    // 1. answer key
    const keyFile=path.join(c.dir,'answer_key.json');
    if(fs.existsSync(keyFile)){
      const key=JSON.parse(fs.readFileSync(keyFile,'utf8'));
      const sheet=path.join(c.dir,key.source.file);
      expect(`${c.id}: the answer sheet ${key.source.file} is the one answer_key.json was made from`,
        fs.existsSync(sheet) && crypto.createHash('sha256').update(fs.readFileSync(sheet)).digest('hex')===key.source.sha256, 'the sheet changed: re-run source/tools/import_answer_sheet.js');
      const unknown=key.rows.filter(r=>!K.lines[r.line]).map(r=>r.line);
      expect(`${c.id}: every answer key row names a line the case reads`, !unknown.length, unknown.join(', '));
      const want=E.expectedFromKey(key);
      for(const s of K.steps){
        const basis=s.type==='nochange' ? K.steps.find(x=>'Step '+x.id===s.basis) : null;
        const from=basis ? basis.id : s.id;
        if(!want[from]){ expect(`${c.id} Step ${s.id}: has a column in the answer key${basis?' (through '+s.basis+')':''}`, false); continue; }
        const diff=Object.keys({...want[from],...s.expected}).filter(k=>want[from][k]!==s.expected[k]);
        expect(`${c.id} Step ${s.id}: the page's expected values are the answer key's${basis?' at '+s.basis:''}`, !diff.length,
          diff.slice(0,4).map(k=>`${k}: page ${s.expected[k]}, key ${want[from][k]}`).join('; '));
      }
    } else expect(`${c.id}: has an answer_key.json made from its answer sheet (no answer key is typed)`, false);
    // every checked line can be read and taught: a reader, a name, and one hint (rule 7)
    const bare=Object.keys(K.lines).filter(k=>{ const L=K.lines[k]; return !Array.isArray(L.read) || !L.name || !(L.hint && L.hint.length>20); });
    expect(`${c.id}: every line names its reader and has a name and a teaching hint`, !bare.length, bare.join(', '));
    // 2. case.json against the page
    if(!expect(`${c.id}: case.json lists the page's steps in order`, K.steps.map(s=>s.id).join('')===c.steps.join(''), `page ${K.steps.map(s=>s.id).join('')}, case.json ${c.steps.join('')}`)) continue;
    // 3 and 4. every printout against every step
    const results={}; let cells=0;
    for(const f of c.files){ const pages=await readPdf(path.join(c.dir,f),E); results[f]=check(E,pages); }
    for(const f of c.files) for(const s of K.steps){
      const {got,present}=results[f], pass=E.linesPass(s,got,present), alt=E.otherMatches(s,got,present), warn=pass && alt.length>0;
      cells++;
      if(c.mayPass(f,s.id)){
        const bad=Object.keys(s.expected).filter(k=>E.matches(got[k],s.expected[k],present[K.lines[k].form],K.lines[k].form)!=='pass');
        expect(`${c.id}: ${f} passes Step ${s.id}`, pass && !warn, bad.slice(0,4).map(k=>`${k} read ${got[k]}, want ${s.expected[k]}`).join('; ')||'wrong-step warning shown');
      } else expect(`${c.id}: ${f} does not pass Step ${s.id} silently`, !pass || warn, 'passes with no warning');
      if(!c.mayPass(f,s.id)) expect(`${c.id}: ${f} checked as Step ${s.id}: the "Did you pick the right step?" box names its own step, and only steps it may pass`,
        alt.length>0 && alt.every(x=>c.mayPass(f,x.id)), alt.map(x=>x.id).join('/')||'no step named');
    }
    console.log(`${c.id}: ${K.steps.length} steps, ${c.files.length} printouts, ${cells} printout-step pairs checked in ${((Date.now()-t0)/1000).toFixed(1)} s`);
  }
})().catch(e=>{console.error(e);process.exit(1);});
