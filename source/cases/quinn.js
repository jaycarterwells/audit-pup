/* Quinn case: answer key, hints, steps, notes, and its line readers. Built into the page by build_html.js. */
/* ---------- answer key + hints for the Quinn problem ---------- */
/* Values are NOT shown to the student. Only pass/fail and a single hint. */
var Q_LINES = {
  fed_1a:  {form:'fed', line:'Line 1a',  name:'Wages (W-2 box 1)',
    hint:'Line 1a comes straight from box 1 of the W-2 you entered. Re-open that W-2 in TaxSlayer and compare box 1 to the source document.'},
  fed_1d:  {form:'fed', line:'Line 1d',  name:'Medicaid Waiver Payment not on a W-2',
    hint:'Line 1d is where a Medicaid Waiver Payment with no W-2 is reported. Look again at the MWP handout and at the Medicaid Waiver Payment field below Box 14 on the W-2 screen.'},
  fed_8:   {form:'fed', line:'Line 8',   name:'Additional income (Schedule 1)',
    hint:'Line 8 pulls from Schedule 1, where the excludable MWP is subtracted back out. Revisit the handout on how the payment is removed from taxable income, and check your Medicaid Waiver Payment entry.'},
  fed_9:   {form:'fed', line:'Line 9',   name:'Total income',
    hint:'Line 9 is a sum of the income lines above it. If it is off, the mistake is in one of those income entries, not on line 9 itself.'},
  fed_11a: {form:'fed', line:'Line 11a', name:'Adjusted gross income',
    hint:'Line 11a is total income minus adjustments. If total income is right, look for an unexpected adjustment above this line.'},
  fed_12e: {form:'fed', line:'Line 12e', name:'Standard or itemized deduction',
    hint:'The standard deduction follows from filing status. Re-check the filing status for this taxpayer, using the dependent and head of household notes in the problem.'},
  fed_25d: {form:'fed', line:'Line 25d', name:'Federal tax withheld',
    hint:'Line 25d is federal withholding from your W-2 entries. Re-open the W-2 and compare box 2 to the source document.'},
  fed_27:  {form:'fed', line:'Line 27',  name:'Earned income credit (EIC)',
    hint:'The EIC depends on earned income and the qualifying person. Re-check the dependent entry and whether earned income was entered as the problem intends.'},
  fed_33:  {form:'fed', line:'Line 33',  name:'Total payments',
    hint:'Line 33 totals your payments and refundable credits. If it is off, the mistake is in a withholding or credit line above it.'},
  fed_35a: {form:'fed', line:'Line 35a', name:'Refund',
    hint:'The refund is the end result. If it is wrong, one of the checked lines above it is wrong. Fix those first and this should follow.'},

  ca540_12:  {form:'ca540', line:'Line 12',  name:'State wages (W-2 box 16)',
    hint:'Line 12 is state wages from box 16 of the W-2. For an MWP return the handout explains how box 16 is set. Re-check box 16 and the handout note on California wages.'},
  ca540_17:  {form:'ca540', line:'Line 17',  name:'California AGI',
    hint:'CA AGI builds from federal AGI and the Schedule CA adjustments. If federal AGI is right, look at the Schedule CA entries.'},
  ca540_18:  {form:'ca540', line:'Line 18',  name:'California deduction',
    hint:'The California deduction follows from filing status. Confirm the filing status first, then confirm which standard deduction applies.'},
  ca540_19:  {form:'ca540', line:'Line 19',  name:'California taxable income',
    hint:'CA taxable income is CA AGI minus the deduction. If both of those are right, this follows. Otherwise re-check them.'},
  ca540_31:  {form:'ca540', line:'Line 31',  name:'California tax',
    hint:'CA tax comes from taxable income through the tax table. If taxable income is right, re-check that the correct table or method was used.'},
  ca540_32:  {form:'ca540', line:'Line 32',  name:'Exemption credit',
    hint:'The exemption credit depends on the taxpayer and the dependents claimed. Re-check the dependent and exemption entries.'},
  ca540_71:  {form:'ca540', line:'Line 71',  name:'California tax withheld',
    hint:'Line 71 is California withholding from box 17 of the W-2. Re-open the W-2 and compare box 17 to the source document.'},
  ca540_75:  {form:'ca540', line:'Line 75',  name:'California EITC',
    hint:'CA EITC depends on California earned income. Re-check the earned income entries, and for an MWP return see the handout on how California treats the payment for the credit.'},
  ca540_78:  {form:'ca540', line:'Line 78',  name:'Total payments',
    hint:'Line 78 totals California payments and credits. If it is off, the mistake is in a withholding or EITC line above it.'},
  ca540_115: {form:'ca540', line:'Line 115', name:'California refund',
    hint:'The California refund is the end result. If it is wrong, one of the checked California lines above it is wrong. Fix those first.'},

  ca3514_2:  {form:'ca3514', line:'Line 2',  name:'Federal AGI',
    hint:'Line 2 carries federal AGI onto the 3514. If federal AGI is right this will match. Otherwise fix federal AGI first.'},
  ca3514_13: {form:'ca3514', line:'Line 13', name:'California wages',
    hint:'Line 13 is California wages used for the credit. For an MWP return the handout explains how the payment affects this figure. Re-check the handout and box 16.'},
  ca3514_14: {form:'ca3514', line:'Line 14', name:'IHSS / MWP payments',
    hint:'Line 14 is where IHSS and Medicaid Waiver Payments are reported for the California credit. Revisit the handout on how the payment flows to the 3514, and the Medicaid Waiver Payment field in TaxSlayer.'},
  ca3514_19: {form:'ca3514', line:'Line 19', name:'California earned income',
    hint:'Line 19 is your California earned income for the credit. Whether the MWP is included here depends on the option you chose. Re-check the option you selected on the MWP Worksheet.'}
};

var EXP_B ={fed_1a:15000, fed_9:15000, fed_11a:15000, fed_12e:23625, fed_25d:1800, fed_27:312, fed_33:2112, fed_35a:2112,
  ca540_12:15000, ca540_17:15000, ca540_18:11412, ca540_19:3588, ca540_31:36, ca540_32:628, ca540_71:750, ca540_75:165, ca540_78:915, ca540_115:915,
  ca3514_2:15000, ca3514_13:15000, ca3514_19:15000};
var EXP_E = Object.assign({}, EXP_B, {fed_1d:15679, fed_8:-15679, ca540_12:30679, ca3514_13:30679, ca3514_14:15679});
var EXP_A = {fed_12e:23625, ca540_18:11412, ca540_32:628};

var Q_STEPS = [
  {id:'A', name:'Step A: Basic information', type:'check', expected:EXP_A, notes:['N1']},
  {id:'B', name:'Step B: W-2 income entered', type:'check', expected:EXP_B, notes:[]},
  {id:'D', name:'Step D: no change expected from Step B', type:'nochange', basis:'Step B', expected:EXP_B, notes:[]},
  {id:'E', name:'Step E: Medicaid Waiver Payment (MWP)', type:'check', expected:EXP_E, notes:['N2','N3','NN']},
  {id:'F', name:'Step F: no change expected from Step E', type:'nochange', basis:'Step E', expected:EXP_E, notes:['N2','N3','NN']}
];

/* Output order follows the answer key, top to bottom. Notes sit where the key places them. */
var Q_ORDER = ['fed_1a','fed_1d','fed_8','fed_9','fed_11a','fed_12e','fed_25d','fed_27','fed_33','fed_35a','N2','N1','NN',
  'ca540_12','ca540_17','ca540_18','ca540_19','ca540_31','ca540_32','ca540_71','ca540_75','ca540_78','ca540_115',
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
  lines:Q_LINES, steps:Q_STEPS, order:Q_ORDER, notes:Q_NOTES, worksheet:Q_WORKSHEET, extract:function(pages){ return extractQuinn(pages); }});

function extractQuinn(pages){
  return {
    fed_1a: fedValue(pages,'1a',/Total amount from Form\(s\) W-2, box 1/),
    fed_1d: fedValue(pages,'1d',/Medicaid waiver payments not reported/),
    fed_8:  fedValue(pages,'8',/Additional income from Schedule 1, line 10/),
    fed_9:  fedValue(pages,'9',/This is your total income/),
    fed_11a:fedValue(pages,'11a',/This is your adjusted gross income/),
    fed_12e:fedValue(pages,'12e',/Standard deduction or itemized deductions/),
    fed_25d:fedValue(pages,'25d',/Add lines 25a through 25c/),
    fed_27: fedValue(pages,'27a',/Earned income credit \(EIC\)/),
    fed_33: fedValue(pages,'33',/Add lines 25d, 26, and 32/),
    fed_35a:fedValue(pages,'35a',/you want refunded to you/,true),
    ca540_12: caValue(pages,'ca540','12',330),
    ca540_17: caValue(pages,'ca540','17',500),
    ca540_18: caValue(pages,'ca540','18',500),
    ca540_19: caValue(pages,'ca540','19',500),
    ca540_31: caValue(pages,'ca540','31',500),
    ca540_32: caValue(pages,'ca540','32',500),
    ca540_71: caValue(pages,'ca540','71',500),
    ca540_75: caValue(pages,'ca540','75',500),
    ca540_78: caValue(pages,'ca540','78',500),
    ca540_115: caValue(pages,'ca540','115',500),
    ca3514_2:  caValue(pages,'ca3514','2',500,430,460),
    ca3514_13: caValue(pages,'ca3514','13',500,430,460),
    ca3514_14: caValue(pages,'ca3514','14',500,430,460),
    ca3514_19: caValue(pages,'ca3514','19',500,430,460)
  };
}
