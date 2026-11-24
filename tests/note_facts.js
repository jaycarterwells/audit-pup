// Every fact a note reads from the PDF must be an exact match (Mary Ryan's review, November 2026: Quinn N1 passed 12
// months because the check allowed "7 or more"). For each answer key note that Audit Pup reads from the PDF, on the
// correct printout of the note's own step:
//   * the note passes as printed;
//   * each dependent's months in the home, set to every other value from 0 to 12 or blanked, fails;
//   * the checked filing status, changed to another one, fails;
//   * each listed dependent, renamed, fails;
//   * one digit of the Identity Protection PIN, changed, fails.
//   * each estimated tax voucher amount changed or blank, or a voucher left out, fails;
//   * each Capital Loss Carryover Worksheet amount, one more or one less, blank, or the worksheet left out, fails.
// Also: the Quinn printouts as the case author made them (cases/quinn/original/, 12 months) fail N1.
// The planted-mistake sweep (engine_sweep.js) changes dollar amounts only; this is its counterpart for notes.
const path=require('path'), fs=require('fs');
const { expect }=require('./expect');
const { loadEngine, readPdf, pickCases }=require('./engine');
const { loadCases }=require('./cases');
const E=loadEngine();
const STATUSES=['Single','Married filing jointly','Married filing separately','Head of household','Qualifying surviving spouse'];
(async()=>{
  let planted=0;
  for(const c of pickCases(loadCases())){
    const K=E.useCase(c.id);
    for(const [id,N] of Object.entries(K.notes)){
      if(E.noteOk(N,[])===null) continue;   // entered or ticked by the student: nothing in the PDF to change
      const step=K.steps.find(s=>(s.notes||[]).includes(id)); if(!step || !c.pdf[step.id]) continue;
      const pages=await readPdf(c.pdfPath(step.id),E), ok=()=>E.noteOk(N,pages);
      if(!expect(`${c.id} ${id}: passes on the Step ${step.id} printout as printed`, ok()===true)) continue;
      const fails=(what,undo)=>{ planted++; const r=ok(); undo(); expect(`${c.id} ${id}: fails when ${what}`, r===false, 'still passes'); };
      // months in the home, on TaxSlayer's dependent summary
      const deps=N.deps?N.deps.filter(d=>d.months!=null):(N.months!=null?[{first:N.dependent, months:N.months}]:[]);
      for(const d of deps){
        let cell=null;
        for(const pg of pages){ for(const r of E.rowsOf(pg.items,4)){ if(r.text.toUpperCase().indexOf(d.first)!==0 || !/\s\d{1,2}$/.test(r.text)) continue;
          cell=r.items.slice().sort((a,b)=>b.x-a.x)[0]; } }
        if(!expect(`${c.id} ${id}: ${d.first}'s months are on the dependent summary`, !!cell)) continue;
        const orig=cell.s;
        for(let m=0;m<=12;m++){ if(m===d.months) continue; cell.s=String(m); fails(`${d.first} lived ${m} months, not ${d.months}`,()=>{ cell.s=orig; }); }
        cell.s=''; fails(`${d.first}'s months cannot be read`,()=>{ cell.s=orig; });
      }
      // filing status: the label beside the X on Form 1040
      if(N.kind==='filing'){
        const fs1=E.filingStatus(pages), lab=pages.filter(p=>p.form==='fed').flatMap(p=>p.items).find(i=>i.s.indexOf(fs1)===0);
        if(lab){ const orig=lab.s, other=STATUSES.find(s=>s!==fs1); lab.s=other+orig.slice(fs1.length); fails(`the filing status is ${other}`,()=>{ lab.s=orig; }); }
        // each dependent, renamed everywhere it is printed
        const names=N.deps?N.deps.map(d=>d.first):[N.dependent];
        for(const first of names){
          const hit=pages.flatMap(p=>p.items).filter(i=>i.s.toUpperCase().indexOf(first)===0);
          const saved=hit.map(i=>i.s); hit.forEach(i=>{ i.s='ZED'+i.s.slice(first.length); });
          fails(`${first} is not on the return`,()=>{ hit.forEach((i,k)=>{ i.s=saved[k]; }); });
        }
      }
      if(N.kind==='carryws'){
        // each amount on the Capital Loss Carryover Worksheet the note lists: one more, one less, and (if printed) blank
        const pg=pages.find(p=>p.items.some(i=>E.worksheetText(i.s).trim()==='Capital Loss Carryover Worksheet'));
        for(const k of Object.keys(N.lines)){
          const lab=pg && pg.items.find(i=>i.x>=400 && E.worksheetText(i.s)===k+'.');
          if(!expect(`${c.id} ${id}: line ${k} is on the worksheet`, !!lab)) continue;
          let cell=pg.items.find(i=>Math.abs(i.y-lab.y)<=4 && i.x>lab.x && /^-?\d[\d,]*$/.test(i.s)), added=false;
          if(!cell){ cell={x:lab.x+47, y:lab.y, s:'0'}; pg.items.push(cell); added=true; }
          const orig=cell.s, v=+orig.replace(/,/g,'');
          for(const w of [v+1, v-1]){ cell.s=String(w); fails(`worksheet line ${k} is ${w}, not ${N.lines[k]}`,()=>{ cell.s=orig; }); }
          if(!added && N.lines[k]!==0){ cell.s=''; fails(`worksheet line ${k} is blank`,()=>{ cell.s=orig; }); }
          if(added) pg.items.splice(pg.items.indexOf(cell),1);
        }
        // the worksheet left out of the PDF
        if(pg){ const saved=pg.items; pg.items=[]; fails('the worksheet is not in the PDF',()=>{ pg.items=saved; }); }
      }
      if(N.kind==='esvouchers'){
        // each voucher's amount, one more or one less, or blank; and each voucher page left out
        const vp=pages.filter(p=>p.items.some(i=>i.s.trim()==='Estimated Tax Voucher Filing Instructions'));
        expect(`${c.id} ${id}: the PDF has the ${N.count} voucher pages`, vp.length===N.count);
        vp.forEach((pg,k)=>{
          const lab=pg.items.find(i=>i.s.trim()==='Date to file by:');
          const cell=lab && pg.items.find(i=>i.y<lab.y-12 && i.y>lab.y-36 && i.x>lab.x+100 && i.x<lab.x+350 && /^\$?[\d,]+(\.\d\d)?$/.test(i.s.trim()));
          if(!expect(`${c.id} ${id}: voucher ${k+1} shows its amount`, !!cell)) return;
          const orig=cell.s;
          for(const w of [N.amount+1, N.amount-1]){ cell.s=String(w); fails(`voucher ${k+1} is $${w}, not $${N.amount}`,()=>{ cell.s=orig; }); }
          cell.s=''; fails(`voucher ${k+1} has no amount`,()=>{ cell.s=orig; });
          const saved=pg.items; pg.items=[]; fails(`voucher ${k+1} is not in the PDF`,()=>{ pg.items=saved; });
        });
      }
      if(N.kind==='ippin'){
        // the PIN boxes beside the 1040 signature line, found the way the reader finds them
        for(const pg of pages.filter(p=>p.form==='fed')){ const lab=pg.items.find(i=>i.s==='Protection PIN, enter it here'); if(!lab) continue;
          const boxes=pg.items.filter(i=>/^\d$/.test(i.s) && i.x>lab.x+30 && i.x<lab.x+120 && i.y<lab.y && i.y>lab.y-18);
          for(const d of boxes){ const orig=d.s; d.s=String((+orig+1)%10); fails(`PIN digit ${orig} is wrong`,()=>{ d.s=orig; }); } }
      }
    }
  }
  // the case author's original Quinn printouts say James lived 12 months: N1 must fail on every one
  const Q=E.useCase('quinn'), odir=path.join(__dirname,'..','cases','quinn','original');
  if(fs.existsSync(odir)) for(const f of fs.readdirSync(odir).filter(f=>f.endsWith('.pdf'))){
    planted++; const pages=await readPdf(path.join(odir,f),E);
    expect(`quinn N1: fails on the author's original ${f} (12 months)`, E.noteOk(Q.notes.N1,pages)===false, 'passes');
  }
  console.log(`${planted} note facts changed; each one fails the note`);
})().catch(e=>{ console.error(e); process.exit(1); });
