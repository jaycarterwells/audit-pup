/* Quinn case: hints, steps, notes, and its line readers. The answer key values come from cases/quinn/answer_key.json
   (ANSWER_KEYS.quinn), which tools/import_answer_sheet.js makes from the answer sheet. Built into the page by build_html.js. */
/* ---------- hints for the Quinn problem ----------
   A blank cell in the answer sheet is checked as "must be blank or $0", as for Baylor. */
var Q_EXP = expectedFromKey(ANSWER_KEYS.quinn);   /* from cases/quinn/answer_key.json */
var Q_LINES = {
  fed_1a:  {form:'fed', line:'Line 1a',  name:'Wages (W-2 box 1)', read:['box','fed','1a'],
    hint:'Line 1a comes straight from box 1 of the W-2 you entered. Re-open that W-2 in TaxSlayer and compare box 1 to the source document.'},
  fed_1d:  {form:'fed', line:'Line 1d',  name:'Medicaid Waiver Payment not on a W-2', read:['box','fed','1d'],
    hint:'Line 1d is where a Medicaid Waiver Payment with no W-2 is reported. Look again at the MWP handout and at the Medicaid Waiver Payment field below Box 14 on the W-2 screen.'},
  fed_8:   {form:'fed', line:'Line 8',   name:'Additional income (Schedule 1)', read:['box','fed','8'],
    hint:'Line 8 pulls from Schedule 1, where the excludable MWP is subtracted back out. Revisit the handout on how the payment is removed from taxable income, and check your Medicaid Waiver Payment entry.'},
  fed_9:   {form:'fed', line:'Line 9',   name:'Total income', read:['box','fed','9'],
    hint:'Line 9 is a sum of the income lines above it. If it is off, the mistake is in one of those income entries, not on line 9 itself.'},
  fed_11a: {form:'fed', line:'Line 11a', name:'Adjusted gross income', read:['box','fed','11a'],
    hint:'Line 11a is total income minus adjustments. If total income is right, look for an unexpected adjustment above this line.'},
  fed_12e: {form:'fed', line:'Line 12e', name:'Standard or itemized deduction', read:['box','fed','12e'],
    hint:'The standard deduction follows from filing status. Re-check the filing status for this taxpayer, using the dependent and head of household notes in the problem.'},
  fed_15:  {form:'fed', line:'Line 15',  name:'Taxable income', read:['box','fed','15'],
    hint:'Taxable income is AGI minus the deduction (line 11a minus line 12e, never below zero). If lines 11a and 12e are right, this follows.'},
  fed_16:  {form:'fed', line:'Line 16',  name:'Tax', read:['box','fed','16'],
    hint:'Tax comes from taxable income through the tax table. If taxable income (line 15) is right, this follows.'},
  fed_24:  {form:'fed', line:'Line 24',  name:'Total tax', read:['box','fed','24'],
    hint:'Total tax is the tax minus credits plus other taxes. If line 16 is right, look for a credit or an extra tax entered in TaxSlayer that is not in the problem.'},
  fed_25d: {form:'fed', line:'Line 25d', name:'Federal tax withheld', read:['box','fed','25d'],
    hint:'Line 25d is federal withholding from your W-2 entries. Re-open the W-2 and compare box 2 to the source document.'},
  fed_27a: {form:'fed', line:'Line 27a', name:'Earned income credit (EIC)', read:['box','fed','27a'],
    hint:'The EIC depends on earned income and the qualifying person. Re-check the dependent entry and whether earned income was entered as the problem intends.'},
  fed_33:  {form:'fed', line:'Line 33',  name:'Total payments', read:['box','fed','33'],
    hint:'Line 33 totals your payments and refundable credits. If it is off, the mistake is in a withholding or credit line above it.'},
  fed_35a: {form:'fed', line:'Line 35a', name:'Refund', read:['box','fed','35a'],
    hint:'The refund is the end result. If it is wrong, one of the checked lines above it is wrong. Fix those first and this should follow.'},

  fed_37:  {form:'fed', line:'Line 37',  name:'Amount you owe', read:['box','fed','37'],
    hint:'The amount owed is the end result. If it is wrong, one of the checked lines above it is wrong. Fix those first and this should follow.'},
  ca540_12:  {form:'ca540', line:'Line 12',  name:'State wages (W-2 box 16)', read:['ca','12',330],
    hint:'Line 12 is state wages from box 16 of the W-2. For an MWP return the handout explains how box 16 is set. Re-check box 16 and the handout note on California wages.'},
  ca540_14:  {form:'ca540', line:'Line 14',  name:'California subtractions', read:['ca','14',500],
    hint:'Line 14 comes from Schedule CA (540), column B. Look for an amount entered on a California adjustment screen in TaxSlayer that is not in the problem.'},
  ca540_16:  {form:'ca540', line:'Line 16',  name:'California additions', read:['ca','16',500],
    hint:'Line 16 comes from Schedule CA (540), column C. Look for an amount entered on a California adjustment screen in TaxSlayer that is not in the problem.'},
  ca540_17:  {form:'ca540', line:'Line 17',  name:'California AGI', read:['ca','17',500],
    hint:'CA AGI builds from federal AGI and the Schedule CA adjustments. If federal AGI is right, look at the Schedule CA entries.'},
  ca540_18:  {form:'ca540', line:'Line 18',  name:'California deduction', read:['ca','18',500],
    hint:'The California deduction follows from filing status. Confirm the filing status first, then confirm which standard deduction applies.'},
  ca540_19:  {form:'ca540', line:'Line 19',  name:'California taxable income', read:['ca','19',500],
    hint:'CA taxable income is CA AGI minus the deduction. If both of those are right, this follows. Otherwise re-check them.'},
  ca540_31:  {form:'ca540', line:'Line 31',  name:'California tax', read:['ca','31',500],
    hint:'CA tax comes from taxable income through the tax table. If taxable income is right, re-check that the correct table or method was used.'},
  ca540_32:  {form:'ca540', line:'Line 32',  name:'Exemption credit', read:['ca','32',500],
    hint:'The exemption credit depends on the taxpayer and the dependents claimed. Re-check the dependent and exemption entries.'},
  ca540_35:  {form:'ca540', line:'Line 35',  name:'California tax after credits', read:['ca','35',500],
    hint:'Line 35 is the California tax (line 31) minus the credits, starting with the exemption credit (line 32). If lines 31 and 32 are right, this follows.'},
  ca540_64:  {form:'ca540', line:'Line 64',  name:'California total tax', read:['ca','64',500],
    hint:'Line 64 adds any other California taxes to line 35. If line 35 is right, look for an extra California tax entered in TaxSlayer that is not in the problem.'},
  ca540_71:  {form:'ca540', line:'Line 71',  name:'California tax withheld', read:['ca','71',500],
    hint:'Line 71 is California withholding from box 17 of the W-2. Re-open the W-2 and compare box 17 to the source document.'},
  ca540_75:  {form:'ca540', line:'Line 75',  name:'California EITC', read:['ca','75',500],
    hint:'CA EITC depends on California earned income. Re-check the earned income entries, and for an MWP return see the handout on how California treats the payment for the credit.'},
  ca540_78:  {form:'ca540', line:'Line 78',  name:'Total payments', read:['ca','78',500],
    hint:'Line 78 totals California payments and credits. If it is off, the mistake is in a withholding or EITC line above it.'},
  ca540_111: {form:'ca540', line:'Line 111', name:'California amount you owe', read:['ca','111',500],
    hint:'The amount owed is the end result. If it is wrong, one of the checked California lines above it is wrong. Fix those first and this should follow.'},
  ca540_115: {form:'ca540', line:'Line 115', name:'California refund', read:['ca','115',500],
    hint:'The California refund is the end result. If it is wrong, one of the checked California lines above it is wrong. Fix those first.'},

  ca3514_2:  {form:'ca3514', line:'Line 2',  name:'Federal AGI', read:['ca','2',500,'ca3514',430,460],
    hint:'Line 2 carries federal AGI onto the 3514. If federal AGI is right this will match. Otherwise fix federal AGI first.'},
  ca3514_13: {form:'ca3514', line:'Line 13', name:'California wages', read:['ca','13',500,'ca3514',430,460],
    hint:'Line 13 is California wages used for the credit. For an MWP return the handout explains how the payment affects this figure. Re-check the handout and box 16.'},
  ca3514_14: {form:'ca3514', line:'Line 14', name:'IHSS / MWP payments', read:['ca','14',500,'ca3514',430,460],
    hint:'Line 14 is where IHSS and Medicaid Waiver Payments are reported for the California credit. Revisit the handout on how the payment flows to the 3514, and the Medicaid Waiver Payment field in TaxSlayer.'},
  ca3514_19: {form:'ca3514', line:'Line 19', name:'California earned income', read:['ca','19',500,'ca3514',430,460],
    hint:'Line 19 is your California earned income for the credit. Whether the MWP is included here depends on the option you chose. Re-check the option you selected on the MWP Worksheet.'}
};

var EXP_A = Q_EXP.A, EXP_B = Q_EXP.B, EXP_E = Q_EXP.E;

var Q_STEPS = [
  {id:'A', name:'Step A: Basic information', type:'check', expected:EXP_A, notes:['N1']},
  {id:'B', name:'Step B: W-2 income entered', type:'check', expected:EXP_B, notes:[]},
  {id:'D', name:'Step D: no change expected from Step B', type:'nochange', basis:'Step B', expected:EXP_B, notes:[]},
  {id:'E', name:'Step E: Medicaid Waiver Payment (MWP)', type:'check', expected:EXP_E, notes:['N2','N3','NN']},
  {id:'F', name:'Step F: no change expected from Step E', type:'nochange', basis:'Step E', expected:EXP_E, notes:['N2','N3','NN']}
];

/* Output order follows the answer key, top to bottom. Notes sit where the key places them. */
var Q_ORDER = ['fed_1a','fed_1d','fed_8','fed_9','fed_11a','fed_12e','fed_15','fed_16','fed_24','fed_25d','fed_27a','fed_33','fed_35a','fed_37','N2','N1','NN',
  'ca540_12','ca540_14','ca540_16','ca540_17','ca540_18','ca540_19','ca540_31','ca540_32','ca540_35','ca540_64','ca540_71','ca540_75','ca540_78','ca540_111','ca540_115',
  'ca3514_2','ca3514_13','ca3514_14','ca3514_19','N3'];

/* Answer key MWP Worksheet (attached to the answer sheet). Option 1 is circled. */
var Q_WORKSHEET = {
  circled:1,
  cols:['Federal AGI','Federal EITC','Federal refund','CA EITC','CA refund','CA 3514 wages / EI','Total refund'],
  rows:[ [1,'NNN',15000,312,2112,165,915,15000,3027],
         [2,'NNY',15000,312,2112,21,771,30679,2883],
         [3,'NYN',15000,0,1800,165,915,15000,2715],
         [4,'NYY',15000,0,1800,21,771,30679,2571],
         [5,'YYY',30679,0,1592,21,771,30679,2363] ]
};

var Q_NOTES = {
  N1:{form:'fed', kind:'filing', name:'Filing status and dependent', status:/head of household/i, dependent:'JAMES', dependentName:'James', minMonths:7,
    key:'Filing status = HOH. Using the Resource Tool, James is a dependent of Raymond and lived in his home for more than half the year (Chart 2, Box 25).',
    coach:'Walk James through the Resource Tool, Chart 2: his relationship to Raymond, the months he lived in the home, and support. That decides his dependent status, and his dependent status drives the filing status. Then check the dependent and filing status screens in TaxSlayer.'},
  N2:{form:'fed', kind:'mwpRefunds', name:'Both refunds match the option you chose',
    coach:'Both refunds should equal the results of the option you circled on your MWP Worksheet. If they do not, the W-2 screen in TaxSlayer is probably still set up for another option you tested. Re-check the Medicaid Waiver Payment field, the include in earned income box, and Box 16.'},
  N3:{form:'ca3514', kind:'mwpWorksheet', name:'MWP Worksheet scenarios',
    coach:'For any option that does not match, set the W-2 screen back to that option\'s three settings (Medicaid Waiver Payment field, include in earned income box, Box 16) and read the results again.'},
  NN:{form:'fed', kind:'confirm', name:'TS Note added for this step', mark:'nn', confirm:'I added a TS Note for Step E in TaxSlayer',
    example:'STEP E - MWP: FOR TAX YEAR 2025, THE MWP WORKSHEET WAS COMPLETED, ENTERED INTO TS AND THEN PLACED IN THE TP ENVELOPE. OPTION 1 WAS THE BEST ENTRY COMBINATION FOR THIS YEAR.',
    coach:'Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year\'s counselor should know.'}
};
CASES.push({id:'quinn', label:'Case: Quinn (Raymond Quinn, 2025)',
  lines:Q_LINES, steps:Q_STEPS, order:Q_ORDER, notes:Q_NOTES, worksheet:Q_WORKSHEET, extract:function(pages){ return extractByLines(Q_LINES,pages); }});
