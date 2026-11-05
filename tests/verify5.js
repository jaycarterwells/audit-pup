const { chromium } = require('playwright'); const path=require('path');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const U=path.join(__dirname,'..','cases','quinn');
const PDF={A:'Quinn_Sec_A',B:'Quinn_Sec_B',D:'Quinn_Sec_D',E:'Quinn_Sec_E',F:'Quinn_Sec_F'};
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:820,height:900},deviceScaleFactor:1.5});
 await ctx.addInitScript(()=>{ window.Worker=function(){throw new Error('blocked');}; });
 await ctx.addInitScript(()=>{ try{ if(!sessionStorage.getItem('keep')){ localStorage.clear(); } }catch(e){} });  // each page load starts with no saved progress
 await ctx.route('https://dog.ceo/**',r=>r.abort());
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+PAGE); await p.waitForTimeout(250);
 const run=async(step,pdf)=>{ await p.goto('file://'+PAGE); await p.waitForTimeout(150); await p.selectOption('#step',step); await p.setInputFiles('#file',`${U}/${PDF[pdf]}.pdf`); await p.click('#grade');
   await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',{timeout:20000}); await p.waitForTimeout(100);
   const warn=await p.$eval('#stepwarn',e=>e.classList.contains('hidden')?'':Array.from(e.querySelectorAll('button')).map(x=>x.textContent.replace('Check against ','').replace(' instead','')).join('/'));
   const reward=await p.$eval('#reward',e=>!e.classList.contains('hidden'));
   const lineFails=await p.$$eval('li.check.fail',e=>e.length);
   const shownErr=await p.$eval('#error',e=>e.classList.contains('hidden')?'':e.textContent); if(shownErr) errs.push('on-screen error ('+step+'/'+pdf+'): '+shownErr);
   return {score:(await p.textContent('#score')).replace(/\s/g,''), warn, reward, lineFails}; };
 console.log('PDF\\picked   A                B                D                E                F');
 for(const pdf of Object.keys(PDF)){ let row=`PDF ${pdf}:    `;
   for(const step of ['A','B','D','E','F']){ const r=await run(step,pdf);
     const tag=r.warn?('WARN->'+r.warn):(r.lineFails?'fail':'pass');
     row+=(r.score+' '+tag+(r.reward?' +reward':'')).padEnd(17); }
   console.log(row); }
 // button: pick A, give F's PDF, click the suggested step
 await run('A','F'); await p.screenshot({path:path.join(OUT,'warn.png')});
 await p.click('#stepwarn button:last-child'); await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready'); await p.waitForTimeout(150);
 console.log('\nAfter clicking "Check against Step F instead": step=',await p.$eval('#step',e=>e.value),'score=',(await p.textContent('#score')).replace(/\s/g,''),'warn hidden=',await p.$eval('#stepwarn',e=>e.classList.contains('hidden')));
 await p.screenshot({path:path.join(OUT,'tiles.png')});
 console.log('errors:',errs.length?errs:'none'); await b.close(); })();
