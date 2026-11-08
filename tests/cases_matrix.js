// Every case: every printout checked against every step. A step's own printout, or one with the same return
// (case.json "sameReturn"), must pass. Any other printout must fail, or pass only with the yellow
// "Did you pick the right step?" warning. A wrong PDF must never pass silently, and no check may show an error.
const { chromium } = require('playwright');
const { expect } = require('./expect');
const { loadCases, grade, PAGE } = require('./cases');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext(); await ctx.route('https://dog.ceo/**',r=>r.abort());
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+PAGE); await p.waitForFunction(()=>window.CASES&&document.getElementById('step').options.length>0);
  for(const c of loadCases()){
    console.log(`\n${c.id}: printout (row) checked as step (column)\n${''.padEnd(14)}${c.steps.map(s=>s.padEnd(6)).join('')}`);
    for(const f of c.files){
      let line=`${c.stepsOf(f).join('/').padEnd(14)}`;
      for(const s of c.steps){
        const r=await grade(p,c.id,s,`${c.dir}/${f}`), pass=!r.rows.some(x=>x.cls==='fail'||x.cls==='warn'||x.cls==='missing');
        const cell=pass?(r.warn?'WARN':'pass'):'fail';
        if(c.mayPass(f,s)) expect(`${c.id}: ${f} passes Step ${s}`, pass && !r.warn, cell);
        else expect(`${c.id}: ${f} does not pass Step ${s} silently`, !pass || !!r.warn, cell);
        expect(`${c.id}: no on-screen error for ${f} as Step ${s}`, !r.err, r.err);
        line+=cell.padEnd(6);
      }
      console.log(line);
    }
  }
  expect('no page errors',!errs.length,errs.join(';'));
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
