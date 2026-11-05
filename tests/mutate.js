// Plants single-line mistakes into the real PDFs (one printed number at a time) and checks the engine catches them.
const { chromium } = require('playwright'); const path=require('path'); const fs=require('fs');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const U=path.join(__dirname,'..','cases','quinn');
const CASES=[['A','Quinn_Sec_A'],['B','Quinn_Sec_B'],['D','Quinn_Sec_D'],['E','Quinn_Sec_E'],['F','Quinn_Sec_F']];
(async()=>{ const b=await chromium.launch(); const p=await b.newPage();
 await p.goto('file://'+PAGE); await p.waitForTimeout(300);
 const all={};
 for(const [stepId,f] of CASES){
  const b64=fs.readFileSync(`${U}/${f}.pdf`).toString('base64');
  const r=await p.evaluate(async ({b64,stepId})=>{
    const bin=atob(b64), bytes=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
    const pages=await loadPages(bytes.buffer); const step=STEPS.find(s=>s.id===stepId); const keys=Object.keys(step.expected);
    const present={}; pages.forEach(pg=>present[pg.form]=true);
    const base=extractAll(pages);
    const valueReaders={}, anchorDeps={}; keys.forEach(k=>{valueReaders[k]=[]; anchorDeps[k]=0;});
    let mutations=0;
    pages.forEach((pg,pi)=>{ if(!['fed','ca540','ca3514'].includes(pg.form)) return;
      pg.items.forEach((it,ii)=>{ if(!isMoney(it.s)) return; const orig=it.s; const v=parseNum(orig);
        it.s=String(v+7); mutations++; const got=extractAll(pages);
        keys.forEach(k=>{ if(got[k]===base[k]) return;
          if(got[k]===base[k]+7) valueReaders[k].push({pi,ii,page:pg.page,form:pg.form,x:Math.round(it.x),y:Math.round(it.y),s:orig});
          else anchorDeps[k]++; });
        it.s=orig; }); });
    // for each check, at the spot it truly reads: is a +$1 error caught? is a blanked line caught, or does a neighbor's number get used?
    const report={};
    keys.forEach(k=>{ const rd=valueReaders[k]; const out={readers:rd.length};
      if(rd.length===1){ const it=pages[rd[0].pi].items[rd[0].ii], orig=it.s, f=LINES[k].form;
        const row=pages[rd[0].pi].items.filter(o=>Math.abs(o.y-it.y)<=12 && o.x<it.x && !isMoney(o.s)).sort((a,b)=>b.y-a.y||a.x-b.x).map(o=>o.s).join(' ').replace(/\s*\.(\s*\.)+/g,' ').slice(0,90);
        out.where=`p${rd[0].page} ${f} x=${rd[0].x} y=${rd[0].y} "${orig}"  near: ${row}`;
        it.s=String(parseNum(orig)+1); out.plus1=matches(extractAll(pages)[k],step.expected[k],present[f]);
        it.s=''; const g=extractAll(pages)[k]; out.blankGot=g; out.blank=matches(g,step.expected[k],present[f]);
        it.s=orig; }
      report[k]=out; });
    return {mutations, report};
  },{b64,stepId});
  all[stepId]=r;
  console.log(`\n===== Step ${stepId}: ${r.mutations} single-number mistakes planted =====`);
  for(const [k,o] of Object.entries(r.report)){
    const flag=o.readers!==1?'  <-- CHECK':'' ;
    console.log(`${k.padEnd(10)} readers=${o.readers} | +$1 error -> ${o.plus1||'-'} | line blanked -> ${o.blank||'-'} (read ${o.blankGot}) ${flag}`);
    if(o.where) console.log(`           reads ${o.where}`);
  }
 }
 fs.writeFileSync(path.join(OUT,'mutation_report.json'),JSON.stringify(all,null,1)); await b.close();
 let planted=0; const missed=[]; for(const [s,r] of Object.entries(all)){ planted+=r.mutations;
   for(const [k,o] of Object.entries(r.report)) if(o.readers!==1||o.plus1!=='fail'||o.blank==='pass') missed.push(s+':'+k); }
 console.log(`\nSWEEP: ${planted} single-number mistakes planted | checks with a miss: ${missed.length}${missed.length?' ('+missed.join(', ')+')':''}`);
 console.log(missed.length?'SWEEP FAILED':'SWEEP OK'); if(missed.length) process.exitCode=1; })().catch(e=>{console.error(e);process.exit(1);});
