const { expect } = require('./expect');
// What's new panel
const { chromium } = require('playwright'); const path=require('path');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1366,height:657}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const url='file://'+PAGE;
 await p.goto(url); await p.waitForTimeout(250);
 const btn=await p.textContent('#verbtn'); const isNew=await p.$eval('#verbtn',e=>e.classList.contains('isnew'));
 console.log('button:',JSON.stringify(btn),'| New tag on first open:',isNew); expect('Version button shows the version and a New tag on first open',/^Version \d+\.\d+\.\d+/.test(btn)&&isNew,btn);
 await p.click('#verbtn'); await p.waitForTimeout(150);
 const open=await p.$eval('#wnback',e=>!e.classList.contains('hidden'));
 const rel=await p.$$eval('.wn-rel h3',e=>e.map(x=>x.textContent)); console.log('panel open:',open,'| releases:',rel.join(' / ')); expect('What\'s new opens with the current version first',open&&rel.length>=5&&/You have this one/.test(rel[0]),rel[0]);
 await p.screenshot({path:path.join(OUT,'wn_100.png')});
 await p.keyboard.press('Escape'); await p.waitForTimeout(100); { const c=await p.$eval('#wnback',e=>e.classList.contains('hidden')); console.log('Esc closes:',c); expect('Esc closes the panel',c); }
 await p.reload(); await p.waitForTimeout(250); { const n=await p.$eval('#verbtn',e=>e.classList.contains('isnew')); console.log('New tag after seeing it and reopening the page:',n); expect('New tag is gone after the panel was seen',!n); }
 await p.click('#verlink'); await p.waitForTimeout(100); { const o=await p.$eval('#wnback',e=>!e.classList.contains('hidden')); console.log('footer "What\'s new" link opens panel:',o); expect('footer link opens the panel',o); }
 await p.mouse.click(5,5); await p.waitForTimeout(100); { const c=await p.$eval('#wnback',e=>e.classList.contains('hidden')); console.log('click outside closes:',c); expect('a click outside closes the panel',c); }
 await p.setViewportSize({width:911,height:438}); await p.click('#verbtn'); await p.waitForTimeout(150);
 const fit=await p.$eval('#wn',e=>{const r=e.getBoundingClientRect(); return {top:Math.round(r.top),bottom:Math.round(r.bottom),scrolls:document.getElementById('wnbody').scrollHeight>document.getElementById('wnbody').clientHeight};});
 console.log('150% zoom Chromebook: panel top/bottom',fit.top,fit.bottom,'of 438 | body scrolls inside panel:',fit.scrolls); expect('150% zoom: the panel fits the screen',fit.top>=0&&fit.bottom<=438,fit.top+'-'+fit.bottom); await p.screenshot({path:path.join(OUT,'wn_150.png')});
 const c2=await b.newContext({javaScriptEnabled:false}); const p2=await c2.newPage(); await p2.goto(url); await p2.waitForTimeout(200);
 { const f=(await p2.textContent('footer .ver')).trim(); console.log('scripts blocked, footer still shows:',f); expect('with scripts blocked the footer still shows the version',/Audit Pup version \d/.test(f),f); }
 console.log('errors:',errs.length?errs:'none'); expect('no page errors',!errs.length,errs.join(';')); await b.close(); })();
