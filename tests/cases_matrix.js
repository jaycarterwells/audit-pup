// Every case, through the page: a sample of printout-step pairs. The full every-printout-against-every-step check
// runs at engine level in engine_cases.js (seconds instead of minutes); engine_parity.js proves the page reads the
// PDFs the same way. Here each printout is checked through the page against:
//   * every step it may pass (its own step and steps with the same return): it must pass with no warning, and
//   * the next step it may not pass: it must fail, or pass only with the yellow "Did you pick the right step?" box.
// No check may show an error on the page.
const { chromium } = require('playwright');
const { expect } = require('./expect');
const { loadCases, grade, PAGE } = require('./cases');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext(); await ctx.route('https://dog.ceo/**',r=>r.abort());
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+PAGE); await p.waitForFunction(()=>window.CASES&&document.getElementById('step').options.length>0);
  for(const c of loadCases()){ let n=0;
    for(const f of c.files){
      const own=c.stepsOf(f)[0], i=c.steps.indexOf(own);
      const pass=c.steps.filter(s=>c.mayPass(f,s));
      const wrong=[...c.steps.slice(i+1),...c.steps.slice(0,i)].find(s=>!c.mayPass(f,s));
      for(const s of [...pass, wrong].filter(Boolean)){
        const r=await grade(p,c.id,s,`${c.dir}/${f}`), ok=!r.rows.some(x=>x.cls==='fail'||x.cls==='warn'||x.cls==='missing'); n++;
        if(c.mayPass(f,s)) expect(`${c.id}: ${f} passes Step ${s} on the page`, ok && !r.warn, ok?'wrong-step warning shown':r.score);
        else expect(`${c.id}: ${f} does not pass Step ${s} silently on the page`, !ok || !!r.warn, r.score);
        expect(`${c.id}: no on-screen error for ${f} as Step ${s}`, !r.err, r.err);
      }
    }
    console.log(`${c.id}: ${n} sample printout-step pairs checked through the page`);
  }
  expect('no page errors',!errs.length,errs.join(';'));
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
