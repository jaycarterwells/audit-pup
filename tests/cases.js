// Loads every case that has a cases/<case>/case.json, in "order". The generic tests (cases_steps, cases_matrix,
// cases_switch, mutate) run over this list, so a new case needs a case.json and its PDFs, not new test scripts.
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..','cases');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html');
function loadCases(){
  return fs.readdirSync(ROOT).filter(d=>fs.existsSync(path.join(ROOT,d,'case.json'))).map(d=>{
    const m=JSON.parse(fs.readFileSync(path.join(ROOT,d,'case.json'),'utf8'));
    m.dir=path.join(ROOT,d);
    m.steps=Object.keys(m.pdf);
    m.pdfPath=s=>path.join(m.dir,m.pdf[s]);
    m.files=[...new Set(Object.values(m.pdf))];                       // each printout once (Baylor P and O share one)
    m.stepsOf=file=>m.steps.filter(s=>m.pdf[s]===file);
    m.todo=m.todo||{}; m.sameReturn=m.sameReturn||[];
    // a PDF may pass a step when it is that step's printout or a printout of a step with the same return
    m.mayPass=(file,step)=>m.stepsOf(file).some(s=>s===step||m.sameReturn.some(g=>g.includes(s)&&g.includes(step)));
    return m;
  }).sort((a,b)=>(a.order||99)-(b.order||99));
}
// the page's own list of cases and steps, so a case.json that drifts from the page is caught
async function pageCases(p){ return p.evaluate(()=>CASES.map(c=>({id:c.id, steps:c.steps.map(s=>s.id)}))); }
// select a case and step, check a PDF, and return the score, rows, warnings, and any on-screen error
async function grade(p,caseId,step,file){
  if(await p.$eval('#assignment',e=>e.value)!==caseId){ await p.selectOption('#assignment',caseId); await p.waitForFunction(id=>document.getElementById('assignment').value===id,caseId); }
  await p.selectOption('#step',step); await p.setInputFiles('#file',file); await p.click('#grade');
  await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',null,{timeout:60000});
  return p.evaluate(()=>({
    score:document.getElementById('score').textContent.replace(/\s/g,''),
    rows:[...document.querySelectorAll('#groups li.check')].map(l=>({cls:l.className.replace('check','').trim(), name:l.querySelector('.name').textContent, st:l.querySelector('.state').textContent, yours:(l.querySelector('.yours')||{}).textContent||''})),
    warn:document.getElementById('stepwarn').classList.contains('hidden')?'':document.getElementById('stepwarn').textContent,
    err:document.getElementById('error').classList.contains('hidden')?'':document.getElementById('error').textContent }));
}
module.exports={ loadCases, pageCases, grade, PAGE };
