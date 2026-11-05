// Baylor: every step's correct PDF checked against its own step. Every line and automatic note must pass;
// only the TS Note boxes (checked by the student) may be To do. Also prints any line that did not pass.
const { chromium } = require('playwright'); const path=require('path');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html');
const U=path.join(__dirname,'..','cases','baylor');
const STEPS=['A','B','C','E','F','G','H','I','J','L','M','N','O','P','R'];
const PDF=s=>`${U}/Baylor_Sec_${s==='P'?'O':s}.pdf`;   // Step P has no printout of its own; its return is the same as Step O
const WANT_TODO={A:1,E:1,I:1,N:1};                        // one TS Note box at each of these steps
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext(); await ctx.route('https://dog.ceo/**',r=>r.abort());
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+PAGE); await p.waitForTimeout(300);
  await p.selectOption('#assignment','baylor'); await p.waitForTimeout(150);
  let ok=true;
  for(const s of STEPS){
    await p.selectOption('#step',s); await p.setInputFiles('#file',PDF(s)); const t0=Date.now(); await p.click('#grade');
    await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',{timeout:60000}); await p.waitForTimeout(150);
    const score=(await p.textContent('#score')).replace(/\s/g,'');
    const rows=await p.$$eval('#groups li.check',ls=>ls.map(l=>({cls:l.className.replace('check','').trim(), name:l.querySelector('.name').textContent, st:l.querySelector('.state').textContent, amt:l.querySelector('.amt').textContent, yours:(l.querySelector('.yours')||{}).textContent||''})));
    const todo=rows.filter(r=>r.cls==='todo').length, bad=rows.filter(r=>r.cls!=='pass'&&r.cls!=='todo');
    const err=await p.$eval('#error',e=>e.classList.contains('hidden')?'':e.textContent);
    const good=!bad.length && todo===(WANT_TODO[s]||0) && !err;
    ok=ok&&good;
    console.log(`${good?'OK  ':'FAIL'} Step ${s} | ${score} | ${rows.length} rows, ${todo} to do | ${Date.now()-t0} ms${err?' | ERROR MESSAGE SHOWN: '+err:''}`);
    bad.forEach(r=>console.log(`      ${r.st}: ${r.name} | ${r.yours}`));
  }
  console.log(ok?'\nALL BAYLOR STEPS OK':'\nSOME CASES FAILED','| errors:',errs.length?errs:'none'); await b.close(); process.exit(ok?0:1); })();
