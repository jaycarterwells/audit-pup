/* Baylor case: hints, steps, and notes. The answer key values come from cases/baylor/answer_key.json
   (ANSWER_KEYS.baylor), which tools/import_answer_sheet.js makes from the answer sheet. Built into the page by build_html.js. */
/* ---------- answer key + hints for the Baylor problem ----------
   Expected values come from the Baylor answer sheet (2025). A blank cell in the answer sheet is checked
   as "must be blank or $0". Hints approved by Carter for 0.14.0. */
var B_EXP = expectedFromKey(ANSWER_KEYS.baylor);   /* from cases/baylor/answer_key.json */

var B_LINES = {
  fed_1a:  {form:'fed', line:'Line 1a',  name:'Wages (W-2 box 1)', read:['box','fed','1a'],
    hint:"Line 1a adds box 1 of every W-2 entered so far. Compare each W-2 you entered in TaxSlayer with box 1 of the W-2s in the problem for the steps you have finished."},
  fed_1b:  {form:'fed', line:'Line 1b',  name:'Household employee wages (election worker pay)', read:['box','fed','1b'],
    hint:"Line 1b is where the election worker pay goes. See 'Election Worker Income' in Pub 4012 for how to enter pay that came with no W-2 (Step I)."},
  fed_2a:  {form:'fed', line:'Line 2a',  name:'Tax-exempt interest', read:['box','fed','2a',200,260],
    hint:"Line 2a is the $10 HSA interest from Step N. The handout 'HSA Notes' explains how to enter it so it is tax-exempt for the IRS but taxable for California."},
  fed_8:   {form:'fed', line:'Line 8',   name:'Additional income (Schedule 1, line 10)', read:['box','fed','8'],
    hint:"Line 8 comes from Schedule 1, line 10. Check the Schedule 1 lines in this list first; this total follows from them."},
  fed_9:   {form:'fed', line:'Line 9',   name:'Total income', read:['box','fed','9'],
    hint:"Line 9 is a sum of the income lines above it. If it is off, the mistake is in one of those income entries, not on line 9 itself."},
  fed_11a: {form:'fed', line:'Line 11a', name:'Adjusted gross income', read:['box','fed','11a'],
    hint:"Line 11a is total income minus the adjustments on Schedule 1, line 26. If total income is right, look at the adjustments (jury pay given to the employer, the HSA deduction)."},
  fed_12e: {form:'fed', line:'Line 12e', name:'Standard or itemized deduction', read:['box','fed','12e'],
    hint:"The standard deduction follows from filing status. Michael is a qualifying surviving spouse (Step A, note N1). Itemizing is right only when Schedule A is larger, and here it is not."},
  fed_15:  {form:'fed', line:'Line 15',  name:'Taxable income', read:['box','fed','15'],
    hint:"Taxable income is AGI minus the deduction. If lines 11a and 12e are right, this follows."},
  fed_16:  {form:'fed', line:'Line 16',  name:'Tax', read:['box','fed','16'],
    hint:"Tax comes from taxable income through the tax table. If taxable income is right, this follows."},
  fed_24:  {form:'fed', line:'Line 24',  name:'Total tax', read:['box','fed','24'],
    hint:"Total tax is tax minus credits plus other taxes. Check Willie's child tax credit, the Schedule 3 credits, and the Schedule 2 taxes in this list."},
  fed_25d: {form:'fed', line:'Line 25d', name:'Federal tax withheld', read:['box','fed','25d'],
    hint:"Line 25d adds federal withholding from every W-2 (box 2) and the unemployment Form 1099-G (box 4). Compare each one you entered with the problem."},
  fed_27a: {form:'fed', line:'Line 27a', name:'Earned income credit (EIC)', read:['box','fed','27a'],
    hint:"The EIC depends on earned income and on Willie as a qualifying child. Re-check his dependent entry from Step A and the W-2 amounts."},
  fed_28:  {form:'fed', line:'Line 28',  name:'Additional child tax credit (ACTC)', read:['box','fed','28'],
    hint:"The additional child tax credit depends on Willie qualifying for the child tax credit (note N1) and on earned income. Re-check his dependent screen."},
  fed_33:  {form:'fed', line:'Line 33',  name:'Total payments', read:['box','fed','33'],
    hint:"Line 33 totals withholding and refundable credits. If it is off, the mistake is in a withholding or credit line above it."},
  fed_35a: {form:'fed', line:'Line 35a', name:'Refund', read:['box','fed','35a'],
    hint:"The refund is the end result. If it is wrong, one of the checked lines above it is wrong. Fix those first and this should follow."},
  fed_37:  {form:'fed', line:'Line 37',  name:'Amount you owe', read:['box','fed','37'],
    hint:"The amount owed is the end result. If it is wrong, one of the checked lines above it is wrong. Fix those first and this should follow."},

  sch1_7:  {form:'sch1', line:'Line 7',   name:'Unemployment compensation', read:['box','sch1','7'],
    hint:"Schedule 1, line 7 is box 1 of the unemployment Form 1099-G in Step G."},
  sch1_8c: {form:'sch1', line:'Line 8c',  name:'Cancellation of debt', read:['box','sch1','8c'],
    hint:"Line 8c is box 2 of the Form 1099-C in Step H. Michael is not insolvent and the debt is personal, so the whole amount is income."},
  sch1_8f: {form:'sch1', line:'Line 8f',  name:'Income from Form 8889 (HSA)', read:['box','sch1','8f'],
    hint:"Line 8f is HSA money not spent on qualified medical expenses. Go through each Step N distribution and decide which ones qualify (the Zumba classes had no letter of medical necessity)."},
  sch1_8h: {form:'sch1', line:'Line 8h',  name:'Jury duty pay', read:['box','sch1','8h'],
    hint:"Line 8h is all of the jury duty pay from Step J: 10 weekdays at $40 a day."},
  sch1_13: {form:'sch1', line:'Line 13',  name:'HSA deduction', read:['box','sch1','13'],
    hint:"Line 13 is the HSA deduction from Form 8889: the contribution Michael made himself in Step N."},
  sch1_20: {form:'sch1', line:'Line 20',  name:'IRA deduction', read:['box','sch1','20'],
    hint:"Nothing in this case is an IRA contribution. Look for an HSA or retirement amount that was entered as an IRA."},
  sch1_24a:{form:'sch1', line:'Line 24a', name:'Jury pay given to the employer', read:['box','sch1','24a'],
    hint:"Line 24a is the jury pay Michael had to give his employer: the 5 weekdays his salary continued, at $40 a day."},
  sch2_17c:{form:'sch2', line:'Line 17c', name:'Additional tax on HSA distributions', read:['box','sch2','17c'],
    hint:"Line 17c is the 20% additional tax on HSA money not spent on qualified medical expenses (Schedule 1, line 8f)."},
  sch3_2:  {form:'sch3', line:'Line 2',   name:'Child and dependent care credit', read:['box','sch3','2'],
    hint:"Schedule 3, line 2 is the child and dependent care credit from Form 2441, for Willie's care in Step L."},
  sch3_3:  {form:'sch3', line:'Line 3',   name:'Education credit', read:['box','sch3','3'],
    hint:"Line 3 is the education credit from Form 8863 for the Step O Form 1098-T. Read the Step O notes to decide which credit Michael qualifies for, and do not rely on the TaxSlayer pop-up."},
  schA_5a: {form:'schA', line:'Line 5a',  name:'State and local income tax', read:['box','schA','5a'],
    hint:"Schedule A, line 5a picks up California withholding (box 17) and CASDI (box 14) from the W-2s. Compare boxes 14 and 17 on each W-2 you entered with the problem."},
  schA_17: {form:'schA', line:'Line 17',  name:'Total itemized deductions', read:['box','schA','17'],
    hint:"Schedule A, line 17 totals the itemized deductions entered. Only the state taxes from the W-2s belong here in this case."},
  f8880_2: {form:'f8880', line:'Line 2',  name:'Elective deferrals', read:['box','f8880','2',400,440],
    hint:"Form 8880, line 2 is the elective deferral in box 12 (code D) of the Betts Technology W-2."},

  ca540_12:  {form:'ca540', line:'Line 12',  name:'State wages (W-2 box 16)', read:['ca','12',330],
    hint:"Line 12 is state wages from box 16 of every W-2 entered so far. Compare box 16 of each W-2 in TaxSlayer with the problem."},
  ca540_14:  {form:'ca540', line:'Line 14',  name:'California subtractions', read:['ca','14',500],
    hint:"Line 14 comes from Schedule CA. California does not tax unemployment, and some differences need a manual entry. See the 'CA Adjustments Worksheet'."},
  ca540_16:  {form:'ca540', line:'Line 16',  name:'California additions', read:['ca','16',500],
    hint:"Line 16 comes from Schedule CA. California taxes the HSA money that the IRS does not (box 12 code W on the Betts W-2, and later the HSA interest). See the 'CA Adjustments Worksheet'."},
  ca540_18:  {form:'ca540', line:'Line 18',  name:'California deduction', read:['ca','18',500],
    hint:"The California deduction follows from filing status. Confirm the filing status first (note N1)."},
  ca540_19:  {form:'ca540', line:'Line 19',  name:'California taxable income', read:['ca','19',500],
    hint:"CA taxable income is CA AGI minus the deduction. If the subtraction and addition lines are right, this follows."},
  ca540_31:  {form:'ca540', line:'Line 31',  name:'California tax', read:['ca','31',500],
    hint:"CA tax comes from taxable income through the tax table. If taxable income is right, this follows."},
  ca540_32:  {form:'ca540', line:'Line 32',  name:'Exemption credit', read:['ca','32',500],
    hint:"The exemption credit depends on filing status and dependents. Re-check the Step A filing status and Willie's dependent entry."},
  ca540_40:  {form:'ca540', line:'Line 40',  name:'California child and dependent care credit', read:['ca','40',500],
    hint:"Line 40 follows from the Step L care expenses. Check the qualified expense amount you entered."},
  ca540_46:  {form:'ca540', line:'Line 46',  name:'Renter’s credit', read:['ca','46',500],
    hint:"Line 46 is the nonrefundable renter's credit. Michael rents the land under his mobile home (Interview Notes)."},
  ca540_47:  {form:'ca540', line:'Line 47',  name:'Total California credits', read:['ca','47',500],
    hint:"Line 47 totals the California credits. Check the renter's credit first."},
  ca540_71:  {form:'ca540', line:'Line 71',  name:'California tax withheld', read:['ca','71',500],
    hint:"Line 71 is California withholding from box 17 of each W-2. Compare box 17 of each W-2 in TaxSlayer with the problem."},
  ca540_75:  {form:'ca540', line:'Line 75',  name:'California EITC', read:['ca','75',500],
    hint:"The California EITC depends on California earned income and on Willie as a qualifying child."},
  ca540_78:  {form:'ca540', line:'Line 78',  name:'Total payments', read:['ca','78',500],
    hint:"Line 78 totals California payments and credits. If it is off, the mistake is in a withholding or EITC line above it."},
  ca540_91:  {form:'ca540', line:'Line 91',  name:'Use tax', read:['ca','91',440],
    hint:"Michael said he owes $35 in California use tax (Interview Notes). Line 91 must not be left blank."},
  ca540_111: {form:'ca540', line:'Line 111', name:'Amount you owe', read:['ca','111',500],
    hint:"The amount owed to California is the end result. Fix the checked California lines above it first."},
  ca540_115: {form:'ca540', line:'Line 115', name:'California refund', read:['ca','115',500],
    hint:"The California refund is the end result. If it is wrong, one of the checked California lines above it is wrong. Fix those first."}
};

/* Answer sheet notes that point at one line at one step replace that line's hint at that step */
var B_N3="Note N3: read the information on Renter's Credit in the Duck Book if your answer does not match.";
var B_N5="Note N5: always enter the state information on a W-2, even when nothing is withheld. That is the only way TaxSlayer knows the income also belongs to California.";
var B_N6="Note N6: review what you entered for box 14 of the W-2. The STRS amount was a required contribution, not an elective one.";
var B_N7="Note N7: this needs a manual entry on the state return. The Eskaton W-2 box 1 and box 16 differ, so note the Fed/CA wage difference on line B-8z of the 'CA Adjustments Worksheet' and make the manual adjustment described under 'Line A-1 Wages' in the handout 'CA CA Instructions'.";
var B_N8="Note N8: the Form 1099-G for last year's California refund should not be entered, because Michael did not itemize last year.";
var B_N9="Note N9: see Jury Duty in Pub 4012. The jury pay and the amount given to the employer cannot be netted against each other.";
var B_N11="Note N11: Willie qualifies for only 4 months of care, because he turned 13 on May 1. Enter only the qualified expenses, not the total paid.";
var B_N12="Note N12: Michael did not need to itemize. Compare the itemized total with his standard deduction before entering Step M.";
var B_N13="Note N13: double-check the manual California changes for an HSA, using the last bullet under 'Distributions From HSA' in the handout 'HSA Notes'.";

var B_STEPS = [
  {id:'A', name:'Step A: Basic information', type:'check', expected:B_EXP.A, notes:['N1','N2','NN_A'], hints:{ca540_46:B_N3}},
  {id:'B', name:'Step B: W-2 from Betts Technology', type:'check', expected:B_EXP.B, notes:['N4'], hints:{ca540_12:B_N5}},
  {id:'C', name:'Step C: W-2 from El Dorado County Schools', type:'check', expected:B_EXP.C, notes:[], hints:{f8880_2:B_N6}},
  {id:'E', name:'Step E: W-2 from Eskaton Properties', type:'check', expected:B_EXP.E, notes:['NN_E'], hints:{ca540_14:B_N7}},
  {id:'F', name:'Step F: Last year’s California refund', type:'check', expected:B_EXP.F, notes:[], tip:B_N8, hints:{ca540_14:B_N7}},
  {id:'G', name:'Step G: Unemployment (1099-G)', type:'check', expected:B_EXP.G, notes:[]},
  {id:'H', name:'Step H: Cancelled debt (1099-C)', type:'check', expected:B_EXP.H, notes:[]},
  {id:'I', name:'Step I: Election worker pay', type:'check', expected:B_EXP.I, notes:['NP','NN_I']},
  {id:'J', name:'Step J: Jury duty pay', type:'check', expected:B_EXP.J, notes:[], hints:{sch1_8h:B_N9, sch1_24a:B_N9}},
  {id:'L', name:'Step L: Child and dependent care', type:'check', expected:B_EXP.L, notes:[], hints:{sch3_2:B_N11, ca540_40:B_N11}},
  {id:'M', name:'Step M: Itemize or not', type:'check', expected:B_EXP.M, notes:[], hints:{fed_12e:B_N12, schA_5a:B_N12, schA_17:B_N12}},
  {id:'N', name:'Step N: Health savings account (HSA)', type:'check', expected:B_EXP.N, notes:['NN_N'], hints:{ca540_14:B_N13, ca540_16:B_N13}},
  {id:'O', name:'Step O: Education credit (1098-T)', type:'check', expected:B_EXP.O, notes:[]},
  {id:'P', name:'Step P: no change expected from Step O', type:'nochange', basis:'Step O', expected:B_EXP.O, notes:[]},
  {id:'R', name:'Step R: no change expected from Step O', type:'nochange', basis:'Step O', expected:B_EXP.O, notes:[]}
];

var B_ORDER = ['fed_1a','fed_1b','fed_2a','fed_8','fed_9','fed_11a','fed_12e','fed_15','fed_16','fed_24','fed_25d','fed_27a','fed_28','fed_33','fed_35a','fed_37',
  'N1','N2','NN_A','N4','NP','NN_E','NN_I','NN_N',
  'sch1_7','sch1_8c','sch1_8f','sch1_8h','sch1_13','sch1_20','sch1_24a','sch2_17c','sch3_2','sch3_3','schA_5a','schA_17','f8880_2',
  'ca540_12','ca540_14','ca540_16','ca540_18','ca540_19','ca540_31','ca540_32','ca540_40','ca540_46','ca540_47','ca540_71','ca540_75','ca540_78','ca540_91','ca540_111','ca540_115'];

var B_TSNOTE_COACH="Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.";
var B_NOTES = {
  N1:{form:'fed', kind:'filing', name:'Filing status and dependent', status:/qualifying surviving spouse/i, dependent:'WILLIAM', dependentName:'Willie (William)', minMonths:7, ctc:true,
    key:"Filing status = QSS. Using the 'Qualifying Child or Relative Resource Tool', Willie = Box 35, CTC.",
    coach:"Joan died in 2023 and Michael supports his son, so check the qualifying surviving spouse rules. Walk Willie through the Resource Tool and the handout 'CTC ODC Chart' to decide his dependent status and the child tax credit box. Then check the filing status and dependent screens in TaxSlayer."},
  N2:{form:'fed', kind:'ippin', name:'Identity Protection PIN entered', pin:'543456',
    coach:"Michael's IP PIN is in the Interview Notes. Enter it in TaxSlayer where the taxpayer's Identity Protection PIN is asked for, and add a TS Note about it (the next item)."},
  NN_A:{form:'fed', kind:'confirm', chip:'NN', name:'TS Note added for Step A', mark:'nn_A', confirm:'I added a TS Note for Step A (the IP PIN) in TaxSlayer',
    example:'STEP A - IP PIN: TP HAS AN IP PIN', coach:B_TSNOTE_COACH},
  N4:{form:'fed', kind:'w2text', name:'Betts W-2 address matches the form', employer:'BETTS', text:'PO BOX 540', shown:'PO Box 540',
    coach:"The Betts Technology W-2 shows Michael's address as PO Box 540. Enter the address on the W-2 screen in TaxSlayer exactly as it is printed on the form."},
  NP:{form:'fed', kind:'prepnote', name:'Preparer Note added',
    coach:"Pub 4012, 'Election Worker Income', says to add a Preparer Note when election worker pay is entered. Add one in TaxSlayer and print a new PDF."},
  NN_E:{form:'fed', kind:'confirm', chip:'NN', name:'TS Note added for Step E', mark:'nn_E', confirm:'I added a TS Note for Step E (the wage difference) in TaxSlayer',
    example:'STEP E - FED/STATE WAGE DIFFERENCE: ESKATON PROPERTIES W-2 HAD A FED/STATE WAGE DIFFERENCE. A MANUAL ADJUSTMENT WAS MADE TO THE CA STATE RETURN.', coach:B_TSNOTE_COACH},
  NN_I:{form:'fed', kind:'confirm', chip:'NN', name:'TS Note added for Step I', mark:'nn_I', confirm:'I added a TS Note for Step I (election worker pay) in TaxSlayer',
    example:'STEP I - ELECTION WORKER PAY: ELECTION WORKER PAY ENTERED AS HOUSEHOLD EMPLOYEE INCOME.', coach:B_TSNOTE_COACH},
  NN_N:{form:'fed', kind:'confirm', chip:'NN', name:'TS Note added for Step N', mark:'nn_N', confirm:'I added a TS Note for Step N (the HSA interest) in TaxSlayer',
    example:'STEP N - HSA INTEREST: INTEREST AMOUNT OF $10 MUST BE REPORTED AS TAXABLE FOR CA. ENTERED ON 1099-INT, FED TAX EXEMPT MADE TAXABLE FOR CA.', coach:B_TSNOTE_COACH}
};

CASES.push({id:'baylor', label:'Case: Baylor (Michael Baylor, 2025)',
  lines:B_LINES, steps:B_STEPS, order:B_ORDER, notes:B_NOTES, worksheet:null, extract:function(pages){ return extractByLines(B_LINES,pages); }});
