// Instructor mode against a real graded student (DH, November 2026): every comment the instructor wrote that the PDF
// can show must be a row in the report (or a missing page). Quinn, which the instructor called perfect, must show no
// rows. The comments are summarized here as facts on the return; the student's PDFs are tests/fixtures/instructor/.
// One comment cannot be seen in any PDF and is listed as such: Kent Step N (the sales tax worksheet in TaxSlayer was
// left incomplete, but the printed worksheet page is the same as the golden one).
const { expect }=require('./expect');
const { loadCompare, goldenPages, studentFile, readPdf }=require('./instructor');
const E=loadCompare();
const row=(name,golden,student)=>r=>r.rows.some(d=>name.test(d.name) && golden.test(d.golden) && student.test(d.student));
const missing=name=>r=>r.missingPages.some(p=>name.test(p.name));
const COMMENTS={
  quinn:[],
  baylor:[
    ['Step A: Willie entered instead of William', row(/Form 1040/,/^WILLIAM$/,/^WILLIE$/)],
    ['Step I: the Preparer Note for election worker pay is missing', missing(/^Preparer Notes$/)],
    ['Step N: the HSA interest was made taxable for California by a manual entry', row(/Schedule CA/,/./,/HSA INTEREST/)],
    ['Step O: the 1098-T prior year box was checked Yes', row(/Form 8863/,/^X$/,/^X$/)]],
  graham:[
    ['Step A: Stacey misspelled as Stacy', row(/./,/STACEY/,/STACY\b/)],
    ['Step B: the first-year-in-business box was not checked', row(/Schedule C/,/^X$/,/^$/)],
    ['Step H: 1099-R box 5 left blank', row(/Form 1099-R/,/^283$/,/^$/)],
    ['Step K: 1099-R box 9b left blank', row(/Form 1099-R/,/^(60499|5864)$/,/^$/)],
    ['Step O: the railroad retirement payer name is not as on the form', row(/Form 1099-R/,/UNITED STATES RAILROAD/,/US RAILROAD/)],
    ['Step Q: the full name entered for alimony paid on the California return', row(/Schedule CA/,/^SMITH$/,/ELAIN SMITH/)]],
  kent:[
    ['Step J: the acquired date of the inherited home is not "Inherited"', row(/Form 8949/,/INHERIT/,/\d\/\d/)],
    ['Step K: the 450 HIJ shares were left out (Schedule D long-term totals)', row(/Schedule D/,/27403/,/16547/)],
    ['Step K: the carryforward worksheet line 13 is $848, not $3,992', row(/./,/^3992$/,/^848$/)],
    ['Step K: wash sale code W left out', row(/Form 8949/,/^MW$/,/^M$/)],
    ['Step L: K-1 tax-exempt interest added by hand on the California return', row(/Schedule CA/,/./,/TAXABLE INTEST/)]],
  parks:[
    ['Step L: Schedule A line 7 is $970, not $921', row(/Schedule A/,/^921$/,/^970$/)]],
};
(async()=>{
  let n=0;
  for(const [c,list] of Object.entries(COMMENTS)){
    const r=E.compareReturn(goldenPages(c,E), await readPdf(studentFile(c),E));
    if(c==='quinn') expect('quinn: the return the instructor called perfect shows no rows or page changes', !r.rows.length && !r.missingPages.length && !r.extraPages.length, r.rows.map(d=>d.golden+'/'+d.student).join(' | '));
    for(const [what,found] of list){ n++; expect(`${c} ${what}: shown in the report`, found(r)); }
    expect(`${c}: each distinct difference is one row`, new Set(r.rows.map(d=>d.golden+'|'+d.student)).size===r.rows.length);
    if(c==='baylor') expect('baylor: the FREEMONT address, printed on 6 pages, is one row naming the other pages', r.rows.filter(d=>d.golden==='516 FREMONT RD').length===1 && r.rows.find(d=>d.golden==='516 FREMONT RD').also.length>=4);
    if(c==='kent') expect('kent: the TaxSlayer Link number on Schedule E is unreported', !r.rows.some(d=>/^Link:/.test(d.golden)) && r.unreported.some(d=>d.rule==='link'));
    if(c==='parks'){
      expect('parks: DH\'s four 1040-ES vouchers match the golden file (its November 20 version has them)', !r.extraPages.length && !r.rows.some(d=>/1040-ES|803/.test(d.golden+d.student)));
      // pages of the same name are one row: the same comparison against the golden file without its voucher pages
      const g=goldenPages(c,E).filter(p=>!p.items.some(i=>i.s.trim()==='Estimated Tax Voucher Filing Instructions'));
      const x=E.compareReturn(g, await readPdf(studentFile(c),E)).extraPages;
      expect('parks: four extra voucher pages of the same name are one row naming its other pages', x.length===1 && x[0].name==='Form 1040-ES voucher' && x[0].also.length===3, JSON.stringify(x));
    }
    if(c==='graham') expect('graham: the TaxSlayer notes page is one row with both sets of notes', r.rows.filter(d=>d.name==='TaxSlayer notes (file copy)').length===1);
    expect(`${c}: the report header knows when the PDF was printed`, r.printed==='11/19/2026', r.printed);
  }
  expect('the student initials come from the file names', E.studentInitials(['DH Quinn.pdf','DH Kent.pdf'],['Quinn','Kent'])==='DH' &&
    E.studentInitials(['DH Quinn.pdf','MP Kent.pdf'],['Quinn','Kent'])==='Unknown' && E.studentInitials(['final.pdf'],['Quinn'])==='Unknown');
  console.log(`${n} instructor comments checked; 1 (Kent Step N) cannot be seen in a PDF`);
})().catch(e=>{ console.error(e); process.exit(1); });
