const { chromium } = require('playwright'); const path=require('path');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const U=path.join(__dirname,'..','cases','quinn'), T=OUT;
// damaged copies of the current build: cut off inside the app code, inside the PDF engine, and near the end
{ const s=require('fs').readFileSync(PAGE,'utf8'), fs2=require('fs');
  fs2.writeFileSync(path.join(T,'cut_in_app.html'), s.slice(0, s.indexOf('function extractAll')+200));
  fs2.writeFileSync(path.join(T,'cut_in_lib.html'), s.slice(0, s.indexOf('id="pdfjslib-b64"')+300000));
  fs2.writeFileSync(path.join(T,'cut_in_worker.html'), s.slice(0, s.indexOf('id="aup-end"')-5000)); }
const vis=(p,sel)=>p.$eval(sel,e=>!e.classList.contains('hidden')&&getComputedStyle(e).display!=='none').catch(()=>false);
(async()=>{ const b=await chromium.launch();
 const cases=[['normal copy',PAGE,true],['scripts blocked (preview)',PAGE,false],
   ['cut off inside the app code',T+'/cut_in_app.html',true],['cut off inside PDF engine',T+'/cut_in_lib.html',true],['cut off near the end',T+'/cut_in_worker.html',true]];
 for(const [name,file,js] of cases){ const ctx=await b.newContext({javaScriptEnabled:js}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+file); await p.waitForTimeout(400);
  const opts=await p.$$eval('#step option',e=>e.length).catch(()=>0), banner=await vis(p,'#startup'), err=await p.$eval('#error',e=>e.classList.contains('hidden')?'':e.textContent).catch(()=>'');
  let check='';
  if(js && opts){ await p.selectOption('#step','B'); await p.setInputFiles('#file',`${U}/Quinn_Sec_B.pdf`); await p.click('#grade');
    await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',{timeout:20000}); await p.waitForTimeout(150);
    const e2=await p.$eval('#error',e=>e.classList.contains('hidden')?'':e.textContent); const sc=await p.$eval('#results',e=>e.style.display==='block'?document.getElementById('score').textContent.replace(/\s/g,''):'');
    check= sc?`graded ${sc}`:`message: "${e2.slice(0,70)}..."`; }
  console.log(`${name.padEnd(29)} | steps=${opts} | "did not start" note shown=${banner} | ${err?'warns on open: incomplete copy | ':''}${check}`);
  await ctx.close(); }
 // drop a PDF outside the box: page must stay and take the file
 const ctx=await b.newContext(); await ctx.addInitScript(()=>{ delete File.prototype.arrayBuffer; });  // also simulate older Safari (no File.arrayBuffer)
 const p=await ctx.newPage(); await p.goto('file://'+PAGE); await p.waitForTimeout(300);
 const fs=require('fs'); const b64=fs.readFileSync(`${U}/Quinn_Sec_B.pdf`).toString('base64');
 const dt=await p.evaluateHandle(b64=>{ const bin=atob(b64), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
   const d=new DataTransfer(); d.items.add(new File([u],'Quinn_Sec_B.pdf',{type:'application/pdf'})); return d; }, b64);
 await p.dispatchEvent('h1','drop',{dataTransfer:dt}); await p.waitForTimeout(200);
 console.log('\nPDF dropped on the page title (outside the box):', await p.$eval('#filename',e=>e.textContent), '| still on Audit Pup:', (await p.title())==='Audit Pup');
 await p.selectOption('#step','B'); await p.click('#grade'); await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',{timeout:20000}); await p.waitForTimeout(150);
 console.log('Graded with File.arrayBuffer removed (older Safari path):', (await p.textContent('#score')).replace(/\s/g,''));
 await b.close(); })();
