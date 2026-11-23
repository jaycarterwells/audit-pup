// Loads compare.js (Instructor mode's comparison engine) after the reading engine, as build_html.js does, and gives the
// golden return of each case as pages, from cases/<case>/golden.json (what the page uses) or from the golden PDF.
const fs=require('fs'), path=require('path'), vm=require('vm');
const { loadEngine, readPdf, ROOT }=require('./engine');
function loadCompare(){ const E=loadEngine(); if(!global.compareReturn) vm.runInThisContext(fs.readFileSync(path.join(ROOT,'source','compare.js'),'utf8'),{filename:'source/compare.js'}); return E; }
const CASE_FILES={quinn:'Quinn',baylor:'Baylor',graham:'Graham',parks:'Parks',kent:'Kent'};
function goldenJson(c){ return JSON.parse(fs.readFileSync(path.join(ROOT,'cases',c,'golden.json'),'utf8')); }
// the golden pages exactly as the page builds them from golden.json (instructor.js goldenPages)
function goldenPages(c,E){ return goldenJson(c).pages.map((p,i)=>{ const items=p.map(a=>({x:a[0],y:a[1],s:a[2]})); return {page:i+1, form:E.classifyPage(items), items}; }); }
const studentFile=c=>path.join(__dirname,'fixtures','instructor',`DH ${CASE_FILES[c]}.pdf`);
const goldenPdf=c=>path.join(ROOT,'cases',c,`${CASE_FILES[c]}_Golden.pdf`);
module.exports={ loadCompare, goldenPages, goldenJson, studentFile, goldenPdf, readPdf, CASES:Object.keys(CASE_FILES) };
