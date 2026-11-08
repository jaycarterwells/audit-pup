// index.html is the page GitHub Pages serves. The rule:
//  (a) source/VERSION is a version not yet tagged (a release in progress): index.html must be the build of
//      this commit, apart from the build date.
//  (b) source/VERSION is already tagged as a release: index.html must be exactly that release's index.html,
//      so the live page stays at the last release between releases.
// Build first: cd source && node build_html.js. Needs git tags (fetch-depth: 0 on GitHub Actions).
const fs=require('fs'), path=require('path'), { execSync }=require('child_process');
const { expect }=require('./expect');
const root=path.join(__dirname,'..');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const build=fs.readFileSync(path.join(root,'source','tax-aide-quinn-checker.html'),'utf8');
const version=fs.readFileSync(path.join(root,'source','VERSION'),'utf8').trim();
const live=(index.match(/var APP_VERSION='([^']+)'/)||[])[1];
const noDate=s=>s.replace(/\d{4}-\d{2}-\d{2}/g,'DATE');
console.log(`index.html is version ${live}; source/VERSION is ${version}`);
let tagged=null;
try{ tagged=execSync(`git show v${version}:index.html`,{cwd:root,encoding:'utf8',maxBuffer:64*1024*1024,stdio:['ignore','pipe','ignore']}); }catch(e){}
if(tagged===null){
  expect(`release ${version} in progress: index.html is the build of this commit`, live===version && noDate(index)===noDate(build),
    live!==version ? `index.html is still version ${live}; rebuild and copy source/tax-aide-quinn-checker.html to index.html` : 'index.html differs from the build; rebuild and copy it again');
} else {
  expect(`between releases: index.html is unchanged since tag v${version}`, tagged===index, 'index.html was changed without raising source/VERSION');
}
console.log(require('./expect').failures() ? 'INDEX CHECK FAILED' : 'INDEX CHECK OK');
