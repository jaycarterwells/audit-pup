const { expect } = require('./expect');
const { chromium } = require('playwright'); const path=require('path');
const PAGE=path.join(__dirname,'..','source','tax-aide-quinn-checker.html'), OUT=path.join(__dirname,'output'); require('fs').mkdirSync(OUT,{recursive:true});
const U=path.join(__dirname,'..','cases','quinn'), T=OUT;
const { open, ready, offline } = require('./page');
// damaged copies of the current build: cut off inside the app code, inside the PDF engine, and near the end
{ const s=require('fs').readFileSync(PAGE,'utf8'), fs2=require('fs');
  fs2.writeFileSync(path.join(T,'cut_in_app.html'), s.slice(0, s.indexOf('function extractAll')+200));
  fs2.writeFileSync(path.join(T,'cut_in_lib.html'), s.slice(0, s.indexOf('id="pdfjslib-b64"')+300000));
  fs2.writeFileSync(path.join(T,'cut_in_worker.html'), s.slice(0, s.indexOf('id="aup-end"')-5000)); }
const vis=(p,sel)=>p.$eval(sel,e=>!e.classList.contains('hidden')&&getComputedStyle(e).display!=='none').catch(()=>false);
(async()=>{ const b=await chromium.launch();
 // [name, file, scripts on, want: steps listed?, 'did not start' note?, outcome]
 const cases=[['normal copy',PAGE,true,true,false,'graded 22/22'],['scripts blocked (preview)',PAGE,false,false,true,''],
   ['cut off inside the app code',T+'/cut_in_app.html',true,false,true,''],['cut off inside PDF engine',T+'/cut_in_lib.html',true,true,false,'incomplete'],['cut off near the end',T+'/cut_in_worker.html',true,true,false,'incomplete']];
 for(const [name,file,js,wantSteps,wantBanner,wantOut] of cases){ const ctx=await b.newContext({javaScriptEnabled:js}); await offline(ctx); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+file);   // the page starts, or reports why not, before it finishes loading
  const opts=await p.$$eval('#step option',e=>e.length).catch(()=>0), banner=await vis(p,'#startup'), err=await p.$eval('#error',e=>e.classList.contains('hidden')?'':e.textContent).catch(()=>'');
  let check='';
  if(js && opts){ await p.selectOption('#step','B'); await p.setInputFiles('#file',`${U}/Quinn_Sec_B.pdf`); await p.click('#grade');
    await ready(p,{settle:false});
    const e2=await p.$eval('#error',e=>e.classList.contains('hidden')?'':e.textContent); const sc=await p.$eval('#results',e=>e.style.display==='block'?document.getElementById('score').textContent.replace(/\s/g,''):'');
    check= sc?`graded ${sc}`:`message: "${e2.slice(0,70)}..."`; }
  console.log(`${name.padEnd(29)} | steps=${opts} | "did not start" note shown=${banner} | ${err?'warns on open: incomplete copy | ':''}${check}`);
  expect(`${name}: steps ${wantSteps?'listed':'not listed'}, "did not start" note ${wantBanner?'shown':'hidden'}`,(opts>0)===wantSteps&&banner===wantBanner,`steps=${opts} note=${banner}`);
  if(wantOut==='incomplete') expect(`${name}: says the copy is incomplete`,!!err&&/incomplete/i.test(check),check); else if(wantOut) expect(`${name}: ${wantOut}`,check===wantOut,check);
  await ctx.close(); }
 // drop a PDF outside the box: page must stay and take the file
 const ctx=await b.newContext(); await offline(ctx); await ctx.addInitScript(()=>{ delete File.prototype.arrayBuffer; });  // also simulate older Safari (no File.arrayBuffer)
 const p=await ctx.newPage(); await open(p,'file://'+PAGE);
 const fs=require('fs'); const b64=fs.readFileSync(`${U}/Quinn_Sec_B.pdf`).toString('base64');
 const dt=await p.evaluateHandle(b64=>{ const bin=atob(b64), u=new Uint8Array(bin.length); for(let i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);
   const d=new DataTransfer(); d.items.add(new File([u],'Quinn_Sec_B.pdf',{type:'application/pdf'})); return d; }, b64);
 await p.dispatchEvent('h1','drop',{dataTransfer:dt});
 { const fn=await p.$eval('#filename',e=>e.textContent), stay=(await p.title())==='Audit Pup'; console.log('\nPDF dropped on the page title (outside the box):', fn, '| still on Audit Pup:', stay); expect('a PDF dropped outside the box is taken and the page stays',/Quinn_Sec_B\.pdf/.test(fn)&&stay,fn); }
 await p.selectOption('#step','B'); await p.click('#grade'); await ready(p,{settle:false});
 { const sc=(await p.textContent('#score')).replace(/\s/g,''); console.log('Graded with File.arrayBuffer removed (older Safari path):', sc); expect('older Safari file reading still checks 22/22',sc==='22/22',sc); }
 await b.close(); })();
