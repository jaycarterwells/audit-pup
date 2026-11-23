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
    rows:[...document.querySelectorAll('.icase tbody tr')].map(r=>r.textContent), spots:[...document.querySelectorAll('img.ispot')].map(i=>!!i.src && i.naturalWidth>0),
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
