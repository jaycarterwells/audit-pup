// The main counselor paths in WebKit, Safari's engine (Playwright's current WebKit, not Safari 15 itself; Carter's
// Mac check at release covers the real Safari). For every case: the page starts, the first step's PDF passes, a wrong
// PDF fails and its hint opens, progress survives a reload, and the What's new panel opens and closes.
// WebKit is installed on GitHub (tests.yml). Where it is not installed it reports SKIPPED, except on GitHub (CI=true),
// where a missing WebKit is a failure, so this test can never pass by not running.
const { webkit } = require('playwright');
const { expect } = require('./expect');
const { loadCases, grade, PAGE } = require('./cases');
const { open, reload, offline } = require('./page');
(async()=>{
  let b;
  try{ b=await webkit.launch(); }
  catch(e){
    if(process.env.CI){ expect('WebKit is installed on GitHub', false, e.message.split('\n')[0]); return; }
    console.log('SKIPPED: WebKit is not installed here (GitHub runs this test). '+e.message.split('\n')[0]); return;
  }
  const ctx=await b.newContext({viewport:{width:1280,height:800}}); await offline(ctx);
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await open(p,'file://'+PAGE);
  expect('WebKit: the page starts (no "did not start" note)', await p.$eval('#startup',e=>e.classList.contains('hidden')));
  const chips=()=>p.$$eval('.pchip',e=>e.map(x=>x.getAttribute('data-step')+':'+x.className.replace('pchip','').replace('sel','').trim()).join(' '));
  for(const c of loadCases()){
    const s=c.steps[0], r=await grade(p,c.id,s,c.pdfPath(s));
    const todo=r.rows.filter(x=>x.cls==='todo').length, bad=r.rows.filter(x=>x.cls!=='pass'&&x.cls!=='todo');
    expect(`WebKit ${c.id} Step ${s}: its PDF passes`, !bad.length && !r.err && todo===(c.todo[s]||0), bad.map(x=>x.name).join('; ')||r.err||`${todo} To do`);
    console.log(`WebKit ${c.id} Step ${s}: ${r.score}`);
    const wrong=c.steps.find(x=>!c.mayPass(c.pdf[s],x));
    const w=await grade(p,c.id,wrong,c.pdfPath(s));
    expect(`WebKit ${c.id}: Step ${s}'s PDF checked as Step ${wrong} fails`, w.rows.some(x=>x.cls==='fail') && !w.err, w.score);
    await p.click('#groups li.check.fail .hintbtn');
    expect(`WebKit ${c.id}: a failing line's hint opens with the answer key value`, await p.$eval('#groups li.check.fail .hint',e=>e.classList.contains('show')&&/Answer key:/.test(e.textContent)));
    const before=await chips();
    await reload(p);
    if(await p.$eval('#assignment',e=>e.value)!==c.id){ await p.selectOption('#assignment',c.id); }
    expect(`WebKit ${c.id}: progress is kept after a reload`, (await chips())===before && before.includes(`${s}:`), `${before} | ${await chips()}`);
  }
  await p.click('#verbtn');
  expect('WebKit: the What\'s new panel opens', await p.$eval('#wnback',e=>!e.classList.contains('hidden')));
  await p.keyboard.press('Escape');
  expect('WebKit: Esc closes the What\'s new panel', await p.$eval('#wnback',e=>e.classList.contains('hidden')));
  expect('WebKit: no page errors', !errs.length, errs.join(';'));
  console.log(`WebKit ${b.version()}: checked ${loadCases().length} cases`);
  await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
