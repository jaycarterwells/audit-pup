const { expect, finish } = require('./expect');
// Same-file reuse warning
const { chromium } = require('playwright'); const path=require('path');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const U=path.join(__dirname,'..','cases','quinn');
const F={A:'Quinn_Sec_A',B:'Quinn_Sec_B',D:'Quinn_Sec_D',E:'Quinn_Sec_E',F:'Quinn_Sec_F'};
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext(); await ctx.route('https://dog.ceo/**',r=>r.abort());
 await ctx.addInitScript(()=>{ try{ if(!sessionStorage.getItem('keep')){ localStorage.clear(); } }catch(e){} });  // each page load starts with no saved progress
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const fresh=async()=>{ await p.goto('file://'+PAGE); await p.waitForTimeout(250); };
 const run=async(step,pdf,{click}={})=>{ if(click) await p.click(click); else { await p.selectOption('#step',step); await p.setInputFiles('#file',`${U}/${F[pdf]}.pdf`); await p.click('#grade'); }
   await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',{timeout:20000}); await p.waitForTimeout(120);
   const reuse=await p.$eval('#reusewarn',e=>e.classList.contains('hidden')?'':e.querySelector('b').textContent);
   return {score:(await p.textContent('#score')).replace(/\s/g,''), reuse, verdict:await p.textContent('#verdictV'),
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
 all&=show('F file checked as Step A by mistake (wrong-step warning)', await run('A','F'), false);
 all&=show('...then "Check against Step F instead" button', await run(null,null,{click:'#stepwarn button:last-child'}), false);
 await fresh();
 all&=show('D file checked for Step D', await run('D','D'), false);
 all&=show('same D file then checked for earlier Step B', await run('B','D'), false);
 await fresh();
 all&=show('B file for Step B, with an error (fails, not claimed)', await run('E','B'), false);
 finish(!!all); console.log(all?'\nALL REUSE CASES OK':'\nSOME CASES FAILED','| errors:',errs.length?errs:'none'); expect('no page errors',!errs.length,errs.join(';')); await b.close(); })();
