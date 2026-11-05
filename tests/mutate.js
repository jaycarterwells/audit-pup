// Plants single-line mistakes into the real PDFs (one printed number at a time) and checks the engine catches them.
const { chromium } = require('playwright'); const path=require('path'); const fs=require('fs');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const C=path.join(__dirname,'..','cases');
// [case, step, PDF]. Baylor Step P has no printout of its own; its return is the same as Step O.
const CASES=[['quinn','A','quinn/Quinn_Sec_A'],['quinn','B','quinn/Quinn_Sec_B'],['quinn','D','quinn/Quinn_Sec_D'],['quinn','E','quinn/Quinn_Sec_E'],['quinn','F','quinn/Quinn_Sec_F']]
  .concat(['A','B','C','E','F','G','H','I','J','L','M','N','O','P','R'].map(s=>['baylor',s,'baylor/Baylor_Sec_'+(s==='P'?'O':s)]));
(async()=>{ const b=await chromium.launch(); const p=await b.newPage();
 await p.goto('file://'+PAGE); await p.waitForTimeout(300);
 const all={};
 for(const [caseId,stepId,f] of CASES){
  const b64=fs.readFileSync(`${C}/${f}.pdf`).toString('base64');
  const r=await p.evaluate(async ({b64,stepId,caseId})=>{
    useCase(caseId);
    const bin=atob(b64), bytes=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i);
    const pages=await loadPages(bytes.buffer); const step=STEPS.find(s=>s.id===stepId); const keys=Object.keys(step.expected);
    const present={}; pages.forEach(pg=>present[pg.form]=true);
    const base=extractAll(pages);
    const valueReaders={}, anchorDeps={}; keys.forEach(k=>{valueReaders[k]=[]; anchorDeps[k]=0;});
    let mutations=0;
    const forms={}; keys.forEach(k=>forms[LINES[k].form]=1);   // plant mistakes only on the forms this case reads
    pages.forEach((pg,pi)=>{ if(!forms[pg.form]) return;
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
      // a line whose answer is blank has no number to change: put $5 in its empty box and make sure it is caught
      if(step.expected[k]===0 && rd.length===0 && LINES[k].read){ const R=LINES[k].read, f=LINES[k].form; out.blankAnswer=true;
        const isTok=i=>R[0]==='box' ? (i.s===R[2]&&i.x>=(R[3]||370)&&i.x<=(R[4]||500)) : (i.s===R[1]&&i.x<=470);
        const pg=pages.find(q=>q.form===f && q.items.some(isTok)) || pages.find(q=>q.form===f);
        if(!pg) out.plant=OPTIONAL_FORMS[f]?'form not printed':'missing';
        else { const tok=pg.items.filter(isTok).sort((a,b)=>b.x-a.x)[0];   // the box beside the amount column, not the line number at the left edge
          if(!tok) out.plant='no box found';
          else { const fake={x:R[0]==='box'?tok.x+60:Math.max(R[2],tok.x)+40, y:tok.y, s:'5'}; pg.items.push(fake);
            out.plant=matches(extractAll(pages)[k],0,true,f); out.where=`p${pg.page} ${f} box "${tok.s}" x=${Math.round(tok.x)} y=${Math.round(tok.y)} (blank answer, planted $5)`; pg.items.pop(); } } }
      report[k]=out; });
    const expected0={}; keys.forEach(k=>{ if(step.expected[k]===0) expected0[k]=1; });
    return {mutations, report, expected0};
  },{b64,stepId,caseId});
  all[caseId+' '+stepId]=r;
  console.log(`\n===== ${caseId==='quinn'?'':'Baylor '}Step ${stepId}: ${r.mutations} single-number mistakes planted =====`);
  for(const [k,o] of Object.entries(r.report)){
    if(o.blankAnswer){ console.log(`${k.padEnd(10)} blank answer | $5 put in the empty box -> ${o.plant}${o.plant==='fail'||o.plant==='form not printed'?'':'  <-- CHECK'}`); if(o.where) console.log(`           ${o.where}`); continue; }
    const flag=o.readers!==1?'  <-- CHECK':'' ;
    console.log(`${k.padEnd(10)} readers=${o.readers} | +$1 error -> ${o.plus1||'-'} | line blanked -> ${o.blank||'-'} (read ${o.blankGot}) ${flag}`);
    if(o.where) console.log(`           reads ${o.where}`);
  }
 }
 fs.writeFileSync(path.join(OUT,'mutation_report.json'),JSON.stringify(all,null,1)); await b.close();
 let planted=0; const missed=[]; for(const [s,r] of Object.entries(all)){ planted+=r.mutations;
   for(const [k,o] of Object.entries(r.report)){
     if(o.blankAnswer){ if(o.plant!=='fail' && o.plant!=='form not printed') missed.push(s+':'+k); continue; }
     const zero=r.expected0 && r.expected0[k];
     if(o.readers!==1||o.plus1!=='fail'||(o.blank==='pass'&&!zero)) missed.push(s+':'+k); } }
 console.log(`\nSWEEP: ${planted} single-number mistakes planted | checks with a miss: ${missed.length}${missed.length?' ('+missed.join(', ')+')':''}`);
 console.log(missed.length?'SWEEP FAILED':'SWEEP OK'); if(missed.length) process.exitCode=1; })().catch(e=>{console.error(e);process.exit(1);});
