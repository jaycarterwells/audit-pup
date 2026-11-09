/* Audit Pup reading engine. Pure functions with no page or browser use: they read amounts from the text of TaxSlayer PDF pages
   and match them to an answer key. build_html.js puts this file into the page; tests/engine.js loads it in Node without a browser. */
function parseNum(str){
  if(str==null) return null;
  var s=String(str).replace(/\s+/g,'');
  if(s==='.'||s==='') return null;
  var neg=/^\(.*\)$/.test(s)||/^-/.test(s);
  s=s.replace(/[()$,-]/g,'');
  var m=s.match(/^(\d+)(?:\.(\d{2}))?$/);
  if(!m) return null;
  var v=parseInt(m[1],10);
  return neg?-v:v;
}

function isMoney(s){ return parseNum(s)!==null && s!=='00' && s!=='.'; }


function rowsOf(items,tol){
  tol=tol||4;
  var sorted=items.slice().sort(function(a,b){return b.y-a.y||a.x-b.x;});
  var out=[];
  sorted.forEach(function(it){
    var r=null;
    for(var i=0;i<out.length;i++){ if(Math.abs(out[i].y-it.y)<=tol){r=out[i];break;} }
    if(!r){ r={y:it.y,items:[]}; out.push(r); }
    r.items.push(it); r.y=(r.y*(r.items.length-1)+it.y)/r.items.length;
  });
  out.forEach(function(r){ r.items.sort(function(a,b){return a.x-b.x;}); r.text=r.items.map(function(i){return i.s;}).join(' '); });
  return out;
}

function fedValue(pages,token,labelRe,needToken){
  for(var p=0;p<pages.length;p++){ if(pages[p].form!=='fed') continue;
    var rs=rowsOf(pages[p].items,4);
    for(var i=0;i<rs.length;i++){ var r=rs[i];
      if(!labelRe.test(r.text)) continue;
      if(needToken && !r.items.some(function(it){return it.s===token;})) continue;
      var nums=r.items.filter(function(it){return it.x>=430 && isMoney(it.s) && it.s!==token;});
      if(nums.length) return parseNum(nums[nums.length-1].s);
      return null;
    }
  }
  return undefined;
}

function caValue(pages,form,token,valueMin,tokXMin,tokXMax,tol){
  tokXMin=tokXMin||0; tokXMax=tokXMax||470; tol=tol||9;
  var sawLine=false;
  for(var p=0;p<pages.length;p++){ if(pages[p].form!==form) continue;
    var toks=pages[p].items.filter(function(it){return it.s===token && it.x>=tokXMin && it.x<=tokXMax;});
    if(toks.length) sawLine=true;
    var vals=pages[p].items.filter(function(it){return it.x>=valueMin && isMoney(it.s);});
    var best=null;
    toks.forEach(function(t){ vals.forEach(function(v){
      var dy=Math.abs(v.y-t.y);
      if(dy<=tol && (!best||dy<best.dy||(dy===best.dy && v.x>best.v.x))) best={dy:dy,v:v};
    });});
    if(best) return parseNum(best.v.s);
  }
  return sawLine?null:undefined;   /* line printed but empty = blank; line not found = undefined */
}

/* N1 helpers: filing status box checked on the 1040, and the dependent row in TaxSlayer's client summary */
function filingStatus(pages){
  var re=/^(Single|Married filing jointly|Married filing separately|Head of household|Qualifying surviving spouse)/;
  for(var p=0;p<pages.length;p++){ if(pages[p].form!=='fed') continue;
    var its=pages[p].items, labels=its.filter(function(i){return re.test(i.s);}), xs=its.filter(function(i){return i.s==='X';});
    for(var a=0;a<labels.length;a++) for(var b=0;b<xs.length;b++){
      var gap=labels[a].x-xs[b].x;
      if(Math.abs(xs[b].y-labels[a].y)<=4 && gap>0 && gap<30) return labels[a].s.match(re)[1];
    }
  }
  for(var q=0;q<pages.length;q++){ var rs=rowsOf(pages[q].items,4);
    for(var i=0;i<rs.length;i++){ var m=rs[i].text.match(/^STATUS\s*:\s*([A-Z ]+)$/);
      if(m){ var t=m[1].trim().toLowerCase(); return t.charAt(0).toUpperCase()+t.slice(1); } } }
  return null;
}

function dependentInfo(pages,first){
  var re=/^(.+?)\s+\d{2}\/\d{2}\/\d{4}\s+\d+\s+\S+\s+([A-Z][A-Z ]*?)\s+(\d{1,2})$/;
  for(var p=0;p<pages.length;p++){ var rs=rowsOf(pages[p].items,4);
    for(var i=0;i<rs.length;i++){ var m=rs[i].text.match(re);
      if(m && m[1].toUpperCase().indexOf(first)===0) return {name:m[1], rel:m[2], months:parseInt(m[3],10)}; } }
  for(var q=0;q<pages.length;q++){ if(pages[q].form!=='fed') continue;
    if(pages[q].items.some(function(i){return i.s.toUpperCase()===first;})) return {name:first, rel:null, months:null}; }
  return null;
}

/* Identify the form on a page from its printed header. Any page we do not
   recognize is marked 'other' and ignored, so extra or new forms are harmless. */
function classifyPage(items){
  var lead=items.slice(0,14).map(function(i){return i.s;}).join(' ').replace(/\s+/g,' ');
  if(/^\d{7} (Side \d+ )?Form 540 \d{4}/.test(lead)) return 'ca540';
  if(/^\d{7} (Side \d+ )?FTB 3514 \d{4}/.test(lead)) return 'ca3514';
  if(/^Form 1040(-SR)?\b.{0,24}U\.S\. (Individual )?Income Tax Return/.test(lead)) return 'fed';
  if(/^Form 1040(-SR)? \(\d{4}\) Page \d/.test(lead)) return 'fed';
  var sch=lead.match(/^SCHEDULE ([123A]) \(Form 1040\)/)||lead.match(/^Schedule ([123A]) \(Form 1040\) \d{4} Page \d/);
  if(sch) return 'sch'+sch[1];
  if(/^Form 8880 Department of the Treasury/.test(lead)) return 'f8880';
  return 'other';
}

/* Generic reader for IRS forms whose amount sits just right of a line-number box (Form 1040 boxes,
   Schedules 1, 2, 3, A, Form 8880). The box label is found by its exact text inside the box column
   (x from xMin to xMax). If the same box appears more than once with different amounts, the line is
   reported as unread rather than guessed. Returns a number, null (box printed but empty), or
   undefined (box not found). */
function boxValue(pages,form,token,xMin,xMax){
  xMin=xMin||370; xMax=xMax||500;
  var saw=false, vals=[];
  for(var p=0;p<pages.length;p++){ if(pages[p].form!==form) continue;
    var its=pages[p].items;
    its.forEach(function(t){
      if(t.s!==token || t.x<xMin || t.x>xMax) return;
      saw=true;
      var row=its.filter(function(i){ return Math.abs(i.y-t.y)<=4 && i.x>t.x+3 && i.x<t.x+140 && isMoney(i.s); });
      row.sort(function(a,b){return a.x-b.x;});
      vals.push(row.length?parseNum(row[row.length-1].s):null);
    });
  }
  if(!saw) return undefined;
  var nums=vals.filter(function(v){return v!==null;});
  if(!nums.length) return null;
  return nums.every(function(v){return v===nums[0];}) ? nums[0] : undefined;
}

/* The taxpayer's Identity Protection PIN, printed one digit per box beside the 1040 signature line */
function ipPin(pages){
  for(var p=0;p<pages.length;p++){ if(pages[p].form!=='fed') continue;
    var its=pages[p].items, lab=its.filter(function(i){return i.s==='Protection PIN, enter it here';})[0];
    if(!lab) continue;
    var d=its.filter(function(i){ return /^\d$/.test(i.s) && i.x>lab.x+30 && i.x<lab.x+120 && i.y<lab.y && i.y>lab.y-18; });
    d.sort(function(a,b){return a.x-b.x;});
    return d.map(function(i){return i.s;}).join('');
  }
  return null;
}

/* Child tax credit box for the first dependent on the 1040 (an X just left of the "Child tax" label) */
function firstDependentCTC(pages){
  for(var p=0;p<pages.length;p++){ if(pages[p].form!=='fed') continue;
    var its=pages[p].items, labs=its.filter(function(i){return i.s==='Child tax';});
    if(!labs.length) continue;
    labs.sort(function(a,b){return a.x-b.x;});
    var lab=labs[0];
    return its.some(function(i){ var gap=lab.x-i.x; return i.s==='X' && Math.abs(i.y-lab.y)<=4 && gap>0 && gap<30; });
  }
  return null;
}

/* Text of TaxSlayer's Preparer Notes page, if one was printed */
function preparerNotes(pages){
  for(var p=0;p<pages.length;p++){ var its=pages[p].items;
    if(!its.length || its[0].s!=='Preparer Notes') continue;
    var rule=its.filter(function(i){return /^_{20,}$/.test(i.s);})[0]; if(!rule) continue;
    var lines=its.filter(function(i){ return i.y<rule.y && i.y>rule.y-200; }).map(function(i){return i.s;});
    return lines.join(' ').replace(/\s+/g,' ').trim();
  }
  return null;
}

/* Is this text printed on the same page as an employer's W-2 (for example the employee address)? */
function onW2(pages,employer,text){
  var found=null;
  for(var p=0;p<pages.length;p++){ var its=pages[p].items;
    var lead=its.slice(0,6).map(function(i){return i.s;}).join(' ').replace(/\s+/g,' ');
    if(!/^a Employee.s social security number/.test(lead)) continue;
    if(!its.some(function(i){return i.s.toUpperCase().indexOf(employer)>=0;})) continue;
    found=its.some(function(i){return i.s.toUpperCase().indexOf(text)>=0;});
    if(found) return true;
  }
  return found;
}

/* Schedules and forms TaxSlayer leaves out when nothing goes on them. A blank answer on one of these
   is correct when the form is not printed at all. The 1040 and 540 are always required. The FTB 3514 is
   printed only when a California EITC is claimed (not at Quinn's Step A). */
var OPTIONAL_FORMS = {sch1:1, sch2:1, sch3:1, schA:1, f8880:1, ca3514:1};

function matches(got,exp,present,form){
  if(!present) return (exp===0 && OPTIONAL_FORMS[form]) ? 'pass' : 'missing';
  if(got===undefined) return 'warn';
  if(got===null) return exp===0?'pass':'fail';
  return got===exp?'pass':'fail';   /* exact: TaxSlayer and the key are whole dollars, so any difference is a real mistake */
}


/* Wrong-step guard: if the chosen column passes, see whether a column with MORE checks also passes
   completely. That means the PDF holds a later step's work. Only ever warns, never changes the score. */
function linesPass(s,got,present){
  return Object.keys(s.expected).every(function(k){ return matches(got[k], s.expected[k], present[LINES[k].form], LINES[k].form)==='pass'; });
}

function laterMatches(step,got,present){
  if(!linesPass(step,got,present)) return [];
  var n=Object.keys(step.expected).length, hits=[], top=0;
  STEPS.forEach(function(s){ var m=Object.keys(s.expected).length;
    if(m>n && linesPass(s,got,present)){ if(m>top){ top=m; hits=[]; } if(m===top) hits.push(s); } });
  return hits;
}

/* Wrong-PDF guard for a check that fails: the steps whose every line this PDF matches (for example the previous
   step's PDF checked again, or a later step's PDF checked too early). Steps with identical expected values
   (a no-change step and the step it repeats) are named once, by the earlier one. Only ever warns. */
function otherMatches(step,got,present){
  if(linesPass(step,got,present)) return laterMatches(step,got,present);
  var hits=[], seen={}; seen[JSON.stringify(step.expected)]=1;
  STEPS.forEach(function(s){ var key=JSON.stringify(s.expected); if(seen[key]) return; seen[key]=1;
    if(linesPass(s,got,present)) hits.push(s); });
  return hits;
}

/* Read every line with the reader named in its definition:
   ['box', form, token, xMin, xMax]   the amount box beside a line token (federal forms and schedules)
   ['ca', token, valueMin, form, tokXMin, tokXMax]   a California line (form is ca540 unless named, e.g. ca3514) */
function extractByLines(lines,pages){
  var got={};
  Object.keys(lines).forEach(function(k){ var r=lines[k].read;
    got[k]= r[0]==='box' ? boxValue(pages,r[1],r[2],r[3],r[4]) : caValue(pages,r[3]||'ca540',r[1],r[2],r[4],r[5]); });
  return got;
}

/* Each step's expected values from a case's answer_key.json (see tools/import_answer_sheet.js).
   A row checks a line at the steps of its answer sheet table; a blank cell means "blank or $0". */
function expectedFromKey(key){
  var exp={};
  key.steps.forEach(function(s){ exp[s]={}; });
  key.rows.forEach(function(r){ Object.keys(r.values).forEach(function(s){
    if(Object.prototype.hasOwnProperty.call(exp[s],r.line) && exp[s][r.line]!==(r.values[s]||0)) throw new Error('Answer key has two values for '+r.line+' at Step '+s);
    exp[s][r.line]=r.values[s]===null?0:r.values[s]; }); });
  return exp;
}
