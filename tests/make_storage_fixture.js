// Makes tests/fixtures/storage/<version>.json: the saved progress a released page leaves in the browser, made by
// using that page the way a counselor does. storage_upgrade.js then proves the current page loads it.
// Run once after each release, on the released page (the tag's index.html, or the live site saved to a file):
//   git show v0.14.0:index.html > /tmp/v0.14.0.html
//   node tests/make_storage_fixture.js /tmp/v0.14.0.html 0.14.0
// What it does: Quinn Steps A and B checked (done), Step E checked with the MWP Worksheet entries and the TS Note
// box (done), Step D checked with the Step B file (same-file warning, so To finish), and, where the page has
// Baylor, Baylor Step A with its TS Note box ticked and Step B checked with the Step A file (Fix).
const fs=require('fs'), path=require('path');
const { chromium } = require('playwright');
const { offline } = require('./page');
const [page, version]=process.argv.slice(2);
if(!page||!version){ console.error('usage: node make_storage_fixture.js <released page.html> <version>'); process.exit(2); }
const Q=path.join(__dirname,'..','cases','quinn'), B=path.join(__dirname,'..','cases','baylor');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext(); await offline(ctx);
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+path.resolve(page));
  await p.waitForFunction(()=>document.getElementById('step').options.length>0,null,{timeout:30000});
  const hasCases=!!(await p.$('#assignment'));
  const pick=async id=>{ if(hasCases && await p.$eval('#assignment',e=>e.value)!==id) await p.selectOption('#assignment',id); };
  const grade=async(step,file)=>{ await p.selectOption('#step',step); await p.setInputFiles('#file',file); await p.click('#grade');
    await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',null,{timeout:60000}); };
  const chips=()=>p.$$eval('.pchip',e=>e.map(x=>x.getAttribute('data-step')+':'+x.className.replace('pchip','').replace('sel','').trim()).join(' '));
  const shown={};
  await pick('quinn');
  await grade('A',`${Q}/Quinn_Sec_A.pdf`); await grade('B',`${Q}/Quinn_Sec_B.pdf`);
  await grade('E',`${Q}/Quinn_Sec_E.pdf`);
  const ins=await p.$$('.ws-grid input'); for(const [i,v] of ['3027','2883','2715','2571','2363'].entries()) await ins[i].fill(v);
  await p.selectOption('.ws-grid select','1'); await p.check('.confirm input');
  await grade('D',`${Q}/Quinn_Sec_B.pdf`);
  shown.quinn=await chips();
  if(hasCases && await p.$('#assignment option[value="baylor"]')){
    await pick('baylor'); await grade('A',`${B}/Baylor_Sec_A.pdf`); await p.check('.confirm input');
    await grade('B',`${B}/Baylor_Sec_A.pdf`);
    shown.baylor=await chips(); await pick('quinn');
  }
  const storage=await p.evaluate(()=>{ const o={}; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(/^auditpup\./.test(k)) o[k]=localStorage.getItem(k); } return o; });
  if(errs.length) throw new Error('page errors: '+errs.join('; '));
  const out=path.join(__dirname,'fixtures','storage',version+'.json'); fs.mkdirSync(path.dirname(out),{recursive:true});
  fs.writeFileSync(out,JSON.stringify({about:`Saved progress left by Audit Pup ${version}, made by tests/make_storage_fixture.js. Do not edit by hand.`,
    version, chips:shown, storage},null,1)+'\n');
  console.log(`wrote ${path.relative(process.cwd(),out)}: ${Object.keys(storage).length} keys | ${Object.entries(shown).map(([c,s])=>c+': '+s).join(' | ')}`);
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
