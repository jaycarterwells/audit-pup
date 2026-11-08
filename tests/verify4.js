const { expect } = require('./expect');
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
    { const s=await p.$eval('#filename',e=>e.innerHTML); console.log('selected label:', s); expect(mode+': chosen file name shown',/Quinn_Sec_E\.pdf/.test(s),s); }
    await grade(p,'E',`${U}/Quinn_Sec_E.pdf`);
    { const c=await barColor(p), r=await rewardState(p); console.log('E, manual items open :', c, '|', r); expect(mode+': manual items open is yellow, no reward',c==='rgb(222, 164, 20)'&&r==='hidden',c+' '+r); }
    const ins=await p.$$('.ws-grid input'); const v=['3027','2883','9999','2571','2363']; for(let i=0;i<5;i++) await ins[i].fill(v[i]); await p.selectOption('.ws-grid select','1');
    await p.waitForTimeout(500); { const c=await barColor(p), r=await rewardState(p); console.log('E, wrong worksheet   :', c, '|', r); expect(mode+': wrong worksheet is red, no reward',c==='rgb(180, 35, 24)'&&r==='hidden',c+' '+r); }
    await ins[2].fill('2715'); await p.check('.confirm input'); await p.waitForTimeout(700);
    { const c=await barColor(p), r=await rewardState(p), s=(await p.textContent('#score')).replace(/\s/g,''); console.log('E, all done          :', c, '|', r, '|', s);
      expect(mode+': all done is green with the reward, 27/27',c==='rgb(27, 122, 61)'&&s==='27/27'&&(mode==='online'?/^dog:/.test(r):r==='check mark only'),c+' '+r+' '+s); }
    await p.uncheck('.confirm input'); await p.waitForTimeout(100);
    await p.waitForTimeout(500); { const c=await barColor(p), r=await rewardState(p); console.log('E, note unticked     :', c, '|', r); expect(mode+': unticking a note goes back to yellow, reward hidden',c==='rgb(222, 164, 20)'&&r==='hidden',c+' '+r); }
    await p.check('.confirm input'); await p.waitForTimeout(700);
    // frozen frame: scroll to the very bottom, is the score frame still at the top of the viewport?
    await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight)); await p.waitForTimeout(300);
    const st=await p.$eval('#sticky',e=>{const r=e.getBoundingClientRect(); return {top:Math.round(r.top), bottom:Math.round(r.bottom)};});
    console.log('after scrolling to bottom, frame at', JSON.stringify(st), '| checking line:', (await p.textContent('#ctx')).replace(/\s+/g,' ')); expect(mode+': score frame stays pinned at the top',st.top===0,JSON.stringify(st));
    if(mode==='online') await p.screenshot({path:path.join(OUT,'sticky_done.png')});
    await grade(p,'E',`${U}/Quinn_Sec_B.pdf`);
    await p.waitForTimeout(500); { const c=await barColor(p), r=await rewardState(p); console.log('B graded as E (fails):', c, '|', r); expect(mode+': failing check is red, no reward',c==='rgb(180, 35, 24)'&&r==='hidden',c+' '+r); }
    await grade(p,'B',`${U}/Quinn_Sec_B.pdf`); await p.waitForTimeout(700);
    { const c=await barColor(p), r=await rewardState(p); console.log('B all pass, no manual:', c, '|', r); expect(mode+': all passing is green with the reward',c==='rgb(27, 122, 61)'&&(mode==='online'?/^dog:/.test(r):r==='check mark only'),c+' '+r); }
    await p.evaluate(()=>window.scrollTo(0,1400)); await p.waitForTimeout(300);
    if(mode==='online') await p.screenshot({path:path.join(OUT,'sticky_b.png')});
    console.log('errors:', errs.length?errs:'none'); expect(mode+': no page errors',!errs.length,errs.join(';')); await ctx.close();
  }
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
