// Instructor mode in the page: the Instructor link and passcode, dropping a counselor's five Quality Review PDFs (DH),
// the report (the counselor's initials from the file names, a progress message naming each case, a section per case, rows, missing and extra pages, the unreported
// list, the spot pictures), Copy report, staying on after a reload, and Leave instructor mode. The comparison itself is
// tested in Node by compare_*.js; this proves the screen shows what compare.js finds.
const { expect }=require('./expect');
const { chromium }=require('playwright'); const path=require('path'), fs=require('fs');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); fs.mkdirSync(OUT,{recursive:true});
const DH=path.join(__dirname,'fixtures','instructor');
const { open, reload, offline }=require('./page');
const reportReady=p=>p.waitForFunction(()=>document.getElementById('ireport').dataset.state==='ready',null,{timeout:180000});
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1366,height:768}}); await offline(ctx);
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await open(p,'file://'+PAGE);
  expect('the student page opens with Instructor mode off', await p.isHidden('#instructor') && await p.isVisible('#drop'));
  await p.click('#instrlink');
  expect('the Instructor link asks for the passcode', await p.isVisible('#pcinput'));
  await p.fill('#pcinput','wrong'); await p.click('#pcform button[type=submit]');
  expect('a wrong passcode is refused and says so', await p.isVisible('#pcerr') && await p.isHidden('#instructor'));
  await p.fill('#pcinput','aarp'); await p.click('#pcform button[type=submit]');
  expect('the passcode turns Instructor mode on and hides the student screen', await p.isVisible('#instructor') && await p.isHidden('#drop') && await p.isHidden('#instrlink'));
  const files=['Quinn','Baylor','Graham','Parks','Kent'].map(c=>path.join(DH,`DH ${c}.pdf`));
  await p.setInputFiles('#ifile',files);
  await p.waitForFunction(()=>/^Reading and comparing \d of 5: the \w+ case/.test((document.getElementById('ibusy')||{}).textContent||''),null,{timeout:60000});
  expect('while it works, the screen names the file and case it is on', true);
  await reportReady(p);
  const rep=await p.evaluate(()=>({who:document.querySelector('.iwho').textContent, heads:[...document.querySelectorAll('.icase h3')].map(h=>h.textContent),
    rows:[...document.querySelectorAll('.icase tbody tr.idiff')].map(r=>r.textContent), spots:[...document.querySelectorAll('img.ispot')].map(i=>!!i.src && i.naturalWidth>0),
    unrep:[...document.querySelectorAll('.iunrep summary')].map(s=>s.textContent)}));
  expect('the header names the counselor from the file names', rep.who==='Counselor: DH', rep.who);
  expect('one section per case, in alphabetical order by case name', rep.heads.length===5 && rep.heads.map(h=>h.split(':')[0]).join(',')==='Baylor,Graham,Kent,Parks,Quinn' && rep.heads[4]==='Quinn: no differences', rep.heads.join(' | '));
  expect('the report columns say Counselor, not Student', await p.$eval('.icase thead',e=>/Golden\s*Counselor/.test(e.textContent)));
  expect('the Baylor section shows the missing Preparer Notes page and WILLIE for WILLIAM', rep.rows.some(r=>/Preparer Notes.*missing/.test(r)) && rep.rows.some(r=>/WILLIAM.*WILLIE/.test(r)));
  expect('the Parks section shows Schedule A 921 golden, 970 counselor, once, naming the other pages', rep.rows.filter(r=>/^Schedule A \(p\. \d+\).*921970/.test(r)).length===1 && rep.rows.some(r=>/^Schedule A \(p\. \d+\)Also on p\. \d+.*921970/.test(r)), rep.rows.filter(r=>/921/.test(r)).join(' | '));
  expect('four extra 1040-ES voucher pages are one row', rep.rows.filter(r=>/Form 1040-ES voucher/.test(r)).length===1 && rep.rows.some(r=>/Form 1040-ES voucher \(p\. 12, 13, 14, 15\)/.test(r)));
  expect('every difference has its spot picture', rep.spots.length>20 && rep.spots.every(Boolean), `${rep.spots.filter(Boolean).length} of ${rep.spots.length}`);
  expect('each case lists its unreported differences, closed', rep.unrep.length===5 && rep.unrep.every(s=>/^\d+ unreported difference/.test(s)), rep.unrep.join(' | '));
  await p.screenshot({path:path.join(OUT,'instructor_report.png'), fullPage:false});
  await ctx.grantPermissions(['clipboard-read','clipboard-write']);
  await p.click('#icopy');
  const text=await p.evaluate(()=>navigator.clipboard.readText()).catch(()=>'');
  expect('Copy report puts the report on the clipboard as text', /^Audit Pup Instructor report\nCounselor: DH/.test(text) && /Parks: /.test(text) && await p.isVisible('#icopied'), text.slice(0,80));
  // ----- comments from the library, the TS Notes checklist, and the feedback letter -----
  expect('the header names the comment library in use, the copy built into this version, with no warning',
    /^Comment library version 1 \(November 20, 2026\), built into this version of Audit Pup\. \d+ comments\.$/.test(await p.textContent('.ilib')) && !(await p.$('.iwarn')), await p.textContent('.ilib'));
  const n7=p.locator('.ipick',{hasText:'Line 7 should be $921'}).first();
  expect('the Parks Schedule A row suggests answer sheet Note N7 with the counselor\'s $970 filled in', /your return has \$970\./.test(await n7.textContent()));
  await n7.locator('input').check();
  expect('ticking a comment opens its words for editing', await n7.locator('textarea').isVisible() && await n7.locator('.itext').isHidden());
  await n7.locator('textarea').fill('Line 7 should be $921; your return has $970. Please look at the MAGI adjustment.');
  const kentSec=p.locator('.icase',{hasText:'DH Kent.pdf'});
  await kentSec.locator('.iacts > .iwrite').last().click();
  const custom=kentSec.locator('.icustom').last();
  await custom.locator('select').selectOption('K'); await custom.locator('textarea').fill('Please re-check the Schwab entries.');
  expect('each case has a TS Notes checklist with Found and Missing for each TS Note it expects', await p.locator('.itsn').count()===5 &&
    await kentSec.locator('.itsrow').count()===2 && await kentSec.locator('.itsrow input[value="found"]').count()===2);
  await kentSec.locator('.itsrow',{hasText:'Step N'}).locator('input[value="missing"]').check();
  await kentSec.locator('.itsrow',{hasText:'Step Q'}).locator('input[value="found"]').check();
  await p.click('#iletterbtn');
  const letter=await p.evaluate(()=>navigator.clipboard.readText()).catch(()=>'');
  expect('Copy feedback letter: the chosen comments, edited, grouped by case and step, with the missing TS Note and the written comment',
    /^Homework Problem Review\nCounselor: DH\n\nKent:\nStep K: Brokerage sales \(Schwab 1099-B\)\n\tPlease re-check the Schwab entries\.\n\nStep N: Itemized deductions\n\tThe TS Note for this step is missing\. An example of what is needed: STEP N - VA BENEFITS/.test(letter) &&
    /\nParks:\nStep L: [^\n]+\n\tLine 7 should be \$921; your return has \$970\. Please look at the MAGI adjustment\.\n$/.test(letter) && !/Step Q/.test(letter) && await p.isVisible('#iletter'), letter);
  // the Sheet cannot be reached (the network is off in this test): the built-in copy, with the yellow warning
  await p.evaluate(()=>{ LIBRARY_SOURCE.comments='https://example.invalid/comments.csv'; instrLibLoading=null; });
  await p.setInputFiles('#ifile',[files[3]]); await reportReady(p);
  expect('when the library cannot be reached, a yellow warning says which copy is used',
    /could not be reached\. Using version 1 \(November 20, 2026\), built into this version of Audit Pup, which may be out of date\./.test(await p.textContent('.iwarn')));
  await p.evaluate(()=>{ LIBRARY_SOURCE.comments=''; instrLibLoading=null; });
  // a file named any other way gives Unknown initials
  await p.setInputFiles('#ifile',[{name:'final return.pdf', mimeType:'application/pdf', buffer:fs.readFileSync(files[0])}]); await reportReady(p);
  expect('initials that cannot be read from the file names show as Unknown', (await p.textContent('.iwho'))==='Counselor: Unknown');
  await reload(p);
  expect('Instructor mode stays on after a reload in this browser', await p.isVisible('#instructor'));
  await p.click('#ileave');
  expect('Leave instructor mode brings back the student screen', await p.isHidden('#instructor') && await p.isVisible('#drop') && await p.isVisible('#instrlink'));
  await reload(p);
  expect('after leaving, a reload opens the student screen', await p.isHidden('#instructor'));
  expect('no page errors', !errs.length, errs.join(' | '));
  await b.close();
  console.log('instructor mode checked');
})().catch(e=>{ console.error(e); process.exit(1); });
