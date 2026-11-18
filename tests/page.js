// Waits on the page's own signals, so the page tests never sleep for a fixed time. Everything the page does after a
// click, a tick, or a typed value happens at once, before the event returns. Only these things take time:
//   * opening the page: the steps are listed and the "did not start" note is hidden (started),
//   * reading a PDF: the Check button's data-state is "busy" until the results are drawn (ready),
//   * motion: CSS transitions and animations (the bar color, the reward's pop) and the smooth scroll to the
//     results (settled; the paw-print burst is decoration and is not waited for),
//   * the reward photo, which comes from the Dog API (dogShown, with the API mocked by the test).
async function started(p){
  await p.waitForFunction(()=>window.CASES && document.getElementById('step').options.length>0 &&
    document.getElementById('startup').classList.contains('hidden'),null,{timeout:30000});
}
async function open(p,url){ await p.goto(url); await started(p); }
async function reload(p){ await p.reload(); await started(p); }
async function settled(p){
  await p.waitForFunction(()=>document.getAnimations().every(a=>{
    const t=a.effect&&a.effect.target; if(t&&t.closest&&t.closest('.burst')) return true;
    return !a.pending && a.playState!=='running'; }),null,{timeout:10000});
  // the scroll position has not moved for four frames in a row
  await p.evaluate(()=>new Promise(res=>{ let y=NaN, same=0;
    (function frame(){ if(window.scrollY===y){ if(++same>=4) return res(); } else { same=0; y=window.scrollY; } requestAnimationFrame(frame); })(); }));
}
async function ready(p,{timeout=60000, settle=true}={}){
  await p.waitForFunction(()=>document.getElementById('grade').dataset.state==='ready',null,{timeout});
  if(settle) await settled(p);
}
// the reward photo is in and faded in (only when the test mocks the Dog API); a missing photo is left to the test's own check
async function dogShown(p){
  await p.waitForSelector('#reward.hasdog',{state:'attached',timeout:10000}).catch(()=>{});
  await settled(p);
}
// Tests never ask the real website whether a newer Audit Pup exists (update_check.js tests that with a stand-in);
// offline() also blocks the Dog API.
const LIVE='https://jaycarterwells.github.io/**';
async function noUpdateCheck(ctx){ await ctx.route(LIVE,r=>r.abort()); }
async function offline(ctx){ await ctx.route('https://dog.ceo/**',r=>r.abort()); await noUpdateCheck(ctx); }
module.exports={ started, open, reload, settled, ready, dogShown, noUpdateCheck, offline };
