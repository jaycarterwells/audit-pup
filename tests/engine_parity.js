// The Node tests (engine_cases.js, engine_sweep.js) read PDFs with Node's copy of pdf.js. This proves that, for
// every PDF of every case, the page in the browser reads exactly the same text at exactly the same positions and
// recognizes the same form on every page, so what the Node tests prove holds for the real page.
const fs=require('fs'), path=require('path');
const { chromium } = require('playwright');
const { expect } = require('./expect');
const { loadEngine, readPdf } = require('./engine');
const { loadCases, PAGE } = require('./cases');
const { open } = require('./page');
(async()=>{
  const E=loadEngine(), b=await chromium.launch(), p=await b.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await open(p,'file://'+PAGE);
  let files=0, items=0;
  for(const c of loadCases()) for(const f of c.files){
    const node=await readPdf(path.join(c.dir,f),E);
    const b64=fs.readFileSync(path.join(c.dir,f)).toString('base64');
    const web=await p.evaluate(async b64=>{ const bin=atob(b64), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
      return (await loadPages(u.buffer)).map(pg=>({page:pg.page, form:pg.form, items:pg.items})); }, b64);
    const n=JSON.stringify(node.map(pg=>({page:pg.page, form:pg.form, items:pg.items})));
    files++; items+=node.reduce((s,pg)=>s+pg.items.length,0);
    expect(`${c.id} ${f}: the page and the Node tests read the same text and forms`, n===JSON.stringify(web),
      `pages ${node.length} vs ${web.length}; first difference on page ${(node.findIndex((pg,i)=>JSON.stringify(pg)!==JSON.stringify(web[i]))+1)||'?'}`);
  }
  console.log(`${files} PDFs, ${items} text items: page and Node read them the same`);
  expect('no page errors',!errs.length,errs.join(';'));
  await b.close();
})().catch(e=>{console.error(e);process.exit(1);});
