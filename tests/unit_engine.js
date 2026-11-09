// Unit tests of the reading engine (source/engine.js) in Node: no browser and no PDF, so they run in well under a second.
// Each test builds a small page of text items by hand and checks one rule of the engine.
const { expect } = require('./expect');
const { loadEngine } = require('./engine');
const E=loadEngine();
const item=(x,y,s)=>({x,y,s});
let n=0; const t=(label,cond,detail)=>{ n++; expect(label,cond,detail); };

// amounts
t('parseNum reads plain, comma, cents, and negative amounts', E.parseNum('15000')===15000 && E.parseNum('1,234')===1234 && E.parseNum('77.00')===77 && E.parseNum('(250)')===-250 && E.parseNum('-15679')===-15679);
t('parseNum refuses words and empty text', E.parseNum('Wages')===null && E.parseNum('')===null && E.parseNum('.')===null && E.parseNum(null)===null);
t('isMoney skips the printed "00" cents box', E.isMoney('35') && !E.isMoney('00') && !E.isMoney('.'));

// matching: exact, no tolerance; blank equals $0 only when $0 is expected; optional schedules
t('matches: exact amounts only', E.matches(100,100,true,'fed')==='pass' && E.matches(101,100,true,'fed')==='fail');
t('matches: a blank line passes only when the answer is $0', E.matches(null,0,true,'fed')==='pass' && E.matches(null,5,true,'fed')==='fail');
t('matches: a line that could not be found is Unread, never a pass', E.matches(undefined,100,true,'fed')==='warn' && E.matches(undefined,0,true,'fed')==='warn');
t('matches: a missing 1040 or 540 is always Form missing', E.matches(undefined,0,false,'fed')==='missing' && E.matches(undefined,0,false,'ca540')==='missing');
t('matches: a missing optional schedule passes only for a $0 answer', E.matches(undefined,0,false,'sch2')==='pass' && E.matches(undefined,120,false,'sch2')==='missing');

// page recognition from the printed header
const lead=s=>s.split(' ').map((w,i)=>item(i,800,w));
t('classifyPage: Form 1040 page 1 and page 2', E.classifyPage(lead('Form 1040 20 25 U.S. Individual Income Tax Return'))==='fed' && E.classifyPage(lead('Form 1040 (2025) Page 2 Tax and Credits'))==='fed');
t('classifyPage: California 540 and 3514', E.classifyPage(lead('3101254 Form 540 2025 Side 1'))==='ca540' && E.classifyPage(lead('7621254 FTB 3514 2025'))==='ca3514');
t('classifyPage: Schedules 1, 2, 3, A and Form 8880', ['SCHEDULE 1 (Form 1040)','Schedule 2 (Form 1040) 2025 Page 2','SCHEDULE 3 (Form 1040)','SCHEDULE A (Form 1040)','Form 8880 Department of the Treasury'].map(s=>E.classifyPage(lead(s))).join()==='sch1,sch2,sch3,schA,f8880');
t('classifyPage: a Schedule 1 mentioned inside another form is not a Schedule 1', E.classifyPage(lead('Form 2555 Schedule 1 (Form 1040) line 8d'))==='other');

// line readers
const page=(form,items)=>({form,items});
t('boxValue reads the amount right of the line box', E.boxValue([page('fed',[item(96,300,'16'),item(488,300,'16'),item(552,300,'6210')])],'fed','16')===6210);
t('boxValue: box printed with no amount is blank (null)', E.boxValue([page('fed',[item(488,300,'37')])],'fed','37')===null);
t('boxValue: box not on the form is undefined (Unread)', E.boxValue([page('fed',[item(96,300,'37')])],'fed','37')===undefined);
t('boxValue: the same box twice with different amounts is Unread, not a guess', E.boxValue([page('fed',[item(488,300,'9'),item(552,300,'100')]),page('fed',[item(488,300,'9'),item(552,300,'200')])],'fed','9')===undefined);
t('boxValue: the same box twice with the same amount is read', E.boxValue([page('fed',[item(488,300,'9'),item(552,300,'100')]),page('fed',[item(488,300,'9'),item(552,300,'100')])],'fed','9')===100);
t('caValue takes the amount on the line-number row, not a neighbor', E.caValue([page('ca540',[item(55,400,'31'),item(560,400,'1380'),item(55,388,'32'),item(560,388,'781')])],'ca540','31',500)===1380);
t('caValue: line printed but empty is blank (null)', E.caValue([page('ca540',[item(55,400,'31')])],'ca540','31',500)===null);
t('ipPin reads the digits printed one per box', E.ipPin([page('fed',[item(464,140,'Protection PIN, enter it here'),...'543456'.split('').map((d,i)=>item(506+12*i,129,d))])])==='543456');

// answer keys from answer_key.json
const key={steps:['A','B'], rows:[{line:'fed_1a',values:{A:null,B:24491}},{line:'fed_12e',values:{A:31500,B:31500}}]};
const ex=E.expectedFromKey(key);
t('expectedFromKey: a blank cell becomes $0, a filled cell its amount', ex.A.fed_1a===0 && ex.B.fed_1a===24491 && ex.A.fed_12e===31500);
let threw=false; try{ E.expectedFromKey({steps:['A'],rows:[{line:'fed_9',values:{A:1}},{line:'fed_9',values:{A:2}}]}); }catch(e){ threw=true; }
t('expectedFromKey refuses two different values for one line at one step', threw);

t('matches: a missing FTB 3514 passes only for a $0 answer (it is printed only with a California EITC)', E.matches(undefined,0,false,'ca3514')==='pass' && E.matches(undefined,15000,false,'ca3514')==='missing');

// the wrong-step warning: only when the picked step passes and a step with MORE checks also passes. With full
// answer keys no real printout triggers it (a later printout fails the earlier step's blanks); it guards partial keys.
{ const saved=[E.LINES,E.STEPS];
  E.LINES={fed_1a:{form:'fed'}, fed_9:{form:'fed'}};
  const sA={id:'A',expected:{fed_1a:0}}, sB={id:'B',expected:{fed_1a:15000, fed_9:15000}}; E.STEPS=[sA,sB];
  const present={fed:true};
  const warnB=E.laterMatches({id:'A',expected:{fed_9:15000}},{fed_1a:15000,fed_9:15000},present);
  t('laterMatches: a passing step with fewer checks warns when a step with more checks also passes', warnB.length===1 && warnB[0].id==='B');
  t('laterMatches: no warning when the picked step fails', E.laterMatches(sA,{fed_1a:15000,fed_9:15000},present).length===0);
  t('laterMatches: no warning when no step with more checks passes', E.laterMatches(sA,{fed_1a:0,fed_9:0},present).length===0);
  [E.LINES,E.STEPS]=saved; }

console.log(`${n} engine unit tests run`);
