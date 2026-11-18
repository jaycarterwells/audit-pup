// Checks the live site the way a counselor uses it: the page opens with no errors, shows the expected version, and
// for every case on the live page, the first step's correct PDF passes with only the student's own items left to do.
// A case in the repository that the live page does not have yet (added on main, not released) is skipped, so this
// script from main can check any release.
// Usage: node tests/live_check.js <url> [expected version, for example 0.14.0]
// Also, from 0.17.0: version.json on the site names the same version, and both the live page and a downloaded copy of
// it (a file:// page) can read it, so a counselor on an old version is told to update.
// Runs after each deploy (release workflow) and every week (weekly workflow). It needs the internet.
const fs=require('fs'), os=require('os'), path=require('path');
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
  if(await p.evaluate(()=>typeof UPDATE_CHECK==='object')){
    const vj=await p.evaluate(async u=>{ try{ const r=await fetch(u+'version.json?t='+Date.now(),{cache:'no-store'}); return r.ok?(await r.json()).version:'HTTP '+r.status; }catch(e){ return 'error '+e.message; } }, url.replace(/[^/]*$/,''));
    expect('version.json on the site names the live version', vj===version, vj);
    await p.waitForFunction(()=>UPDATE_CHECK.answered>0,null,{timeout:15000}).catch(()=>{});
    expect('the live page reads version.json and shows no update box', await p.evaluate(()=>UPDATE_CHECK.answered>0 && document.getElementById('updatebox').classList.contains('hidden')), JSON.stringify(await p.evaluate(()=>UPDATE_CHECK)));
    // a downloaded copy: the same page opened as a file must be able to ask the website (cross-origin read)
    const copy=path.join(fs.mkdtempSync(path.join(os.tmpdir(),'auditpup-')),'Audit Pup.html');
    fs.writeFileSync(copy, await (await ctx.request.get(url)).text());
    const d=await ctx.newPage(); await d.goto('file://'+copy);
    await d.waitForFunction(()=>window.UPDATE_CHECK && UPDATE_CHECK.answered>0,null,{timeout:15000}).catch(()=>{});
    const dc=await d.evaluate(()=>window.UPDATE_CHECK||null);
    expect('a downloaded copy can read version.json from the website', !!dc && dc.answered>0 && dc.version===version, JSON.stringify(dc));
    console.log(`update check: version.json ${vj}; downloaded copy read ${dc&&dc.version}`);
  } else console.log('update check: not in this version (before 0.17.0)');
  expect('no page errors',!errs.length,errs.join(';'));
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
