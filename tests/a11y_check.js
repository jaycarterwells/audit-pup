// Accessibility scan with axe-core (WCAG 2.1 A and AA rules) of the screens counselors see, in both light and dark
// themes, on a Chromebook-size screen: the start page of every case, results with a failing line and its hint open,
// a finished step with the reward, and the What's new panel. Every finding fails, with the element it is about.
const path=require('path');
const { chromium } = require('playwright');
const { default: AxeBuilder } = require(path.join(__dirname,'..','source','node_modules','@axe-core','playwright'));
const { expect } = require('./expect');
const { loadCases, grade, PAGE } = require('./cases');
const { open, settled } = require('./page');
const TAGS=['wcag2a','wcag2aa','wcag21a','wcag21aa'];
(async()=>{ const b=await chromium.launch(); let screens=0, found=0;
  for(const theme of ['light','dark']){
    const ctx=await b.newContext({viewport:{width:1366,height:657}, colorScheme:theme}); await ctx.route('https://dog.ceo/**',r=>r.abort());
    const p=await ctx.newPage();
    await open(p,'file://'+PAGE);
    const scan=async name=>{ screens++; await settled(p);   // colors are checked after every transition ends
      const r=await new AxeBuilder({page:p}).withTags(TAGS).analyze();
      for(const v of r.violations){ for(const n of v.nodes){ found++;
        console.log(`FAIL ${theme} | ${name} | ${v.id} (${v.impact}): ${v.help} | ${n.target.join(' ')} | ${(n.failureSummary||'').split('\n').slice(1,2).join(' ').trim()}`); } }
      console.log(`${theme} | ${name}: ${r.violations.length} rule(s) broken, ${r.passes.length} passed`); };
    for(const c of loadCases()){
      await p.selectOption('#assignment',c.id);
      await scan(`${c.id} start page`);
      // a wrong PDF: lines fail; open the first hint
      const wrong=c.steps.find(s=>!c.mayPass(c.pdf[c.steps[0]],s));
      await grade(p,c.id,wrong,c.pdfPath(c.steps[0]));
      const hb=await p.$('#groups li.check.fail .hintbtn'); if(hb) await hb.click();
      await scan(`${c.id} results with a failing line and its hint`);
      // the right PDF for a step with nothing left to tick: done, with the reward
      const done=c.steps.find(s=>!(c.todo[s]>0));
      await grade(p,c.id,done,c.pdfPath(done));
      await scan(`${c.id} finished step with the reward`);
    }
    await p.click('#verbtn'); await scan('What\'s new panel');
    await ctx.close();
  }
  expect('no accessibility problems', found===0, `${found} finding(s) on ${screens} screens`);
  console.log(`scanned ${screens} screens`);
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
