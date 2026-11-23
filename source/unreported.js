/* ---------- The unreported list: the differences Instructor mode leaves out of a counselor's report ----------
   This is the product owner's file (a control file: see the architecture document). Each rule names one kind of
   difference instructors never comment on. A report row is left out only when every difference in it is covered by a
   rule; it is then counted and listed, closed, under its case, so nothing is lost. To add or change a rule, change it
   here and in the architecture document's Unreported differences table, then run tests/compare_golden.js (the compare
   sweep must still print 0 hidden).
   g is the golden file's text, s the counselor's, taxYear the return's tax year, ctx what the row's label words say. */
var UNREPORTED=[
  { id:'date', name:'Dates after the tax year (when the return was printed, prepared or signed)',
    test:function(g,s,taxYear){ var dg=datesIn(g), ds=datesIn(s);
      return (dg.length||ds.length) && withoutDates(g)===withoutDates(s) && dg.concat(ds).every(function(y){ return y>taxYear; }); } },
  { id:'ptin', name:'The paid preparer\'s PTIN',
    test:function(g,s,taxYear,ctx){ return (/^[PS]\d{8}$/.test(g) && /^[PS]\d{8}$/.test(s)) || (ctx.preparerRow && /^\d$/.test(g) && /^\d$/.test(s)); } },
  { id:'pin', name:'Self-select e-file signature PINs (never the IP PIN)',
    test:function(g,s,taxYear,ctx){ return ctx.pinRow && /^\d{1,5}$/.test(g) && /^\d{1,5}$/.test(s) && g.length===s.length; } },
  { id:'initial', name:'A middle initial added or left out (first and last names must match exactly)',
    test:function(g,s){
      var ig=initialsOf(g), is=initialsOf(s);
      if(!ig.length===!is.length) return false;                       // an initial on one side only
      var dg=letters(dropInitials(g)), ds=letters(dropInitials(s));
      return /[A-Za-z]{2}/.test(g) && /[A-Za-z]{2}/.test(s) && g.replace(/\s+/g,' ')!==s.replace(/\s+/g,' ') && dg.length>=2 && dg===ds; } }
];

/* helpers for the rules */
var DATE_RE=/\b(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})\b/g;
function datesIn(s){ var out=[], m; DATE_RE.lastIndex=0; while((m=DATE_RE.exec(s))){ var y=+m[3]; if(y<100) y+=2000; out.push(y); } return out; }
function withoutDates(s){ return s.replace(DATE_RE,'#DATE#'); }
function letters(s){ return s.toUpperCase().replace(/[^A-Z0-9]/g,''); }
function initialsOf(s){ return (s.toUpperCase().match(/(^|\s)[A-Z]\.?(?=\s|$)/g)||[]); }
function dropInitials(s){ return s.toUpperCase().replace(/(^|\s)[A-Z]\.?(?=\s|$)/g,' '); }
/* the row's label words say it holds a self-select signature PIN (not the IP PIN, which is always reported) */
function isPinRow(rowText){ return /\bPIN\b/i.test(rowText) && !/Identity Protection/i.test(rowText); }
