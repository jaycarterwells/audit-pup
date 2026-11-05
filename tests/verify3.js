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
  r=await grade(p,'A',`${U}/Quinn_Sec_A.pdf`); console.log('A', r.score, '|', r.rows.join(', '));
  console.log('   N1 detail:', await p.$eval('li.check:nth-child(2) .yours',e=>e.textContent).catch(()=>'?'));
  r=await grade(p,'B',`${U}/Quinn_Sec_B.pdf`); console.log('B', r.score, r.verdict);
  r=await grade(p,'D',`${U}/Quinn_Sec_D.pdf`); console.log('D', r.score, r.verdict);
  r=await grade(p,'E',`${U}/Quinn_Sec_E.pdf`); console.log('E (before notes)', r.score, '|', r.verdict); console.log('   order:', r.rows.join(', '));
  const ins=await p.$$('.ws-grid input'); const vals=['3027','2883','2,751','2571','2363'];   // option 3 typo on purpose
  for(let i=0;i<5;i++) await ins[i].fill(vals[i]); await p.selectOption('.ws-grid select','1');
  console.log('E N3 with a wrong option 3:', (await p.textContent('#score')).replace(/\s/g,''), await p.$$eval('.ws-grid .bad',e=>e.length),'bad field(s)');
  await ins[2].fill('2715'); await p.selectOption('.ws-grid select','2');
  console.log('E N3 right totals, wrong option circled:', (await p.textContent('#score')).replace(/\s/g,''));
  await p.selectOption('.ws-grid select','1'); await p.check('.confirm input');
  console.log('E all notes done:', (await p.textContent('#score')).replace(/\s/g,''), '|', await p.textContent('#verdictV'));
  r=await grade(p,'F',`${U}/Quinn_Sec_F.pdf`); console.log('F (entries kept)', r.score, '|', r.verdict);
  r=await grade(p,'B',`${T}/B_plus_extra_forms.pdf`); console.log('B+extra forms', r.score);
  r=await grade(p,'B',`${T}/B_without_3514.pdf`); console.log('B-3514', r.score);
  r=await grade(p,'E',`${U}/Quinn_Sec_B.pdf`); console.log('B graded as E', r.score, '|', r.rows.filter(x=>!/Correct|Confirmed/.test(x)).join(', '));
  // N1 negative unit test using the page's own functions
  const neg=await p.evaluate(()=>{ const fake=[{form:'fed',items:[{x:100,y:500,s:'X'},{x:110,y:500,s:'Single'},{x:349,y:480,s:'Head of household (HOH)'}]}];
    return {fs:filingStatus(fake), dep:dependentInfo(fake,'JAMES')}; });
  console.log('N1 negative (Single checked, no dependent):', JSON.stringify(neg));
  console.log('errors:', errs.length?errs:'none'); await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
