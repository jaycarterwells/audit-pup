const { expect } = require('./expect');
// What's new panel
const { chromium } = require('playwright'); const path=require('path');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const { open, reload, offline } = require('./page');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1366,height:657}}); await offline(ctx); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
 const url='file://'+PAGE;
 await open(p,url);
 const btn=await p.textContent('#verbtn'); const isNew=await p.$eval('#verbtn',e=>e.classList.contains('isnew'));
 console.log('button:',JSON.stringify(btn),'| New tag on first open:',isNew); expect('Version button shows the version and a New tag on first open',/^Version \d+\.\d+\.\d+/.test(btn)&&isNew,btn);
 await p.click('#verbtn');
 const shown=await p.$eval('#wnback',e=>!e.classList.contains('hidden'));
 const rel=await p.$$eval('.wn-rel h3',e=>e.map(x=>x.textContent)); console.log('panel open:',shown,'| releases:',rel.join(' / ')); expect('What\'s new opens with the current version first',shown&&rel.length>=5&&/You have this one/.test(rel[0]),rel[0]);
 await p.screenshot({path:path.join(OUT,'wn_100.png')});
 await p.keyboard.press('Escape'); { const c=await p.$eval('#wnback',e=>e.classList.contains('hidden')); console.log('Esc closes:',c); expect('Esc closes the panel',c); }
 await reload(p); { const n=await p.$eval('#verbtn',e=>e.classList.contains('isnew')); console.log('New tag after seeing it and reopening the page:',n); expect('New tag is gone after the panel was seen',!n); }
 await p.click('#verlink'); { const o=await p.$eval('#wnback',e=>!e.classList.contains('hidden')); console.log('footer "What\'s new" link opens panel:',o); expect('footer link opens the panel',o); }
 await p.mouse.click(5,5); { const c=await p.$eval('#wnback',e=>e.classList.contains('hidden')); console.log('click outside closes:',c); expect('a click outside closes the panel',c); }
 await p.setViewportSize({width:911,height:438}); await p.click('#verbtn');
 const fit=await p.$eval('#wn',e=>{const r=e.getBoundingClientRect(); return {top:Math.round(r.top),bottom:Math.round(r.bottom),scrolls:document.getElementById('wnbody').scrollHeight>document.getElementById('wnbody').clientHeight};});
 console.log('150% zoom Chromebook: panel top/bottom',fit.top,fit.bottom,'of 438 | body scrolls inside panel:',fit.scrolls); expect('150% zoom: the panel fits the screen',fit.top>=0&&fit.bottom<=438,fit.top+'-'+fit.bottom); await p.screenshot({path:path.join(OUT,'wn_150.png')});
 const c2=await b.newContext({javaScriptEnabled:false}); const p2=await c2.newPage(); await p2.goto(url);   // scripts are off: the page is done when it has loaded
 { const f=(await p2.textContent('footer .ver')).trim(); console.log('scripts blocked, footer still shows:',f); expect('with scripts blocked the footer still shows the version',/Audit Pup version \d/.test(f),f); }
 console.log('errors:',errs.length?errs:'none'); expect('no page errors',!errs.length,errs.join(';')); await b.close(); })();
