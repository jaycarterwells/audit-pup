const { expect, finish } = require('./expect');
const { chromium } = require('playwright'); const path=require('path');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const U=path.join(__dirname,'..','cases','quinn');
const T=path.join(__dirname,'fixtures');
async function grade(p,step,file){ await p.selectOption('#step',step); await p.setInputFiles('#file',file); await p.click('#grade');
  await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',{timeout:20000}); await p.waitForTimeout(120);
  return { score:(await p.textContent('#score')).replace(/\s/g,''), verdict:await p.textContent('#verdictV'),
    rows:await p.$$eval('li.check',els=>els.map(e=>{const n=e.querySelector('.name');const chip=n.querySelector('.chip');const ln=n.querySelector('.line').textContent;
      return (chip?chip.textContent+' ':'')+ln.replace(/^.*, /,'')+'='+e.querySelector('.state').textContent;})) }; }
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext();
  await ctx.addInitScript(()=>{ window.Worker=function(){throw new Error('blocked');}; URL.createObjectURL=()=> 'blob-request://blocked'; });
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+PAGE); await p.waitForTimeout(300);
  let r;
  r=await grade(p,'A',`${U}/Quinn_Sec_A.pdf`); console.log('A', r.score, '|', r.rows.join(', ')); expect('A scores 4/4',r.score==='4/4',r.score);
  console.log('   N1 detail:', await p.$eval('li.check:nth-child(2) .yours',e=>e.textContent).catch(()=>'?'));
  r=await grade(p,'B',`${U}/Quinn_Sec_B.pdf`); console.log('B', r.score, r.verdict); expect('B scores 21/21',r.score==='21/21',r.score);
  r=await grade(p,'D',`${U}/Quinn_Sec_D.pdf`); console.log('D', r.score, r.verdict); expect('D scores 21/21 with no changes',r.score==='21/21'&&/No unexpected changes/.test(r.verdict),r.score+' '+r.verdict);
  r=await grade(p,'E',`${U}/Quinn_Sec_E.pdf`); console.log('E (before notes)', r.score, '|', r.verdict); console.log('   order:', r.rows.join(', ')); expect('E before notes scores 25/27',r.score==='25/27',r.score);
  const ins=await p.$$('.ws-grid input'); const vals=['3027','2883','2,751','2571','2363'];   // option 3 typo on purpose
  for(let i=0;i<5;i++) await ins[i].fill(vals[i]); await p.selectOption('.ws-grid select','1');
  { const s=(await p.textContent('#score')).replace(/\s/g,''), n=await p.$$eval('.ws-grid .bad',e=>e.length); console.log('E N3 with a wrong option 3:', s, n,'bad field(s)'); expect('a wrong worksheet total marks exactly 1 field',n===1&&s==='25/27',s+' '+n); }
  await ins[2].fill('2715'); await p.selectOption('.ws-grid select','2');
  { const s=(await p.textContent('#score')).replace(/\s/g,''); console.log('E N3 right totals, wrong option circled:', s); expect('wrong option circled does not pass N3',s==='25/27',s); }
  await p.selectOption('.ws-grid select','1'); await p.check('.confirm input');
  { const s=(await p.textContent('#score')).replace(/\s/g,''); console.log('E all notes done:', s, '|', await p.textContent('#verdictV')); expect('E with all notes done scores 27/27',s==='27/27',s); }
  r=await grade(p,'F',`${U}/Quinn_Sec_F.pdf`); console.log('F (entries kept)', r.score, '|', r.verdict); expect('F keeps the worksheet entries and scores 27/27',r.score==='27/27',r.score);
  r=await grade(p,'B',`${T}/B_plus_extra_forms.pdf`); console.log('B+extra forms', r.score); expect('extra forms are ignored',r.score==='21/21',r.score);
  r=await grade(p,'B',`${T}/B_without_3514.pdf`); console.log('B-3514', r.score); expect('a missing 3514 shows 3 lines failing',r.score==='18/21',r.score);
  r=await grade(p,'E',`${U}/Quinn_Sec_B.pdf`); console.log('B graded as E', r.score, '|', r.rows.filter(x=>!/Correct|Confirmed/.test(x)).join(', ')); expect('the B file graded as E fails exactly the 5 MWP lines',r.score==='22/27'&&r.rows.filter(x=>/=Check/.test(x)).length===5,r.score);
  // N1 negative unit test using the page's own functions
  const neg=await p.evaluate(()=>{ const fake=[{form:'fed',items:[{x:100,y:500,s:'X'},{x:110,y:500,s:'Single'},{x:349,y:480,s:'Head of household (HOH)'}]}];
    return {fs:filingStatus(fake), dep:dependentInfo(fake,'JAMES')}; });
  console.log('N1 negative (Single checked, no dependent):', JSON.stringify(neg)); expect('N1 reads Single and no dependent from a fake page',neg.fs==='Single'&&neg.dep===null,JSON.stringify(neg));
  console.log('errors:', errs.length?errs:'none'); expect('no page errors',!errs.length,errs.join(';')); await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
