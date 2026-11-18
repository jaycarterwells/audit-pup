// Dropping a PDF picks the case from the 1040's last name (0.17.0, Carter's choice "auto-switch, keep the menu").
// For every case: a PDF from it, dropped while another case is showing, switches to its case, keeps the chosen file,
// and Zeke says so; checking it then grades against the new case. A step letter the counselor picked is kept when the
// new case has it; otherwise the new case opens on its first unfinished step. A PDF for the case already showing
// changes nothing. Also: the Guide button opens the counselor guide, and Esc closes it.
const { chromium } = require('playwright');
const { expect } = require('./expect');
const { loadCases, PAGE } = require('./cases');
const { started, offline, ready } = require('./page');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext(); await offline(ctx);
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+PAGE); await started(p);
  const cases=loadCases(), val=s=>p.$eval(s,e=>e.value);
  const pick=async id=>{ await p.selectOption('#assignment',id); await p.waitForFunction(id=>document.getElementById('assignment').value===id,id); };
  const choose=async f=>{ await p.setInputFiles('#file',f); await p.waitForFunction(()=>{ const g=document.getElementById('grade'); return g.dataset.state==='ready' && !g.disabled; }); };
  for(const c of cases){
    const other=cases.find(x=>x.id!==c.id), s=c.steps[1];
    // 1. the step was not picked by hand: the new case opens on its first unfinished step
    await pick(other.id); await choose(c.pdfPath(s));
    expect(`${c.id}: its PDF dropped on ${other.id} switches the case`, await val('#assignment')===c.id, await val('#assignment'));
    expect(`${c.id}: the chosen file is kept after the switch`, (await p.textContent('#filename')).includes(c.pdf[s]), await p.textContent('#filename'));
    const say=await p.textContent('#guidesay');
    expect(`${c.id}: Zeke says the case was switched`, say.startsWith('This PDF is from the ') && say.includes(' case, so I switched from '), say);
    expect(`${c.id}: the step is its first unfinished step`, await val('#step')===c.steps[0], await val('#step'));
    // 2. the counselor picked a step the new case also has: it is kept, and the check grades against the new case
    await pick(other.id); const letter=other.steps.includes(s)?s:null;
    if(letter){ await p.selectOption('#step',letter); await choose(c.pdfPath(s));
      expect(`${c.id}: the step letter picked by hand (${letter}) is kept`, await val('#step')===letter, await val('#step'));
      await p.click('#grade'); await ready(p,{settle:false});
      const sc=await p.textContent('#score'), ctxText=await p.textContent('#ctx');
      expect(`${c.id}: the check after the switch grades the ${c.id} case`, await val('#assignment')===c.id && (/^(\d+)\/\1$/.test(sc.replace(/\s/g,'')) || c.todo[s]>0 || c.known(c.pdf[s],s).length>0), sc+' '+ctxText); }
    // 3. a PDF for the case already showing changes nothing
    await pick(c.id); await p.selectOption('#step',c.steps[2]); await choose(c.pdfPath(s));
    expect(`${c.id}: its own PDF leaves the case and the picked step alone`, await val('#assignment')===c.id && await val('#step')===c.steps[2]);
    expect(`${c.id}: no switch message for its own case`, (await p.textContent('#guidesay')).startsWith('Got it.'), await p.textContent('#guidesay'));
  }
  // a last name no case has leaves the case alone
  const none=await p.evaluate(()=>caseOfPages(CASES,[{form:'fed',items:[{x:300,y:700,s:'Last name'},{x:300,y:690,s:'SMITH'}]}]));
  expect('a last name no case has picks no case', none===null, String(none));
  // the Guide window
  await p.click('#guidebtn');
  expect('the Guide button opens the counselor guide', await p.isVisible('#gd') && (await p.textContent('#gdbody')).includes('Save the PDF from TaxSlayer'));
  await p.keyboard.press('Escape'); expect('Esc closes the guide', !(await p.isVisible('#gd')));
  console.log(`checked ${cases.length} cases`);
  expect('no page errors',!errs.length,errs.join(';'));
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
