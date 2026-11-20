// A hint that names steps must name every step where the answer key changes that line (Mary Ryan's review, November
// 2026). Students do not always check every step, so a mistake can come from any step that changes the line, and a
// hint that names only some of them points the wrong way. Developer test: run by tests/dev_test.sh and tests/run_all.sh.
//
// A step changes a line when its answer key value differs from the step before it. The first step counts when its value
// is not blank. A step whose earlier step has no value for the line is skipped: the sheet's tables list some lines from a
// later step on, so the step where the line first appears is not known to be a change. Answer sheet notes shown at one
// step (step hints) are not checked: they speak about that step only.
const { expect }=require('./expect');
const { loadEngine, pickCases }=require('./engine');
const E=loadEngine();
// "Step N", "Steps K and L", "Steps G, H, I, K, L, O, and P", "Step C or D"; not the K of "Karl"
const named=t=>{ const out=new Set();
  for(const m of t.matchAll(/\bSteps? ((?:[A-Z]\d?)(?:(?:,? and |, | or |,? or )(?:[A-Z]\d?)(?![a-z]))*)(?![a-z])/g))
    for(const s of m[1].split(/,? and |, | or /)) out.add(s.trim());
  return out; };
const blank=v=>v===false||v===null||v===undefined?0:v;
let hints=0, withSteps=0;
for(const c of pickCases(E.CASES)){
  const K=E.useCase(c.id), steps=K.steps.filter(s=>s.type==='check');
  for(const [k,L] of Object.entries(K.lines)){
    hints++; const nm=named(L.hint||''); if(!nm.size) continue; withSteps++;
    const changes=[];
    steps.forEach((s,i)=>{ if(!(k in s.expected)) return; const v=blank(s.expected[k]);
      if(i===0){ if(v!==0) changes.push(s.id); return; }
      const p=steps[i-1]; if(!(k in p.expected)) return;
      if(blank(p.expected[k])!==v) changes.push(s.id); });
    const missing=changes.filter(s=>!nm.has(s));
    expect(`${c.id} ${k}: the hint names every step where the answer key changes this line`, !missing.length,
      `names Step ${[...nm].join(', ')}; the key changes it at ${changes.join(', ')}; add ${missing.join(', ')}`);
  }
}
console.log(`${hints} line hints, ${withSteps} name steps; each names every step where its line changes`);
