// Answer key notes checked again at later steps, through the page: the "Notes from earlier steps" row.
//  * Baylor Step R with its correct printout: the row lists N1, N2 (Step A) and NP (Step I) and passes.
//  * Baylor Step R with the Preparer Notes page left out (the beta tester's case, November 17, 2026): every line
//    passes, but the row fails, names NP and its step, and the step is not done.
//  * The row never asks about TS Note boxes again, and the first step has no such row.
//  * Quinn Step B carries Quinn's N1 from Step A.
const path=require('path');
const { chromium } = require('playwright');
const { expect } = require('./expect');
const { grade, PAGE } = require('./cases');
const { open, offline } = require('./page');
const B=path.join(__dirname,'..','cases','baylor'), Q=path.join(__dirname,'..','cases','quinn');
const carry=r=>r.rows.find(x=>x.line==='carry');
(async()=>{ const b=await chromium.launch(); const ctx=await b.newContext(); await offline(ctx);
  const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message)); await open(p,'file://'+PAGE);
  let r=await grade(p,'baylor','R',`${B}/Baylor_Sec_R.pdf`); let c=carry(r);
  expect('Baylor Step R, correct printout: the notes-from-earlier-steps row lists N1, N2, and NP and passes',
    !!c && c.cls==='pass' && /N1 \(Step A\)/.test(c.name) && /N2 \(Step A\)/.test(c.name) && /NP \(Step I\)/.test(c.name) && !r.rows.some(x=>x.cls==='fail'), c?c.name+' '+c.cls:'no row');
  expect('the row never asks about TS Note boxes again', !!c && !/NN/.test(c.name), c&&c.name);
  r=await grade(p,'baylor','R',path.join(__dirname,'fixtures','Baylor_R_without_preparer_note.pdf')); c=carry(r);
  const others=r.rows.filter(x=>x.line!=='carry' && x.cls==='fail');
  const text=await p.$eval('li.check[data-line="carry"]',e=>e.textContent.replace(/\s+/g,' '));
  expect('Baylor Step R without the Preparer Notes page: every line passes but the row fails and names NP from Step I',
    !!c && c.cls==='fail' && /NP: Preparer Note added \(added at Step I\) is not in your return/.test(text) && !others.length, text);
  expect('... and the step is not done: the score shows one check to look at', /^\d+\/\d+$/.test(r.score) && r.score.split('/')[0]!==r.score.split('/')[1], r.score);
  r=await grade(p,'baylor','A',`${B}/Baylor_Sec_A.pdf`);
  expect('the first step has no notes-from-earlier-steps row', !carry(r));
  r=await grade(p,'quinn','B',`${Q}/Quinn_Sec_B.pdf`); c=carry(r);
  expect('Quinn Step B: the row carries N1 from Step A and passes', !!c && c.cls==='pass' && /N1 \(Step A\)/.test(c.name), c?c.name:'no row');
  expect('no page errors', !errs.length, errs.join(';'));
  console.log('notes from earlier steps: checked on Baylor and Quinn');
  await b.close(); })().catch(e=>{console.error(e);process.exit(1);});
