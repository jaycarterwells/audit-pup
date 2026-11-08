// Loads the Audit Pup reading engine and every case in Node, without a browser, exactly as build_html.js puts
// them into the page: source/engine.js, then ANSWER_KEYS from cases/*/answer_key.json, then source/cases/*.js.
// readPdf() reads a PDF's text with the same pdf.js version the page uses and keeps the result in
// tests/output/pdf-text/, so later runs skip the reading. engine_parity.js proves the text matches the browser's.
const fs=require('fs'), path=require('path'), vm=require('vm'), crypto=require('crypto');
const ROOT=path.join(__dirname,'..'), SRC=path.join(ROOT,'source');
function loadEngine(){
  const keys={};
  fs.readdirSync(path.join(ROOT,'cases')).forEach(c=>{ const f=path.join(ROOT,'cases',c,'answer_key.json'); if(fs.existsSync(f)) keys[c]=JSON.parse(fs.readFileSync(f,'utf8')); });
  const caseFiles=fs.readdirSync(path.join(SRC,'cases')).filter(f=>f.endsWith('.js')).sort((a,b)=>(a==='quinn.js'?-1:b==='quinn.js'?1:a.localeCompare(b)));
  // Run in Node's own global scope, like the page's one script: a separate vm context makes every global lookup
  // slow (the sweep ran 10 times slower). Test scripts load the engine once, so the globals do not clash.
  if(global.__auditPupEngine) return global.__auditPupEngine;
  const ctx=global; Object.assign(ctx,{ CASES:[], ANSWER_KEYS:keys, LINES:null, STEPS:null });
  vm.runInThisContext(fs.readFileSync(path.join(SRC,'engine.js'),'utf8'),{filename:'source/engine.js'});
  caseFiles.forEach(f=>vm.runInThisContext(fs.readFileSync(path.join(SRC,'cases',f),'utf8'),{filename:'source/cases/'+f}));
  global.__auditPupEngine=ctx;
  // the page's useCase() also loads saved progress; for the engine only the answer key and lines matter
  ctx.useCase=id=>{ const c=ctx.CASES.find(x=>x.id===id); if(!c) throw new Error('no case '+id); ctx.CASE=c; ctx.LINES=c.lines; ctx.STEPS=c.steps; return c; };
  return ctx;
}
let pdfjs=null;
function loadPdfjs(){
  if(pdfjs) return pdfjs;
  const warn=console.warn, log=console.log; console.warn=()=>{}; console.log=()=>{};   // pdf.js warns that Node has no canvas; text reading does not need one
  try{ pdfjs=require(path.join(SRC,'node_modules','pdfjs-dist','legacy','build','pdf.js')); } finally { console.warn=warn; console.log=log; }
  return pdfjs;
}
const CACHE=path.join(__dirname,'output','pdf-text');
// The same steps as the page's loadPages(): every text item with its position, then the form on each page.
async function readPdf(file, engine){
  const bytes=fs.readFileSync(file), version=require(path.join(SRC,'node_modules','pdfjs-dist','package.json')).version;
  const id=crypto.createHash('sha256').update(bytes).update(version).digest('hex').slice(0,24), cached=path.join(CACHE,id+'.json');
  let pages;
  if(fs.existsSync(cached)) pages=JSON.parse(fs.readFileSync(cached,'utf8'));
  else {
    const lib=loadPdfjs();
    const doc=await lib.getDocument({data:new Uint8Array(bytes), isEvalSupported:false, verbosity:0}).promise;
    pages=[];
    for(let p=1;p<=doc.numPages;p++){
      const tc=await (await doc.getPage(p)).getTextContent();
      pages.push({page:p, items:tc.items.filter(i=>i.str&&i.str.trim()).map(i=>({x:i.transform[4], y:i.transform[5], s:i.str.trim()}))});
    }
    await doc.destroy();
    fs.mkdirSync(CACHE,{recursive:true}); fs.writeFileSync(cached,JSON.stringify(pages));
  }
  pages.forEach(pg=>{ pg.form=engine.classifyPage(pg.items); });
  return pages;
}
// what the page does after reading a PDF: which forms are present, and the value of every line
function check(engine,pages){ const present={}; pages.forEach(pg=>{ present[pg.form]=true; }); return {present, got:engine.CASE.extract(pages)}; }
// the cases to test: all, or the ones named with --case <id> (more than one allowed)
function pickCases(all){ const i=process.argv.indexOf('--case'); if(i<0) return all; const want=process.argv.slice(i+1).filter(a=>!a.startsWith('--'));
  const out=all.filter(c=>want.includes(c.id)); if(!out.length) throw new Error('no case named '+want.join(', ')); return out; }
module.exports={ loadEngine, readPdf, check, pickCases, ROOT };
