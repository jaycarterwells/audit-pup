// Makes cases/<case>/golden.json from each case's golden file (cases/<case>/<Case>_Golden.pdf, the instructors' final
// Quality Review printout). Instructor mode compares a student's PDF with this data; build_html.js puts it into the page.
// The data is every readable text item on every page (x, y to a tenth of a point, the text), read with the same pdf.js
// version the page uses. Never edit golden.json by hand: replace the PDF and run this tool again. tests/golden_data.js
// fails when a golden.json no longer matches its PDF.
// Usage: node source/tools/golden_data.js            (every case that has a golden file)
const fs=require('fs'), path=require('path'), vm=require('vm'), crypto=require('crypto');
const ROOT=path.join(__dirname,'..','..'), SRC=path.join(ROOT,'source');
/* global readableText, shiftedText */
vm.runInThisContext(fs.readFileSync(path.join(SRC,'compare.js'),'utf8'),{filename:'source/compare.js'});   // readableText, shiftedText
function loadPdfjs(){ const w=console.warn, l=console.log; console.warn=()=>{}; console.log=()=>{};
  try{ return require(path.join(SRC,'node_modules','pdfjs-dist','legacy','build','pdf.js')); } finally { console.warn=w; console.log=l; } }
function goldenFile(c){ const dir=path.join(ROOT,'cases',c); const f=fs.existsSync(dir)&&fs.readdirSync(dir).find(n=>/_Golden\.pdf$/.test(n)); return f?path.join(dir,f):null; }
async function goldenData(file){
  const bytes=fs.readFileSync(file), lib=loadPdfjs();
  const doc=await lib.getDocument({data:new Uint8Array(bytes), isEvalSupported:false, verbosity:0}).promise, pages=[];
  for(let p=1;p<=doc.numPages;p++){
    const tc=await (await doc.getPage(p)).getTextContent();
    pages.push(tc.items.filter(i=>i.str&&i.str.trim()&&readableText(shiftedText(i.str.trim())))
      .map(i=>[Math.round(i.transform[4]*10)/10, Math.round(i.transform[5]*10)/10, i.str.trim()]));
  }
  await doc.destroy();
  return { source:path.basename(file), sha256:crypto.createHash('sha256').update(bytes).digest('hex'), pages };
}
module.exports={ goldenFile, goldenData };
if(require.main===module) (async()=>{
  for(const c of fs.readdirSync(path.join(ROOT,'cases'))){ const f=goldenFile(c); if(!f) continue;
    const d=await goldenData(f), out=path.join(ROOT,'cases',c,'golden.json');
    fs.writeFileSync(out, '{"source":'+JSON.stringify(d.source)+',"sha256":"'+d.sha256+'","pages":[\n'+d.pages.map(p=>JSON.stringify(p)).join(',\n')+'\n]}\n');
    console.log(`${c}: ${d.pages.length} pages, ${(fs.statSync(out).size/1024).toFixed(0)} KB`);
  }
})().catch(e=>{ console.error(e); process.exit(1); });
