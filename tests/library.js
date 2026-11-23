// Instructor mode's comment library (source/library.js), in Node with no browser:
//   * reading the CSV as Google Sheets writes it (quotes, commas and line breaks in a cell, Windows line ends, a BOM);
//   * columns found by name in any order, a missing column refused, rows it cannot use listed with the reason, Retired left out;
//   * the copy built into the release (source/library/comments.csv) reads with no bad rows, for the five cases;
//   * suggestions for counselor DH's report rows: the matching 2026 comment is among the first three, with $xxxx filled in;
//   * every fallback with the network off: no Sheet set, Sheet unreachable with and without a copy saved in this browser,
//     a Sheet that shrinks by a lot, and a good read saved for next time;
//   * the Add to library link, and the feedback letter grouped by case and step.
const { expect }=require('./expect');
const { loadCompare, goldenPages, studentFile, readPdf }=require('./instructor');
const E=loadCompare();
const NAMES=['Baylor','Graham','Kent','Parks','Quinn'];

// ----- reading CSV -----
const csv=E.parseCsv('﻿A,B,C\r\n1,"two, with comma","say ""hi""\nnext line"\r\n\r\n,,\n4,5,6');
expect('CSV: a BOM, quoted commas, quotes, line breaks in a cell, and Windows line ends', JSON.stringify(csv)===JSON.stringify([['A','B','C'],['1','two, with comma','say "hi"\nnext line'],['4','5','6']]), JSON.stringify(csv));

// ----- reading the library -----
let lib=E.readLibrary('Status,Comment,Line or box,Form,Step,Case\nActive,Moved columns work.,Line 7,Schedule A,l,parks\nRetired,Old one.,,Form 1040,A,Quinn\n,No case here.,,,A,\nActive,,,Form 1040,A,Kent\nActive,Unknown case.,,,A,Smith\n',
  'Version,Date\n7,2026-12-02\n', NAMES);
expect('columns are found by name in any order; case names and step letters are normalized', lib.comments.length===1 && lib.comments[0].caseName==='Parks' && lib.comments[0].step==='L' && lib.comments[0].form==='Schedule A', JSON.stringify(lib.comments));
expect('a Retired comment is left out and counted', lib.retired===1);
expect('rows it cannot use are listed with the reason', JSON.stringify(lib.bad.map(b=>b.row+' '+b.why))===JSON.stringify(['4 no case','5 no comment','6 unknown case "Smith"']), JSON.stringify(lib.bad));
expect('the version and date come from the Version tab', lib.version==='7' && lib.date==='2026-12-02' && E.libraryName(lib)==='version 7 (December 2, 2026)', E.libraryName(lib));
const noCol=E.readLibrary('Case,Step,Form,Comment\nKent,A,Form 1040,x\n','',NAMES);
expect('a library with a missing column is refused, naming it', /no column named Line or box/.test(noCol.error||''), noCol.error);
expect('an empty library is refused', !!E.readLibrary('','',NAMES).error);

const built=E.readLibrary(global.LIBRARY_SNAPSHOT.comments, global.LIBRARY_SNAPSHOT.version, NAMES);
expect('the built-in library reads with no bad rows', !built.error && !built.bad.length && built.comments.length>=100, built.error||JSON.stringify(built.bad));
expect('the built-in library has comments for all five cases', NAMES.every(n=>built.comments.some(c=>c.caseName===n)));
const LONG_DASH=new RegExp('\\u2014|-'+'-');   // the style rule: no long dashes in what instructors and counselors read
expect('every built-in comment is plain text with no long dash', built.comments.every(c=>!LONG_DASH.test(c.comment) && !/<[a-z]/i.test(c.comment)));

// ----- filling in the counselor's value -----
expect('$xxxx becomes the counselor\'s value, with commas', E.fillValue('Line 7 should be $921; your return has $xxxx.','1520')==='Line 7 should be $921; your return has $1,520.');
expect('$xxxx with a blank value says blank', E.fillValue('It is $xxxx.','')==='It is blank.');
expect('a comment without $xxxx is unchanged', E.fillValue('No value here.','970')==='No value here.');

// ----- the Add to library link -----
expect('no Add to library link until the Google Form exists', E.libraryFormLink({caseName:'Kent', form:'Form 1040', line:'1a'})===null);
E.LIBRARY_FORM.url='https://docs.google.com/forms/d/e/TEST/viewform'; Object.assign(E.LIBRARY_FORM.fields,{caseName:'entry.1', step:'entry.2', form:'entry.3', line:'entry.4'});
expect('the Add to library link fills in the case, form and line', E.libraryFormLink({caseName:'Kent', form:'Schedule D (Form 1040)', line:'Line 6'})==='https://docs.google.com/forms/d/e/TEST/viewform?usp=pp_url&entry.1=Kent&entry.3=Schedule%20D%20(Form%201040)&entry.4=Line%206');
E.LIBRARY_FORM.url='';

// ----- the feedback letter -----
const letter=E.feedbackLetter('DH',[{caseName:'Parks', step:'L', stepName:'Step L: Itemized deductions', text:'Two.'},{caseName:'Baylor', step:'I', stepName:'Step I: Election worker pay', text:'Three.'},
  {caseName:'Parks', step:'A', stepName:'Step A: Basic information', text:'One.'},{caseName:'Parks', step:'L', stepName:'Step L: Itemized deductions', text:'Two b.'}]);
expect('the letter groups comments by case (alphabetical) and step (in order)', letter==='Homework Problem Review\nCounselor: DH\n\nBaylor:\nStep I: Election worker pay\n\tThree.\n\nParks:\nStep A: Basic information\n\tOne.\n\nStep L: Itemized deductions\n\tTwo.\n\tTwo b.\n', JSON.stringify(letter));
expect('step R2 sorts after R and before S', E.stepOrder('R')<E.stepOrder('R2') && E.stepOrder('R2')<E.stepOrder('S'));

(async()=>{
  // ----- suggestions for counselor DH's report: the 2026 comment for the mistake is among the first three -----
  const reports={};
  for(const c of ['baylor','kent','parks']) reports[c]=E.compareReturn(goldenPages(c,E), await readPdf(studentFile(c),E));
  const top3=(c,cn,pick,find)=>{ const row=reports[c].rows.find(pick)||null; if(!row) return null; return {row, list:E.suggestionsFor(built,cn,row).slice(0,3), find}; };
  const want=[
    ['baylor','Baylor','Willie for William on Form 1040', d=>d.name==='Form 1040' && d.golden==='WILLIAM', /Willie instead of/],
    ['kent','Kent','the Box E sale on Schedule D', d=>/Schedule D/.test(d.name) && /27403/.test(d.golden), /\$27,403 cost basis/],
    ['parks','Parks','Schedule A line 7', d=>d.name==='Schedule A' && d.golden==='921', /Line 7 should be \$921/],
  ];
  for(const [c,cn,what,pick,find] of want){
    const t=top3(c,cn,pick,find);
    expect(`DH ${cn}: the report has the row for ${what}`, !!t);
    if(t) expect(`DH ${cn}: the 2026 comment for ${what} is among the first three suggestions`, t.list.some(x=>find.test(x.comment)), t.list.map(x=>x.comment.slice(0,40)).join(' | '));
  }
  const p7=reports.parks.rows.find(d=>d.name==='Schedule A' && d.golden==='921');
  const n7=built.comments.find(x=>/Line 7 should be \$921/.test(x.comment));
  expect('DH Parks: the Schedule A comment shows the counselor\'s $970', p7 && n7 && /your return has \$970\./.test(E.fillValue(n7.comment,p7.student)));
  const pn=E.suggestionsFor(built,'Baylor',{name:'Preparer Notes', label:'Whole page', golden:'', student:''});
  expect('DH Baylor: the missing Preparer Notes page suggests the Note NP comment', pn.length && /Note NP/.test(pn[0].comment));
  const other=E.otherComments(built,'Baylor',['Form 1040','Form W-2']);
  expect('comments for forms not in the report are offered separately, in step order', other.length && other.every(c=>c.form!=='Form 1040' && c.form!=='Form W-2') && other.every((c,i)=>!i || E.stepOrder(other[i-1].step)<=E.stepOrder(c.step)));

  // ----- loading, with every fallback (no network: getText is a stand-in) -----
  const store=()=>{ const m={}; return { getItem:k=>k in m?m[k]:null, setItem:(k,v)=>{ m[k]=String(v); }, m }; };
  const fail=()=>Promise.reject(new Error('offline'));
  let s=store(), r=await E.loadLibrary(fail,s,global.LIBRARY_SNAPSHOT,NAMES);
  expect('no Sheet set: the built-in copy, no warning, no network call', r.from==='built-in' && !r.warning);
  E.LIBRARY_SOURCE.comments='https://example.invalid/comments.csv'; E.LIBRARY_SOURCE.version='https://example.invalid/version.csv';
  r=await E.loadLibrary(fail,s,global.LIBRARY_SNAPSHOT,NAMES);
  expect('Sheet unreachable, nothing saved: the built-in copy with a yellow warning naming its version', r.from==='built-in' && /could not be reached\. Using version 1 \(November 20, 2026\), built into this version/.test(r.warning||''), r.warning);
  const sheet=global.LIBRARY_SNAPSHOT.comments+'Kent,A,Form 1040,First name,A new comment from the Sheet.,Active\n';
  r=await E.loadLibrary(u=>Promise.resolve(/version/.test(u)?'Version,Date\n8,2026-12-09\n':sheet),s,global.LIBRARY_SNAPSHOT,NAMES,1000);
  expect('Sheet read: its comments are used, no warning, and a copy is saved in this browser', r.from==='sheet' && !r.warning && r.lib.version==='8' && r.lib.comments.length===built.comments.length+1 && !!s.m['auditpup.library.v1']);
  r=await E.loadLibrary(fail,s,global.LIBRARY_SNAPSHOT,NAMES);
  expect('Sheet unreachable later: the saved copy (version 8) with a yellow warning', r.from==='saved' && r.lib.version==='8' && /Using version 8 \(December 9, 2026\), saved in this browser/.test(r.warning||''), r.warning);
  r=await E.loadLibrary(()=>Promise.resolve('Case,Step,Form,Line or box,Comment,Status\nKent,A,,,Only one.,Active\n'),store(),global.LIBRARY_SNAPSHOT,NAMES);
  expect('a Sheet that suddenly has far fewer comments is flagged', r.from==='sheet' && /far fewer comments than before \(1, was \d+\)/.test(r.warning||''), r.warning);
  r=await E.loadLibrary(()=>Promise.resolve('Case,Comment\nKent,x\n'),store(),global.LIBRARY_SNAPSHOT,NAMES);
  expect('a Sheet with a missing column is not used: the built-in copy with a warning', r.from==='built-in' && !!r.warning);
  const bad=store(); bad.setItem('auditpup.library.v1','not json');
  r=await E.loadLibrary(fail,bad,global.LIBRARY_SNAPSHOT,NAMES);
  expect('a damaged saved copy is ignored: the built-in copy', r.from==='built-in');
  E.LIBRARY_SOURCE.comments=''; E.LIBRARY_SOURCE.version='';

  console.log(`comment library checked (${built.comments.length} built-in comments)`);
})().catch(e=>{ console.error(e); process.exit(1); });
