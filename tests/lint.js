// ESLint for all the JavaScript: the reading engine, the case files, the page's own script (taken out of the
// template), the build and import tools, and the tests. The page files share one set of names (the engine's
// functions, each case's data, the page script's functions), so those names are collected from the files
// themselves; a misspelled or missing name is still an error. Usage: node tests/lint.js
const fs=require('fs'), path=require('path');
const ROOT=path.join(__dirname,'..'), SRC=path.join(ROOT,'source');
const req=n=>require(path.join(SRC,'node_modules',n));
const { ESLint }=req('eslint'), js=req('@eslint/js'), globals=req('globals');
const { expect }=require('./expect');
(async()=>{
  // the page's main script, taken out of the template, with the same line numbers as in the template
  const tpl=fs.readFileSync(path.join(SRC,'audit-pup-template.html'),'utf8');
  const start=tpl.indexOf('<script>\n'), end=tpl.indexOf('</script>',start);
  if(start<0||end<0) throw new Error('the page script was not found in the template');
  const before=tpl.slice(0,start+'<script>\n'.length).split('\n').length-1;
  const pageScript='\n'.repeat(before)+tpl.slice(start+'<script>\n'.length,end);
  const pageFiles=[['source/engine.js',fs.readFileSync(path.join(SRC,'engine.js'),'utf8')],
    ...fs.readdirSync(path.join(SRC,'cases')).filter(f=>f.endsWith('.js')).map(f=>['source/cases/'+f,fs.readFileSync(path.join(SRC,'cases',f),'utf8')]),
    ['source/audit-pup-template.html.page-script.js',pageScript]];   // a .js name so ESLint lints it; messages give template line numbers
  // names any page file defines at the top level are known to all of them
  const shared={ ANSWER_KEYS:'readonly' };
  for(const [,code] of pageFiles){
    for(const m of code.matchAll(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/gm)) shared[m[1]]='writable';
    for(const m of code.matchAll(/^var\s+([^;=\n]+(?:=[^;\n]*)?)/gm))
      for(const part of m[1].split(',')){ const n=part.trim().match(/^([A-Za-z_$][\w$]*)/); if(n) shared[n[1]]='writable'; }
  }
  const rules={ ...js.configs.recommended.rules,
    'no-unused-vars':['error',{vars:'local', args:'none', caughtErrors:'none'}],   // top-level names are used by other files
    'no-empty':['error',{allowEmptyCatch:true}],                                     // storage and clipboard calls may fail quietly on purpose
    'no-redeclare':['error',{builtinGlobals:false}],                                 // shared names are defined once, in their own file
  };
  const page=new ESLint({ cwd:ROOT, overrideConfigFile:true, overrideConfig:[{ languageOptions:{ ecmaVersion:2020, sourceType:'script',
    globals:{ ...globals.browser, ...shared } }, rules }] });
  const node=new ESLint({ cwd:ROOT, overrideConfigFile:true, overrideConfig:[{ languageOptions:{ ecmaVersion:2022, sourceType:'commonjs',
    globals:{ ...globals.node } }, rules },
    // code inside page.evaluate(...) runs in the browser and uses the page's names
    { files:['tests/**/*.js'], languageOptions:{ globals:{ ...globals.browser, ...shared } } }] });
  const results=[];
  for(const [name,code] of pageFiles) for(const r of await page.lintText(code,{filePath:path.join(ROOT,name)})) results.push({...r, shown:name.replace('.page-script.js',' (page script)')});
  const nodeFiles=['source/build_html.js','source/release_notes.js',...fs.readdirSync(path.join(SRC,'tools')).filter(f=>f.endsWith('.js')).map(f=>'source/tools/'+f),
    ...fs.readdirSync(path.join(ROOT,'tests')).filter(f=>f.endsWith('.js')).map(f=>'tests/'+f)];
  for(const r of await node.lintFiles(nodeFiles.map(f=>path.join(ROOT,f)))) results.push({...r, shown:path.relative(ROOT,r.filePath)});
  let n=0;
  for(const r of results) for(const m of r.messages){ n++; console.log(`FAIL ${r.shown}:${m.line}:${m.column} ${m.message} (${m.ruleId||'parse'})`); }
  expect('ESLint finds no problems', n===0, `${n} problem(s)`);
  console.log(`linted ${results.length} files`);
})().catch(e=>{console.error(e);process.exit(1);});
