const fs=require('fs');
const tpl=fs.readFileSync('audit-pup-template.html','utf8');
const lib=fs.readFileSync('node_modules/pdfjs-dist/legacy/build/pdf.min.js').toString('base64');
const wrk=fs.readFileSync('node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js').toString('base64');
// Version comes from the VERSION file (semantic versioning: MAJOR.MINOR.PATCH)
const version=fs.readFileSync('VERSION','utf8').trim();
if(!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) throw new Error('VERSION is not a semantic version: '+version);
// The release notes inside the page must have an entry for this version
if(!tpl.includes(`version:'${version}'`)) throw new Error('No changelog entry for version '+version+' in the template CHANGELOG');
const d=new Date(), stamp=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
// Fonts and dog drawings live in assets/ and are built into the page as base64, so the one file works offline
const path=require('path');
const tplA=tpl.replace(/__ASSET_([\w.-]+)__/g,(m,name)=>{ const f=path.join('assets',name);
  if(!fs.existsSync(f)) throw new Error('Missing asset '+f); return fs.readFileSync(f).toString('base64'); });
// The reading engine, each case's answer key (cases/<case>/answer_key.json), and each case's data (cases/*.js)
// go into the page in this order. Quinn first: it is the first case in the case picker.
const keys={};
fs.readdirSync(path.join('..','cases')).forEach(c=>{ const f=path.join('..','cases',c,'answer_key.json'); if(fs.existsSync(f)) keys[c]=JSON.parse(fs.readFileSync(f,'utf8')); });
const caseFiles=fs.readdirSync('cases').filter(f=>f.endsWith('.js')).sort((a,b)=>(a==='quinn.js'?-1:b==='quinn.js'?1:a.localeCompare(b)));
const engineAndCases=[fs.readFileSync('engine.js','utf8'),
  '/* answer keys made from each case\'s answer sheet by tools/import_answer_sheet.js */\nvar ANSWER_KEYS = '+JSON.stringify(keys)+';',
  ...caseFiles.map(f=>fs.readFileSync(path.join('cases',f),'utf8'))].join('\n');
if(!tplA.includes('/*__ENGINE_AND_CASES__*/')) throw new Error('The template has no /*__ENGINE_AND_CASES__*/ marker');
const tplB=tplA.replace(/\/\*__ENGINE_AND_CASES__\*\/[^\n]*/,()=>engineAndCases);
const out=tplB.split('__PDFJS_LIB__').join(lib).split('__PDFJS_WORKER__').join(wrk).split('__APP_VERSION__').join(version).split('__BUILD_DATE__').join(stamp);
const name=`Audit Pup ${version} ${stamp}.html`;
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/'+name, out);
fs.writeFileSync('tax-aide-quinn-checker.html', out);   // fixed copy used by the test scripts
console.log('built dist/'+name, (out.length/1048576).toFixed(2)+' MB');
