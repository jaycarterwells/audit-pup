// Rule 3: the counselor guide must match the page. Every phrase the guide puts in bold is either
//  (1) something on Audit Pup's screen (a message, button, status, label, or dog), which must exist in the built page, or
//  (2) listed below as not Audit Pup's text (Chrome, TaxSlayer, the keyboard, or the guide's own emphasis).
// A new bold phrase that is in neither group fails, so each one gets a decision. Text that the page builds around a
// step letter ("Drop your Step A PDF here") is matched in pieces on one line of the page ("Drop your Step " and
// " PDF here"); a dog's name and title ("Zion, corrections officer") are matched the same way.
// Build first: cd source && node build_html.js
const fs=require('fs'), path=require('path');
const { expect }=require('./expect');
const ROOT=path.join(__dirname,'..');
const guide=fs.readFileSync(path.join(ROOT,'docs','chromebook-guide.md'),'utf8');
// Only text the page can show counts: not the built-in PDF engine, not comments, and not the release notes (the
// What's new list keeps old wording on purpose, so a renamed button must not be found there).
const page=fs.readFileSync(path.join(ROOT,'source','tax-aide-quinn-checker.html'),'utf8')
  .replace(/<script id="pdfjs[\s\S]*?<\/script>/g,'')
  .replace(/<!--[\s\S]*?-->/g,'')
  .replace(/\/\*[\s\S]*?\*\//g,'')
  .replace(/^\s*\/\/.*$/gm,'')
  .replace(/var CHANGELOG=\[[\s\S]*?\n\];/,'')
  .replace(/var CHANGELOG_EARLIER=.*$/m,'');
if(/version:'\d+\.\d+\.\d+'/.test(page)) throw new Error('the release notes were not removed before the check');
const lines=page.split('\n');
const NOT_PAGE_TEXT={
  'Chrome or TaxSlayer': ['Downloads','Download','Destination','Save as PDF','Save','Open'],
  'keyboard keys': ['Ctrl + R','Ctrl + D','Ctrl + Tab','Ctrl +','Ctrl -','Ctrl 0','Alt + Shift + M'],
  'colors the guide names': ['red','yellow','green'],
  "the guide's headings and labels": ['Open it here:','Worksheet entries:','Items you confirm yourself:','Notes Audit Pup checks for you:',
    'Lines that should be blank:','No-change steps:','Wrong step picked:','Your reward:','No dog photo'],
  "the guide's emphasis": ['case','step','new','next step','no change','only in Chrome on this Chromebook',
    'In Guest mode or an Incognito window, your progress is erased when you close the window'],
};
const skip=new Map(); for(const [why,list] of Object.entries(NOT_PAGE_TEXT)) for(const p of list) skip.set(p,why);
const bold=[...new Set([...guide.matchAll(/\*\*([^*]+)\*\*/g)].map(m=>m[1].trim()))];
let checked=0;
for(const raw of bold){
  if(skip.has(raw)) continue;
  const text=raw.replace(/^"|"$/g,'');                                         // a quoted message, without its quotes
  const pieces=text.split(/Step [A-Z]\b|, /).map(s=>s.trim()).filter(Boolean);  // the fixed parts around a step letter or a dog's title
  const found=page.includes(text) || lines.some(l=>pieces.every(p=>l.includes(p)));
  checked++;
  expect(`the guide's "${raw}" is in the page`, found, 'fix the guide or the page, or list it in NOT_PAGE_TEXT if it is not Audit Pup text');
}
// a listed exception the guide no longer uses is stale
for(const p of skip.keys()) expect(`"${p}" (listed as not Audit Pup text) is still in the guide`, bold.includes(p), 'remove it from NOT_PAGE_TEXT');
console.log(`${bold.length} bold phrases in the guide: ${checked} checked against the page, ${bold.length-checked} listed as not Audit Pup text`);
