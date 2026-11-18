/* Kent case: hints, steps, and notes. The answer key values come from cases/kent/answer_key.json
   (ANSWER_KEYS.kent), which tools/import_answer_sheet.js makes from the answer sheet. Built into the page by build_html.js. */
/* ---------- hints for the Kent problem ----------
   Expected values come from the Kent answer sheet (2025). A blank cell in the answer sheet is checked as "must be blank
   or $0". The problem has no Steps F, I, or M. Hints written by Claude for expert review (docs/hints.md). */
var K_EXP = expectedFromKey(ANSWER_KEYS.kent);   /* from cases/kent/answer_key.json */

var K_LINES = {
  fed_1a:  {form:'fed', line:'Line 1a',  name:'Wages (W-2 box 1)', read:['box','fed','1a'],
    hint:"Line 1a is box 1 of Karl's W-2 (Step B). Compare the W-2 you entered with the form in the problem, box by box."},
  fed_2a:  {form:'fed', line:'Line 2a',  name:'Tax-exempt interest', read:['box','fed','2a',200,260],
    hint:"Line 2a adds the tax-exempt interest from the ZYX 1099-INT (Step D), the exempt-interest dividends from the 1099-DIVs (Steps E and G), and the K-1's tax-exempt interest (Step L). Review the handout 'Tax Exempt Interest & Dividends Quick Guide' for where each one is entered."},
  fed_2b:  {form:'fed', line:'Line 2b',  name:'Taxable interest', read:['box','fed','2b'],
    hint:"Line 2b adds the seller-financed mortgage interest (Step C), the ZYX 1099-INT (Step D), and the K-1 interest (Step L). Check each amount you entered against the problem."},
  fed_3a:  {form:'fed', line:'Line 3a',  name:'Qualified dividends', read:['box','fed','3a',200,260],
    hint:"Line 3a is the qualified dividends (box 1b) from the 1099-DIVs and the K-1. Compare box 1b of each form you entered with the problem."},
  fed_3b:  {form:'fed', line:'Line 3b',  name:'Ordinary dividends', read:['box','fed','3b'],
    hint:"Line 3b is the ordinary dividends (box 1a) from the 1099-DIVs and the K-1. Compare box 1a of each form you entered with the problem."},
  fed_7a:  {form:'fed', line:'Line 7a',  name:'Capital gain or loss', read:['box','fed','7a'],
    hint:"Line 7a comes from Schedule D: the capital gain distributions (Step E), the home sale (Step J), the Schwab 1099-B sales (Step K), and the K-1 (Step L). A net loss is limited to $3,000. Look at Schedule D in your PDF to find which part is off."},
  fed_8:   {form:'fed', line:'Line 8',   name:'Additional income (Schedule 1, line 10)', read:['box','fed','8'],
    hint:"Line 8 comes from Schedule 1, line 10: last year's taxable state refund (Step H) and the K-1 partnership income on Schedule E (Step L). Check the Schedule 1 lines first."},
  fed_9:   {form:'fed', line:'Line 9',   name:'Total income', read:['box','fed','9'],
    hint:"Line 9 is the sum of the income lines above it. If it is off, the mistake is in one of those income entries, not on line 9 itself."},
  fed_10:  {form:'fed', line:'Line 10',  name:'Adjustments to income (Schedule 1, line 26)', read:['box','fed','10'],
    hint:"Line 10 comes from Schedule 1, line 26: the early withdrawal penalty from the 1099-INT (Step D) and, from Step Q, the IRA deduction. Check the Schedule 1 lines in this list."},
  fed_11a: {form:'fed', line:'Line 11a', name:'Adjusted gross income', read:['box','fed','11a'],
    hint:"Line 11a is total income minus the adjustments. If lines 9 and 10 are right, this follows."},
  fed_12e: {form:'fed', line:'Line 12e', name:'Standard or itemized deduction', read:['box','fed','12e'],
    hint:"Before Step N this is the standard deduction for head of household and Karl's age; from Step N, Karl itemizes. Re-check the filing status from Step A, or the Schedule A amounts the answer sheet lists for this step."},
  fed_13a: {form:'fed', line:'Line 13a', name:'Qualified business income deduction', read:['box','fed','13a'],
    hint:"Line 13a is the qualified business income deduction from the Section 199A dividends on a 1099-DIV (Step E). Check box 5 of the 1099-DIV you entered."},
  fed_13b: {form:'fed', line:'Line 13b', name:'Additional deductions (Schedule 1-A)', read:['box','fed','13b'],
    hint:"Line 13b comes from Schedule 1-A: the new deduction for a taxpayer age 65 or older, which phases out as income rises. Check Karl's birth date from Step A; if line 11a is right, this follows."},
  fed_15:  {form:'fed', line:'Line 15',  name:'Taxable income', read:['box','fed','15'],
    hint:"Taxable income is AGI minus the deductions on lines 12e through 13b, never below zero. If those lines are right, this follows."},
  fed_16:  {form:'fed', line:'Line 16',  name:'Tax', read:['box','fed','16'],
    hint:"Tax comes from taxable income, with qualified dividends and capital gains taxed at lower rates. If line 15 and the dividend and gain lines are right, this follows."},
  fed_19:  {form:'fed', line:'Line 19',  name:'Child tax credit and credit for other dependents', read:['box','fed','19'],
    hint:"Line 19 is the child tax credit for Jane (note N1), limited to the tax. Kendra and Susan are not dependents and are not listed. Re-check the dependent screens from Step A."},
  fed_20:  {form:'fed', line:'Line 20',  name:'Credits from Schedule 3, line 8', read:['box','fed','20'],
    hint:"Line 20 comes from Schedule 3: the foreign tax credit from the 1099-DIVs and the K-1, and from Step P the child and dependent care credit. Check the Schedule 3 lines in this list."},
  fed_21:  {form:'fed', line:'Line 21',  name:'Total credits', read:['box','fed','21'],
    hint:"Line 21 adds lines 19 and 20. If those are right, this follows."},
  fed_22:  {form:'fed', line:'Line 22',  name:'Tax after credits', read:['box','fed','22'],
    hint:"Line 22 is the tax minus the credits. Check lines 16 and 21 first."},
  fed_24:  {form:'fed', line:'Line 24',  name:'Total tax', read:['box','fed','24'],
    hint:"Total tax is the tax after credits plus any other taxes. Check lines 16 and 21 first; this follows from them."},
  fed_25d: {form:'fed', line:'Line 25d', name:'Federal tax withheld', read:['box','fed','25d'],
    hint:"Line 25d adds the federal tax withheld on every form entered so far: the 1099-INT (Step D) and the 1099-DIV (Step E). Compare box 4 of each form you entered with the problem."},
  fed_26:  {form:'fed', line:'Line 26',  name:'Estimated tax payments', read:['box','fed','26'],
    hint:"Line 26 is the four federal estimated payments Karl made plus last year's refund applied to this year (Step O). Look at last year's return in the problem for the amount applied."},
  fed_31:  {form:'fed', line:'Line 31',  name:'Other payments (Schedule 3, line 15)', read:['box','fed','31'],
    hint:"Line 31 is the net premium tax credit from Form 8962 (Step R). Check the 1095-A entries: totals only when every month is the same, otherwise month by month."},
  fed_33:  {form:'fed', line:'Line 33',  name:'Total payments', read:['box','fed','33'],
    hint:"Line 33 adds withholding, estimated payments, and refundable credits. Check lines 25d, 26, and 31 first."},
  fed_35a: {form:'fed', line:'Line 35a', name:'Refund', read:['box','fed','35a'],
    hint:"The refund is the payments minus the total tax. Check the total tax and the payment lines first."},
  fed_37:  {form:'fed', line:'Line 37',  name:'Amount you owe', read:['box','fed','37'],
    hint:"The amount owed is the total tax minus the payments. Check line 24 and the payment lines first."},

  sch1_5:  {form:'sch1', line:'Line 5',   name:'Rental real estate, partnerships (Schedule E)', read:['box','sch1','5'],
    hint:"Line 5 is the K-1 partnership income from Schedule E (Step L). Check that the K-1 was entered as a passive, publicly traded partnership with all investment at risk, as note N10 describes."},
  sch1_18: {form:'sch1', line:'Line 18',  name:'Penalty on early withdrawal of savings', read:['box','sch1','18'],
    hint:"Line 18 is box 2 of the ZYX 1099-INT (Step D), the early withdrawal penalty. Compare the 1099-INT you entered with the brokerage statement."},
  sch1_20: {form:'sch1', line:'Line 20',  name:'IRA deduction', read:['box','sch1','20'],
    hint:"Line 20 is Karl's traditional IRA contribution (Step Q): the maximum for his age, limited by his earned income. See the handout 'IRA Contributions'."},
  sch3_1:  {form:'sch3', line:'Line 1',   name:'Foreign tax credit', read:['box','sch3','1'],
    hint:"Line 1 adds the foreign tax paid on the 1099-DIVs (box 7) and on the K-1. Enter foreign tax on the federal interest or dividend screen, not on the state section."},
  sch3_2:  {form:'sch3', line:'Line 2',   name:'Child and dependent care credit', read:['box','sch3','2'],
    hint:"Line 2 is the credit for the care of Susan (Step P). Jane is a qualifying person with no expenses, and Melissa is not a qualifying person. See Pub 4012, 'Child & Dependent Care Expenses'."},
  sch3_9:  {form:'sch3', line:'Line 9',   name:'Net premium tax credit', read:['box','sch3','9'],
    hint:"Line 9 is the net premium tax credit from Form 8962 (Step R). Check the 1095-A entries month by month against the form in the problem."},
  schA_5a: {form:'schA', line:'Line 5a',  name:'State and local income or sales tax', read:['box','schA','5a'],
    hint:"Line 5a is the larger of the state income tax and the general sales tax. From Step N, use the sales tax worksheet in TaxSlayer, with the VA benefits added to the income for it (note N12)."},

  ca540_11:  {form:'ca540', line:'Line 11',  name:'California exemption amount', read:['ca','11',500],
    hint:"The exemption amount follows from Karl's personal exemption and Jane as a dependent. Re-check the dependent entries from Step A, as note N1 describes."},
  ca540_14:  {form:'ca540', line:'Line 14',  name:'California subtractions', read:['ca','14',500],
    hint:"California subtractions come from Schedule CA, column B: the U.S. Savings Bond interest (Step D) and last year's state refund (Step H). Mark savings bond interest as California exempt on the 1099-INT screen."},
  ca540_16:  {form:'ca540', line:'Line 16',  name:'California additions', read:['ca','16',500],
    hint:"California taxes interest and exempt-interest dividends from other states' bonds, so they are added on Schedule CA, column C. Check the California taxable amounts on each 1099-INT, 1099-DIV, and K-1 entry, as the answer sheet notes describe."},
  ca540_17:  {form:'ca540', line:'Line 17',  name:'California AGI', read:['ca','17',500],
    hint:"California AGI is the federal AGI minus the subtractions plus the additions. Check lines 14 and 16 first."},
  ca540_18:  {form:'ca540', line:'Line 18',  name:'California deduction', read:['ca','18',500],
    hint:"California uses the larger of its standard deduction and its own itemized deductions. From Step N, the California itemized deductions start from Schedule A. Check the Schedule A entries."},
  ca540_19:  {form:'ca540', line:'Line 19',  name:'California taxable income', read:['ca','19',500],
    hint:"California taxable income is the California AGI minus line 18. Check lines 17 and 18 first."},
  ca540_31:  {form:'ca540', line:'Line 31',  name:'California tax', read:['ca','31',500],
    hint:"California tax comes from taxable income (line 19). If line 19 is right, this follows."},
  ca540_35:  {form:'ca540', line:'Line 35',  name:'California tax after exemption credits', read:['ca','35',500],
    hint:"Line 35 is the California tax minus the exemption credits. Check line 31 and the dependent entries from Step A."},
  ca540_46:  {form:'ca540', line:'Line 46',  name:'Nonrefundable renter’s credit', read:['ca','46',500],
    hint:"Karl rents his home on Rivermeade Drive. Read the Interview Notes and the Duck Book on the California renter's credit, including its income limit."},
  ca540_48:  {form:'ca540', line:'Line 48',  name:'California tax after credits', read:['ca','48',500],
    hint:"Line 48 is the California tax minus the nonrefundable credits. Check lines 31 and 35 first."},
  ca540_64:  {form:'ca540', line:'Line 64',  name:'California total tax', read:['ca','64',500],
    hint:"Line 64 is the California tax after credits plus any other taxes. Check line 48 first."},
  ca540_72:  {form:'ca540', line:'Line 72',  name:'California estimated payments', read:['ca','72',500],
    hint:"Line 72 adds Karl's California estimated payments for the year (Step O), including the one made in January, plus last year's California refund applied to this year. Look at last year's return in the problem."},
  ca540_76:  {form:'ca540', line:'Line 76',  name:'Young child tax credit', read:['ca','76',500],
    hint:"The young child tax credit depends on Jane being under 6 and on earned income. Once Karl has wages (Step B), check that Jane is entered as a qualifying child for the California EITC."},
  ca540_78:  {form:'ca540', line:'Line 78',  name:'California total payments', read:['ca','78',500],
    hint:"Line 78 adds the California payments and refundable credits. Check line 72 first."},
  ca540_111: {form:'ca540', line:'Line 111', name:'California amount you owe', read:['ca','111',500],
    hint:"The California amount owed is the total tax minus the payments. Check lines 64 and 78 first."},
  ca540_115: {form:'ca540', line:'Line 115', name:'California refund', read:['ca','115',500],
    hint:"A California refund comes from the refundable credits (such as the young child tax credit) and payments being more than the tax. Check the California credit and payment lines."},
};

/* Answer sheet notes that point at one line at one step replace that line's hint at that step */
var K_N2="Note N2: did you enter the number of months Jane lived with Karl as 12, not 7?";
var K_N3="Note N3: different answer? Go back and read the Interview Notes and the Duck Book on the California renter's credit.";
var K_N4="Note N4: Schedule CA, line 2 should be 147; 63,519; 500; 25. Not matching? Watch the video.";
var K_N5="Note N5: incorrect amount? Read the Duck Book about box 12 under 'Line 3 - Dividends', including the 'Note for CA returns'. Schedule CA line 2 should be 38,147; 63,519; 500; 38,025, and line 3 should be 150; 232; 0; 0.";
var K_N7="Note N7: Schedule CA line 2 should be 38,933; 63,519; 500; 38,489, and line 3 should be 150; 232; 0; 0.";
var K_N8="Note N8: look at Schedule D line 10. Did you enter the sale of the main home correctly? The line should read 470,000; 240,000; -230,000; 0.";
var K_N9="Note N9: look at Schedule D. Line 1b = 6,203; 9,381; 200; -2,978. Line 7 = -2,978. Line 8a = 15,000; 12,000; 3,000. Line 9 = 27,403; 33,277; 0; -5,874. Line 10 stays 470,000; 240,000; -230,000; 0. On the Capital Loss Carryover Worksheet, line 8 = 0 and line 13 = 2,783.";
var K_N10="Note N10: did you check the boxes for 'passive entity' and 'publicly traded partnership' on the K-1 form? Schedule D line 5 = -8 and line 12 = 13.";
var K_N11="Note N11: Schedule CA line 2 should be 39,224; 63,564; 500; 38,780, and line 3 should be 175; 308; 0; 0. If not, tax-exempt interest and foreign taxes paid should be entered on the federal interest screen, not directly in the California state section.";
var K_N12="Note N12: Schedule A line 1 = $23,270; line 4 = $14,132; line 5a box checked, $1,949; line 7 = $8,005; line 10 = $7,065; line 14 = $11,425; line 17 = $40,627. If line 5a is off, did you increase the MAGI by the VA benefits (Pub 4012, page F-11)?";
var K_N13="Note N13: Schedule A line 1 = $23,270; line 4 = $14,132; line 5a box NOT checked, $2,459; line 7 = $8,515; line 10 = $7,065; line 14 = $11,425.";
var K_N13b="Note N13b: on the Capital Loss Carryover Worksheet, line 8 = 786 and line 13 = 3,992.";
var K_N14="Note N14: if you do not match, did you mark Jane as qualified but with no expenses? See Pub 4012, 'Child & Dependent Care Expenses', especially page G-15.";
var K_N15="Note N15: Schedule A line 1 = $21,058; line 4 = $12,520; line 5a box NOT checked, $2,459; line 7 = $8,515; line 10 = $7,065; line 14 = $11,425.";

var K_STEPS = [
  {id:'A', name:'Step A: Basic information', type:'check', expected:K_EXP.A, notes:['N1'], hints:{ca540_46:K_N3, ca540_76:K_N2, ca540_115:K_N2}},
  {id:'B', name:'Step B: W-2', type:'check', expected:K_EXP.B, notes:[]},
  {id:'C', name:'Step C: Seller-financed mortgage interest', type:'check', expected:K_EXP.C, notes:[]},
  {id:'D', name:'Step D: Interest (ZYX 1099-INT)', type:'check', expected:K_EXP.D, notes:[], hints:{ca540_14:K_N4, ca540_16:K_N4}},
  {id:'E', name:'Step E: Dividends (ZYX 1099-DIV)', type:'check', expected:K_EXP.E, notes:[], hints:{ca540_16:K_N5}},
  {id:'G', name:'Step G: Dividends (Wells Fargo 1099-DIV)', type:'check', expected:K_EXP.G, notes:[], hints:{ca540_16:K_N7}},
  {id:'H', name:'Step H: Last year’s California refund (1099-G)', type:'check', expected:K_EXP.H, notes:[]},
  {id:'J', name:'Step J: Sale of home (1099-S)', type:'check', expected:K_EXP.J, notes:[], hints:{fed_7a:K_N8}},
  {id:'K', name:'Step K: Brokerage sales (Schwab 1099-B)', type:'check', expected:K_EXP.K, notes:[], hints:{fed_7a:K_N9}},
  {id:'L', name:'Step L: Partnership K-1', type:'check', expected:K_EXP.L, notes:[], hints:{sch1_5:K_N10, fed_8:K_N10, ca540_16:K_N11}},
  {id:'N', name:'Step N: Itemized deductions', type:'check', expected:K_EXP.N, notes:['NN_N'], hints:{fed_12e:K_N12, schA_5a:K_N12}},
  {id:'O', name:'Step O: Estimated payments and last year’s return', type:'check', expected:K_EXP.O, notes:[], hints:{fed_12e:K_N13, fed_7a:K_N13b, fed_15:K_N13b}},
  {id:'P', name:'Step P: Child and dependent care', type:'check', expected:K_EXP.P, notes:[], hints:{sch3_2:K_N14, fed_21:K_N14}},
  {id:'Q', name:'Step Q: IRA contribution', type:'check', expected:K_EXP.Q, notes:['NN_Q']},
  {id:'R', name:'Step R: Health insurance (1095-A)', type:'check', expected:K_EXP.R, notes:[], hints:{fed_12e:K_N15}},
  {id:'S', name:'Step S: State section (no change expected from Step R)', type:'nochange', basis:'Step R', expected:K_EXP.R, notes:[]},
  {id:'T', name:'Step T: Finish the return (no change expected from Step R)', type:'nochange', basis:'Step R', expected:K_EXP.R, notes:[]}
];

var K_ORDER = ['fed_1a','fed_2a','fed_2b','fed_3a','fed_3b','fed_7a','fed_8','fed_9','fed_10','fed_11a','fed_12e','fed_13a','fed_13b','fed_15','fed_16',
  'fed_19','fed_20','fed_21','fed_22','fed_24','fed_25d','fed_26','fed_31','fed_33','fed_35a','fed_37',
  'N1','NN_N','NN_Q',
  'sch1_5','sch1_18','sch1_20','sch3_1','sch3_2','sch3_9','schA_5a',
  'ca540_11','ca540_14','ca540_16','ca540_17','ca540_18','ca540_19','ca540_31','ca540_35','ca540_46','ca540_48','ca540_64','ca540_72','ca540_76','ca540_78','ca540_111','ca540_115'];

var K_TSNOTE_COACH="Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.";
function kNN(step,what,example){ return {form:'fed', kind:'confirm', carry:false, chip:'NN', name:'TS Note added for Step '+step, mark:'nn_'+step,
  confirm:'I added a TS Note for Step '+step+' ('+what+') in TaxSlayer', example:example, coach:K_TSNOTE_COACH}; }
/* carry: true = checked at its own step and again at every later step; false = its own step only (TS Note boxes).
   N1 stays in the return, so it is checked again at every later step. */
var K_NOTES = {
  N1:{form:'fed', kind:'filing', carry:true, name:'Filing status and dependents', status:/head of household/i, taxpayer:'KARL', taxpayerName:'Karl',
    deps:[{first:'JANE', name:'Jane', box:'ctc'}],
    key:"Filing status = HOH. Using the 'Qualifying Child or Relative Resource Tool', Jane = Box 35, CTC. Kendra and Susan = Chart 2 Box 12, not a dependent, no EIC, but medical and dependent care allowed. The CTC ODC Chart shows these two are not entered on the tax return in the dependents area.",
    coach:"Start the 'Qualifying Child or Relative Resource Tool' with Karl and Kendra, then Jane and Susan. Only Jane is listed, for the child tax credit, and she lived with Karl all 12 months. Kendra and Susan are not entered as dependents at all, even as 'not a dependent'. Check the filing status and the dependents area."},
  NN_N:kNN('N','the VA benefits',"STEP N - VA BENEFITS: ENTERED $30,000 OF NON-TAXABLE VA BENEFITS INTO THE SALES TAX MAGI."),
  NN_Q:kNN('Q','the IRA contribution',"STEP Q - IRA CONTRIBUTION: KARL AGREED TO MAKE HIS 2025 IRA CONTRIBUTION OF $8,000 PRIOR TO 4/15.")
};

CASES.push({id:'kent', label:'Case: Kent (Karl Kent, 2025)', short:'Kent', lastName:'KENT',
  lines:K_LINES, steps:K_STEPS, order:K_ORDER, notes:K_NOTES, worksheet:null, extract:function(pages){ return extractByLines(K_LINES,pages); }});
