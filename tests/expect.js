// Shared check helper for the test scripts. expect() prints FAIL for a failed check and makes the
// script end with a failure exit code, so run_all.sh and GitHub Actions both see the failure.
let failed = 0;
function expect(label, cond, detail){
  if(!cond){ failed++; console.log(`FAIL ${label}${detail!==undefined && detail!=='' ? '  ['+detail+']' : ''}`); }
  return !!cond;
}
// for scripts that keep their own ok flag: end with a failure exit code when it is false
function finish(ok){ if(!ok) failed++; }
process.on('exit', ()=>{ if(failed) process.exitCode = 1; });
module.exports = { expect, finish, failures: ()=>failed };
