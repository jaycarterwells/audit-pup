// Every case: progress is kept per case. Finishing a step in one case leaves every other case untouched,
// reopening the page returns to the case used last with its progress, and Start over clears only the case picked.
// For a case with TS Note boxes at more than one step, ticking one step's box does not tick another step's.
const { chromium } = require('playwright');
const { expect } = require('./expect');
const { loadCases, grade, PAGE } = require('./cases');
const { started, offline } = require('./page');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext(); await offline(ctx);
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  const ready=()=>started(p);
  await p.goto('file://'+PAGE); await ready();
  const cases=loadCases();
  const chips=()=>p.$$eval('.pchip',e=>e.map(x=>x.getAttribute('data-step')+':'+x.className.replace('pchip','').replace('sel','').trim()).join(' '));
  const pick=async id=>{ await p.selectOption('#assignment',id); await p.waitForFunction(id=>document.getElementById('assignment').value===id&&document.querySelectorAll('.pchip').length>0,id); };
  const fresh=s=>s.split(' ').every(x=>x.endsWith(':none'));
  // finish the first step of each case in turn; every case must show only its own progress
  const after={};
  for(const c of cases){
    await pick(c.id); expect(`${c.id}: starts with no progress and ${c.steps.length} steps on the trail`, fresh(await chips()) && (await chips()).split(' ').length===c.steps.length, await chips());
    const s=c.steps.find(x=>!(c.todo[x]>0)) || c.steps[0];
    await grade(p,c.id,s,c.pdfPath(s)); after[c.id]=await chips();
    expect(`${c.id}: Step ${s} is Done after its own PDF passes`, after[c.id].includes(`${s}:done`), after[c.id]);
    for(const o of cases.filter(x=>x.id!==c.id && !after[x.id])){ await pick(o.id); expect(`${c.id} progress does not show in ${o.id}`, fresh(await chips()), await chips()); }
    await pick(c.id);
  }
  // reopening: back on the last case, every case's progress kept
  const last=cases[cases.length-1].id; await pick(last); await p.reload(); await ready();
  expect('reopening the page returns to the case used last', await p.$eval('#assignment',e=>e.value)===last);
  for(const c of cases){ await pick(c.id); expect(`${c.id}: progress kept after reopening`, (await chips())===after[c.id], await chips()); }
  // TS Note boxes are per step where case.json says so (taken from case.json, not from the page under test)
  for(const c of cases){
    const own=c.ownTsNoteBox||[]; if(own.length<2) continue;
    for(const s of own){ await grade(p,c.id,s,c.pdfPath(s)); if(await p.$eval('.confirm input',e=>e.checked)) await p.uncheck('.confirm input'); }
    for(let i=0;i<own.length;i++){
      await grade(p,c.id,own[i],c.pdfPath(own[i])); await p.check('.confirm input');
      for(const o of own.filter(x=>x!==own[i])){ await grade(p,c.id,o,c.pdfPath(o));
        expect(`${c.id}: ticking the TS Note box at Step ${own[i]} does not tick Step ${o}`, !(await p.$eval('.confirm input',e=>e.checked))); }
      await grade(p,c.id,own[i],c.pdfPath(own[i])); await p.uncheck('.confirm input');
    }
    await grade(p,c.id,own[0],c.pdfPath(own[0])); await p.check('.confirm input');
    await p.reload(); await ready(); await grade(p,c.id,own[0],c.pdfPath(own[0]));
    expect(`${c.id}: the Step ${own[0]} TS Note box is still ticked after reopening`, await p.$eval('.confirm input',e=>e.checked));
  }
  // Start over clears only the case picked
  const first=cases[0]; await pick(first.id); await p.click('#resetbtn'); await p.click('#resetyes');
  expect(`${first.id}: Start over clears its progress`, fresh(await chips()), await chips());
  for(const o of cases.slice(1)){ await pick(o.id); expect(`Start over in ${first.id} leaves ${o.id} alone`, !fresh(await chips()), await chips()); }
  console.log(`checked ${cases.length} cases: ${cases.map(c=>c.id).join(', ')}`);
  expect('no page errors',!errs.length,errs.join(';'));
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
