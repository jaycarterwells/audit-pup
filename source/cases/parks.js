/* Parks case: hints, steps, and notes. The answer key values come from cases/parks/answer_key.json
   (ANSWER_KEYS.parks), which tools/import_answer_sheet.js makes from the answer sheet. Built into the page by build_html.js. */
/* ---------- hints for the Parks problem ----------
   Expected values come from the Parks answer sheet (2025). A blank cell in the answer sheet is checked as "must be blank
   or $0". Hints written by Claude for expert review (docs/hints.md). */
var P_EXP = expectedFromKey(ANSWER_KEYS.parks);   /* from cases/parks/answer_key.json */

var P_LINES = {
  fed_4a:  {form:'fed', line:'Line 4a',  name:'IRA distributions', read:['box','fed','4a',200,260],
    hint:"Line 4a is box 1 of Mary's Wells Fargo 1099-R (Step K). Compare the 1099-R you entered with the form in the problem."},
  fed_4b:  {form:'fed', line:'Line 4b',  name:'Taxable IRA distributions', read:['box','fed','4b'],
    hint:"Only part of Mary's IRA distribution is taxable, because she has basis from nondeductible contributions (Step K). The taxable amount comes from Form 8606, using last year's Form 8606 and the total value of her IRAs given in the step."},
  fed_6a:  {form:'fed', line:'Line 6a',  name:'Social Security benefits', read:['box','fed','6a',200,260],
    hint:"Line 6a holds Mary's Canada Pension Plan benefits (Step C), which are treated like U.S. Social Security for the federal return. Check how the Canadian pension was entered and the amount from the problem."},
  fed_6b:  {form:'fed', line:'Line 6b',  name:'Taxable Social Security benefits', read:['box','fed','6b'],
    hint:"TaxSlayer works out the taxable part of the benefits from Mary's other income. If line 6a and the income lines above are right, this follows."},
  fed_8:   {form:'fed', line:'Line 8',   name:'Additional income (Schedule 1, line 10)', read:['box','fed','8'],
    hint:"Line 8 comes from Schedule 1, line 10: last year's state refund, the board member pay, the cell tower rent and royalties, the gambling winnings, the prize, and the alimony, each added in its own step. Check the Schedule 1 lines in this list first."},
  fed_9:   {form:'fed', line:'Line 9',   name:'Total income', read:['box','fed','9'],
    hint:"Line 9 is the sum of the income lines above it. If it is off, the mistake is in one of those income entries, not on line 9 itself."},
  fed_11a: {form:'fed', line:'Line 11a', name:'Adjusted gross income', read:['box','fed','11a'],
    hint:"Mary has no adjustments to income, so line 11a equals total income. If line 9 is right, this follows."},
  fed_12e: {form:'fed', line:'Line 12e', name:'Standard or itemized deduction', read:['box','fed','12e'],
    hint:"The standard deduction follows from the filing status (single) and Mary's age. Re-check the filing status and her birth date from Step A."},
  fed_15:  {form:'fed', line:'Line 15',  name:'Taxable income', read:['box','fed','15'],
    hint:"Taxable income is AGI minus the deduction, never below zero. If lines 11a and 12e are right, this follows."},
  fed_16:  {form:'fed', line:'Line 16',  name:'Tax', read:['box','fed','16'],
    hint:"Tax comes from taxable income through the tax table. If taxable income (line 15) is right, this follows."},
  fed_19:  {form:'fed', line:'Line 19',  name:'Child tax credit and credit for other dependents', read:['box','fed','19'],
    hint:"Line 19 is the credit for other dependents for Sue (note N1). It shows once Mary has tax to apply it against. Re-check Sue's dependent screen from Step A."},
  fed_24:  {form:'fed', line:'Line 24',  name:'Total tax', read:['box','fed','24'],
    hint:"Total tax is the tax minus the credits. Check lines 16 and 19 first; this follows from them."},
  fed_37:  {form:'fed', line:'Line 37',  name:'Amount you owe', read:['box','fed','37'],
    hint:"Mary has no withholding or payments, so the amount she owes equals the total tax. If line 24 is right, this follows."},

  sch1_1:  {form:'sch1', line:'Line 1',   name:'Taxable state refund', read:['box','sch1','1'],
    hint:"Mary itemized last year, so her California refund from the 1099-G is taxable (Step B). Use last year's sales tax deduction worksheet to work out how much of the refund is taxable."},
  sch1_2a: {form:'sch1', line:'Line 2a',  name:'Alimony received', read:['box','sch1','2a'],
    hint:"The alimony Mary receives (Step J) is taxable because the divorce was final before 2019. Enter it as alimony received, with the date of the divorce from the problem."},
  sch1_5:  {form:'sch1', line:'Line 5',   name:'Rental real estate and royalties (Schedule E)', read:['box','sch1','5'],
    hint:"Line 5 comes from Schedule E: the cell tower rent (Step E) and the oil and gas royalties (Step F), each from a 1099-MISC. Check the property type and the amounts on each Schedule E entry."},
  sch1_8b: {form:'sch1', line:'Line 8b',  name:'Gambling winnings', read:['box','sch1','8b'],
    hint:"Line 8b adds box 1 of every W-2G entered so far: the casino (Step G) and the California Lottery (Step H). Compare each W-2G you entered with the forms in the problem."},
  sch1_8z: {form:'sch1', line:'Line 8z',  name:'Other income', read:['box','sch1','8z'],
    hint:"Line 8z holds the board member pay that was moved from the 1099-NEC to other income (Step D) and the prize from the 1099-MISC (Step I). Check that both went to other income, not to a business."},
  schA_16: {form:'schA', line:'Line 16',  name:'Other itemized deductions (gambling losses)', read:['box','schA','16'],
    hint:"Gambling losses go on Schedule A line 16, up to the gambling winnings: the casino losses (Step G) and the California Lottery losses (Step H). Check the losses entered with each W-2G."},

  ca540_11:  {form:'ca540', line:'Line 11',  name:'California exemption amount', read:['ca','11',500],
    hint:"The exemption amount follows from Mary's personal exemption and Sue as a dependent. Re-check the dependent entries from Step A, as note N1 describes."},
  ca540_14:  {form:'ca540', line:'Line 14',  name:'California subtractions', read:['ca','14',500],
    hint:"California subtractions come from Schedule CA, column B: last year's state refund, the nontaxable part of the Canadian pension, and the California Lottery winnings. Check the Schedule CA lines for the step you are on."},
  ca540_16:  {form:'ca540', line:'Line 16',  name:'California additions', read:['ca','16',500],
    hint:"California taxes the Canada Pension Plan benefits that the federal return treats like Social Security (note N3b), so the $10,000 is added back on Schedule CA. Enter it as a manual California adjustment."},
  ca540_18:  {form:'ca540', line:'Line 18',  name:'California deduction', read:['ca','18',500],
    hint:"California uses the larger of its standard deduction and its own itemized deductions. Once Mary's itemized deductions are entered (Step L), California itemizes even though the federal return does not. Check the Schedule A entries."},
  ca540_19:  {form:'ca540', line:'Line 19',  name:'California taxable income', read:['ca','19',500],
    hint:"California taxable income is the California AGI minus the deduction on line 18. Check the subtractions, additions, and line 18 first."},
  ca540_31:  {form:'ca540', line:'Line 31',  name:'California tax', read:['ca','31',500],
    hint:"California tax comes from taxable income (line 19). If line 19 is right, this follows."},
  ca540_46:  {form:'ca540', line:'Line 46',  name:'Nonrefundable renter’s credit', read:['ca','46',500],
    hint:"Mary rents, so she may qualify for the California renter's credit. Read the Interview Notes about her home, and the renter's credit questions in TaxSlayer's state section."},
  ca540_48:  {form:'ca540', line:'Line 48',  name:'California tax after credits', read:['ca','48',500],
    hint:"Line 48 is the California tax minus the exemption and renter's credits. Check lines 31 and 46 first."},
  ca540_78:  {form:'ca540', line:'Line 78',  name:'Total payments', read:['ca','78',500],
    hint:"Mary has no California withholding or estimated payments, so this line should be blank. Check that nothing was entered as California tax withheld on any form."},
  ca540_96:  {form:'ca540', line:'Line 96',  name:'Individual shared responsibility penalty', read:['ca','96',500],
    hint:"Sue had no health insurance during the year, so California charges a shared responsibility penalty (Step M). Answer the California health coverage questions for each person, month by month, as the problem describes."},
  ca540_111: {form:'ca540', line:'Line 111', name:'California amount you owe', read:['ca','111',500],
    hint:"The California amount owed is the tax after credits plus any penalty, minus payments. Check lines 48 and 96 first."},
  ca540_115: {form:'ca540', line:'Line 115', name:'California refund', read:['ca','115',500],
    hint:"Mary owes California tax and has no payments, so there should be no refund. Check the California tax lines above."},

  schCA_8b_B:{form:'schCA', line:'Section B, line 8b, column B', name:'California Lottery winnings subtracted', read:['box','schCA','8b',215,232,400,475],
    hint:"California does not tax California Lottery winnings (note N5), so the lottery winnings from Step H are subtracted on Schedule CA. Enter it as a manual California adjustment."},
  schCA_9a_B:{form:'schCA', line:'Section B, line 9a, column B', name:'Total additional income subtractions', read:['box','schCA','9a',215,232,400,475],
    hint:"Line 9a totals the column B subtractions in Section B. If the lottery subtraction on line 8b is right, this follows."},
  schCA_16_B:{form:'schCA', line:'Part II, line 16, column B', name:'California Lottery losses subtracted', read:['box','schCA','16',228,240,400,475],
    hint:"California Lottery losses are not deductible for California (note N5), so they are subtracted from the itemized deductions on Schedule CA Part II. Enter it under the state section's itemized deduction adjustments."},
};

/* Answer sheet notes that point at one line at one step replace that line's hint at that step */
var P_N2="Note N2: answer incorrect? The exercise said Mary rented a large townhouse.";
var P_N3="Note N3: did you use the State and Local General Sales Tax Deduction worksheet that was included in last year's tax return, beginning on page 10?";
var P_N3b="Note N3b: see the Duck Book or the 'CA CA' handouts. You need to manually increase California income for the Canada Pension Plan benefits of $10,000.";
var P_N4="Note N4: if your answer is incorrect, see Pub 4012 or the Duck Book for 'Form 1099-NEC'.";
var P_N5="Note N5: California Lottery winnings are not taxable to California, and California Lottery losses are not deductible. Manually decrease the income for the lottery winnings, and manually decrease (subtract) the California itemized deductions by $550. See the handout 'CA CA Instructions' or the Duck Book under 'Gambling Winnings'.";
var P_N6="Note N6: enter the 1099-R and blank out box 2a. Then enter Form 8606: total basis in traditional IRAs from the 2024 Form 8606 line 14 ($22,343), total value of all traditional IRAs from the step ($110,000), and the distribution from 1099-R box 1 ($15,000). TaxSlayer shows the taxable amount after Continue. Go back to the 1099-R and put that amount in box 2a (it is also on the 2025 Form 8606 line 15c, $12,315).";
var P_N7="Note N7: itemized deductions should be entered, because even though the federal return uses the standard deduction, California itemizes. Check Schedule A: line 1 = $2,617; line 4 = $0; line 7 = $921; line 14 = $9,000; line 16 = $1,050; line 17 = $10,971.";

var P_STEPS = [
  {id:'A', name:'Step A: Basic information', type:'check', expected:P_EXP.A, notes:['N1'], hints:{ca540_46:P_N2}},
  {id:'B', name:'Step B: Last year’s California refund (1099-G)', type:'check', expected:P_EXP.B, notes:[], hints:{sch1_1:P_N3, fed_8:P_N3}},
  {id:'C', name:'Step C: Canadian pension', type:'check', expected:P_EXP.C, notes:['NN_C'], hints:{ca540_16:P_N3b}},
  {id:'D', name:'Step D: Board member pay (1099-NEC)', type:'check', expected:P_EXP.D, notes:['NN_D'], hints:{fed_8:P_N4}},
  {id:'E', name:'Step E: Cell tower rent (1099-MISC)', type:'check', expected:P_EXP.E, notes:[]},
  {id:'F', name:'Step F: Oil and gas royalties (1099-MISC)', type:'check', expected:P_EXP.F, notes:[]},
  {id:'G', name:'Step G: Casino winnings (W-2G)', type:'check', expected:P_EXP.G, notes:[]},
  {id:'H', name:'Step H: California Lottery (W-2G)', type:'check', expected:P_EXP.H, notes:[], hints:{schCA_8b_B:P_N5, schCA_9a_B:P_N5, schCA_16_B:P_N5}},
  {id:'I', name:'Step I: Prize (1099-MISC)', type:'check', expected:P_EXP.I, notes:[]},
  {id:'J', name:'Step J: Alimony received', type:'check', expected:P_EXP.J, notes:[]},
  {id:'K', name:'Step K: IRA distribution with basis (1099-R)', type:'check', expected:P_EXP.K, notes:['NN_K'], hints:{fed_4b:P_N6}},
  {id:'L', name:'Step L: Itemize for California', type:'check', expected:P_EXP.L, notes:[], hints:{ca540_18:P_N7}},
  {id:'M', name:'Step M: Health coverage (California penalty)', type:'check', expected:P_EXP.M, notes:[]},
  {id:'N', name:'Step N: no change expected from Step M', type:'nochange', basis:'Step M', expected:P_EXP.M, notes:[]},
  {id:'O', name:'Step O: Estimated payments (no change expected from Step M)', type:'nochange', basis:'Step M', expected:P_EXP.M, notes:['NN_O']}
];

var P_ORDER = ['fed_4a','fed_4b','fed_6a','fed_6b','fed_8','fed_9','fed_11a','fed_12e','fed_15','fed_16','fed_19','fed_24','fed_37',
  'N1','NN_C','NN_D','NN_K','NN_O',
  'sch1_1','sch1_2a','sch1_5','sch1_8b','sch1_8z','schA_16',
  'ca540_11','ca540_14','ca540_16','ca540_18','ca540_19','ca540_31','ca540_46','ca540_48','ca540_78','ca540_96','ca540_111','ca540_115',
  'schCA_8b_B','schCA_9a_B','schCA_16_B'];

var P_TSNOTE_COACH="Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.";
function pNN(step,what,example){ return {form:'fed', kind:'confirm', carry:false, chip:'NN', name:'TS Note added for Step '+step, mark:'nn_'+step,
  confirm:'I added a TS Note for Step '+step+' ('+what+') in TaxSlayer', example:example, coach:P_TSNOTE_COACH}; }
/* carry: true = checked at its own step and again at every later step; false = its own step only (TS Note boxes).
   N1 stays in the return, so it is checked again at every later step. */
var P_NOTES = {
  N1:{form:'fed', kind:'filing', carry:true, name:'Filing status and dependents', status:/^single$/i, taxpayer:'MARY', taxpayerName:'Mary',
    deps:[{first:'SUE', name:'Sue', box:'odc'}],
    key:"Filing status = Single. Using the 'Qualifying Child or Relative Resource Tool', Devon = Chart 1 Box 36, so he is NOT a dependent but is eligible for EIC. Pam = Chart 2 Box 2, is NOT a dependent and should NOT be listed on the tax return. Sue = Chart 2 Box 24, ODC, but no EIC. Her relationship = NONE.",
    coach:"Walk Devon, Pam, and Sue through the 'Qualifying Child or Relative Resource Tool'. Only Sue is a dependent, for the credit for other dependents, with relationship None. Devon is listed for the EIC only, not as a dependent, and Pam is not listed at all. Check the filing status and each person's screen."},
  NN_C:pNN('C','the Canadian pension',"STEP C - CANADIAN PENSION: MARY RECEIVES MONIES FROM A CANADIAN PENSION. BE SURE TO ASK HER FOR IT EACH YEAR IF SHE DOESN'T OFFER THE INFORMATION."),
  NN_D:pNN('D','the 1099-NEC',"STEP D - 1099-NEC: MARY IS A VOLUNTEER FOR EDAC. THE $30 THAT WAS REPORTED IN 1099-NEC BOX 1 IS NOT BUSINESS INCOME AND WAS MOVED TO 1099-MISC BOX 3 OTHER INCOME."),
  NN_K:pNN('K','the IRA basis',"STEP K - IRA BASIS: 2024 TAX RETURN HAD FORM 8606. ENTERED INFO FROM THAT, THE WELLS FARGO 1099-R, AND TOTAL VALUE OF IRAS TO GET TAXABLE AMOUNT SHOWN IN BOX 2A."),
  NN_O:pNN('O','the estimated tax vouchers',"STEP O - EST VOUCHERS: CREATED EST. TAX VOUCHERS, FED ONLY, $803 A QTR.")
};

CASES.push({id:'parks', label:'Case: Parks (Mary Parks, 2025)', short:'Parks', lastName:'PARKS',
  lines:P_LINES, steps:P_STEPS, order:P_ORDER, notes:P_NOTES, worksheet:null, extract:function(pages){ return extractByLines(P_LINES,pages); }});
