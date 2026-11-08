// Makes cases/<case>/answer_key.json from a case's answer sheet, so the answer key is never typed by hand.
//
//   1. Convert the answer sheet to HTML with LibreOffice (keeps each table cell in its own column):
//        soffice --headless --convert-to html --outdir /tmp/sheet cases/baylor/answer_sheet.doc
//   2. Import it:
//        node source/tools/import_answer_sheet.js baylor /tmp/sheet/answer_sheet.html
//      or check that the committed answer_key.json still matches the sheet:
//        node source/tools/import_answer_sheet.js baylor /tmp/sheet/answer_sheet.html --check
//
// How a row of the sheet becomes a line of the page:
//   "1a", "12e" ...           Form 1040 line          -> fed_1a, fed_12e
//   "Sch 1-8c", "Sch A-5a"    schedule line           -> sch1_8c, schA_5a
//   "8880" with "L2" in label Form 8880 line 2        -> f8880_2
//   rows after the "CA 540" row                        -> ca540_<line>
// A blank cell means "blank or $0" at that step (stored as null). Notes such as "N7" after a value are kept
// in "notes" and stripped from the value. Rows like "(additional notes)" and "Comments" are kept as notes only.
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const [caseId, htmlFile, flag]=process.argv.slice(2);
if(!caseId||!htmlFile){ console.error('usage: node import_answer_sheet.js <case> <sheet.html> [--check]'); process.exit(2); }
const root=path.join(__dirname,'..','..'), caseDir=path.join(root,'cases',caseId);
const sheetDoc=fs.readdirSync(caseDir).find(f=>/^answer_sheet\./.test(f));
if(!sheetDoc) throw new Error(`no answer_sheet.* in cases/${caseId}`);

// --- read the tables from LibreOffice's HTML (no packages needed)
const html=fs.readFileSync(htmlFile,'utf8');
const text=s=>s.replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&#(\d+);/g,(m,n)=>String.fromCharCode(+n))
  .replace(/&lsquo;|&rsquo;|&#8216;|&#8217;/g,"'").replace(/\s+/g,' ').trim();
const tables=[...html.matchAll(/<table[\s\S]*?<\/table>/gi)].map(t=>[...t[0].matchAll(/<tr[\s\S]*?<\/tr>/gi)].map(r=>{
  const cells=[]; for(const c of r[0].matchAll(/<t[dh]([^>]*)>([\s\S]*?)<\/t[dh]>/gi)){ cells.push(text(c[2])); const span=+((c[1].match(/colspan="?(\d+)/i)||[])[1]||1); for(let i=1;i<span;i++) cells.push(''); }
  return cells; }));
if(!tables.length) throw new Error('no tables found in '+htmlFile);

// --- turn each table row into a line of the page
const rows=[], notes=[], steps=[];
tables.forEach((t,ti)=>{
  const cols=t[0].slice(2).map(h=>{ const m=h.match(/['‘’]([A-Z])['‘’]/)||h.match(/^([A-Z])\b/); if(!m) throw new Error(`table ${ti+1}: cannot read step from header "${h}"`); return m[1]; });
  cols.forEach(s=>{ if(!steps.includes(s)) steps.push(s); });
  let ca=false;
  t.slice(1).forEach(r=>{
    const code=(r[0]||'').trim(), label=(r[1]||'').trim(), cells=r.slice(2);
    if(/^CA 540/i.test(code)){ ca=true; return; }
    if(!code){ if(/note/i.test(label)) cols.forEach((s,i)=>{ if(cells[i]) notes.push({step:s, notes:cells[i]}); }); return; }
    if(/^comments?$/i.test(code)){ cols.forEach((s,i)=>{ if(cells[i]) notes.push({step:s, notes:cells[i]}); }); return; }
    let line;
    if(ca) line='ca540_'+code;
    else if(/^Sch ([123A])-(\w+)$/i.test(code)){ const m=code.match(/^Sch ([123A])-(\w+)$/i); line='sch'+m[1].toUpperCase()+'_'+m[2]; }
    else if(/^\d{4}$/.test(code)){ const m=label.match(/\bL(\d+[a-z]?)\b/); if(!m) throw new Error(`table ${ti+1}: form ${code} row needs "L<line>" in its label: "${label}"`); line='f'+code+'_'+m[1]; }
    else if(/^\d+[a-z]?$/.test(code)) line='fed_'+code;
    else throw new Error(`table ${ti+1}: cannot tell which line "${code} ${label}" is`);
    const values={}, rowNotes={};
    cols.forEach((s,i)=>{ const c=(cells[i]||'').trim(); const n=c.match(/\b(N[0-9A-Z]+)\b/g);
      if(n) rowNotes[s]=n.join(', ');
      const v=c.replace(/\bN[0-9A-Z]+\b/g,'').replace(/[,\s$]/g,'');
      if(v && !/^-?\d+$/.test(v)) throw new Error(`table ${ti+1}, ${code}, step ${s}: "${c}" is not a whole-dollar amount`);
      values[s]=v?parseInt(v,10):null; });
    const row={line, sheet:`${code} ${label}`.trim(), values};
    if(Object.keys(rowNotes).length) row.notes=rowNotes;
    rows.push(row);
  });
});
const sha=crypto.createHash('sha256').update(fs.readFileSync(path.join(caseDir,sheetDoc))).digest('hex');
const key={ about:'Made by source/tools/import_answer_sheet.js from the answer sheet. Do not edit by hand: re-run the import.',
  source:{file:sheetDoc, sha256:sha}, steps, rows, notes };
const out=JSON.stringify(key,null,1).replace(/\{\n\s+("[A-Z]": [^\n]+,?\n\s*)+\}/g,m=>m.replace(/\n\s*/g,' '))+'\n';
const target=path.join(caseDir,'answer_key.json');
if(flag==='--check'){
  const same=fs.existsSync(target) && fs.readFileSync(target,'utf8')===out;
  console.log(same?`answer_key.json matches ${sheetDoc}`:`answer_key.json does NOT match ${sheetDoc}: re-run the import`); process.exit(same?0:1);
}
fs.writeFileSync(target,out);
console.log(`wrote cases/${caseId}/answer_key.json: ${rows.length} rows, steps ${steps.join(' ')}, ${rows.reduce((n,r)=>n+Object.values(r.values).filter(v=>v!==null).length,0)} filled cells`);
