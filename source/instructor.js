/* ---------- Instructor mode: compare a counselor's final PDFs with the golden files ----------
   Turned on from the Instructor link at the bottom of the page with the passcode, and kept on in this browser until
   Leave instructor mode. The comparison itself is compare.js (pure functions, tested in Node); this file is only the
   screen: passcode, drop zone, the report, the spot pictures, and Copy report. build_html.js puts it into the page's
   script, so it uses the page's own helpers (esc, loadPages, ensurePdfjs, CASES, caseOfPages). */
var INSTR_KEY='auditpup.instructor', INSTR_PASSCODE='AARP', INSTR_MAX=5;
var instrCard=document.getElementById('instructor'), instrReport=document.getElementById('ireport'), instrInput=document.getElementById('ifile');
var instrFiles=[], instrGolden={};
function instructorOn(){ return !instrCard.classList.contains('hidden'); }
function showInstructor(on){
  instrCard.classList.toggle('hidden',!on);
  document.querySelectorAll('.student-only').forEach(function(el){ el.classList.toggle('hidden',on); });
  document.getElementById('instrlink').classList.toggle('hidden',on);
  try{ if(on) localStorage.setItem(INSTR_KEY,'1'); else localStorage.removeItem(INSTR_KEY); }catch(e){}
}
/* the golden return for a case, as pages the engine and compare.js read (built from cases/<case>/golden.json) */
function goldenPages(caseId){
  if(instrGolden[caseId]) return instrGolden[caseId];
  var g=GOLDEN_DATA[caseId]; if(!g) return null;
  instrGolden[caseId]=g.pages.map(function(p,i){ var items=p.map(function(a){ return {x:a[0], y:a[1], s:a[2]}; }); return {page:i+1, form:classifyPage(items), items:items}; });
  return instrGolden[caseId];
}

/* ----- passcode ----- */
var pcBack=document.getElementById('pcback'), pcLastFocus=null;
function openPasscode(){ pcLastFocus=document.activeElement; document.getElementById('pcerr').classList.add('hidden'); document.getElementById('pcinput').value='';
  pcBack.classList.remove('hidden'); document.getElementById('pcinput').focus(); }
function closePasscode(){ pcBack.classList.add('hidden'); if(pcLastFocus && pcLastFocus.focus) pcLastFocus.focus(); }
document.getElementById('instrlink').addEventListener('click',openPasscode);
document.getElementById('pcclose').addEventListener('click',closePasscode);
pcBack.addEventListener('click',function(e){ if(e.target===pcBack) closePasscode(); });
document.addEventListener('keydown',function(e){ if(e.key==='Escape' && !pcBack.classList.contains('hidden')) closePasscode(); });
document.getElementById('pcform').addEventListener('submit',function(e){
  e.preventDefault();
  if(document.getElementById('pcinput').value.trim().toUpperCase()!==INSTR_PASSCODE){ document.getElementById('pcerr').classList.remove('hidden'); document.getElementById('pcinput').focus(); return; }
  pcBack.classList.add('hidden'); showInstructor(true); document.getElementById('ihead').focus();
});
document.getElementById('ileave').addEventListener('click',function(){ showInstructor(false); instrFiles=[]; renderInstructor(); document.getElementById('instrlink').focus(); });

/* ----- choosing files: the Choose PDFs button, or dropping files anywhere on the page while Instructor mode is on ----- */
var idrop=document.getElementById('idrop');
idrop.addEventListener('click',function(){ instrInput.click(); });
document.getElementById('ichoose').addEventListener('click',function(e){ e.stopPropagation(); instrInput.click(); });
instrInput.addEventListener('change',function(e){ var fs=Array.prototype.slice.call(e.target.files||[]); try{ e.target.value=''; }catch(x){} if(fs.length) addInstructorFiles(fs); });
window.addEventListener('dragover',function(e){ if(!instructorOn()) return; e.preventDefault(); e.stopImmediatePropagation(); idrop.classList.add('over'); },true);
window.addEventListener('dragleave',function(e){ if(instructorOn() && !e.relatedTarget) idrop.classList.remove('over'); },true);
window.addEventListener('drop',function(e){ if(!instructorOn()) return; e.preventDefault(); e.stopImmediatePropagation(); idrop.classList.remove('over');
  var fs=e.dataTransfer && e.dataTransfer.files ? Array.prototype.slice.call(e.dataTransfer.files) : []; if(fs.length) addInstructorFiles(fs); },true);

/* Read each PDF, pick its case from the 1040 name, and compare it with that case's golden file. A second file for the same
   case replaces the first. */
async function addInstructorFiles(files){
  instrReport.dataset.state='busy';
  instrReport.innerHTML='<p class="ibusy" id="ibusy" role="status"></p>';
  var busy=document.getElementById('ibusy');
  /* say which file and case is being worked on, so the instructor sees progress */
  function working(i,what){ busy.textContent='Reading and comparing '+(i+1)+' of '+files.length+': '+what+' ...'; }
  try{ ensurePdfjs(); }catch(e){}
  for(var i=0;i<files.length;i++){
    var f=files[i], entry={name:f.name, caseId:null, result:null, err:null};
    working(i,f.name);
    await new Promise(function(r){ setTimeout(r,0); });   // let the message show before the work starts
    try{
      if(!/\.pdf$/i.test(f.name) && f.type!=='application/pdf') throw new Error('This is not a PDF file.');
      var buf=await f.arrayBuffer(); entry.bytes=buf.slice(0);
      var pages=await loadPages(buf);
      entry.caseId=caseOfPages(CASES,pages);
      if(entry.caseId){ working(i,'the '+caseShort(entry.caseId)+' case'); await new Promise(function(r){ setTimeout(r,0); }); }
      if(!entry.caseId) throw new Error('Audit Pup could not tell which case this PDF is for from the name on its Form 1040.');
      var golden=goldenPages(entry.caseId);
      if(!golden) throw new Error('There is no golden file for this case.');
      entry.result=compareReturn(golden,pages);
    }catch(err){ entry.err=err && err.message ? err.message : 'This PDF could not be read.'; }
    instrFiles=instrFiles.filter(function(x){ return !(entry.caseId && x.caseId===entry.caseId) && x.name!==entry.name; });
    instrFiles.push(entry);
  }
  instrFiles=instrFiles.slice(-INSTR_MAX);
  busy.textContent='Reading the comment library ...';
  await ensureLibrary();
  busy.textContent='Drawing the spots ...';
  renderInstructor();
  await drawSpots();
  instrReport.dataset.state='ready';
}

/* ----- the comment library (library.js): read once when the first report is made ----- */
var instrLib=null, instrLibLoading=null;
function fetchText(url){
  var ctl=window.AbortController ? new AbortController() : null, t=setTimeout(function(){ if(ctl) ctl.abort(); },5000);
  return fetch(url,{cache:'no-store', signal:ctl?ctl.signal:undefined}).then(function(r){ clearTimeout(t); if(!r.ok) throw new Error('HTTP '+r.status); return r.text(); },
    function(e){ clearTimeout(t); throw e; });
}
function libStore(){ try{ var s=window.localStorage; s.getItem(LIBRARY_KEY); return s; }catch(e){ return {getItem:function(){ return null; }, setItem:function(){}}; } }
function ensureLibrary(){
  if(!instrLibLoading) instrLibLoading=loadLibrary(fetchText, libStore(), LIBRARY_SNAPSHOT, CASES.map(function(c){ return c.short; }))
    .then(function(r){ instrLib=r; return r; });
  return instrLibLoading;
}
function libraryLine(){
  if(!instrLib) return '';
  var L=instrLib, when=L.from==='sheet' ? 'read just now' : (L.from==='saved' ? 'saved in this browser'+(L.readAt?' on '+new Date(L.readAt).toLocaleDateString('en-US',{month:'long', day:'numeric'}):'') : 'built into this version of Audit Pup');
  var h='<div class="ilib">Comment library '+esc(libraryName(L.lib))+', '+esc(when)+'. '+L.lib.comments.length+' comments.</div>';
  if(L.warning) h+='<div class="iwarn" role="status">'+esc(L.warning)+'</div>';
  if(L.lib.bad.length) h+='<details class="ibadrows"><summary>'+L.lib.bad.length+' library row'+(L.lib.bad.length===1?'':'s')+' Audit Pup could not use</summary><ul>'+
    L.lib.bad.map(function(b){ return '<li>Row '+b.row+': '+esc(b.why)+'</li>'; }).join('')+'</ul></details>';
  return h;
}
function caseOf(id){ return CASES.filter(function(c){ return c.id===id; })[0]; }
function stepName(caseId, step){ var c=caseOf(caseId), s=c && c.steps.filter(function(x){ return x.id===step; })[0]; return s ? s.name : (step ? 'Step '+step : 'Other comments'); }
/* one library comment the instructor can tick and then edit; the text is plain text, never HTML */
function pickHtml(caseId, c, value){
  var t=fillValue(c.comment, value);
  return '<div class="ipick"><label><input type="checkbox" class="ipickbox" data-case="'+esc(caseId)+'" data-step="'+esc(c.step)+'"> '+
    '<span class="istep">'+esc(c.step?'Step '+c.step:'Any step')+'</span>'+(/^check before use$/i.test(c.status)?' <span class="itag">Check before use</span>':'')+' <span class="itext">'+esc(t)+'</span></label>'+
    '<textarea class="iedit hidden" rows="3" aria-label="Edit this comment for the letter">'+esc(t)+'</textarea></div>';
}
/* the comments under one report row (or a missing or extra page): the 3 best first, the rest folded */
function suggestionHtml(caseId, row, value){
  var cn=caseShort(caseId), list=instrLib ? suggestionsFor(instrLib.lib, cn, row) : [];
  var h='<div class="isug">';

  list.slice(0,3).forEach(function(c){ h+=pickHtml(caseId,c,value); });
  if(list.length>3) h+='<details class="imore"><summary>More comments for '+esc(row.name)+' ('+(list.length-3)+')</summary>'+list.slice(3).map(function(c){ return pickHtml(caseId,c,value); }).join('')+'</details>';
  h+='<div class="iacts">'+(list.length?'':'<span class="inone">No library comments for '+esc(row.name)+'.</span> ')+'<button type="button" class="ilink iwrite" data-case="'+esc(caseId)+'">Write a comment</button>';
  var link=libraryFormLink({caseName:cn, form:row.name, line:row.label||''});
  if(link) h+=' <a class="ilink" href="'+esc(link)+'" target="_blank" rel="noopener">Add to library</a>';
  return h+'</div></div>';
}
/* a comment the instructor writes, with the step it goes under in the letter */
function writeBox(caseId){
  var c=caseOf(caseId), d=document.createElement('div'); d.className='icustom';
  var opts=(c?c.steps:[]).map(function(s){ return '<option value="'+esc(s.id)+'">Step '+esc(s.id)+'</option>'; }).join('');
  d.innerHTML='<label>Step <select class="icstep" data-case="'+esc(caseId)+'"><option value="">Other</option>'+opts+'</select></label>'+
    '<textarea class="ictext" rows="3" aria-label="Your comment for the letter"></textarea>';
  return d;
}
/* the TS Notes the case expects: TaxSlayer does not print them, so the instructor checks them live in TaxSlayer */
function tsNotes(caseId){
  var c=caseOf(caseId), out=[]; if(!c) return out;
  var seen={};   /* a note listed at two steps (Quinn's one TS Note, at E and F) is one item, at its first step */
  c.steps.forEach(function(s){ (s.notes||[]).forEach(function(id){ var N=c.notes[id];
    if(N && N.kind==='confirm' && (N.chip||id)==='NN' && !seen[id]){ seen[id]=1; out.push({id:id, step:s.id, example:N.example||''}); } }); });
  return out;
}
function tsHtml(fi, caseId){
  var list=tsNotes(caseId); if(!list.length) return '';
  var h='<fieldset class="itsn"><legend>TS Notes checklist</legend><p class="ilead2">TaxSlayer does not print TS Notes. Open the return in TaxSlayer and mark each one.</p>';
  list.forEach(function(t,k){ var nm='its-'+fi+'-'+k;
    h+='<div class="itsrow" data-case="'+esc(caseId)+'" data-step="'+esc(t.step)+'" data-example="'+esc(t.example)+'"><span class="itsname">Step '+esc(t.step)+' TS Note</span>'+
      '<label><input type="radio" name="'+nm+'" value="found"> Found</label><label><input type="radio" name="'+nm+'" value="missing"> Missing</label></div>'; });
  return h+'</fieldset>';
}
/* everything the instructor chose, for the letter */
function letterPicks(){
  var out=[];
  Array.prototype.forEach.call(instrReport.querySelectorAll('input.ipickbox:checked'),function(b){
    var t=b.closest('.ipick').querySelector('textarea').value.trim(); if(t) out.push({caseName:caseShort(b.dataset.case), step:b.dataset.step, stepName:stepName(b.dataset.case,b.dataset.step), text:t}); });
  Array.prototype.forEach.call(instrReport.querySelectorAll('.icustom'),function(d){
    var t=d.querySelector('textarea').value.trim(), s=d.querySelector('select'); if(t) out.push({caseName:caseShort(s.dataset.case), step:s.value, stepName:stepName(s.dataset.case,s.value), text:t}); });
  Array.prototype.forEach.call(instrReport.querySelectorAll('.itsrow'),function(r){
    var m=r.querySelector('input[value="missing"]'); if(!m.checked) return;
    out.push({caseName:caseShort(r.dataset.case), step:r.dataset.step, stepName:stepName(r.dataset.case,r.dataset.step),
      text:'The TS Note for this step is missing.'+(r.dataset.example?' An example of what is needed: '+r.dataset.example:'')}); });
  return out;
}
function copyLetter(){
  var txt=feedbackLetter(studentLine().who, letterPicks()), pre=document.getElementById('iletter');
  pre.textContent=txt; pre.classList.remove('hidden');
  var done=function(){ var c=document.getElementById('icopied'); c.textContent='Feedback letter copied.'; c.classList.remove('hidden'); };
  try{ navigator.clipboard.writeText(txt).then(done,function(){ copyFallback(txt); done(); }); }catch(e){ copyFallback(txt); done(); }
}

/* ----- the report ----- */
function caseShort(id){ var c=CASES.filter(function(x){ return x.id===id; })[0]; return c ? c.short : id; }
function ruleName(id){ if(id==='mixed') return 'More than one kind on the unreported list'; var r=UNREPORTED.filter(function(x){ return x.id===id; })[0]; return r ? r.name : id; }
/* cases in alphabetical order by name; files Audit Pup could not read come last */
function reportOrder(){
  return instrFiles.slice().sort(function(a,b){ var na=a.caseId?caseShort(a.caseId):'~'+a.name, nb=b.caseId?caseShort(b.caseId):'~'+b.name; return na<nb?-1:na>nb?1:0; });
}
function studentLine(){
  var who=studentInitials(instrFiles.map(function(f){ return f.name; }), CASES.map(function(c){ return c.short; }));
  var printed={}; instrFiles.forEach(function(f){ if(f.result && f.result.printed) printed[f.result.printed]=true; });
  return {who:who, printed:Object.keys(printed)};
}
function caseHeadline(r){
  var pc=function(list){ return list.reduce(function(s,p){ return s+1+p.also.length; },0); }, nm=pc(r.missingPages), ne=pc(r.extraPages);
  var n=r.rows.length, parts=[n===0?'no differences':n+' difference'+(n===1?'':'s')];
  if(nm) parts.push(nm+' page'+(nm===1?'':'s')+' missing');
  if(ne) parts.push(ne+' extra page'+(ne===1?'':'s'));
  return parts.join(', ');
}
function renderInstructor(){
  if(!instrFiles.length){ instrReport.innerHTML=''; instrReport.dataset.state='ready'; return; }
  var s=studentLine(), h='<div class="ihdr"><div><div class="iwho">Counselor: '+esc(s.who)+'</div>'+
    '<div class="isub">'+instrFiles.length+' PDF'+(instrFiles.length===1?'':'s')+(s.printed.length?', printed '+esc(s.printed.join(', ')):'')+'</div></div>'+
    '<div class="ibtns"><button type="button" class="choose" id="icopy">Copy report</button> <button type="button" class="choose" id="iletterbtn">Copy feedback letter</button></div></div>'+
    libraryLine()+'<div class="icopied hidden" id="icopied" role="status">Report copied.</div><pre class="iletter hidden" id="iletter" tabindex="0" aria-label="The feedback letter"></pre>';
  reportOrder().forEach(function(f,fi){
    h+='<section class="icase">';
    if(f.err){ h+='<h3>'+esc(f.name)+'</h3><p class="ierr">'+esc(f.err)+'</p></section>'; return; }
    var r=f.result, forms={};
    h+='<h3>'+esc(caseShort(f.caseId))+': '+esc(caseHeadline(r))+'</h3><div class="ifile">'+esc(f.name)+'</div>';
    if(r.missingPages.length||r.extraPages.length||r.rows.length){
      h+='<div class="itable" tabindex="0"><table><thead><tr><th scope="col">Form and page</th><th scope="col">Line or box</th><th scope="col">Golden</th><th scope="col">Counselor</th><th scope="col">The spot</th></tr></thead><tbody>';
      var sug=function(row,value){ forms[row.name]=1; return '<tr class="isugrow"><td colspan="5">'+suggestionHtml(f.caseId,row,value)+'</td></tr>'; };
      r.missingPages.forEach(function(p){ h+='<tr class="idiff"><td>'+esc(p.name)+' (golden p. '+[p.page].concat(p.also).join(', ')+')</td><td>Whole page</td><td>printed</td><td class="ibad">missing</td><td></td></tr>'+sug({name:p.name, label:'Whole page', golden:'', student:''},''); });
      r.extraPages.forEach(function(p){ h+='<tr class="idiff"><td>'+esc(p.name)+' (p. '+[p.page].concat(p.also).join(', ')+')</td><td>Whole page</td><td>not printed</td><td class="ibad">extra</td><td></td></tr>'+sug({name:p.name, label:'Whole page', golden:'', student:''},''); });
      r.rows.forEach(function(d,di){
        h+='<tr class="idiff"><td>'+esc(d.name)+' (p. '+d.page+')'+(d.also.length?'<div class="ialso">Also on p. '+esc(d.also.join(', '))+'</div>':'')+'</td><td>'+esc(d.label||'')+'</td><td>'+(d.golden?esc(d.golden):'<i>blank</i>')+'</td><td class="ibad">'+(d.student?esc(d.student):'<i>blank</i>')+'</td>'+
           '<td><img class="ispot" alt="The spot on page '+d.page+' of the counselor\'s PDF" data-f="'+fi+'" data-d="'+di+'"></td></tr>'+sug(d,d.student); });
      h+='</tbody></table></div>';
    }
    if(instrLib){
      var other=otherComments(instrLib.lib, caseShort(f.caseId), Object.keys(forms));
      if(other.length) h+='<details class="iother"><summary>Other '+esc(caseShort(f.caseId))+' comments ('+other.length+'): for mistakes the PDF does not show, or forms with no difference above</summary>'+
        other.map(function(c){ return pickHtml(f.caseId,c,''); }).join('')+'</details>';
    }
    h+=tsHtml(fi,f.caseId);
    h+='<div class="iacts"><button type="button" class="ilink iwrite" data-case="'+esc(f.caseId)+'">Write a comment for '+esc(caseShort(f.caseId))+'</button></div>';
    if(r.unreported.length){
      h+='<details class="iunrep"><summary>'+r.unreported.length+' unreported difference'+(r.unreported.length===1?'':'s')+'</summary><ul>';
      r.unreported.forEach(function(d){ h+='<li>'+esc(d.name)+' (p. '+d.page+'): '+esc(d.golden||'blank')+' / '+esc(d.student||'blank')+' <span class="irule">('+esc(ruleName(d.rule))+')</span></li>'; });
      h+='</ul></details>';
    }
    h+='</section>';
  });
  instrReport.innerHTML=h;
  document.getElementById('icopy').addEventListener('click',copyReport);
  document.getElementById('iletterbtn').addEventListener('click',copyLetter);
}
/* ticking a comment opens its words for editing; Write a comment adds a box under the button */
instrReport.addEventListener('change',function(e){
  if(e.target.classList && e.target.classList.contains('ipickbox')){ var pk=e.target.closest('.ipick'); pk.classList.toggle('on',e.target.checked); pk.querySelector('textarea').classList.toggle('hidden',!e.target.checked); }
});
instrReport.addEventListener('click',function(e){
  var b=e.target.closest ? e.target.closest('.iwrite') : null; if(!b) return;
  var box=writeBox(b.dataset.case); b.parentNode.parentNode.insertBefore(box,b.parentNode.nextSibling); box.querySelector('textarea').focus();
});
/* the report as plain text, for notes or an email */
function reportText(){
  var s=studentLine(), out=['Audit Pup Instructor report','Counselor: '+s.who+(s.printed.length?' (printed '+s.printed.join(', ')+')':''),''];
  reportOrder().forEach(function(f){
    if(f.err){ out.push(f.name+': '+f.err,''); return; }
    var r=f.result; out.push(caseShort(f.caseId)+': '+caseHeadline(r));
    r.missingPages.forEach(function(p){ out.push('  Missing page: '+p.name); });
    r.extraPages.forEach(function(p){ out.push('  Extra page: '+p.name+' (p. '+[p.page].concat(p.also).join(', ')+')'); });
    r.rows.forEach(function(d){ out.push('  '+d.name+' (p. '+d.page+(d.also.length?'; also p. '+d.also.join(', '):'')+')'+(d.label?', '+d.label:'')+': golden '+(d.golden||'blank')+'; counselor '+(d.student||'blank')); });
    if(r.unreported.length) out.push('  ('+r.unreported.length+' unreported differences not listed)');
    out.push('');
  });
  return out.join('\n');
}
function copyReport(){
  var txt=reportText(), done=function(){ var c=document.getElementById('icopied'); c.textContent='Report copied.'; c.classList.remove('hidden'); };
  try{ navigator.clipboard.writeText(txt).then(done,function(){ copyFallback(txt); done(); }); }catch(e){ copyFallback(txt); done(); }
}
function copyFallback(txt){ var t=document.createElement('textarea'); t.value=txt; document.body.appendChild(t); t.select(); try{ document.execCommand('copy'); }catch(e){} t.remove(); }

/* ----- the spot: a small picture of each difference's area on the counselor's page ----- */
async function drawSpots(){
  var imgs=Array.prototype.slice.call(instrReport.querySelectorAll('img.ispot')), order=reportOrder(), docs={}, pageCanvas={};
  for(var i=0;i<imgs.length;i++){
    var img=imgs[i], f=order[+img.dataset.f], d=f && f.result ? f.result.rows[+img.dataset.d] : null;
    if(!d || !f.bytes) continue;
    try{
      if(!docs[img.dataset.f]) docs[img.dataset.f]=await window.pdfjsLib.getDocument({data:new Uint8Array(f.bytes.slice(0)), isEvalSupported:false, verbosity:0}).promise;
      var key=img.dataset.f+'.'+d.page, pc=pageCanvas[key];
      if(!pc){ var pg=await docs[img.dataset.f].getPage(d.page), vp=pg.getViewport({scale:2}), cv=document.createElement('canvas');
        cv.width=vp.width; cv.height=vp.height; await pg.render({canvasContext:cv.getContext('2d'), viewport:vp}).promise; pc=pageCanvas[key]={cv:cv, vp:vp}; }
      var a=pc.vp.convertToViewportPoint(Math.max(0,d.x-24),d.y+22), b=pc.vp.convertToViewportPoint(d.x+176,d.y-14);
      var w=Math.round(Math.min(pc.cv.width,b[0])-a[0]), hgt=Math.round(b[1]-a[1]), out=document.createElement('canvas');
      out.width=Math.max(1,w); out.height=Math.max(1,hgt);
      var ctx=out.getContext('2d'); ctx.drawImage(pc.cv,a[0],a[1],w,hgt,0,0,w,hgt);
      var m=pc.vp.convertToViewportPoint(d.x-3,d.y+11); ctx.strokeStyle='#b8892c'; ctx.lineWidth=3; ctx.strokeRect(m[0]-a[0],m[1]-a[1],Math.min(w-(m[0]-a[0])-3,300),30);
      /* the PDF page number in the corner, so the instructor can find the place in the PDF */
      var tag='PDF page '+d.page; ctx.font='bold 22px sans-serif'; var tw=ctx.measureText(tag).width+16;
      ctx.fillStyle='#2a2e35'; ctx.fillRect(w-tw,0,tw,30); ctx.fillStyle='#ffffff'; ctx.fillText(tag,w-tw+8,22);
      img.src=out.toDataURL('image/png');
    }catch(e){ img.alt='The spot could not be drawn'; }
  }
  Object.keys(docs).forEach(function(k){ try{ docs[k].destroy(); }catch(e){} });
}

/* open in Instructor mode when it was left on in this browser */
(function(){ var on=false; try{ on=localStorage.getItem(INSTR_KEY)==='1'; }catch(e){} if(on) showInstructor(true); })();
