/* Audit Pup comparison engine (Instructor mode). Pure functions with no page or browser use: they compare a student's
   Quality Review PDF with the case's golden file, page by page and value by value. It calls the reading engine
   (engine.js: rowsOf, classifyPage) and copies none of it. build_html.js puts this file into the page after engine.js;
   tests load it in Node the same way.
   Safety rule: never hide a real difference. A difference is left out of the report only when it is on the
   UNREPORTED list below, and then it is still counted and listed under its case. */

/* Text the PDF prints in a font that cannot be read as letters (form labels on some pages) is left out of the
   comparison: the amounts, names and dates on those pages print in a readable font and are compared. */
function readableText(s){ return !/[\u0000-\u001F\u00A1-\u00A6\u00A8-\u00BC\u00BE-\u02FF]/.test(s); }   // eslint-disable-line no-control-regex
/* One TaxSlayer font prints every letter 29 places early (a space prints as character 3): such text is shifted back
   so it can be read and compared. */
function shiftedText(s){
  if(!/[\u0000-\u001F]/.test(s)) return s;   // eslint-disable-line no-control-regex
  var out='';
  for(var i=0;i<s.length;i++){ var c=s.charCodeAt(i)+29; if(c<32||c>126) return s; out+=String.fromCharCode(c); }
  return out;
}
/* A page's items as the comparison reads them: shifted text put right, unreadable text left out */
function pageItems(pg){
  if(!pg.cmpItems) pg.cmpItems=pg.items.map(function(i){ return {x:i.x, y:i.y, s:shiftedText(i.s)}; }).filter(function(i){ return readableText(i.s); });
  return pg.cmpItems;
}

/* A short, stable name for a page: its form when the reading engine knows it, else its first readable words
   without numbers (so a page's name does not change with the values printed on it). */
function pageTitle(pg){
  if(pg.form && pg.form!=='other') return pg.form;
  var words=[], its=pageItems(pg);
  for(var i=0;i<its.length && words.length<10;i++){ var s=its[i].s;
    s=s.replace(/[0-9]/g,'').replace(/[^A-Za-z ]+/g,' ').replace(/\s+/g,' ').trim();
    if(s.length>=2) words.push(s.toUpperCase()); }
  return words.join(' ').slice(0,80);
}

/* A page's name for the report: its form header, in plain words */
var FORM_NAMES={fed:'Form 1040', sch1:'Schedule 1', sch2:'Schedule 2', sch3:'Schedule 3', schA:'Schedule A', f8880:'Form 8880',
  ca540:'CA Form 540', ca3514:'FTB 3514', schCA:'Schedule CA (540)'};
/* TaxSlayer's own Quality Review pages, named by how they start */
var LEAD_NAMES=[[/^TAX YEAR/,'Return summary'],[/^CLIENT\b/,'Return summary, page 2'],[/^a Employee.s social security number/,'Form W-2'],
  [/^THREE YEAR TAX COMPARISON/,'Three year tax comparison'],[/^Consent to Disclose/,'Consent to disclose'],[/^PIN Date/,'Consent signature page'],
  [/^Preparer Notes/,'Preparer Notes'],[/^Supporting Statements/,'Supporting statements'],
  [/FILE COPY ONLY.*SUPPORTING NOTES/,'TaxSlayer notes (file copy)'],[/^Estimated Tax/,'Form 1040-ES voucher'],
  [/refund is taxable/,'State and local income tax refund worksheet'],[/^TIP QNA/,'Sales tax worksheet']];
function pageName(pg){
  if(FORM_NAMES[pg.form]) return FORM_NAMES[pg.form];
  var lead=pageItems(pg).slice(0,8).map(function(i){ return i.s; }).join(' ').replace(/\s+/g,' ').trim();
  var m=lead.match(/\b(Form|FORM|Schedule|SCHEDULE|FTB)\s+(?!\(|Department|DEPARTMENT)[0-9A-Z][\w-]*(\s*\(Form 1040\)|\s*\(540\))?/);
  if(m && lead.indexOf(m[0])<48) return m[0].replace(/^FORM/,'Form').replace(/^SCHEDULE/,'Schedule');
  for(var k=0;k<LEAD_NAMES.length;k++){ if(LEAD_NAMES[k][0].test(lead)) return LEAD_NAMES[k][1]; }
  var ws=pageItems(pg).filter(function(i){ return /Worksheet/i.test(i.s) && i.s.length<70; })[0];
  if(ws) return ws.s.replace(/[*_=]+/g,' ').replace(/\s+/g,' ').trim();
  if(!/\b[a-z]{3,}\b/.test(lead) && !/\b(FORM|SCHEDULE|WORKSHEET|STATEMENT)\b/.test(lead)) return 'Page with no readable title';
  return lead.replace(/\d[\d/-]*/g,' ').replace(/[*_:]+/g,' ').replace(/\s+/g,' ').trim().slice(0,48) || 'Page';
}

function itemsOf(pg){ return pageItems(pg); }
function sameSpot(a,b,tol){ return Math.abs(a.x-b.x)<=tol && Math.abs(a.y-b.y)<=tol; }

/* How alike two pages are: the share of readable text that prints in the same place on both */
function pageLikeness(g,s){
  var gi=itemsOf(g), si=itemsOf(s); if(!gi.length||!si.length) return 0;
  var used=[], same=0;
  var byText={}; si.forEach(function(b,j){ (byText[b.s]=byText[b.s]||[]).push(j); });
  gi.forEach(function(a){ var c=byText[a.s]||[]; for(var k=0;k<c.length;k++){ var j=c[k]; if(!used[j] && sameSpot(a,si[j],3)){ used[j]=true; same++; return; } } });
  return same/Math.max(gi.length,si.length);
}

/* Pair the student's pages with the golden pages. Pages pair only when they carry the same form; among pages of the
   same form (several W-2s or 1099-Rs) the most alike pair first. A golden page left over is missing from the student's
   PDF; a student page left over is extra. Page order does not matter. */
function pairPages(golden,student){
  var cand=[];
  golden.forEach(function(g,gi){ var tg=pageTitle(g);
    student.forEach(function(s,si){ if(pageTitle(s)!==tg) return; cand.push({g:gi, s:si, score:pageLikeness(g,s)}); }); });
  cand.sort(function(a,b){ return b.score-a.score || Math.abs(a.g-a.s)-Math.abs(b.g-b.s); });
  var gUsed={}, sUsed={}, pairs=[];
  cand.forEach(function(c){ if(gUsed[c.g]||sUsed[c.s]) return; gUsed[c.g]=sUsed[c.s]=true; pairs.push({g:c.g, s:c.s}); });
  // second pass: pages left over that carry the same report name and much of the same text (a supporting statement
  // whose first words are the student's own entries)
  var cand2=[];
  golden.forEach(function(g,gi){ if(gUsed[gi]) return; var ng=pageName(g);
    student.forEach(function(s,si){ if(sUsed[si] || pageName(s)!==ng) return; var sc=pageLikeness(g,s); if(sc>=0.1) cand2.push({g:gi, s:si, score:sc}); }); });
  // the only page of a name left on each side pairs whatever its text (a signature page with a line added)
  golden.forEach(function(g,gi){ if(gUsed[gi]) return; var ng=pageName(g);
    var gl=golden.filter(function(x,k){ return !gUsed[k] && pageName(x)===ng; }), sl=[];
    student.forEach(function(s,si){ if(!sUsed[si] && pageName(s)===ng) sl.push(si); });
    if(gl.length===1 && sl.length===1 && !cand2.some(function(c){ return c.g===gi; })) cand2.push({g:gi, s:sl[0], score:0}); });
  cand2.sort(function(a,b){ return b.score-a.score; });
  cand2.forEach(function(c){ if(gUsed[c.g]||sUsed[c.s]) return; gUsed[c.g]=sUsed[c.s]=true; pairs.push({g:c.g, s:c.s}); });
  pairs.sort(function(a,b){ return a.g-b.g; });
  return { pairs:pairs,
    missing: golden.map(function(_,i){ return i; }).filter(function(i){ return !gUsed[i]; }),
    extra: student.map(function(_,i){ return i; }).filter(function(i){ return !sUsed[i]; }) };
}

/* The unreported list (what Instructor mode leaves out of the rows) is in unreported.js, the product owner's file. */

/* Compare one golden page with its student page. Returns the differences, one per printed row:
   {y, label, golden, student, unreported (rule id or null)} */
function comparePage(g,s,taxYear){
  var gi=itemsOf(g).map(function(i){ return {x:i.x,y:i.y,s:i.s}; }), si=itemsOf(s).map(function(i){ return {x:i.x,y:i.y,s:i.s}; });
  var sUsed=[];
  // 1. whole printed rows first. A row is its words in order, each in its column.
  var gRows=rowsOf(gi,3), sRows=rowsOf(si.map(function(i,j){ return {x:i.x,y:i.y,s:i.s,j:j}; }),3), sRowUsed=[];
  function sameRow(gr,sr){ return sr.items.length===gr.items.length && gr.items.every(function(a,n){ return a.s===sr.items[n].s && Math.abs(a.x-sr.items[n].x)<=3; }); }
  function takeRow(gr,k){ sRowUsed[k]=true; gr.done=true; gr.items.forEach(function(a){ a.matched=true; }); sRows[k].items.forEach(function(b){ sUsed[b.j]=true; }); }
  //   a. the same row in the same place
  gRows.forEach(function(gr){ for(var k=0;k<sRows.length;k++){ if(!sRowUsed[k] && Math.abs(sRows[k].y-gr.y)<=3 && sameRow(gr,sRows[k])){ takeRow(gr,k); return; } } });
  //   b. the same row moved up or down (a line added above it), the nearest one. A single value moved to another line
  //      changes both rows, so it is never matched here and is reported.
  gRows.forEach(function(gr){ if(gr.done) return; var best=-1;
    for(var k=0;k<sRows.length;k++){ if(!sRowUsed[k] && sameRow(gr,sRows[k]) && (best<0 || Math.abs(sRows[k].y-gr.y)<Math.abs(sRows[best].y-gr.y))) best=k; }
    if(best>=0) takeRow(gr,best); });
  // 2. in the rows left, the same words in the same place: no difference
  var byText={}; si.forEach(function(b,j){ if(!sUsed[j]) (byText[b.s]=byText[b.s]||[]).push(j); });
  gi.forEach(function(a){ if(a.matched) return; var c=byText[a.s]||[]; for(var k=0;k<c.length;k++){ var j=c[k]; if(!sUsed[j] && sameSpot(a,si[j],3)){ sUsed[j]=true; a.matched=true; return; } } });
  var gLeft=gi.filter(function(a){ return !a.matched; });
  var sLeft=si.filter(function(_,j){ return !sUsed[j]; });
  // 3. group what is left into printed rows; each row is one difference
  var rows=[];
  function rowFor(y){ for(var i=0;i<rows.length;i++){ if(Math.abs(rows[i].y-y)<=3) return rows[i]; } var r={y:y,g:[],s:[]}; rows.push(r); return r; }
  gLeft.forEach(function(a){ rowFor(a.y).g.push(a); });
  sLeft.forEach(function(b){ rowFor(b.y).s.push(b); });
  var lines=rowsOf(gi,3);
  return rows.map(function(r){
    r.g.sort(function(a,b){ return a.x-b.x; }); r.s.sort(function(a,b){ return a.x-b.x; });
    var x0=Math.min.apply(null,r.g.concat(r.s).map(function(i){ return i.x; }));
    var line=lines.filter(function(l){ return Math.abs(l.y-r.y)<=3; })[0];
    var labelWords=line ? line.items.filter(function(i){ return i.matched && i.x<x0; }).map(function(i){ return i.s; }) : [];
    var label=labelWords.join(' ').replace(/(\s*\.){2,}/g,' ').replace(/_{2,}/g,' ').replace(/\s+/g,' ').trim();
    if(label.length>48){ label=label.slice(-48); label=label.slice(label.indexOf(' ')+1); }
    var near=gi.filter(function(i){ return Math.abs(i.y-r.y)<=14; }).map(function(i){ return i.s; }).join(' ');
    var shown=function(list){ return list.map(function(i){ return i.s; }).join(' ').replace(/_{4,}/g,'___'); };
    var d={y:r.y, x:x0, label:label, golden:shown(r.g), student:shown(r.s), unreported:null};
    d.unreported=unreportedRule(r,taxYear,{pinRow:isPinRow(near), preparerRow:/PTIN/.test(gi.filter(function(i){ return Math.abs(i.y-r.y)<=30; }).map(function(i){ return i.s; }).join(' ')) && / S$/.test(label)});
    return d;
  }).sort(function(a,b){ return b.y-a.y; });
}
/* the rule that covers every item in a row, or null (reported). Items are paired left to right; a row whose two sides
   have different numbers of items is compared as one piece of text. */
function unreportedRule(r,taxYear,ctx){
  var pairs=[];
  if(r.g.length===r.s.length && r.g.length) r.g.forEach(function(a,i){ pairs.push([a.s,r.s[i].s]); });
  else pairs.push([r.g.map(function(i){ return i.s; }).join(' '), r.s.map(function(i){ return i.s; }).join(' ')]);
  for(var k=0;k<UNREPORTED.length;k++){ var rule=UNREPORTED[k];
    if(pairs.every(function(p){ return p[0]!=='' && p[1]!=='' && rule.test(p[0],p[1],taxYear,ctx); })) return rule.id; }
  // a row can mix kinds (a date and a PTIN in the preparer box): unreported when each pair has a rule
  if(pairs.length>1 && pairs.every(function(p){ return UNREPORTED.some(function(rule){ return p[0]!=='' && p[1]!=='' && rule.test(p[0],p[1],taxYear,ctx); }); })) return 'mixed';
  return null;
}

/* The tax year the golden return is for ("TAX YEAR: 2025" on its first page), else the year before the latest date */
function taxYearOf(pages){
  var t=pages.length ? pages[0].items.map(function(i){ return i.s; }).join(' ') : '';
  var m=t.match(/TAX YEAR:\s*(\d{4})/); return m ? +m[1] : null;
}
/* When the student's PDF was printed ("PROCESS DATE" on its first page) */
function printDateOf(pages){
  var t=pages.length ? pages[0].items.map(function(i){ return i.s; }).join(' ') : '';
  var m=t.match(/PROCESS DATE:\s*(\d{1,2}\/\d{1,2}\/\d{4})/); return m ? m[1] : null;
}

/* The whole comparison of one student PDF with its golden file:
   {missingPages:[{page,name}], extraPages:[{page,name}], rows:[{page, name, label, golden, student, x, y}], unreported:[...same, rule]} */
function compareReturn(golden,student){
  var taxYear=taxYearOf(golden)||taxYearOf(student)||0, p=pairPages(golden,student), out={missingPages:[], extraPages:[], rows:[], unreported:[], printed:printDateOf(student)};
  // pages of the same name (four estimate vouchers) are one row that names each page
  function addPage(list,i,pages){ var name=pageName(pages[i]), same=list.filter(function(x){ return x.name===name; })[0];
    if(same) same.also.push(i+1); else list.push({page:i+1, name:name, also:[]}); }
  p.missing.forEach(function(i){ addPage(out.missingPages,i,golden); });
  p.extra.forEach(function(i){ addPage(out.extraPages,i,student); });
  var seen={};
  p.pairs.forEach(function(pr){ var name=pageName(golden[pr.g]), diffs=comparePage(golden[pr.g],student[pr.s],taxYear);
    // TaxSlayer's notes page holds each counselor's own wording: it is one row, the two sets of notes side by side
    if(name===NOTES_PAGE){ var rep=diffs.filter(function(d){ return !d.unreported; });
      if(rep.length) diffs=[{y:rep[0].y, x:rep[0].x, label:'', unreported:null,
        golden:rep.map(function(d){ return d.golden; }).filter(Boolean).join(' / '), student:rep.map(function(d){ return d.student; }).filter(Boolean).join(' / ')}]
        .concat(diffs.filter(function(d){ return d.unreported; })); }
    diffs.forEach(function(d){
      var row={page:pr.s+1, goldenPage:pr.g+1, name:name, label:d.label, golden:d.golden, student:d.student, x:d.x, y:d.y, also:[]};
      if(d.unreported){ row.rule=d.unreported; out.unreported.push(row); return; }
      // the same difference printed again on another page (an address on every form, an amount carried forward) is
      // one row that names every page it is on
      var key=d.golden+'\u0000'+d.student;
      if(seen[key]){ if(seen[key].page!==row.page && seen[key].also.indexOf(row.page)<0) seen[key].also.push(row.page); seen[key].count++; return; }
      row.count=1; seen[key]=row; out.rows.push(row); }); });
  return out;
}
var NOTES_PAGE='TaxSlayer notes (file copy)';

/* The student's initials from the file names ("DH Quinn.pdf": initials, a space, the case name). Every file must give
   the same initials, else 'Unknown'. */
function studentInitials(names,caseNames){
  var re=new RegExp('^\\s*([A-Za-z]{1,4})[\\s_-]+('+caseNames.join('|')+')\\b','i'), seen={};
  names.forEach(function(n){ var m=String(n||'').match(re); seen[m ? m[1].toUpperCase() : '?']=true; });
  var k=Object.keys(seen); return k.length===1 && k[0]!=='?' ? k[0] : 'Unknown';
}
