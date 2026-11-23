// Instructor mode's safety rule: never hide a real difference (the counterpart of the planted-mistake sweep).
//  * Each golden file compared with itself shows nothing: no rows, no unreported items, no missing or extra pages.
//  * The golden data the page uses (golden.json) reads exactly like the golden PDF.
//  * Planted differences, one at a time on every page of every golden file, must each be reported: a changed number,
//    a changed letter, a removed value, an added value, and a removed page. Only a change the unreported list covers
//    (a date after the tax year, a preparer PTIN, a digit in a PIN or PTIN box) may be left out of the rows.
//  * Planted changes of the unreported kinds only (dates after the tax year, the PTIN, a middle initial, capital
//    letters) produce no rows.
const { expect }=require('./expect');
const { loadCompare, goldenPages, goldenPdf, readPdf, CASES }=require('./instructor');
const E=loadCompare();
const copy=pages=>pages.map(p=>({page:p.page, form:p.form, items:p.items.map(i=>({x:i.x,y:i.y,s:i.s}))}));
(async()=>{
  let planted=0, missed=0;
  for(const c of CASES){
    const G=goldenPages(c,E), fromPdf=await readPdf(goldenPdf(c),E);
    const self=E.compareReturn(G,copy(G));
    expect(`${c}: the golden file against itself shows nothing`, !self.rows.length && !self.unreported.length && !self.missingPages.length && !self.extraPages.length, JSON.stringify(self).slice(0,200));
    const vsPdf=E.compareReturn(G,fromPdf);
    expect(`${c}: golden.json reads like the golden PDF`, !vsPdf.rows.length && !vsPdf.unreported.length && !vsPdf.missingPages.length && !vsPdf.extraPages.length, JSON.stringify(vsPdf.rows.slice(0,2)));
    const taxYear=E.taxYearOf(G);
    G.forEach((g,pi)=>{
      const items=E.pageItems(g);
      const plainItems=g.items.filter(i=>E.readableText(i.s));   // plant only in text printed in a plain font
      // which planted changes the unreported list may cover
      const covered=it=>E.datesIn(it.s).some(y=>y>taxYear) || /^[PS]\d{8}$/.test(it.s) ||
        (/^\d$/.test(it.s) && /PTIN/.test(items.filter(o=>Math.abs(o.y-it.y)<=30).map(o=>o.s).join(' '))) ||
        (/^\d{1,5}$/.test(it.s) && E.isPinRow(items.filter(o=>Math.abs(o.y-it.y)<=14).map(o=>o.s).join(' ')));   // a self-select PIN, never the IP PIN
      // one page compared with its planted copy, as compareReturn compares each pair of pages
      const plant=(what,mutate,item)=>{ planted++;
        const sp={page:g.page, form:g.form, items:g.items.map(i=>({x:i.x,y:i.y,s:i.s}))}; mutate(sp);
        const rows=E.comparePage(g,sp,taxYear);
        const ok=rows.some(d=>!d.unreported && Math.abs(d.y-item.y)<=4) || covered(item);
        if(!ok){ missed++; if(missed<=15) expect(`${c} page ${pi+1}: ${what} is reported`, false, `"${item.s}" at ${item.x.toFixed(0)},${item.y.toFixed(0)}`); } };
      const find=it=>sp=>sp.items.find(o=>o.s===it.s && Math.abs(o.x-it.x)<0.01 && Math.abs(o.y-it.y)<0.01);
      // every number on the page, and every word of three or more letters, one at a time
      plainItems.forEach(it=>{
        if(/\d/.test(it.s)) plant('a changed number',sp=>{ const o=find(it)(sp); o.s=o.s.replace(/\d(?=\D*$)/,d=>String((+d+1)%10)); },it);
        else if(/[A-Za-z]{3}/.test(it.s)) plant('a changed letter',sp=>{ const o=find(it)(sp); o.s=o.s.replace(/[A-Za-z](?=[^A-Za-z]*$)/,ch=>ch==='Q'||ch==='q'?'Z':String.fromCharCode(ch.charCodeAt(0)+1)); },it);
      });
      // a value removed, and a value added, every tenth value
      plainItems.filter(it=>/\d/.test(it.s)).forEach((it,k)=>{ if(k%10) return;
        plant('a removed value',sp=>{ sp.items.splice(sp.items.indexOf(find(it)(sp)),1); },it);
        plant('an added value',sp=>{ sp.items.push({x:it.x, y:it.y-9, s:'4321'}); },{x:it.x,y:it.y-9,s:'4321'}); });
    });
    // every page removed, one at a time, is a missing page
    G.forEach((g,pi)=>{ planted++; const S=copy(G); S.splice(pi,1); const r=E.compareReturn(G,S);
      if(!r.missingPages.some(m=>m.page===pi+1)){ missed++; if(missed<=15) expect(`${c}: removing page ${pi+1} shows it missing`, false, JSON.stringify(r.missingPages)); } });
    // unreported kinds only: dates after the tax year, the PTIN, capital letters and a middle initial
    const S=copy(G); S.forEach(p=>p.items.forEach(i=>{
      i.s=i.s.replace(/\b(\d{1,2})\/(\d{1,2})\/(20\d\d|\d\d)\b/g,(m,a,b,y)=>((+y<100?2000+ +y:+y)>taxYear?'12/31/'+y:m)).replace(/^[PS]\d{8}$/,'P99999999');
      if(/^[A-Z][A-Z]+ [A-Z][A-Z]+$/.test(i.s) && !/\d/.test(i.s)) i.s=i.s.replace(' ',' Q ');   // a middle initial added to a two-word name
    }));
    const u=E.compareReturn(G,S);
    expect(`${c}: changes of the unreported kinds only produce no rows`, !u.rows.length, u.rows.slice(0,3).map(d=>`${d.name}: ${d.golden} / ${d.student}`).join(' | '));
  }
  expect('every planted difference is reported', !missed, `${missed} of ${planted} hidden`);
  console.log(`COMPARE SWEEP: ${planted} differences planted, ${missed} hidden`);
})().catch(e=>{ console.error(e); process.exit(1); });
