const { finish } = require('./expect');
// 0.13.0 look: mood dog matches the bar, the trail wraps for long cases, the drop box and button name the step, Zeke's guide
const { chromium } = require('playwright'); const path=require('path');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const U=path.join(__dirname,'..','cases','quinn');
const { open, ready, settled, offline } = require('./page');
const F={A:'Quinn_Sec_A',B:'Quinn_Sec_B',E:'Quinn_Sec_E'};
(async()=>{ const b=await chromium.launch(); let ok=true; const check=(l,c,d)=>{ ok=ok&&c; console.log(`${c?'OK  ':'FAIL'} ${l}${d?'  ['+d+']':''}`); };
 for(const motion of ['no-preference','reduce']){
 const ctx=await b.newContext({viewport:{width:1366,height:657},reducedMotion:motion}); await offline(ctx);
 const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 await open(p,'file://'+PAGE);
 const grade=async(step,pdf)=>{ await p.selectOption('#step',step); await p.setInputFiles('#file',`${U}/${F[pdf]}.pdf`); await p.click('#grade');
   await ready(p); };
 const mood=()=>p.evaluate(()=>({mood:document.getElementById('mood').className, dog:document.getElementById('moodname').textContent, label:document.getElementById('moodimg').getAttribute('aria-label'),
   bar:getComputedStyle(document.getElementById('barfill')).backgroundColor}));
 if(motion==='no-preference'){
  check('opens with Zeke greeting and step-named drop box and button', (await p.textContent('#guidesay')).startsWith("Hi, I'm Zeke!") &&
    (await p.textContent('#dropbig'))==='Drop your Step A PDF here' && (await p.textContent('#grade'))==='Check Step A');
  await p.selectOption('#step','E'); check('changing the step renames the drop box and button', (await p.textContent('#dropbig'))==='Drop your Step E PDF here' && (await p.textContent('#grade'))==='Check Step E');
  await p.setInputFiles('#file',`${U}/${F.E}.pdf`); check('choosing a file: Zeke says to click Check', (await p.textContent('#guidesay'))==='Got it. Click Check Step E when you are ready.');
  await grade('E','B'); let m=await mood(); check('failing check: Zion, the corrections officer, with a red ring, red bar', m.mood==='mood red' && m.dog==='Zion corrections officer' && m.label==="Zion, Audit Pup's corrections officer" && m.bar==='rgb(180, 35, 24)', JSON.stringify(m));
  await grade('E','E'); m=await mood(); check('items to finish: Bailey, the follow-up clerk, with a yellow ring, yellow bar', m.mood==='mood yellow' && m.dog==='Bailey follow-up clerk' && m.label==="Bailey, Audit Pup's follow-up clerk" && m.bar==='rgb(222, 164, 20)', JSON.stringify(m));
  await grade('B','B'); m=await mood(); check('step done: Zeke with a green ring, green bar, Approved snapshot', m.mood==='mood green' && m.dog==='Zeke chief inspector' && m.label==="Zeke, Audit Pup's chief inspector" && m.bar==='rgb(27, 122, 61)' &&
    await p.$eval('#reward',e=>!e.classList.contains('hidden')) && (await p.textContent('#reward .stamp'))==='Approved!', JSON.stringify(m));
  const bimg=await p.$eval('#moodimg',e=>getComputedStyle(e).backgroundImage.slice(0,30)); check('mood dog drawing is built into the file', bimg.startsWith('url("data:image/jpeg;base64'), bimg);
  const fonts=await p.evaluate(async()=>{ await document.fonts.ready; return ['400 17px Atkinson','700 17px Atkinson','800 20px Bitter'].map(f=>document.fonts.check(f)); });
  check('Atkinson Hyperlegible and Bitter load from inside the file', fonts.every(x=>x), fonts.join(','));
  // a long case: 19 steps wrap onto 3 rows, the trail line stops at each row end
  const rows=await p.evaluate(()=>{ for(let i=0;i<14;i++) STEPS.push({id:String.fromCharCode(71+i),name:'x',type:'check',expected:{},notes:[]}); renderProgress();
    const cs=[...document.querySelectorAll('#progress .pchip')]; const tops=[...new Set(cs.map(c=>c.offsetTop))];
    const card=document.querySelector('.card').getBoundingClientRect();
    return {n:cs.length, rows:tops.length, ends:cs.filter(c=>c.hasAttribute('data-end')).length, inside:cs.every(c=>{const r=c.getBoundingClientRect(); return r.right<=card.right && r.left>=card.left;})}; });
  check('19 steps wrap onto 3 rows inside the card, line stops at each row end', rows.n===19 && rows.rows===3 && rows.ends===2 && rows.inside, JSON.stringify(rows));
  await p.setViewportSize({width:911,height:438}); await settled(p);
  const rows2=await p.evaluate(()=>{ const cs=[...document.querySelectorAll('#progress .pchip')]; return {rows:new Set(cs.map(c=>c.offsetTop)).size, ends:cs.filter(c=>c.hasAttribute('data-end')).length,
    sideways:document.documentElement.scrollWidth>window.innerWidth}; });
  check('150% zoom: 19 steps still wrap, no sideways scroll', rows2.rows>=3 && rows2.ends===rows2.rows-1 && !rows2.sideways, JSON.stringify(rows2));
 } else {
  await grade('B','B'); const burst=await p.$eval('#reward .burst',e=>getComputedStyle(e).display);
  check('reduced motion: no paw-print burst', burst==='none', burst);
 }
 check(`no page errors (${motion})`, !errs.length, errs.join(';'));
 await ctx.close(); }
 finish(ok); console.log(ok?'\nALL 0.13.0 LOOK CASES OK':'\nSOME CASES FAILED'); await b.close(); })();
