const { expect, finish } = require('./expect');
// Same-file reuse warning, and the wrong-step warning's suggested steps and its button
const { chromium } = require('playwright'); const path=require('path');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const U=path.join(__dirname,'..','cases','quinn');
const { open, ready } = require('./page');
const F={A:'Quinn_Sec_A',B:'Quinn_Sec_B',D:'Quinn_Sec_D',E:'Quinn_Sec_E',F:'Quinn_Sec_F'};
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext(); await ctx.route('https://dog.ceo/**',r=>r.abort());
 await ctx.addInitScript(()=>{ try{ if(!sessionStorage.getItem('keep')){ localStorage.clear(); } }catch(e){} });  // each page load starts with no saved progress
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const fresh=()=>open(p,'file://'+PAGE);
 const run=async(step,pdf,{click}={})=>{ if(click) await p.click(click); else { await p.selectOption('#step',step); await p.setInputFiles('#file',`${U}/${F[pdf]}.pdf`); await p.click('#grade'); }
   await ready(p,{settle:false});
   const reuse=await p.$eval('#reusewarn',e=>e.classList.contains('hidden')?'':e.querySelector('b').textContent);
   const warn=await p.$eval('#stepwarn',e=>e.classList.contains('hidden')?'':[...e.querySelectorAll('button')].map(x=>x.textContent.replace('Check against ','').replace(' instead','')).join('/'));
   return {score:(await p.textContent('#score')).replace(/\s/g,''), reuse, warn, step:await p.$eval('#step',e=>e.value), verdict:await p.textContent('#verdictV'),
     reward:await p.$eval('#reward',e=>!e.classList.contains('hidden')), bar:await p.$eval('#barfill',e=>e.style.backgroundColor)}; };
 const show=(label,r,expectWarn)=>{ const ok=(!!r.reuse)===expectWarn; console.log(`${ok?'OK  ':'FAIL'} ${label.padEnd(58)} ${r.score.padEnd(6)} reuse warning: ${r.reuse||'none'}${r.reuse?' | dog shown: '+r.reward+' | '+r.verdict:''}`); return ok; };
 let all=true;
 await fresh();
 all&=show('B file checked for Step B', await run('B','B'), false);
 all&=show('same B file checked again for Step B (retry)', await run('B','B'), false);
 all&=show('same B file reused for Step D (forgot to reprint)', await run('D','B'), true);
 all&=show('same B file reused for Step D again', await run('D','B'), true);
 all&=show("D's own new file for Step D", await run('D','D'), false);
 all&=show('same B file reused for Step E (fails, and warns)', await run('E','B'), true);
 await fresh();
 { const r=await run('A','F'); all&=show('F file checked as Step A by mistake (fails: Step A blanks must be blank)', r, false);
   expect('with the full answer key a later printout fails the earlier step, with no warning and no reward',/^\d+\/34$/.test(r.score)&&r.score!=='34/34'&&!r.warn&&!r.reward,`${r.warn} ${r.score} reward ${r.reward}`); }
 // The wrong-step warning fires only when a step with fewer checks passes and a step with more checks also passes.
 // Full answer keys never do that (see unit_engine.js), so give Step A a partial key here, as a future case might have.
 const partialA=()=>p.evaluate(()=>{ STEPS.find(s=>s.id==='A').expected={fed_12e:23625, ca540_18:11412, ca540_32:628}; });
 await fresh(); await partialA();
 { const r=await run('A','F'); expect('partial Step A key: the wrong-step warning offers Steps E and F, with no reward',r.warn==='Step E/Step F'&&r.score==='4/4'&&!r.reward,`${r.warn} ${r.score} reward ${r.reward}`); }
 { const r=await run(null,null,{click:'#stepwarn button:last-child'}); all&=show('...then "Check against Step F instead" button', r, false);
   expect('the warning button re-checks against Step F',r.step==='F'&&r.score==='34/36'&&!r.warn,`${r.step} ${r.score} ${r.warn}`); }
 await fresh(); await partialA();
 { const r=await run('A','B'); expect('partial Step A key: a Step B file checked as Step A offers Steps B and D',r.warn==='Step B/Step D'&&r.score==='4/4',`${r.warn} ${r.score}`); }
 { const r=await run('B','B'); expect('a clean pass shows the reward',!r.warn&&r.score==='33/33'&&r.reward,`${r.score} reward ${r.reward}`); }
 await fresh();
 all&=show('D file checked for Step D', await run('D','D'), false);
 all&=show('same D file then checked for earlier Step B', await run('B','D'), false);
 await fresh();
 all&=show('B file for Step B, with an error (fails, not claimed)', await run('E','B'), false);
 finish(!!all); console.log(all?'\nALL REUSE CASES OK':'\nSOME CASES FAILED','| errors:',errs.length?errs:'none'); expect('no page errors',!errs.length,errs.join(';')); await b.close(); })();
