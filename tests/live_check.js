// Checks the live site the way a counselor uses it: the page opens with no errors, shows the expected version, and
// for every case on the live page, the first step's correct PDF passes with only the student's own items left to do.
// A case in the repository that the live page does not have yet (added on main, not released) is skipped, so this
// script from main can check any release.
// Usage: node tests/live_check.js <url> [expected version, for example 0.14.0]
// Runs after each deploy (release workflow) and every week (weekly workflow). It needs the internet.
const { chromium } = require('playwright');
const { expect } = require('./expect');
const { loadCases, grade } = require('./cases');
const [url, want] = process.argv.slice(2);
if(!url){ console.error('usage: node tests/live_check.js <url> [version]'); process.exit(2); }
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext(); await ctx.route('https://dog.ceo/**',r=>r.abort());
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  const res=await p.goto(url,{waitUntil:'load',timeout:60000});
  expect(`${url} answers`, res && res.ok(), res?String(res.status()):'no answer');
  await p.waitForFunction(()=>window.CASES&&document.getElementById('step').options.length>0,null,{timeout:30000});
  const version=await p.evaluate(()=>APP_VERSION);
  console.log(`live site: ${url} is version ${version}`);
  if(want) expect(`the live site is version ${want}`, version===want, version);
  expect('the "did not start" note is hidden', await p.$eval('#startup',e=>e.classList.contains('hidden')));
  const live=await p.evaluate(()=>CASES.map(c=>({id:c.id, steps:c.steps.map(s=>s.id)})));
  for(const c of loadCases()){
    const lc=live.find(x=>x.id===c.id);
    if(!lc){ console.log(`${c.id}: not on the live site yet (skipped)`); continue; }
    const s=lc.steps.find(x=>c.steps.includes(x));
    if(!expect(`${c.id}: the live page has a step that case.json knows`, !!s, lc.steps.join(''))) continue;
    const r=await grade(p,c.id,s,c.pdfPath(s));
    const todo=r.rows.filter(x=>x.cls==='todo').length, bad=r.rows.filter(x=>x.cls!=='pass'&&x.cls!=='todo');
    expect(`${c.id} Step ${s}: its PDF passes on the live site`, !bad.length && !r.err && todo===(c.todo[s]||0), bad.map(x=>`${x.st}: ${x.name}`).join('; ')||r.err||`${todo} To do`);
    console.log(`${c.id} Step ${s}: ${r.score}`);
  }
  expect('no page errors',!errs.length,errs.join(';'));
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
