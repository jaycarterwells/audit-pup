// Every case: (1) case.json matches the page's steps, (2) each step's correct PDF passes its own step, with only
// the items the student finishes by hand left To do, (3) the case's longest PDF checks in time on a slowed processor.
// Usage: node cases_steps.js [--case baylor]
const { chromium } = require('playwright');
const { expect } = require('./expect');
const { loadCases, pageCases, grade, PAGE } = require('./cases');
const { open, offline } = require('./page');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext(); await offline(ctx);
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await open(p,'file://'+PAGE);
  const cases=loadCases(), onPage=await pageCases(p);
  expect('every case on the page has a case.json, and every case.json is on the page',
    onPage.map(c=>c.id).sort().join()===cases.map(c=>c.id).sort().join(), `page: ${onPage.map(c=>c.id)}; case.json: ${cases.map(c=>c.id)}`);
  const pick=process.argv.indexOf('--case'), only=pick<0?null:process.argv.slice(pick+1);
  for(const c of cases.filter(x=>!only||only.includes(x.id))){
    const pc=onPage.find(x=>x.id===c.id);
    if(!expect(`${c.id}: case.json lists the page's steps in order`, pc && pc.steps.join('')===c.steps.join(''), pc?`page ${pc.steps.join('')}, case.json ${c.steps.join('')}`:'not on the page')) continue;
    for(const s of c.steps){
      const r=await grade(p,c.id,s,c.pdfPath(s));
      const todo=r.rows.filter(x=>x.cls==='todo').length, bad=r.rows.filter(x=>x.cls!=='pass'&&x.cls!=='todo');
      const ok=expect(`${c.id} Step ${s}: its own PDF passes every check`, !bad.length && !r.err, bad.map(x=>`${x.st}: ${x.name} | ${x.yours}`).join(' || ')||r.err)
        & expect(`${c.id} Step ${s}: ${c.todo[s]||0} item(s) left for the student`, todo===(c.todo[s]||0), `${todo} To do`);
      console.log(`${ok?'ok  ':'FAIL'} ${c.id} Step ${s} | ${r.score} | ${r.rows.length} rows, ${todo} to do`);
    }
    if(c.speed){ const cdp=await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate',{rate:6});
      const t0=Date.now(); const r=await grade(p,c.id,c.speed.step,c.pdfPath(c.speed.step)); const sec=(Date.now()-t0)/1000;
      await cdp.send('Emulation.setCPUThrottlingRate',{rate:1}); await cdp.detach();
      console.log(`${c.id}: Step ${c.speed.step} PDF checked in ${sec.toFixed(1)} s with the processor slowed 6 times (${r.score})`);
      expect(`${c.id}: Step ${c.speed.step} PDF checks in under ${c.speed.maxSeconds} s on a slowed processor`, sec<c.speed.maxSeconds, sec.toFixed(1)+' s'); }
  }
  expect('no page errors',!errs.length,errs.join(';'));
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
