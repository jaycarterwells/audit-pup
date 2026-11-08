const { expect, finish } = require('./expect');
const { chromium } = require('playwright');
const path=require('path');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const U=path.join(__dirname,'..','cases','quinn');
const T=path.join(__dirname,'fixtures');
const CASES=[
  ['A',`${U}/Quinn_Sec_A.pdf`,'4/4','original A (3 lines + N1)'],
  ['B',`${U}/Quinn_Sec_B.pdf`,'21/21','original B'],
  ['D',`${U}/Quinn_Sec_D.pdf`,'21/21','original D'],
  ['E',`${U}/Quinn_Sec_E.pdf`,'25/27','original E (2 manual items to do)'],
  ['F',`${U}/Quinn_Sec_F.pdf`,'25/27','original F (2 manual items to do)'],
  ['B',`${T}/B_plus_extra_forms.pdf`,'21/21','B + 8 extra pages (Sch 1, FTB 3532, consent, handout)'],
  ['E',`${T}/E_plus_extra_forms.pdf`,'25/27','E + consent pages + Schedule A'],
  ['B',`${T}/B_without_scheduleA.pdf`,'21/21','B with an unchecked form removed'],
  ['B',`${T}/B_without_3514.pdf`,'18/21','B with the 3514 removed (expect 3 Form missing)'],
  ['E',`${U}/Quinn_Sec_B.pdf`,'20/27','B file graded as Step E (5 MWP lines wrong)'],
];
(async()=>{
  const b=await chromium.launch();
  const ctx=await b.newContext();
  // Reproduce a viewer that blocks background workers and blob links.
  await ctx.addInitScript(()=>{
    window.Worker=function(){ throw new Error('Workers blocked in this viewer'); };
    URL.createObjectURL=function(){ return 'blob-request://blocked'; };
  });
  await ctx.route('https://dog.ceo/**',r=>r.abort());   // never contact the real dog photo service from a test
  const p=await ctx.newPage(); const errs=[];
  p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await p.goto('file://'+PAGE); await p.waitForTimeout(300);
  let ok=true;
  for(const [step,file,want,desc] of CASES){
    await p.selectOption('#step',step); await p.setInputFiles('#file',file); await p.click('#grade');
    await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',{timeout:20000});
    await p.waitForTimeout(150);
    const err=await p.$eval('#error',e=>e.classList.contains('hidden')?'':e.textContent);
    const score=(await p.textContent('#score')).replace(/\s/g,'');
    const states=await p.$$eval('.check .state',els=>{const c={};els.forEach(e=>c[e.textContent]=(c[e.textContent]||0)+1);return c;});
    const pass=!err && score===want; ok=ok&&pass;
    console.log(`${pass?'OK  ':'FAIL'} Step ${step} | ${desc} | score ${score} (want ${want}) | ${JSON.stringify(states)}${err?' | ERROR '+err:''}`);
  }
  // Show one hint's text to confirm the answer value appears
  await p.selectOption('#step','E'); await p.setInputFiles('#file',`${U}/Quinn_Sec_B.pdf`); await p.click('#grade');
  await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',{timeout:20000});
  const hints=await p.$$eval('.hint',els=>els.map(e=>e.innerText.replace(/\n+/g,' | ')));
  console.log('\nSample hint:', hints[0]);
  console.log('Page errors:', errs.length?errs.slice(0,3):'none');
  finish(ok); const real=errs.filter(e=>!/Failed to load resource/.test(e)); expect('no page errors (other than the blocked dog photo)',!real.length,real.join(';'));
  console.log(ok?'\nALL CASES OK (with workers and blob links blocked)':'\nSOME CASES FAILED');
  await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
