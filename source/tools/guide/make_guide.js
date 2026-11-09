// Builds the Audit Pup guide as a print-ready PDF for one release, from that release's own counselor guide
// (docs/chromebook-guide.md at the tag), with screenshots taken from that release's page. One source, two PDFs:
//   * the counselor guide (default), and
//   * the beta tester guide (--beta): the same guide with a welcome page, a testing checklist, how to report a
//     problem, and the known limits.
// Contact details are never stored in the repository: pass them with --contact when building the beta guide.
//
//   node source/tools/guide/make_guide.js v0.16.0
//   node source/tools/guide/make_guide.js v0.16.0 --beta --contact "Carter Wells, email ..., phone ..."
//
// Output: source/dist/guides/ (not committed). Needs git, the npm tools (cd source && npm install), and Chromium
// (Playwright's; set CHROMIUM_PATH to use another Chromium).
/* global window, document, scrollY, CASES, CHANGELOG (names used inside page.evaluate(), which runs in the browser) */
const fs=require('fs'), os=require('os'), path=require('path'), { execFileSync }=require('child_process');
const ROOT=path.join(__dirname,'..','..','..'), SRC=path.join(ROOT,'source');
const args=process.argv.slice(2), tag=args.find(a=>/^v\d+\.\d+\.\d+$/.test(a));
const beta=args.includes('--beta'), ci=args.indexOf('--contact'), contact=ci>=0?args[ci+1]:process.env.AUDITPUP_CONTACT;
if(!tag){ console.error('usage: node source/tools/guide/make_guide.js <tag, e.g. v0.16.0> [--beta --contact "name, email, phone"]'); process.exit(2); }
if(beta && !contact){ console.error('the beta guide needs --contact "..." (who testers send reports to); it is not stored in the repository'); process.exit(2); }
const version=tag.slice(1), OUT=path.join(SRC,'dist','guides'); fs.mkdirSync(OUT,{recursive:true});
const git=(...a)=>execFileSync('git',a,{cwd:ROOT,encoding:'utf8'});
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// ---- 1. the release's page and guide
const work=fs.mkdtempSync(path.join(os.tmpdir(),'auditpup-guide-')), tree=path.join(work,'tree');
git('worktree','add','-q','--detach',tree,tag);
const cleanup=()=>{ try{ git('worktree','remove','--force',tree); }catch(e){ /* already gone */ } };
fs.symlinkSync(path.join(SRC,'node_modules'),path.join(tree,'source','node_modules'));
const date=git('log','-1','--format=%cs',tag).trim();
execFileSync('node',['build_html.js'],{cwd:path.join(tree,'source'),env:{...process.env,BUILD_DATE:date},stdio:'ignore'});
const PAGE=path.join(tree,'source','tax-aide-quinn-checker.html'), A=path.join(tree,'source','assets');
const guideMd=fs.readFileSync(path.join(tree,'docs','chromebook-guide.md'),'utf8');

// ---- 2. Markdown to HTML (the guide uses headings, paragraphs, bullet lists with one nested level,
//         numbered lists, tables, bold, and bare links)
const inline=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/`([^`]+)`/g,'<code>$1</code>')
  .replace(/(https?:\/\/[^\s)]+[^\s).,])/g,'<a href="$1">$1</a>');
function blocks(md){
  const out=[], lines=md.replace(/\r/g,'').split('\n'); let i=0;
  while(i<lines.length){ const l=lines[i];
    if(!l.trim()){ i++; continue; }
    let m;
    if((m=l.match(/^(#{1,3}) (.*)$/))){ out.push({t:'h'+m[1].length, text:m[2]}); i++; continue; }
    if(/^\|/.test(l)){ const rows=[]; while(i<lines.length && /^\|/.test(lines[i])){ rows.push(lines[i]); i++; }
      const cells=r=>r.replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
      out.push({t:'table', head:cells(rows[0]), rows:rows.slice(2).map(cells)}); continue; }
    if(/^\* /.test(l)){ const items=[]; while(i<lines.length && /^(\* | {2}\* )/.test(lines[i])){
        if(/^\* /.test(lines[i])) items.push({text:lines[i].slice(2), sub:[]}); else items[items.length-1].sub.push(lines[i].trim().slice(2)); i++; }
      items.forEach(it=>out.push({t:'li', text:it.text, sub:it.sub})); continue; }
    if(/^\d+\. /.test(l)){ const items=[]; while(i<lines.length && /^\d+\. /.test(lines[i])){ items.push(lines[i].replace(/^\d+\. /,'')); i++; }
      out.push({t:'ol', items}); continue; }
    const para=[]; while(i<lines.length && lines[i].trim() && !/^(#|\||\* |\d+\. )/.test(lines[i])){ para.push(lines[i].trim()); i++; }
    out.push({t:'p', text:para.join(' ')});
  }
  return out;
}
// figures: placed after the first block that matches; a guide without that block simply has no such figure
const FIG={
  start:{after:/^Meet the dogs$/, end:true, cap:'The start page: Zeke\'s message, the case and step pickers, your progress, the drop box, and the Check button.'},
  selected:{after:/^Click the button that names your step/, cap:'A PDF chosen for Step A. The drop box and the button both name the step.'},
  pass:{after:/^The bar under the score is/, cap:'Every check passed: Zeke, a green bar, and the Approved! reward. (Your reward photo will be a real dog.)'},
  ws:{after:/^\*\*Worksheet entries:\*\*/, cap:'A worksheet total typed wrong: the box is outlined in red, and the hint shows the answer key worksheet.'},
  blank:{after:/^\*\*Lines that should be blank:\*\*/, cap:'A Step B PDF checked for Step A: each line that should still be blank but has an amount is listed.'},
  wrong:{after:/^\*\*Did you pick the right step\?\*\*/, cap:'A Step B PDF checked for Step E: the yellow box names Step B.'},
  trail:{after:/^The paw-print trail/, cap:'Baylor with Steps A, B, and C done and Step E waiting for its TS Note box.'},
  pair:{after:/^The \*\*Theme\*\* button/, cap:''},
};
function guideHtml(md,shots){
  const bl=blocks(md), used={}; let h='', inList=false, title='';
  const fig=k=>{ if(used[k] || !(k==='pair' ? shots.whatsnew && shots.dark : shots[k])) return ''; used[k]=1;
    if(k==='pair') return `<div class="two"><figure><img src="${shots.whatsnew}" alt=""><figcaption>The What's new panel.</figcaption></figure><figure><img src="${shots.dark}" alt=""><figcaption>The dark theme.</figcaption></figure></div>`;
    return `<figure${/^(blank|wrong)$/.test(k)?' class="short"':''}><img src="${shots[k]}" alt=""><figcaption>${esc(FIG[k].cap)}</figcaption></figure>`; };
  const after=text=>Object.keys(FIG).filter(k=>!FIG[k].end && FIG[k].after.test(text)).map(fig).join('');
  let pendingEnd=null;
  bl.forEach((b,n)=>{
    if(b.t!=='li' && inList){ h+='</ul>'; inList=false; }
    if(b.t==='h1'){ title=b.text; return; }
    if(/^h[23]$/.test(b.t)){ if(pendingEnd){ h+=fig(pendingEnd); pendingEnd=null; }
      if(b.t==='h2'){ h+=(h?'</section>':'')+'<section class="sec">'; }   // a section stays on one page when it fits
      h+=`<${b.t}>${inline(b.text)}</${b.t}>`; const e=Object.keys(FIG).find(k=>FIG[k].end && FIG[k].after.test(b.text)); if(e) pendingEnd=e; return; }
    if(b.t==='p'){ h+=`<p>${inline(b.text)}</p>`+after(b.text); return; }
    if(b.t==='ol'){ h+='<ol>'+b.items.map(x=>`<li>${inline(x)}</li>`).join('')+'</ol>'+b.items.map(after).join(''); return; }
    if(b.t==='table'){ h+='<table><tr>'+b.head.map(c=>`<th>${inline(c)}</th>`).join('')+'</tr>'+b.rows.map(r=>'<tr>'+r.map(c=>`<td>${inline(c)}</td>`).join('')+'</tr>').join('')+'</table>'; return; }
    if(b.t==='li'){ const f=after(b.text); if(!inList){ h+='<ul>'; inList=true; }
      h+=`<li>${inline(b.text)}${b.sub.length?'<ul>'+b.sub.map(s=>`<li>${inline(s)}</li>`).join('')+'</ul>':''}</li>`;
      if(f){ h+='</ul>'+f; inList=false; } }
    if(n===bl.length-1 && inList){ h+='</ul>'; inList=false; }
  });
  if(inList) h+='</ul>'; if(pendingEnd) h+=fig(pendingEnd);
  return {title, html:h+(h.includes('<section')?'</section>':'')};
}

// ---- 3. screenshots of the release's page at Chromebook size, and its own case list and release notes
async function shoot(browser){
  const { grade }=require(path.join(ROOT,'tests','cases.js')), { open, settled, dogShown }=require(path.join(ROOT,'tests','page.js'));
  const ctx=await browser.newContext({viewport:{width:1366,height:768},deviceScaleFactor:2});
  await ctx.route('https://dog.ceo/**',r=>r.fulfill({contentType:'application/json',body:JSON.stringify({message:'https://images.dog.ceo/breeds/retriever-golden/n02099601_1.jpg',status:'success'})}));
  await ctx.route('https://images.dog.ceo/**',r=>r.fulfill({contentType:'image/jpeg',body:fs.readFileSync(path.join(ROOT,'tests','mockdog.jpg'))}));
  await ctx.route('https://jaycarterwells.github.io/**',r=>r.abort());   // no update check against the live site
  const p=await ctx.newPage(); await open(p,'file://'+PAGE);
  const shots={}, Q=path.join(ROOT,'cases','quinn')+'/', B=path.join(ROOT,'cases','baylor')+'/';
  const png=async clip=>'data:image/png;base64,'+(await p.screenshot(clip?{clip}:{})).toString('base64');
  const of=async(sel,pad=12)=>{ const e=typeof sel==='string'?await p.$(sel):sel; await e.scrollIntoViewIfNeeded(); await settled(p); const b=await e.boundingBox();
    return png({x:Math.max(0,b.x-pad),y:Math.max(0,b.y-pad),width:b.width+2*pad,height:b.height+2*pad}); };
  const top=async sel=>{ await p.evaluate(s=>window.scrollTo(0,s?document.querySelector(s).getBoundingClientRect().top+scrollY-8:0),sel||null); await settled(p); return png(); };
  const sticky=on=>p.addStyleTag({content:`#sticky{position:${on?'sticky':'static'} !important}`});
  const info=await p.evaluate(()=>({cases:CASES.map(c=>({label:c.label.replace(/^Case: /,''), steps:c.steps.map(s=>s.id)})), notes:CHANGELOG[0]}));
  shots.start=await top();
  await p.selectOption('#step','A'); await p.setInputFiles('#file',Q+'Quinn_Sec_A.pdf'); shots.selected=await of('.card');
  await p.click('#grade'); await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready'); await dogShown(p); shots.pass=await top('#results');
  await grade(p,'quinn','E',Q+'Quinn_Sec_E.pdf');
  const ins=await p.$$('.ws-grid input'); for(const [i,v] of ['3027','2883','2751','2571','2363'].entries()) await ins[i].fill(v);
  await p.selectOption('.ws-grid select','1'); await sticky(false);
  const n3=await p.$('li.check.fail'); await n3.$eval('.hintbtn',e=>e.click()); shots.ws=await of(n3); await sticky(true);
  await p.reload(); await open(p,'file://'+PAGE);
  await grade(p,'quinn','E',Q+'Quinn_Sec_B.pdf'); shots.wrong=await top('#results');
  await grade(p,'quinn','A',Q+'Quinn_Sec_B.pdf'); await sticky(false);
  const blank=await p.$('xpath=//li[contains(@class,"check")][.//*[contains(text(),"blank on the answer key")]]'); if(blank) shots.blank=await of(blank); await sticky(true);
  await p.reload(); await open(p,'file://'+PAGE);
  if(info.cases.some(c=>/^Baylor/.test(c.label))){ await p.selectOption('#assignment','baylor');
    await grade(p,'baylor','A',B+'Baylor_Sec_A.pdf'); await p.check('.confirm input');
    for(const s of ['B','C','E']) await grade(p,'baylor',s,B+`Baylor_Sec_${s}.pdf`);
    await p.evaluate(()=>window.scrollTo(0,0)); shots.trail=await of('#progress',16); }
  await p.click('#verbtn'); await settled(p); shots.whatsnew=await png(); await p.keyboard.press('Escape');
  await p.click('#theme'); shots.dark=await top();
  await ctx.close(); return {shots, info};
}

// ---- 4. the beta pages
function betaPages(info){
  const n=info.notes, notes=[].concat(n.added||[],n.changed||[],n.fixed||[]);
  const welcome=`<h2>Welcome, beta testers</h2>
<p>Thank you for testing Audit Pup. Use it the way you would during class, and tell us whenever something is confusing, wrong, or slow. Your reports decide what gets fixed next.</p>
<h3>In version ${esc(version)}</h3>
<table><tr><th>Case</th><th>Steps</th></tr>${info.cases.map(c=>`<tr><td><b>${esc(c.label)}</b></td><td>${c.steps.length} steps: ${esc(c.steps.join(', '))}</td></tr>`).join('')}</table>
${notes.length?'<h3>New in this version</h3><ul>'+notes.map(x=>`<li>${esc(x)}</li>`).join('')+'</ul>':''}`;
  const end=`<div class="section end"><h2>Testing checklist</h2>
<p>Please try as many of these as you can, and note anything that surprised you.</p>
<ul class="check">
<li>Open Audit Pup from your bookmark, pick a case, and check the first step with your own PDF.</li>
<li>Check a step you know has a mistake. Does the hint help you find it?</li>
<li>Check a step with the PDF from the step before. Does the yellow box name the right step?</li>
<li>Check the same PDF for two steps in a row. Do you see the same-file note?</li>
<li>Finish a step with a TS Note or worksheet entries, and tick or type them in.</li>
<li>Close Chrome, reopen Audit Pup, and confirm your progress is still there.</li>
<li>Switch to another case and back. Is each case's progress kept?</li>
<li>Zoom in with <b>Ctrl +</b> to 125% or 150%. Is everything still readable?</li>
<li>Try the dark theme, and open the What's new panel.</li>
<li>Was anything slow, confusing, or worded in a way you did not understand?</li>
</ul>
<h2 style="margin-top:14pt">How to report a problem</h2>
<p>Send your report to <b>${esc(contact)}</b>. Include:</p>
<ol>
<li>The <b>version</b> (on the Version button, top right) and your device and browser, for example "Chromebook, Chrome".</li>
<li>The <b>case</b> and <b>step</b>, and the name of the PDF you checked.</li>
<li>What you <b>expected</b>, and what Audit Pup <b>showed</b> (the line, its status, and the score).</li>
<li>A <b>screenshot</b> (on a Chromebook, <b>Ctrl + Show windows</b>), and if you can, the PDF itself. The practice cases use fabricated data, so the PDF is safe to share.</li>
</ol>
<div class="box warn"><b>Most important to report:</b> any line Audit Pup marks <b>Correct</b> when you know it is wrong. Audit Pup is built so that this never happens, so we want to hear about it right away.</div>
<p>Some hints are new and still being reviewed by instructors. If a hint seems wrong or unclear, please report that too.</p>
<h3>Known limits</h3>
<ul>
<li>Audit Pup checks only the lines and notes on the answer key. A mistake that changes no checked line (for example a wrong W-2 Medicare box) will not be caught.</li>
<li>TaxSlayer does not print TS Notes, so TS Note boxes and worksheet entries rely on you.</li>
<li>Some steps have the same answers by design, so their PDFs cannot be told apart. The same-file note covers the usual mix-up.</li>
<li>Progress is saved in one browser on one computer, and is erased if browsing data is cleared.</li>
</ul></div>`;
  return {welcome, end};
}

// ---- 5. put it together and print
(async()=>{ let browser;
  try{
    const { chromium }=require('playwright');
    browser=await chromium.launch(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{});
    const {shots, info}=await shoot(browser);
    const g=guideHtml(guideMd,shots), bp=beta?betaPages(info):null;
    const uri=(f,t)=>`data:${t};base64,`+fs.readFileSync(f).toString('base64');
    const css=fs.readFileSync(path.join(__dirname,'guide.css'),'utf8')
      .replace('__ATK400__',uri(path.join(A,'atkinson-400.woff2'),'font/woff2')).replace('__ATK700__',uri(path.join(A,'atkinson-700.woff2'),'font/woff2'))
      .replace('__BITTER__',uri(path.join(A,'bitter-800.woff2'),'font/woff2'));
    const kind=beta?'Beta Tester Guide':'Counselor Guide';
    const html=`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Audit Pup ${kind}</title><style>${css}</style></head><body>
<div class="cover"><img src="${uri(path.join(A,'seal_zeke.jpg'),'image/jpeg')}" alt="Audit Pup seal"><h1>Audit Pup</h1>
<div class="sub">${kind}<br>El Dorado County Tax-Aide training</div><div class="ver">Version ${esc(version)}</div>
<div class="url">https://jaycarterwells.github.io/audit-pup/</div>
<div class="small">${esc(g.title)}. Matches Audit Pup ${esc(version)} (released ${esc(date)}).<br>All case data is fabricated TaxSlayer Practice Lab data.</div></div>
<div class="section">${bp?bp.welcome:''}${g.html}</div>${bp?bp.end:''}</body></html>`;
    const p=await browser.newPage(); await p.setContent(html,{waitUntil:'load'}); await p.evaluate(()=>document.fonts.ready);
    const file=path.join(OUT,`Audit Pup ${kind} ${version}.pdf`);
    await p.pdf({path:file, format:'Letter', printBackground:true, preferCSSPageSize:true, displayHeaderFooter:true, headerTemplate:'<span></span>',
      footerTemplate:`<div style="font-size:8pt;color:#5d5a52;width:100%;text-align:center;font-family:Arial">Audit Pup ${esc(version)} ${kind} &nbsp;|&nbsp; Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`});
    console.log('wrote '+path.relative(ROOT,file));
  } finally { if(browser) await browser.close(); cleanup(); }
})().catch(e=>{ console.error(e); process.exit(1); });
