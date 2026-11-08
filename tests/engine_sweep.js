// The planted-mistake sweep, in Node with the reading engine (no browser). For every step of every case, using
// that step's correct PDF:
//  * change every printed amount on the forms the case reads, one at a time, by $7, and record which checked
//    lines move by exactly $7. Each checked line must be read from exactly ONE spot;
//  * at that spot, a $1 error must fail and a blanked amount must fail (unless the answer is $0);
//  * a line whose answer is blank has nothing printed to change: put $5 in its empty box, which must fail.
// Prints SWEEP OK when no check misses a planted mistake. Usage: node engine_sweep.js [--case baylor]
const path=require('path'), fs=require('fs');
const { expect } = require('./expect');
const { loadEngine, readPdf, check, pickCases } = require('./engine');
const { loadCases } = require('./cases');
(async()=>{
  const E=loadEngine(); let planted=0; const missed=[], report={};
  for(const c of pickCases(loadCases())){
    const K=E.useCase(c.id); let caseMut=0; const t0=Date.now();
    for(const step of K.steps){
      const pages=await readPdf(c.pdfPath(step.id),E), {present,got:base}=check(E,pages);
      const keys=Object.keys(step.expected), L=K.lines, forms={}; keys.forEach(k=>{ forms[L[k].form]=1; });
      const readers={}; keys.forEach(k=>{ readers[k]=[]; });
      const extract=()=>E.CASE.extract(pages);
      pages.forEach((pg,pi)=>{ if(!forms[pg.form]) return;
        pg.items.forEach((it,ii)=>{ if(!E.isMoney(it.s)) return; const orig=it.s;
          it.s=String(E.parseNum(orig)+7); caseMut++; const got=extract();
          keys.forEach(k=>{ if(got[k]!==base[k] && got[k]===base[k]+7) readers[k].push({pi,ii}); });
          it.s=orig; }); });
      const rep={};
      keys.forEach(k=>{ const rd=readers[k], f=L[k].form, out={readers:rd.length};
        if(rd.length===1){ const it=pages[rd[0].pi].items[rd[0].ii], orig=it.s;
          out.where=`page ${pages[rd[0].pi].page} (${f}) at x=${Math.round(it.x)} y=${Math.round(it.y)}, printed "${orig}"`;
          it.s=String(E.parseNum(orig)+1); out.plus1=E.matches(extract()[k],step.expected[k],present[f],f);
          it.s=''; out.blank=E.matches(extract()[k],step.expected[k],present[f],f); it.s=orig; }
        if(step.expected[k]===0 && rd.length===0 && L[k].read){ const R=L[k].read; out.blankAnswer=true;
          const isTok=i=>R[0]==='box' ? (i.s===R[2]&&i.x>=(R[3]||370)&&i.x<=(R[4]||500)) : (i.s===R[1]&&i.x<=470);
          const pg=pages.find(q=>q.form===f && q.items.some(isTok)) || pages.find(q=>q.form===f);
          if(!pg) out.plant=E.OPTIONAL_FORMS[f]?'form not printed':'missing';
          else { const tok=pg.items.filter(isTok).sort((a,b)=>b.x-a.x)[0];   // the box beside the amount column, not the line number at the left edge
            if(!tok) out.plant='no box found';
            else { pg.items.push({x:R[0]==='box'?tok.x+60:Math.max(R[2],tok.x)+40, y:tok.y, s:'5'});
              out.plant=E.matches(extract()[k],0,true,f); out.where=`page ${pg.page} (${f}) box "${tok.s}", $5 planted`; pg.items.pop(); } } }
        const miss=out.blankAnswer ? !(out.plant==='fail'||out.plant==='form not printed')
          : (out.readers!==1 || out.plus1!=='fail' || (out.blank==='pass' && step.expected[k]!==0));
        if(miss){ missed.push(`${c.id} ${step.id}:${k}`); console.log(`FAIL ${c.id} Step ${step.id} ${k}: readers=${out.readers} +$1->${out.plus1||'-'} blanked->${out.blank||'-'} $5 in empty box->${out.plant||'-'} ${out.where||''}`); }
        rep[k]=out; });
      report[`${c.id} ${step.id}`]=rep;
    }
    planted+=caseMut;
    console.log(`${c.id}: ${caseMut} mistakes planted over ${K.steps.length} steps in ${((Date.now()-t0)/1000).toFixed(1)} s`);
  }
  fs.mkdirSync(path.join(__dirname,'output'),{recursive:true}); fs.writeFileSync(path.join(__dirname,'output','sweep_report.json'),JSON.stringify(report,null,1));
  expect('no planted mistake is missed', !missed.length, missed.join(', '));
  console.log(`SWEEP: ${planted} single-number mistakes planted | checks with a miss: ${missed.length}`);
  console.log(missed.length?'SWEEP FAILED':'SWEEP OK');
})().catch(e=>{console.error(e);process.exit(1);});
