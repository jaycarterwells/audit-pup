// Writes docs/hints.md: every hint a counselor can see, for every case, taken from the case files exactly as the
// page shows them, so reviewers can read them without opening the code. Never edit docs/hints.md by hand.
//   node source/tools/hints_report.js           write docs/hints.md
//   node source/tools/hints_report.js --check   fail if docs/hints.md is not current (run by the tests)
const fs=require('fs'), path=require('path');
const { loadEngine } = require('../../tests/engine');
const OUT=path.join(__dirname,'..','..','docs','hints.md');
const FORM={fed:'Federal Form 1040', sch1:'Schedule 1', sch2:'Schedule 2', sch3:'Schedule 3', schA:'Schedule A', f8880:'Form 8880',
  ca540:'California Form 540', ca3514:'California Form 3514 (EITC)'};
const one=s=>String(s).replace(/\s+/g,' ').trim();
function report(){
  const E=loadEngine(), version=fs.readFileSync(path.join(__dirname,'..','VERSION'),'utf8').trim();
  let md=`# Audit Pup hints for review\n\nEvery hint a counselor can see, for every case, as Audit Pup ${version} shows it. Made from the case files by \`source/tools/hints_report.js\`, so it always matches the page: change a hint in \`source/cases/<case>.js\`, then run the tool.\n\n`+
    `How hints work: when a line fails, the counselor opens one hint. It shows the answer key value ("Answer key: ...", or "blank or $0" for a blank answer sheet cell) and the text below, which says where to look in the problem. A step can replace a line's hint with an answer sheet note for that step only. Answer key notes have their own text.\n\n`+
    `Reviewers: please check that each hint teaches without giving more away than the answer key value, points to the right place in the problem, the handouts, or TaxSlayer, and is correct for the case.\n\n`;
  md+=E.CASES.map(c=>`* [${c.label.replace(/^Case: /,'')}](#${c.id})`).join('\n')+'\n';
  for(const c of E.CASES){
    md+=`\n<a id="${c.id}"></a>\n\n## ${c.label.replace(/^Case: /,'')}\n\nSteps: ${c.steps.map(s=>s.id).join(', ')}.\n`;
    const byForm={}; c.order.filter(k=>c.lines[k]).forEach(k=>{ (byForm[c.lines[k].form]=byForm[c.lines[k].form]||[]).push(k); });
    for(const [form,keys] of Object.entries(byForm)){
      md+=`\n### ${FORM[form]||form}\n\n| Line | What it is | Hint |\n| --- | --- | --- |\n`;
      keys.forEach(k=>{ const L=c.lines[k]; md+=`| ${L.line} | ${one(L.name)} | ${one(L.hint).replace(/\|/g,'\\|')} |\n`; });
    }
    const stepHints=c.steps.filter(s=>s.hints||s.tip);
    if(stepHints.length){
      md+=`\n### Notes for one step only\n\nAt these steps the line's hint above is replaced by the answer sheet note, or the step shows a tip.\n\n| Step | Line | Text |\n| --- | --- | --- |\n`;
      stepHints.forEach(s=>{ Object.entries(s.hints||{}).forEach(([k,t])=>{ md+=`| ${s.id} | ${c.lines[k]?FORM[c.lines[k].form]+', '+c.lines[k].line:k} | ${one(t).replace(/\|/g,'\\|')} |\n`; });
        if(s.tip) md+=`| ${s.id} | (step tip) | ${one(s.tip).replace(/\|/g,'\\|')} |\n`; });
    }
    md+=`\n### Answer key notes\n\n`;
    for(const [id,n] of Object.entries(c.notes)){
      const steps=c.steps.filter(s=>(s.notes||[]).includes(id)).map(s=>s.id);
      md+=`**${id}: ${one(n.name)}** (Step${steps.length>1?'s':''} ${steps.join(', ')})\n\n`;
      if(n.key) md+=`* Answer key: ${one(n.key)}\n`;
      if(n.coach) md+=`* Hint: ${one(n.coach)}\n`;
      if(n.confirm) md+=`* Box the student ticks: ${one(n.confirm)}\n`;
      if(n.example) md+=`* Example: ${one(n.example)}\n`;
      md+='\n';
    }
  }
  return md;
}
if(require.main===module){
  const md=report();
  if(process.argv.includes('--check')){
    const same=fs.existsSync(OUT) && fs.readFileSync(OUT,'utf8')===md;
    console.log(same?'docs/hints.md matches the case files':'docs/hints.md is NOT current: run node source/tools/hints_report.js'); process.exit(same?0:1);
  }
  fs.writeFileSync(OUT,md); console.log(`wrote docs/hints.md (${md.split('\n').length} lines)`);
}
module.exports={ report };
