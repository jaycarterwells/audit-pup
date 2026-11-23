const fs=require('fs');
const tpl=fs.readFileSync('audit-pup-template.html','utf8');
const lib=fs.readFileSync('node_modules/pdfjs-dist/legacy/build/pdf.min.js').toString('base64');
const wrk=fs.readFileSync('node_modules/pdfjs-dist/legacy/build/pdf.worker.min.js').toString('base64');
// Version comes from the VERSION file (semantic versioning: MAJOR.MINOR.PATCH)
const version=fs.readFileSync('VERSION','utf8').trim();
if(!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) throw new Error('VERSION is not a semantic version: '+version);
// The release notes (docs/release-notes.md, the one list, also used for the GitHub Release) must have this version
const notes=require('./release_notes_md.js').read();
if(!notes.list.some(r=>r.version===version)) throw new Error('No entry for version '+version+' in docs/release-notes.md');
// The build date shown on the page: BUILD_DATE (YYYY-MM-DD) when set, as the release workflow does with the release
// commit's date, otherwise today.
const d=new Date(), stamp=process.env.BUILD_DATE&&/^\d{4}-\d{2}-\d{2}$/.test(process.env.BUILD_DATE)?process.env.BUILD_DATE:d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
// Fonts and dog drawings live in assets/ and are built into the page as base64, so the one file works offline
const path=require('path');
const tplA=tpl.replace(/__ASSET_([\w.-]+)__/g,(m,name)=>{ const f=path.join('assets',name);
  if(!fs.existsSync(f)) throw new Error('Missing asset '+f); return fs.readFileSync(f).toString('base64'); });
// The reading engine, each case's answer key (cases/<case>/answer_key.json), and each case's data (cases/*.js)
// go into the page in this order. Quinn first: it is the first case in the case picker.
const keys={};
fs.readdirSync(path.join('..','cases')).forEach(c=>{ const f=path.join('..','cases',c,'answer_key.json'); if(fs.existsSync(f)) keys[c]=JSON.parse(fs.readFileSync(f,'utf8')); });
const caseFiles=fs.readdirSync('cases').filter(f=>f.endsWith('.js')).sort((a,b)=>(a==='quinn.js'?-1:b==='quinn.js'?1:a.localeCompare(b)));
// the golden files (cases/<case>/golden.json, made by tools/golden_data.js) that Instructor mode compares against
const golden={};
fs.readdirSync(path.join('..','cases')).forEach(c=>{ const f=path.join('..','cases',c,'golden.json'); if(fs.existsSync(f)) golden[c]=JSON.parse(fs.readFileSync(f,'utf8')); });
const engineAndCases=[fs.readFileSync('engine.js','utf8'), fs.readFileSync('compare.js','utf8'),
  '/* answer keys made from each case\'s answer sheet by tools/import_answer_sheet.js */\nvar ANSWER_KEYS = '+JSON.stringify(keys)+';',
  '/* golden files made by tools/golden_data.js, for Instructor mode */\nvar GOLDEN_DATA = '+JSON.stringify(golden)+';',
  ...caseFiles.map(f=>fs.readFileSync(path.join('cases',f),'utf8'))].join('\n');
if(!tplA.includes('/*__ENGINE_AND_CASES__*/')) throw new Error('The template has no /*__ENGINE_AND_CASES__*/ marker');
const tplB0=tplA.replace(/\/\*__ENGINE_AND_CASES__\*\/[^\n]*/,()=>engineAndCases);
// The counselor guide, shown by the Guide button: made from docs/chromebook-guide.md, so it always matches this version
if(!tplB0.includes('__GUIDE_HTML__')) throw new Error('The template has no __GUIDE_HTML__ marker');
const tplB=tplB0.replace('__GUIDE_HTML__',()=>require('./guide_html.js').guideHtml(fs.readFileSync(path.join('..','docs','chromebook-guide.md'),'utf8')));
// one release per line, so tests can find the list (and its closing "\n];")
if(!tplB.includes('/*__CHANGELOG__*/[]') || !tplB.includes("/*__CHANGELOG_EARLIER__*/''")) throw new Error('The template has no /*__CHANGELOG__*/ markers');
const tplC=tplB.replace('/*__CHANGELOG__*/[]',()=>'[\n'+notes.list.map(r=>JSON.stringify(r)).join(',\n')+'\n]')
  .replace("/*__CHANGELOG_EARLIER__*/''",()=>JSON.stringify(notes.earlier));
// Instructor mode's screen (instructor.js) goes into the page script at its marker
if(!tplC.includes('/*__INSTRUCTOR_SCREEN__*/')) throw new Error('The template has no /*__INSTRUCTOR_SCREEN__*/ marker');
const tplD=tplC.replace(/\/\*__INSTRUCTOR_SCREEN__\*\/[^\n]*/,()=>fs.readFileSync('instructor.js','utf8'));
const out=tplD.split('__PDFJS_LIB__').join(lib).split('__PDFJS_WORKER__').join(wrk).split('__APP_VERSION__').join(version).split('__BUILD_DATE__').join(stamp);
const name=`Audit Pup ${version} ${stamp}.html`;
// Rule: the page file stays under 10 MB, so it loads quickly on school Wi-Fi and the downloaded copy stays usable
const LIMIT=10*1024*1024;
if(Buffer.byteLength(out)>=LIMIT) throw new Error('The page is '+(Buffer.byteLength(out)/1048576).toFixed(2)+' MB; the limit is 10 MB (see the architecture document, Constraints)');
fs.mkdirSync('dist',{recursive:true});
fs.writeFileSync('dist/'+name, out);
fs.writeFileSync('tax-aide-quinn-checker.html', out);   // fixed copy used by the test scripts
console.log('built dist/'+name, (out.length/1048576).toFixed(2)+' MB');
