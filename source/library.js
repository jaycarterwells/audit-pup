/* Instructor mode's comment library: the one part that knows where comments come from. It reads the library (a Google
   Sheet published as CSV, or the copy built into this release), finds the comments for a report row, fills in the
   counselor's value, makes the Add to library link, and writes the feedback letter. Moving the library somewhere else
   later changes only this file. Pure functions, except loadLibrary(), which is given its network and storage. */

/* Where the library lives. Empty until the instructors publish their Sheet: then Audit Pup uses only the copy built into
   this release (LIBRARY_SNAPSHOT) and makes no network call. comments: the CSV link of the comments tab; version: the CSV
   link of the Version tab (columns Version, Date). */
var LIBRARY_SOURCE={ comments:'', version:'' };
/* The Google Form that adds a comment. Empty until it exists: then Add to library is not shown. fields: the form's
   entry ids (entry.123456) for the answers Audit Pup fills in. */
var LIBRARY_FORM={ url:'', fields:{ caseName:'', step:'', form:'', line:'' } };
var LIBRARY_KEY='auditpup.library.v1';   /* the last copy read from the Sheet, kept in this browser */
var LIBRARY_COLUMNS=['Case','Step','Form','Line or box','Comment','Status'];

/* CSV as Google Sheets writes it: commas, double quotes around a cell that has a comma, quote or line break, "" for a quote */
function parseCsv(text){
  var rows=[], row=[], cell='', q=false, i=0, s=String(text||'').replace(/^\uFEFF/,'');
  for(;i<s.length;i++){ var ch=s.charAt(i);
    if(q){ if(ch==='"'){ if(s.charAt(i+1)==='"'){ cell+='"'; i++; } else q=false; } else cell+=ch; continue; }
    if(ch==='"') q=true;
    else if(ch===','){ row.push(cell); cell=''; }
    else if(ch==='\n' || ch==='\r'){ if(ch==='\r' && s.charAt(i+1)==='\n') i++; row.push(cell); rows.push(row); row=[]; cell=''; }
    else cell+=ch; }
  if(cell!=='' || row.length){ row.push(cell); rows.push(row); }
  return rows.filter(function(r){ return r.some(function(c){ return c.trim()!==''; }); });
}

/* The library from its two CSV tabs. Columns are found by their header names, in any order; a row it cannot use is
   listed with the reason, never guessed at. Retired comments are left out. caseNames: the case names Audit Pup knows. */
function readLibrary(commentsCsv, versionCsv, caseNames){
  var out={version:null, date:null, comments:[], bad:[], retired:0, error:null};
  var v=parseCsv(versionCsv||'');
  if(v.length>1){ var vh=v[0].map(function(h){ return h.trim().toLowerCase(); });
    out.version=(v[1][vh.indexOf('version')]||'').trim()||null; out.date=(v[1][vh.indexOf('date')]||'').trim()||null; }
  var rows=parseCsv(commentsCsv||'');
  if(!rows.length){ out.error='The comment library is empty.'; return out; }
  var head=rows[0].map(function(h){ return h.trim().toLowerCase(); }), col={};
  LIBRARY_COLUMNS.forEach(function(c){ col[c]=head.indexOf(c.toLowerCase()); });
  var lost=LIBRARY_COLUMNS.filter(function(c){ return col[c]<0 && c!=='Status'; });
  if(lost.length){ out.error='The comment library has no column named '+lost.join(', ')+'.'; return out; }
  var names={}; (caseNames||[]).forEach(function(n){ names[n.toLowerCase()]=n; });
  rows.slice(1).forEach(function(r,i){
    var get=function(c){ return col[c]<0 ? '' : String(r[col[c]]||'').replace(/\s+/g,' ').trim(); };
    var c={id:i+2, caseName:names[get('Case').toLowerCase()]||null, step:get('Step').toUpperCase(), form:get('Form'), line:get('Line or box'),
      comment:get('Comment'), status:get('Status')||'Active'};
    if(/^retired$/i.test(c.status)){ out.retired++; return; }
    if(!c.caseName){ out.bad.push({row:c.id, why:get('Case') ? 'unknown case "'+get('Case')+'"' : 'no case'}); return; }
    if(!c.comment){ out.bad.push({row:c.id, why:'no comment'}); return; }
    out.comments.push(c);
  });
  return out;
}

/* Words that tie a comment to a report row: numbers, and words of 4 or more letters, from its line or box and its text */
function libWords(s){ return (String(s||'').toUpperCase().match(/[A-Z]{4,}|\d[\d,.]*\d|\d/g)||[]).map(function(w){ return w.replace(/,/g,''); }); }
var LIB_SKIP={FORM:1,LINE:1,LINES:1,BOXES:1,ENTER:1,ENTERED:1,SHOULD:1,THIS:1,THAT:1,WITH:1,FROM:1,WAS:1,NOT:1,THE:1,TAXSLAYER:1,
  RETURN:1,PAPER:1,AMOUNT:1,CHECKED:1,FORGOT:1,BECAUSE:1,SINCE:1,THERE:1,WHICH:1,THEY:1,THEIR:1,HAVE:1,WHOLE:1,PAGE:1};
/* The library's comments for one report row: same case and form, the ones sharing the most words with the row first,
   then in step order. row: {name, label, golden, student} as compare.js makes it. */
function suggestionsFor(lib, caseName, row){
  var text=' '+[row.label,row.golden,row.student].join(' ').toUpperCase().replace(/,/g,'')+' ';
  var form=String(row.name||'').toLowerCase();
  return lib.comments.filter(function(c){ return c.caseName===caseName && c.form && c.form.toLowerCase()===form; })
    .map(function(c){ var seen={}, score=0;
      libWords(c.line+' '+c.comment).forEach(function(w){ if(seen[w] || LIB_SKIP[w]) return; seen[w]=1; if(text.indexOf(' '+w+' ')>=0 || (w.length>=4 && text.indexOf(w)>=0)) score++; });
      return {c:c, score:score}; })
    .sort(function(a,b){ return b.score-a.score || stepOrder(a.c.step)-stepOrder(b.c.step) || a.c.id-b.c.id; })
    .map(function(x){ return x.c; });
}
/* The case's comments that are not tied to any form in this report: the PDF cannot show them, or nothing on that form differs */
function otherComments(lib, caseName, formsInReport){
  var on={}; formsInReport.forEach(function(f){ on[String(f).toLowerCase()]=1; });
  return lib.comments.filter(function(c){ return c.caseName===caseName && !(c.form && on[c.form.toLowerCase()]); })
    .sort(function(a,b){ return stepOrder(a.step)-stepOrder(b.step) || a.id-b.id; });
}
/* Step letters in order: A, B, ..., R, R2, S */
function stepOrder(s){ var m=/^([A-Z])(\d*)$/.exec(s||''); return m ? (m[1].charCodeAt(0)-64)*10+(+m[2]||0) : 999; }

/* A comment's $xxxx filled in with the counselor's value (a number gets commas: 970 becomes $970, 1520 becomes $1,520) */
function fillValue(text, value){
  if(!/\$x{3,}/i.test(text)) return text;
  var v=String(value==null?'':value).trim(), n=v.replace(/[$,]/g,'');
  var shown=v==='' ? 'blank' : (/^-?\d+(\.\d+)?$/.test(n) ? '$'+(+n).toLocaleString('en-US') : v);
  return text.replace(/\$x{3,}/ig, shown);
}

/* The Add to library link: the Google Form with the case, step, form and line already filled in; null until the form exists */
function libraryFormLink(what){
  if(!LIBRARY_FORM.url) return null;
  var f=LIBRARY_FORM.fields, q=[];
  [['caseName',what.caseName],['step',what.step],['form',what.form],['line',what.line]].forEach(function(p){
    if(f[p[0]] && p[1]) q.push(encodeURIComponent(f[p[0]])+'='+encodeURIComponent(p[1])); });
  return LIBRARY_FORM.url+(LIBRARY_FORM.url.indexOf('?')<0?'?':'&')+'usp=pp_url'+(q.length?'&'+q.join('&'):'');
}

/* The library to use, and what the report header says about it. Tries the Sheet (when LIBRARY_SOURCE is set), then the
   last copy saved in this browser, then the copy built into the release. getText(url) returns a Promise of the text;
   store is localStorage or a stand-in; snapshot is LIBRARY_SNAPSHOT. Never fails: the built-in copy is always there. */
function loadLibrary(getText, store, snapshot, caseNames, now){
  var built=readLibrary(snapshot.comments, snapshot.version, caseNames);
  var saved=null; try{ saved=JSON.parse(store.getItem(LIBRARY_KEY)||'null'); }catch(e){ saved=null; }
  var savedLib=saved && saved.comments ? readLibrary(saved.comments, saved.version, caseNames) : null;
  var fallback=function(why){
    var use=savedLib && !savedLib.error ? {lib:savedLib, from:'saved', readAt:saved.readAt} : {lib:built, from:'built-in', readAt:null};
    use.warning=why ? 'The comment library could not be reached. Using '+libraryName(use.lib)+(use.from==='saved' ? ', saved in this browser,' : ', built into this version of Audit Pup,')+' which may be out of date.' : null;
    return use; };
  if(!LIBRARY_SOURCE.comments) return Promise.resolve(fallback(null));
  return Promise.all([getText(LIBRARY_SOURCE.comments), LIBRARY_SOURCE.version ? getText(LIBRARY_SOURCE.version) : Promise.resolve('')])
    .then(function(t){
      var lib=readLibrary(t[0], t[1], caseNames);
      if(lib.error) return fallback(lib.error);
      var before=(savedLib && !savedLib.error ? savedLib : built).comments.length, res={lib:lib, from:'sheet', readAt:now||Date.now(), warning:null};
      if(lib.comments.length < before*0.7) res.warning='The comment library has far fewer comments than before ('+lib.comments.length+', was '+before+'). Check the Sheet before using it.';
      try{ store.setItem(LIBRARY_KEY, JSON.stringify({comments:t[0], version:t[1], readAt:res.readAt})); }catch(e){}
      return res; },
      function(){ return fallback('unreachable'); });
}
/* "version 7 (December 2, 2026)" */
function libraryName(lib){
  var d=lib.date && /^\d{4}-\d{2}-\d{2}$/.test(lib.date) ? new Date(lib.date+'T12:00:00').toLocaleDateString('en-US',{month:'long', day:'numeric', year:'numeric'}) : lib.date;
  return 'version '+(lib.version||'unknown')+(d?' ('+d+')':'');
}

/* The feedback letter: the chosen comments grouped by case (alphabetical) and step (in order), in the style of the
   instructors' comments document. picks: [{caseName, step, stepName, text}] */
function feedbackLetter(who, picks){
  var out=['Homework Problem Review','Counselor: '+who,''], byCase={};
  picks.forEach(function(p){ (byCase[p.caseName]=byCase[p.caseName]||[]).push(p); });
  Object.keys(byCase).sort().forEach(function(cn){
    out.push(cn+':');
    var steps={}, list=[];
    byCase[cn].forEach(function(p){ if(!steps[p.step]){ steps[p.step]={step:p.step, name:p.stepName, items:[]}; list.push(steps[p.step]); } steps[p.step].items.push(p.text); });
    list.sort(function(a,b){ return stepOrder(a.step)-stepOrder(b.step); });
    list.forEach(function(s){ out.push(s.name || (s.step ? 'Step '+s.step : 'Other comments')); s.items.forEach(function(t){ out.push('\t'+t); }); out.push(''); });
  });
  if(!picks.length) out.push('No comments chosen.');
  return out.join('\n').replace(/\n+$/,'\n');
}
