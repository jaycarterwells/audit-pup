const { chromium } = require('playwright'); const path=require('path'); const fs=require('fs');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const U=path.join(__dirname,'..','cases','quinn');
async function grade(p,step,file){ await p.selectOption('#step',step); await p.setInputFiles('#file',file); await p.click('#grade');
  await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',{timeout:20000}); await p.waitForTimeout(150); }
const barColor=p=>p.$eval('#barfill',e=>getComputedStyle(e).backgroundColor);
const rewardState=p=>p.$eval('#reward',e=>e.classList.contains('hidden')?'hidden':(e.classList.contains('hasdog')?'dog: '+document.getElementById('dogcap').textContent:'check mark only'));
(async()=>{ const b=await chromium.launch();
  for (const mode of ['online','offline']){
    const ctx=await b.newContext({viewport:{width:820,height:900},deviceScaleFactor:1.5});
    await ctx.addInitScript(()=>{ window.Worker=function(){throw new Error('blocked');}; });
    if(mode==='online'){
      await ctx.route('https://dog.ceo/**',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({message:'https://images.dog.ceo/breeds/retriever-golden/n02099601_1.jpg',status:'success'})}));
      await ctx.route('https://images.dog.ceo/**',r=>r.fulfill({contentType:'image/jpeg',body:fs.readFileSync(path.join(__dirname,'mockdog.jpg'))}));
    } else {
      await ctx.route('https://dog.ceo/**',r=>r.abort());
    }
    const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file://'+PAGE); await p.waitForTimeout(250);
    console.log(`\n=== ${mode} ===`);
    await p.setInputFiles('#file',`${U}/Quinn_Sec_E.pdf`);
    console.log('selected label:', await p.$eval('#filename',e=>e.innerHTML));
    await grade(p,'E',`${U}/Quinn_Sec_E.pdf`);
    console.log('E, manual items open :', await barColor(p), '|', await rewardState(p));
    const ins=await p.$$('.ws-grid input'); const v=['3027','2883','9999','2571','2363']; for(let i=0;i<5;i++) await ins[i].fill(v[i]); await p.selectOption('.ws-grid select','1');
    await p.waitForTimeout(500); console.log('E, wrong worksheet   :', await barColor(p), '|', await rewardState(p));
    await ins[2].fill('2715'); await p.check('.confirm input'); await p.waitForTimeout(700);
    console.log('E, all done          :', await barColor(p), '|', await rewardState(p), '|', (await p.textContent('#score')).replace(/\s/g,''));
    await p.uncheck('.confirm input'); await p.waitForTimeout(100);
    await p.waitForTimeout(500); console.log('E, note unticked     :', await barColor(p), '|', await rewardState(p));
    await p.check('.confirm input'); await p.waitForTimeout(700);
    // frozen frame: scroll to the very bottom, is the score frame still at the top of the viewport?
    await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await p.waitForTimeout(300);
    const st=await p.$eval('#sticky',e=>{const r=e.getBoundingClientRect(); return {top:Math.round(r.top), bottom:Math.round(r.bottom)};});
    console.log('after scrolling to bottom, frame at', JSON.stringify(st), '| checking line:', (await p.textContent('#ctx')).replace(/\s+/g,' '));
    if(mode==='online') await p.screenshot({path:path.join(OUT,'sticky_done.png')});
    await grade(p,'E',`${U}/Quinn_Sec_B.pdf`);
    await p.waitForTimeout(500); console.log('B graded as E (fails):', await barColor(p), '|', await rewardState(p));
    await grade(p,'B',`${U}/Quinn_Sec_B.pdf`); await p.waitForTimeout(700);
    console.log('B all pass, no manual:', await barColor(p), '|', await rewardState(p));
    await p.evaluate(()=>window.scrollTo(0,1400)); await p.waitForTimeout(300);
    if(mode==='online') await p.screenshot({path:path.join(OUT,'sticky_b.png')});
    console.log('errors:', errs.length?errs:'none'); await ctx.close();
  }
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
