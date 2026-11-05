const { chromium } = require('playwright'); const path=require('path'); const fs=require('fs');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const U=path.join(__dirname,'..','cases','quinn');
const VIEWS=[['100%',1366,657],['125%',1093,526],['150%',911,438]];
async function grade(p,step,file){ await p.selectOption('#step',step); await p.setInputFiles('#file',file); await p.click('#grade');
  await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',{timeout:60000}); await p.waitForTimeout(150); }
(async()=>{ const b=await chromium.launch();
 for(const [zoom,w,h] of VIEWS){
  const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});
  await ctx.route('https://dog.ceo/**',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({message:'https://images.dog.ceo/breeds/retriever-golden/n02099601_1.jpg',status:'success'})}));
  await ctx.route('https://images.dog.ceo/**',r=>r.fulfill({contentType:'image/jpeg',body:fs.readFileSync(path.join(__dirname,'mockdog.jpg'))}));
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+PAGE); await p.waitForTimeout(200);
  const hx=async()=>{ await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await p.waitForTimeout(250);
    return p.$eval('#sticky',e=>{const r=e.getBoundingClientRect();return {top:Math.round(r.top),hgt:Math.round(r.height)};}); };
  await grade(p,'B',`${U}/Quinn_Sec_B.pdf`); await p.waitForTimeout(600);
  const done=await hx(); if(zoom!=='125%') await p.screenshot({path:path.join(OUT,`cb_${zoom.replace('%','')}_done.png`)});
  await grade(p,'A',`${U}/Quinn_Sec_F.pdf`); const warn=await hx(); if(zoom==='150%') await p.screenshot({path:path.join(OUT,'cb_150_warn.png')});
  await grade(p,'E',`${U}/Quinn_Sec_B.pdf`); const fail=await hx();
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
  const smallest=await p.evaluate(()=>{let m=99,who='';document.querySelectorAll('body *').forEach(e=>{if(!e.offsetParent&&e.tagName!=='BODY')return;
     if(![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))return; const f=parseFloat(getComputedStyle(e).fontSize); if(f<m){m=f;who=e.className||e.tagName;}});return m+'px ('+who+')';});
  console.log(`${zoom} zoom (${w}x${h}): frame done+dog ${done.hgt}px = ${Math.round(done.hgt/h*100)}% | warning ${warn.hgt}px = ${Math.round(warn.hgt/h*100)}% | failing ${fail.hgt}px = ${Math.round(fail.hgt/h*100)}% | pinned top=${done.top},${warn.top},${fail.top} | sideways scroll: ${overflow} | smallest visible text ${smallest} | errors: ${errs.length||'none'}`);
  await ctx.close(); }
 // entry-level Chromebook speed: throttle CPU 6x via DevTools protocol, time the biggest PDF (30 pages)
 const ctx=await b.newContext({viewport:{width:1366,height:657}}); const p=await ctx.newPage();
 const cdp=await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate',{rate:6});
 await p.goto('file://'+PAGE); await p.waitForTimeout(300);
 for(const [s,f] of [['F','Quinn_Sec_F'],['A','Quinn_Sec_A']]){ const t0=Date.now(); await grade(p,s,`${U}/${f}.pdf`); console.log(`CPU throttled 6x: Step ${s} PDF graded in ${((Date.now()-t0)/1000).toFixed(1)} s, score ${(await p.textContent('#score')).replace(/\s/g,'')}`); }
 const t1=Date.now(); await p.reload(); await p.waitForFunction(()=>!!window.pdfjsWorker); console.log(`CPU throttled 6x: page open time ${((Date.now()-t1)/1000).toFixed(1)} s`);
 await b.close(); })();
