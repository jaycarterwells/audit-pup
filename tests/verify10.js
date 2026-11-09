const { expect, finish } = require('./expect');
// Auto-advance to the next step
const { chromium } = require('playwright'); const path=require('path');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const U=path.join(__dirname,'..','cases','quinn');
const { open, ready, settled, offline } = require('./page');
const F={A:'Quinn_Sec_A',B:'Quinn_Sec_B',D:'Quinn_Sec_D',E:'Quinn_Sec_E',F:'Quinn_Sec_F'};
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1366,height:657}}); await offline(ctx);
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await open(p,'file://'+PAGE);
 const grade=async(step,pdf)=>{ await p.selectOption('#step',step); await p.setInputFiles('#file',`${U}/${F[pdf]}.pdf`); await p.click('#grade');
   await ready(p,{settle:false}); };
 const state=async()=>({step:await p.$eval('#step',e=>e.value), file:await p.$eval('#filename',e=>e.textContent), btnDisabled:await p.$eval('#grade',e=>e.disabled),
   next:await p.$eval('#guidesay',e=>e.textContent.trim()), btn:await p.$eval('#grade',e=>e.textContent.trim()), drop:await p.$eval('#dropbig',e=>e.textContent.trim())});
 let ok=true; const check=(l,c,d)=>{ ok=ok&&c; console.log(`${c?'OK  ':'FAIL'} ${l}${d?'  ['+d+']':''}`); };
 await grade('A','A'); let s=await state();
 check('Step A done: moves to Step B, clears the file, button waits for a new file', s.step==='B' && s.file==='' && s.btnDisabled && s.next.startsWith('Nice work on Step A! Step B is up next') && s.btn==='Check Step B' && s.drop==='Drop your Step B PDF here', JSON.stringify(s));
 await grade('B','B'); s=await state(); check('Step B done: moves to Step D (no Step C in the key)', s.step==='D' && s.next.includes('Step D is up next') && s.btn==='Check Step D', s.next);
 check('results no longer hold a next-step button', !(await p.$('#nextbtn')) && !(await p.$('#nextline')));
 await grade('D','B'); s=await state(); check('reused Step B file for D (warning): stays on D, no advance', s.step==='D' && !s.next.startsWith('Nice work'), JSON.stringify(s));
 await grade('D','D'); s=await state(); check('Step D done with its own file: moves to Step E', s.step==='E', s.step);
 await grade('E','E'); s=await state(); check('Step E lines pass but manual items open: stays on E', s.step==='E' && !s.next.startsWith('Nice work'), JSON.stringify(s));
 const ins=await p.$$('.ws-grid input'); for(const [i,v] of ['3027','2883','2715','2571','2363'].entries()) await ins[i].fill(v);
 await p.selectOption('.ws-grid select','1'); await p.check('.confirm input');
 s=await state(); check('Step E manual items finished: moves to Step F', s.step==='F' && s.next.includes('Step F is up next'), s.next);
 await grade('F','B'); s=await state(); check('Step F fails: stays on F', s.step==='F' && !s.next.startsWith('Nice work'), s.step);
 await grade('F','F'); s=await state(); check('Step F done, all steps done: case-finished message', s.next==='Nice work on Step F! Every step of this case is done.', s.next);
 await p.click('#resetbtn'); await p.click('#resetyes'); await grade('B','B'); s=await state();
 check('after Start over, finishing B first moves to the next unfinished step after B (D)', s.step==='D', s.step);
 await grade('F','F'); { const ins2=await p.$$('.ws-grid input'); for(const [i,v] of ['3027','2883','2715','2571','2363'].entries()) await ins2[i].fill(v);
   await p.selectOption('.ws-grid select','1'); await p.check('.confirm input'); }
 s=await state(); check('finishing F (with its manual items) while A is unfinished wraps back to Step A', s.step==='A', s.step);
 await grade('A','F'); s=await state(); check('wrong-step warning: no advance', s.step==='A' && !s.next.startsWith('Nice work'), s.step);
 await p.setViewportSize({width:911,height:438}); await grade('A','A'); await settled(p);
 const vis=await p.$eval('#sticky',e=>{const r=e.getBoundingClientRect(); return r.height>0 && r.height<=window.innerHeight*0.62;});
 const st=await p.$eval('#sticky',e=>Math.round(e.getBoundingClientRect().height));
 check('150% zoom: the pinned frame with the reward stays a modest share of the screen', vis, st+'px of 438');
 await p.screenshot({path:path.join(OUT,'advance.png')});
 const shownErr=await p.$eval('#error',e=>e.classList.contains('hidden')?'':e.textContent); if(shownErr){ok=false; console.log('ERROR MESSAGE SHOWN:',shownErr);}
 finish(ok); expect('no page errors',!errs.length,errs.join(';')); console.log(ok?'\nALL AUTO-ADVANCE CASES OK':'\nSOME CASES FAILED','| errors:',errs.length?errs:'none'); await b.close(); })();
