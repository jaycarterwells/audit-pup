// Every case has a golden file and its golden.json matches it: the data Instructor mode compares against is made from
// the PDF by source/tools/golden_data.js, never edited by hand. Run that tool when a golden PDF changes.
const fs=require('fs'), path=require('path'), crypto=require('crypto');
const { expect }=require('./expect');
const { goldenJson, goldenPdf, CASES }=require('./instructor');
for(const c of CASES){
  const pdf=goldenPdf(c), json=path.join(path.dirname(pdf),'golden.json');
  if(!expect(`${c}: golden file and golden.json are in cases/${c}/`, fs.existsSync(pdf) && fs.existsSync(json))) continue;
  const g=goldenJson(c), sha=crypto.createHash('sha256').update(fs.readFileSync(pdf)).digest('hex');
  expect(`${c}: golden.json was made from the golden file as it is now`, g.sha256===sha && g.source===path.basename(pdf), 'run: node source/tools/golden_data.js');
}
console.log('golden data checked');
