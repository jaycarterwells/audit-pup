// Baylor: (1) every step's PDF checked against every step, (2) switching cases keeps each case's progress
// separate, (3) the TS Note boxes are kept per step, (4) speed of the longest PDF on a slowed processor.
const { chromium } = require('playwright'); const path=require('path');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html');
const U=path.join(__dirname,'..','cases','baylor'), Q=path.join(__dirname,'..','cases','quinn');
const STEPS=['A','B','C','E','F','G','H','I','J','L','M','N','O','P','R'];
const PDFS=['A','B','C','E','F','G','H','I','J','L','M','N','O','R'];
const pdf=s=>`${U}/Baylor_Sec_${s}.pdf`;
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext(); await ctx.route('https://dog.ceo/**',r=>r.abort());
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  let ok=true; const check=(label,cond,detail)=>{ ok=ok&&cond; console.log(`${cond?'OK  ':'FAIL'} ${label}${detail?'  ['+detail+']':''}`); };
  const grade=async(step,file)=>{ await p.selectOption('#step',step); await p.setInputFiles('#file',file); await p.click('#grade');
    await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',{timeout:60000}); await p.waitForTimeout(120);
    const score=(await p.textContent('#score')).replace(/\s/g,''); const warn=await p.$eval('#stepwarn',e=>e.classList.contains('hidden')?'':e.textContent);
    const fails=await p.$$eval('#groups li.check.fail',l=>l.length); const err=await p.$eval('#error',e=>e.classList.contains('hidden')?'':e.textContent);
    return {score,warn,fails,err}; };
  await p.goto('file://'+PAGE); await p.waitForTimeout(300);
  await p.selectOption('#assignment','baylor'); await p.waitForTimeout(150);

  // (1) matrix. Correct pairings pass; identical returns (E/F, L/M, O/P/R) pass each other; everything else fails or warns. Never an on-screen error.
  const same={E:'EF',F:'EF',L:'LM',M:'LM',O:'OPR',P:'OPR',R:'OPR'};
  console.log('PDF\\picked '+STEPS.map(s=>s.padEnd(6)).join(''));
  let matrixOK=true, falsePass=[];
  for(const f of PDFS){ let line=('PDF '+f+':').padEnd(11);
    for(const s of STEPS){ const r=await grade(s,pdf(f));
      const pass=r.fails===0, should=(s===f)||(same[s]&&same[s].includes(f));
      if(pass && !should && !r.warn) falsePass.push(`${f} picked as ${s}`);
      if(!pass && should) matrixOK=false; if(r.err) matrixOK=false;
      line+=(pass?(r.warn?'WARN':'pass'):'fail').padEnd(6); }
    console.log(line); }
  check('matrix: every correct pairing passes, no on-screen errors', matrixOK);
  check('matrix: no wrong PDF passes a step silently (it must fail, or pass with the yellow warning)', !falsePass.length, falsePass.join('; '));

  // (2) and (3): per-step TS Note boxes, kept after reload; Quinn's progress stays separate
  await p.click('#resetbtn'); await p.click('#resetyes'); await p.waitForTimeout(100);
  await grade('A',pdf('A')); await p.check('.confirm input'); await p.waitForTimeout(100);
  await grade('E',pdf('E')); const eBox=await p.$eval('.confirm input',e=>e.checked);
  check('TS Note box is per step: ticking it at Step A does not tick Step E', !eBox);
  const chips=async()=>p.$$eval('.pchip',e=>e.map(x=>x.getAttribute('data-step')+':'+x.className.replace('pchip','').replace('sel','').trim()).join(' '));
  const bc=await chips(); check('Baylor trail shows 15 steps, A done, E to finish', bc.split(' ').length===15 && bc.includes('A:done') && bc.includes('E:todo'), bc);
  await p.selectOption('#assignment','quinn'); await p.waitForTimeout(150);
  const qc=await chips(); check('switching to Quinn shows Quinn\'s own 5 steps, nothing done', qc==='A:none B:none D:none E:none F:none', qc);
  await p.selectOption('#step','B'); await p.setInputFiles('#file',`${Q}/Quinn_Sec_B.pdf`); await p.click('#grade');
  await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',{timeout:60000});
  check('Quinn still checks normally after switching', (await p.textContent('#score')).replace(/\s/g,'')==='21/21');
  await p.reload(); await p.waitForTimeout(300);
  check('reopening the page returns to the case used last (Quinn)', await p.$eval('#assignment',e=>e.value)==='quinn');
  await p.selectOption('#assignment','baylor'); await p.waitForTimeout(150);
  check('Baylor progress kept after reload and switching back', (await chips())===bc, await chips());
  await grade('A',pdf('A')); check('Step A TS Note box still ticked after reload', await p.$eval('.confirm input',e=>e.checked));
  await p.click('#resetbtn'); await p.click('#resetyes'); await p.waitForTimeout(100);
  await p.selectOption('#assignment','quinn'); await p.waitForTimeout(150);
  check('Start over in Baylor leaves Quinn\'s progress alone', (await chips()).includes('B:done'), await chips());
  await p.click('#resetbtn'); await p.click('#resetyes');

  // (4) speed: the longest Baylor PDF (47 pages) with the processor slowed 6 times
  await p.selectOption('#assignment','baylor'); await p.waitForTimeout(150);
  const cdp=await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate',{rate:6});
  const t0=Date.now(); const r=await grade('O',pdf('O')); const ms=Date.now()-t0; await cdp.send('Emulation.setCPUThrottlingRate',{rate:1});
  console.log(`CPU throttled 6x: Baylor Step O PDF (47 pages) graded in ${(ms/1000).toFixed(1)} s, score ${r.score}`);
  console.log(ok?'\nALL BAYLOR CASE CHECKS OK':'\nSOME CASES FAILED','| errors:',errs.length?errs:'none'); await b.close(); process.exit(ok?0:1); })();
