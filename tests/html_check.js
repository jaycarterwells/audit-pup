// HTML check of the built page with html-validate (its recommended rules). Build first: cd source && node build_html.js
// Rules turned off below are listed with the reason, so a new problem is never hidden by a blanket exception.
const fs=require('fs'), path=require('path');
const { HtmlValidate }=require(path.join(__dirname,'..','source','node_modules','html-validate'));
const { expect }=require('./expect');
const page=path.join(__dirname,'..','source','tax-aide-quinn-checker.html');
(async()=>{
  const html=fs.readFileSync(page,'utf8');
  const v=new HtmlValidate({ extends:['html-validate:recommended'], rules:{
    'no-inline-style':'off',            // small layout tweaks set by the page script; the page is one self-contained file by design
    'long-title':'off',
  }});
  const report=await v.validateString(html,'tax-aide-quinn-checker.html');
  let n=0;
  for(const r of report.results) for(const m of r.messages){ n++; if(n<=40) console.log(`FAIL line ${m.line}:${m.column} ${m.message} (${m.ruleId})`); }
  if(n>40) console.log(`... and ${n-40} more`);
  expect('the built page passes the HTML check', n===0, `${n} problem(s)`);
  console.log(`checked the built page (${(html.length/1048576).toFixed(2)} MB)`);
})().catch(e=>{console.error(e);process.exit(1);});
