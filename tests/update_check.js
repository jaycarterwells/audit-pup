// The newer-version check, with a stand-in for the website (no internet): the page asks version.json on opening,
// when the tab comes back, and before every Check.
//  * On the website, a newer version shows the yellow update box, turns Check off (even after a PDF is chosen, and
//    when the newer version appears only at Check time), Zeke says to update, and Update loads the newest page.
//  * The same version, or a website that does not answer, changes nothing: Check works.
//  * A downloaded copy is told it is out of date and sent to the website, and can still check.
const fs=require('fs'), path=require('path');
const { chromium } = require('playwright');
const { expect } = require('./expect');
const { PAGE, grade } = require('./cases');
const { started } = require('./page');
const { default: AxeBuilder } = require(path.join(__dirname,'..','source','node_modules','@axe-core','playwright'));
const axe=async(p,name)=>{ for(const theme of ['light','dark']){ await p.emulateMedia({colorScheme:theme});
  const r=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).include('#updatebox').analyze();
  expect(`${name} (${theme} theme): no accessibility problems`, !r.violations.length, r.violations.map(v=>v.id+': '+v.nodes.map(n=>n.target.join(' ')).join(', ')).join('; ')); } };
const LIVE='https://jaycarterwells.github.io/audit-pup/';
const html=fs.readFileSync(PAGE,'utf8'), CURRENT=(html.match(/var APP_VERSION='([^']*)'/)||[])[1];
const Q=path.join(__dirname,'..','cases','quinn');
(async()=>{ const b=await chromium.launch();
  // site: what the stand-in website says ('down' = no answer)
  const setup=async site=>{ const ctx=await b.newContext(); await ctx.route('https://dog.ceo/**',r=>r.abort());
    await ctx.route(LIVE+'version.json*',r=>site.v==='down'?r.abort():r.fulfill({contentType:'application/json',body:JSON.stringify({version:site.v})}));
    await ctx.route(new RegExp('^'+LIVE.replace(/[./]/g,'\\$&')+'(\\?.*)?$'),r=>r.fulfill({contentType:'text/html',body:html}));
    const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); return {ctx,p,errs}; };
  const boxShown=p=>p.$eval('#updatebox',e=>!e.classList.contains('hidden'));
  const asked=p=>p.waitForFunction(n=>UPDATE_CHECK.asked>=n && (UPDATE_CHECK.answered>=n || document.getElementById('grade').dataset.state==='ready'),1,{timeout:10000});
  const answered=(p,n)=>p.waitForFunction(m=>UPDATE_CHECK.answered>=m,n,{timeout:10000});
  expect('the built page has a version', /^\d+\.\d+\.\d+$/.test(CURRENT||''), CURRENT);

  // 1. website, a newer version is out when the page opens
  { const site={v:'99.0.0'}, {ctx,p,errs}=await setup(site);
    await p.goto(LIVE); await started(p); await answered(p,1);
    expect('website, newer version: the update box shows with the new version number', await boxShown(p) && /updated to version 99\.0\.0/.test(await p.textContent('#updatebox')), await p.textContent('#updatebox'));
    await p.setInputFiles('#file',`${Q}/Quinn_Sec_A.pdf`);
    expect('website, newer version: Check stays off after a PDF is chosen', await p.$eval('#grade',e=>e.disabled));
    await axe(p,'website update box');
    expect('website, newer version: Zeke says to update first', /new version/.test(await p.textContent('#guidesay')), await p.textContent('#guidesay'));
    await Promise.all([p.waitForURL(u=>String(u).startsWith(LIVE+'?v=99.0.0')), p.click('#updatebtn')]);
    await started(p);
    expect('website: Update loads the newest page', p.url()===LIVE+'?v=99.0.0', p.url());
    expect('website, newer version: no page errors', !errs.length, errs.join(';')); await ctx.close(); }

  // 2. website, the newer version is released while the page is open: found at Check, nothing is checked
  { const site={v:CURRENT}, {ctx,p,errs}=await setup(site);
    await p.goto(LIVE); await started(p); await answered(p,1);
    expect('website, same version: no update box', !(await boxShown(p)));
    await p.selectOption('#step','A'); await p.setInputFiles('#file',`${Q}/Quinn_Sec_A.pdf`);
    site.v='99.0.0'; await p.click('#grade');
    await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',null,{timeout:30000});
    expect('website: Check asks the website for its version first', await p.evaluate(()=>UPDATE_CHECK.answered>=2), JSON.stringify(await p.evaluate(()=>UPDATE_CHECK)));
    expect('website, newer version found at Check: the PDF is not checked and the update box shows',
      await boxShown(p) && await p.$eval('#results',e=>e.style.display==='none') && await p.$eval('#grade',e=>e.disabled), await p.textContent('#updatebox'));
    expect('no page errors (newer at Check)', !errs.length, errs.join(';')); await ctx.close(); }

  // 3. website, same version, then the tab comes back after a release
  { const site={v:CURRENT}, {ctx,p,errs}=await setup(site);
    await p.goto(LIVE); await started(p); await answered(p,1);
    const r=await grade(p,'quinn','A',`${Q}/Quinn_Sec_A.pdf`);
    expect('website, same version: Check works', r.score==='5/5' && !(await boxShown(p)), r.score);
    site.v='99.0.0';
    await p.evaluate(()=>{ Object.defineProperty(document,'visibilityState',{value:'visible',configurable:true}); document.dispatchEvent(new Event('visibilitychange')); });
    await p.waitForFunction(()=>UPDATE_CHECK.answered>=3,null,{timeout:10000});
    expect('website: coming back to the tab after a release shows the update box', await boxShown(p));
    expect('no page errors (tab comes back)', !errs.length, errs.join(';')); await ctx.close(); }

  // 4. website does not answer (offline): nothing changes
  { const site={v:'down'}, {ctx,p,errs}=await setup(site);
    await p.goto(LIVE); await started(p); await asked(p);
    const r=await grade(p,'quinn','A',`${Q}/Quinn_Sec_A.pdf`);
    expect('offline: no update box, and Check works', !(await boxShown(p)) && r.score==='5/5', r.score);
    expect('no page errors (offline)', !errs.length, errs.join(';')); await ctx.close(); }

  // 5. a downloaded copy with a newer version on the website: told to use the website, can still check
  { const site={v:'99.0.0'}, {ctx,p,errs}=await setup(site);
    await p.goto('file://'+PAGE); await started(p); await answered(p,1);
    const t=await p.textContent('#updatebox');
    expect('downloaded copy, newer version: the box says this copy is out of date', await boxShown(p) && /out of date/.test(t) && new RegExp(CURRENT.replace(/\./g,'\\.')).test(t), t);
    await axe(p,'downloaded copy update box');
    const r=await grade(p,'quinn','A',`${Q}/Quinn_Sec_A.pdf`);
    expect('downloaded copy, newer version: Check still works', r.score==='5/5', r.score);
    await Promise.all([p.waitForURL(LIVE), p.click('#updatebtn')]);
    expect('downloaded copy: the button opens the Audit Pup website', p.url()===LIVE, p.url());
    expect('no page errors (downloaded copy)', !errs.length, errs.join(';')); await ctx.close(); }

  console.log(`update check: website and downloaded copy checked against version ${CURRENT}`);
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
