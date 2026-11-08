// Rule 6 (writing style): no em dashes, and no double hyphens used as a dash, in any text file of the repository:
// docs, the page and its case files (the words counselors read), tools, tests, and workflows.
// Code such as "--case" options or "--accent" style names is fine: only a double hyphen between two words, or with
// spaces on both sides, is a dash. Answer sheets and answer_key.json are left out: their text comes from the sheet.
const { execSync }=require('child_process'), fs=require('fs'), path=require('path');
const { expect }=require('./expect');
const ROOT=path.join(__dirname,'..');
const files=execSync('git ls-files --cached --others --exclude-standard',{cwd:ROOT,encoding:'utf8'}).split('\n').filter(Boolean)
  .filter(f=>!/\.(pdf|docx?|jpe?g|png|gif|woff2?|ico)$/i.test(f) && !/(^|\/)package-lock\.json$/.test(f) && !/(^|\/)answer_key\.json$/.test(f))
  .filter(f=>fs.existsSync(path.join(ROOT,f)));
const EM_DASH=String.fromCharCode(0x2014);   // built from its code so this file has no em dash itself
const DASH=/[A-Za-z0-9] -- [A-Za-z0-9]|[A-Za-z]--[A-Za-z]/;
let problems=0;
for(const f of files){
  fs.readFileSync(path.join(ROOT,f),'utf8').split('\n').forEach((line,i)=>{
    if(line.includes(EM_DASH)){ problems++; console.log(`FAIL ${f}:${i+1} em dash: ${line.trim().slice(0,100)}`); }
    else if(DASH.test(line)){ problems++; console.log(`FAIL ${f}:${i+1} double hyphen used as a dash: ${line.trim().slice(0,100)}`); }
  });
}
expect('no em dashes or double hyphens used as dashes', problems===0, `${problems} line(s); use a comma, colon, or parentheses`);
console.log(`checked ${files.length} text files`);
