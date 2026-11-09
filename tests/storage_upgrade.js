// Saved progress from every released version loads in the current page (tests/fixtures/storage/<version>.json,
// made by make_storage_fixture.js from the released page). For each one: the step trail shows the same statuses,
// the page opens on the first unfinished step, the MWP Worksheet entries, the TS Note boxes, and the same-file
// memory come back, the last case used is reopened, and nothing is lost from storage.
const fs=require('fs'), path=require('path');
const { chromium } = require('playwright');
const { expect } = require('./expect');
const { grade, PAGE } = require('./cases');
const { open, reload, offline } = require('./page');
const DIR=path.join(__dirname,'fixtures','storage'), Q=path.join(__dirname,'..','cases','quinn'), B=path.join(__dirname,'..','cases','baylor');
const chips=p=>p.$$eval('.pchip',e=>e.map(x=>x.getAttribute('data-step')+':'+x.className.replace('pchip','').replace('sel','').trim()).join(' '));
(async()=>{ const b=await chromium.launch(); const fixtures=fs.readdirSync(DIR).filter(f=>f.endsWith('.json')).sort();
  expect('there is a saved-progress record for at least two released versions', fixtures.length>=2, fixtures.join(', '));
  for(const f of fixtures){ const fx=JSON.parse(fs.readFileSync(path.join(DIR,f),'utf8')), v=fx.version;
    const ctx=await b.newContext(); await offline(ctx);
    // the old record is in the browser before the page first opens, as it is for a counselor after an update
    await ctx.addInitScript(s=>{ if(!sessionStorage.getItem('seeded')){ localStorage.clear(); Object.entries(s).forEach(([k,x])=>localStorage.setItem(k,x)); sessionStorage.setItem('seeded','1'); } }, fx.storage);
    const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await open(p,'file://'+PAGE);
    const lastCase=fx.storage['auditpup.case']||'quinn';
    expect(`${v}: the last case used is reopened`, await p.$eval('#assignment',e=>e.value)===lastCase, await p.$eval('#assignment',e=>e.value));
    if(await p.$eval('#assignment',e=>e.value)!=='quinn'){ await p.selectOption('#assignment','quinn'); }
    expect(`${v}: Quinn's step trail shows the saved statuses`, (await chips(p))===fx.chips.quinn, `${await chips(p)} | saved ${fx.chips.quinn}`);
    expect(`${v}: Quinn opens on the first unfinished step (D)`, await p.$eval('#step',e=>e.value)==='D', await p.$eval('#step',e=>e.value));
    let r=await grade(p,'quinn','E',`${Q}/Quinn_Sec_E.pdf`);
    const ws=await p.$$eval('.ws-grid input',e=>e.map(x=>x.value).join(',')), sel=await p.$eval('.ws-grid select',e=>e.value), nn=await p.$eval('.confirm input',e=>e.checked);
    expect(`${v}: the MWP Worksheet entries and the TS Note box come back, so Step E is done right away`, ws==='3027,2883,2715,2571,2363'&&sel==='1'&&nn&&r.score==='28/28', `${ws} option ${sel} box ${nn} ${r.score}`);
    r=await grade(p,'quinn','D',`${Q}/Quinn_Sec_B.pdf`);
    expect(`${v}: the same-file memory comes back (the Step B file checked for Step D warns)`, await p.$eval('#reusewarn',e=>!e.classList.contains('hidden')), r.score);
    if(fx.chips.baylor){
      await p.selectOption('#assignment','baylor');
      expect(`${v}: Baylor's step trail shows the saved statuses`, (await chips(p))===fx.chips.baylor, `${await chips(p)} | saved ${fx.chips.baylor}`);
      await grade(p,'baylor','A',`${B}/Baylor_Sec_A.pdf`);
      expect(`${v}: Baylor's Step A TS Note box comes back`, await p.$eval('.confirm input',e=>e.checked));
    }
    const keys=await p.evaluate(()=>Object.keys(localStorage).filter(k=>/^auditpup\./.test(k)).sort().join(','));
    expect(`${v}: no saved progress is lost`, Object.keys(fx.storage).every(k=>keys.split(',').includes(k)), keys);
    await reload(p);
    expect(`${v}: the upgraded progress survives another reload`, (await chips(p)).length>0 && !errs.length, errs.join(';'));
    expect(`${v}: no page errors`, !errs.length, errs.join(';'));
    console.log(`${v}: saved progress loads (${Object.keys(fx.chips).join(', ')})`);
    await ctx.close(); }
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
