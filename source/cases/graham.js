/* Graham case: hints, steps, and notes. The answer key values come from cases/graham/answer_key.json
   (ANSWER_KEYS.graham), which tools/import_answer_sheet.js makes from the answer sheet. Built into the page by build_html.js. */
/* ---------- hints for the Graham problem ----------
   Expected values come from the Graham answer sheet (2025). A blank cell in the answer sheet is checked as "must be blank
   or $0", and a blank checkbox cell as "must not be checked". Hints written by Claude for expert review (docs/hints.md). */
var G_EXP = expectedFromKey(ANSWER_KEYS.graham);   /* from cases/graham/answer_key.json */

var G_LINES = {
  fed_1h:  {form:'fed', line:'Line 1h',  name:'Other earned income', read:['box','fed','1h'],
    hint:"Line 1h is where Stacey's disability pension goes until she reaches the company's normal retirement age (Step M). Re-open that 1099-R in TaxSlayer and check the disability box at the bottom of the screen."},
  fed_4a:  {form:'fed', line:'Line 4a',  name:'IRA distributions', read:['box','fed','4a',200,260],
    hint:"Line 4a adds box 1 of every IRA 1099-R entered so far (Steps C, D, E, and F), even the ones that were rolled over. Compare each IRA 1099-R you entered with box 1 of the forms in the problem."},
  fed_4b:  {form:'fed', line:'Line 4b',  name:'Taxable IRA distributions', read:['box','fed','4b'],
    hint:"Line 4b is only the taxable part of the IRA distributions. A rollover (Steps C and D) adds nothing here, and a qualified charitable distribution (Step F) is left out. Re-check box 2a and the rollover and QCD choices on each IRA 1099-R."},
  fed_4c1: {form:'fed', line:'Line 4c box 1', name:'Rollover box', read:['mark','fed','4a','5a','Rollover'],
    hint:"The Rollover box on line 4c is checked when an IRA distribution was rolled over (Steps C and D). On the 1099-R screen, mark the distribution as a rollover rather than only changing the taxable amount."},
  fed_4c2: {form:'fed', line:'Line 4c box 2', name:'QCD box', read:['mark','fed','4a','5a','QCD'],
    hint:"The QCD box on line 4c is checked when part of an IRA distribution went straight to a charity (Step F). See 'Qualified Charitable Distributions' in Pub 4012 for where TaxSlayer asks about a QCD."},
  fed_5a:  {form:'fed', line:'Line 5a',  name:'Pensions and annuities', read:['box','fed','5a',200,260],
    hint:"Line 5a adds box 1 of every pension 1099-R entered so far. Compare each pension 1099-R you entered with box 1 of the forms in the problem."},
  fed_5b:  {form:'fed', line:'Line 5b',  name:'Taxable pensions and annuities', read:['box','fed','5b'],
    hint:"Line 5b is the taxable part of the pensions. Look at the step's 1099-R: box 2a, the PSO health insurance exclusion (Step G), and the Simplified Method results (Steps K and L) all change it."},
  fed_5c2: {form:'fed', line:'Line 5c box 2', name:'PSO box', read:['mark','fed','5a','6a','PSO'],
    hint:"The PSO box on line 5c is checked when a retired public safety officer's health insurance premiums reduce the taxable pension (Step G). Use the PSO option under box 2a on the 1099-R screen."},
  fed_6a:  {form:'fed', line:'Line 6a',  name:'Social Security benefits', read:['box','fed','6a',200,260],
    hint:"Line 6a is the net benefits from Sean's SSA-1099 (Step N) and the tier 1 benefits from his RRB-1099 (Step O). Compare box 5 of each form with what you entered."},
  fed_6b:  {form:'fed', line:'Line 6b',  name:'Taxable Social Security benefits', read:['box','fed','6b'],
    hint:"TaxSlayer works out the taxable part of the benefits from the other income. If line 6a and the income lines above are right, this follows."},
  fed_8:   {form:'fed', line:'Line 8',   name:'Additional income (Schedule 1, line 10)', read:['box','fed','8'],
    hint:"Line 8 comes from Schedule 1, line 10, which here is Stacey's tutoring business income from Schedule C (Step B). Check the Schedule C income and expenses first."},
  fed_9:   {form:'fed', line:'Line 9',   name:'Total income', read:['box','fed','9'],
    hint:"Line 9 is the sum of the income lines above it. If it is off, the mistake is in one of those income entries, not on line 9 itself."},
  fed_10:  {form:'fed', line:'Line 10',  name:'Adjustments to income (Schedule 1, line 26)', read:['box','fed','10'],
    hint:"Line 10 comes from Schedule 1, line 26: the deductible part of self-employment tax, the self-employed health insurance, and from Step Q the educator expenses, alimony paid, and student loan interest. Check the Schedule 1 lines in this list."},
  fed_11a: {form:'fed', line:'Line 11a', name:'Adjusted gross income', read:['box','fed','11a'],
    hint:"Line 11a is total income minus the adjustments. If lines 9 and 10 are right, this follows."},
  fed_12e: {form:'fed', line:'Line 12e', name:'Standard or itemized deduction', read:['box','fed','12e'],
    hint:"The standard deduction follows from the filing status (married filing jointly) and the ages of Stacey and Sean. Itemizing is right only when Schedule A is larger. Re-check the filing status and birth dates from Step A."},
  fed_13b: {form:'fed', line:'Line 13b', name:'Additional deductions (Schedule 1-A)', read:['box','fed','13b'],
    hint:"Line 13b comes from Schedule 1-A, the new additional deductions, such as the deduction for a taxpayer age 65 or older. Check the birth dates entered in Step A."},
  fed_15:  {form:'fed', line:'Line 15',  name:'Taxable income', read:['box','fed','15'],
    hint:"Taxable income is AGI minus the deductions on lines 12e through 13b, never below zero. If those lines are right, this follows."},
  fed_16:  {form:'fed', line:'Line 16',  name:'Tax', read:['box','fed','16'],
    hint:"Tax comes from taxable income through the tax table. If taxable income (line 15) is right, this follows."},
  fed_19:  {form:'fed', line:'Line 19',  name:'Child tax credit and credit for other dependents', read:['box','fed','19'],
    hint:"Line 19 depends on Joshua qualifying for the child tax credit and Jeremy and Gail for the credit for other dependents (note N1). Re-check the dependent screens from Step A."},
  fed_20:  {form:'fed', line:'Line 20',  name:'Credits from Schedule 3, line 8', read:['box','fed','20'],
    hint:"Line 20 is the nonrefundable part of Jeremy's education credit, from Schedule 3 (Step S). Re-check the 1098-T and the education expenses you entered."},
  fed_21:  {form:'fed', line:'Line 21',  name:'Total credits', read:['box','fed','21'],
    hint:"Line 21 adds lines 19 and 20. If those are right, this follows."},
  fed_23:  {form:'fed', line:'Line 23',  name:'Other taxes (Schedule 2, line 21)', read:['box','fed','23'],
    hint:"Line 23 comes from Schedule 2, line 21: here the self-employment tax and the additional tax on the early IRA distribution. Check the Schedule 2 lines in this list."},
  fed_24:  {form:'fed', line:'Line 24',  name:'Total tax', read:['box','fed','24'],
    hint:"Total tax is the tax minus credits plus other taxes. Check lines 16, 21, and 23 first; this follows from them."},
  fed_25d: {form:'fed', line:'Line 25d', name:'Federal tax withheld', read:['box','fed','25d'],
    hint:"Line 25d adds federal withholding (box 4) from every 1099-R and the SSA and RRB forms entered so far. Compare each form you entered with the problem."},
  fed_27a: {form:'fed', line:'Line 27a', name:'Earned income credit (EIC)', read:['box','fed','27a'],
    hint:"The EIC depends on earned income (Stacey's business and disability pension) and on Joshua as a qualifying child. Gail does not qualify the family for the EIC. Re-check the dependent screens from Step A."},
  fed_28:  {form:'fed', line:'Line 28',  name:'Additional child tax credit (ACTC)', read:['box','fed','28'],
    hint:"The additional child tax credit depends on Joshua qualifying for the child tax credit (note N1) and on earned income. Re-check his dependent screen."},
  fed_29:  {form:'fed', line:'Line 29',  name:'American opportunity credit (refundable part)', read:['box','fed','29'],
    hint:"Line 29 is the refundable part of Jeremy's American opportunity credit (Step S). Re-check the 1098-T, the 1099-Q, and the expenses his parents paid."},
  fed_33:  {form:'fed', line:'Line 33',  name:'Total payments', read:['box','fed','33'],
    hint:"Line 33 totals withholding and refundable credits. If it is off, the mistake is in a withholding or credit line above it."},
  fed_35a: {form:'fed', line:'Line 35a', name:'Refund', read:['box','fed','35a'],
    hint:"The refund is the end result. If it is wrong, one of the checked lines above it is wrong. Fix those first and this should follow."},
  fed_37:  {form:'fed', line:'Line 37',  name:'Amount you owe', read:['box','fed','37'],
    hint:"The amount owed is the end result. If it is wrong, one of the checked lines above it is wrong. Fix those first and this should follow."},

  sch1_3:  {form:'sch1', line:'Line 3',   name:'Business income (Schedule C)', read:['box','sch1','3'],
    hint:"Schedule 1, line 3 is the profit from Stacey's tutoring business on Schedule C (Step B). Compare her income and each expense with the problem."},
  sch1_11: {form:'sch1', line:'Line 11',  name:'Educator expenses', read:['box','sch1','11'],
    hint:"Line 11 is the educator expense deduction from Step Q. Check who qualifies as an eligible educator and the limit in Pub 4012."},
  sch1_15: {form:'sch1', line:'Line 15',  name:'Deductible part of self-employment tax', read:['box','sch1','15'],
    hint:"Line 15 is half of the self-employment tax, worked out from the Schedule C profit. If Schedule 1, line 3 is right, this follows."},
  sch1_17: {form:'sch1', line:'Line 17',  name:'Self-employed health insurance deduction', read:['box','sch1','17'],
    hint:"Line 17 is the health insurance Stacey paid for herself and Joshua through her business (Step B). Check the premiums entered on the Schedule C health insurance screen."},
  sch1_19a:{form:'sch1', line:'Line 19a', name:'Alimony paid', read:['box','sch1','19a'],
    hint:"Line 19a is the alimony paid from Step Q. Check the amount and the divorce date in the problem: only a decree from before 2019 makes alimony deductible."},
  sch1_21: {form:'sch1', line:'Line 21',  name:'Student loan interest deduction', read:['box','sch1','21'],
    hint:"Line 21 is the student loan interest deduction from Step Q. Compare the 1098-E amount with what you entered."},
  sch2_4:  {form:'sch2', line:'Line 4',   name:'Self-employment tax', read:['box','sch2','4'],
    hint:"Line 4 is the self-employment tax on Stacey's Schedule C profit. If Schedule 1, line 3 is right, this follows."},
  sch2_8:  {form:'sch2', line:'Line 8',   name:'Additional tax on IRAs (Form 5329)', read:['box','sch2','8'],
    hint:"Line 8 is the 10% additional tax on the early IRA distribution from Step E, after any exception on Form 5329. Review the early distribution exception codes in Pub 4012."},
  schA_1:  {form:'schA', line:'Line 1',   name:'Medical and dental expenses', read:['box','schA','1'],
    hint:"Schedule A, line 1 collects the medical insurance not already used elsewhere: what is left after the PSO exclusion (Step G), and the premiums on the OPM, SSA, and RRB forms (Steps H, N, and O). Do not count the same premium twice."},
  schA_16: {form:'schA', line:'Line 16',  name:'Other itemized deductions', read:['box','schA','16'],
    hint:"Line 16 is the unrecovered investment in the Northern Trust pension, from the Pension Exclusion Calculator (Step L). See the comments on the Calculator results."},

  ca540_14:  {form:'ca540', line:'Line 14',  name:'California subtractions', read:['ca','14',500],
    hint:"Line 14 comes from Schedule CA, column B: California does not tax Social Security or railroad tier 1 benefits, and Step P adds the military retirement exclusion. Check the CA adjustments you entered."},
  ca540_16:  {form:'ca540', line:'Line 16',  name:'California additions', read:['ca','16',500],
    hint:"Line 16 comes from Schedule CA, column C. Look for an amount entered on a California adjustment screen that does not belong on this return."},
  ca540_18:  {form:'ca540', line:'Line 18',  name:'California deduction', read:['ca','18',500],
    hint:"The California standard deduction follows from the filing status. Itemizing for California is right only when the California itemized total is larger (Step R2)."},
  ca540_19:  {form:'ca540', line:'Line 19',  name:'California taxable income', read:['ca','19',500],
    hint:"California taxable income is California AGI minus the deduction. If the federal income and the CA subtractions are right, this follows."},
  ca540_31:  {form:'ca540', line:'Line 31',  name:'California tax', read:['ca','31',500],
    hint:"California tax comes from taxable income (line 19) through the tax table. If line 19 is right, this follows."},
  ca540_32:  {form:'ca540', line:'Line 32',  name:'Exemption credits', read:['ca','32',500],
    hint:"The exemption credits follow from the filing status, the ages, and the number of dependents entered in Step A. Re-check those screens."},
  ca540_46:  {form:'ca540', line:'Line 46',  name:'Nonrefundable renter’s credit', read:['ca','46',500],
    hint:"Line 46 is the renter's credit. Read its requirements in the Duck Book and check whether the Grahams qualify."},
  ca540_63:  {form:'ca540', line:'Line 63',  name:'Other California taxes', read:['ca','63',500],
    hint:"Line 63 is California's additional tax on the early IRA distribution from Step E (form FTB 3805P). It follows from the federal Form 5329 entries."},
  ca540_71:  {form:'ca540', line:'Line 71',  name:'California tax withheld', read:['ca','71',500],
    hint:"Line 71 adds the state tax withheld on the 1099-R forms (box 14). Compare each one you entered with the problem."},
  ca540_75:  {form:'ca540', line:'Line 75',  name:'California EITC', read:['ca','75',500],
    hint:"The California earned income tax credit depends on earned income and on Joshua as a qualifying child. If the federal EIC lines are right, check the California credit screens."},
  ca540_78:  {form:'ca540', line:'Line 78',  name:'Total payments', read:['ca','78',500],
    hint:"Line 78 totals California withholding and refundable credits. If it is off, the mistake is in a withholding or credit line above it."},
  ca540_111: {form:'ca540', line:'Line 111', name:'California amount you owe', read:['ca','111',500],
    hint:"The amount owed is the end result. If it is wrong, one of the checked California lines above it is wrong. Fix those first and this should follow."},
  ca540_115: {form:'ca540', line:'Line 115', name:'California refund', read:['ca','115',500],
    hint:"The refund is the end result. If it is wrong, one of the checked California lines above it is wrong. Fix those first and this should follow."},

  schCA_5b_B:{form:'schCA', line:'Part I, line 5b, column B', name:'Pension subtraction', read:['box','schCA','5b',200,240,360,475],
    hint:"Schedule CA, line 5b, column B is the part of the pensions California does not tax, including the military retirement exclusion from Step P. Review the handout on the CA exclusion for military retirement and enter the CA adjustment."},
  schCA_19:  {form:'schCA', line:'Part II, line 19', name:'Unreimbursed employee expenses', read:['box','schCA','19',340,380,380,475],
    hint:"Schedule CA, Part II, line 19 is the unreimbursed employee expenses California still allows (Step Q). Enter them as a California adjustment, since they are not deductible on the federal return."}
};

/* Answer sheet notes that point at one line at one step replace that line's hint at that step */
var G_N2="Note N2: if line 46 is more than $0, go back and review the California renter's credit requirements in the Duck Book.";
var G_N2b="Note N2b: if your answer is incorrect, check Schedule C for the probable error: car and truck expenses, line 9 = $1,491; other interest, line 16b = $300; other expenses, line 27b = $108 ($75 for the DMV plus $33 for parking and tolls).";
var G_N3="Note N3: did you forget to zero out box 2a and check the box at the bottom of the screen indicating it was a rollover?";
var G_N4="Note N4: review Pub 4012 on Form 5329 exception codes and the requirements for code 23. Be sure to read the footnotes for code 23. If that does not fix it, make sure you marked TP for both the 1099-R and Form 5329.";
var G_N5="Note N5: did you specify that the QCD was only $20,000 instead of the entire amount?";
var G_N6="Note N6: enter the 1099-R, including box 2a. Then click 'click here for option' below box 2a, choose the PSO option, and enter the health insurance amount. TaxSlayer works out the taxable amount and creates the 'nontaxable retirement distribution' entry.";
var G_N7="Note N7: a public safety officer can use only up to $3,000 of health insurance premiums to reduce the taxable amount. The premiums above that can go on Schedule A when itemizing.";
var G_N8="Note N8: box 5 of the OPM 1099-R ($283) goes on Schedule A as a medical expense, along with the $700 from Step G.";
var G_N9="Note N9: refer back to the handout 'Retirement Income (non-IRA)'.";
var G_N10="Note N10: on the Exclusion Calculator, did you check 'if deceased' and 'died in 20CC'? On the Simplified Method screen, did you check the box indicating the annuity benefits are based on the annuitant and beneficiary?";
var G_N11="Note N11: did you enter the unrecovered investment in the pension from the Pension Exclusion Calculator?";
var G_N12="Note N12: did you mark this 1099-R as a disability, so the distribution is treated as wages?";
var G_N13="Note N13: did you enter the California adjustment as instructed in the step?";
var G_N14="Note N14: there is no need to enter the 1099-G, since the Grahams itemized and took the sales tax deduction last year.";
var G_N15="Note N15: Stacey did not have enough additional itemized deductions to exceed the California standard deduction. The health insurance premiums she listed were already entered in Steps B, G, H, N, and O.";
var G_N16="Note N16: go back and review the video.";

var G_STEPS = [
  {id:'A', name:'Step A: Basic information', type:'check', expected:G_EXP.A, notes:['N1'], hints:{ca540_46:G_N2}},
  {id:'B', name:'Step B: Self-employment (Schedule C)', type:'check', expected:G_EXP.B, notes:[], hints:{fed_8:G_N2b, sch1_3:G_N2b}},
  {id:'C', name:'Step C: IRA indirect rollover (1099-R)', type:'check', expected:G_EXP.C, notes:['NN_C'], hints:{fed_4b:G_N3, fed_4c1:G_N3}},
  {id:'D', name:'Step D: IRA direct rollover (1099-R)', type:'check', expected:G_EXP.D, notes:[], hints:{fed_4b:G_N3, fed_4c1:G_N3}},
  {id:'E', name:'Step E: Early IRA distribution (1099-R)', type:'check', expected:G_EXP.E, notes:['NN_E'], hints:{sch2_8:G_N4}},
  {id:'F', name:'Step F: Qualified charitable distribution (1099-R)', type:'check', expected:G_EXP.F, notes:['NN_F'], hints:{fed_4b:G_N5}},
  {id:'G', name:'Step G: Public safety officer pension (1099-R)', type:'check', expected:G_EXP.G, notes:['NN_G'], hints:{fed_5c2:G_N6, schA_1:G_N7}},
  {id:'H', name:'Step H: OPM retirement (1099-R)', type:'check', expected:G_EXP.H, notes:[], hints:{schA_1:G_N8}},
  {id:'I', name:'Step I: Wells Fargo pension (1099-R)', type:'check', expected:G_EXP.I, notes:[]},
  {id:'J', name:'Step J: US Bank pension (1099-R)', type:'check', expected:G_EXP.J, notes:[], hints:{fed_5b:G_N9}},
  {id:'K', name:'Step K: Simplified Method, joint and survivor (1099-R)', type:'check', expected:G_EXP.K, notes:['NN_K'], hints:{fed_5b:G_N10}},
  {id:'L', name:'Step L: Simplified Method, last year (1099-R)', type:'check', expected:G_EXP.L, notes:['NN_L'], hints:{schA_16:G_N11}},
  {id:'M', name:'Step M: Disability pension (1099-R)', type:'check', expected:G_EXP.M, notes:['NN_M'], hints:{fed_1h:G_N12}},
  {id:'N', name:'Step N: Social Security (SSA-1099)', type:'check', expected:G_EXP.N, notes:[]},
  {id:'O', name:'Step O: Railroad retirement (RRB-1099)', type:'check', expected:G_EXP.O, notes:[]},
  {id:'P', name:'Step P: Military retirement (DFAS 1099-R)', type:'check', expected:G_EXP.P, notes:['NN_P'], hints:{schCA_5b_B:G_N13}},
  {id:'Q', name:'Step Q: Adjustments to income', type:'check', expected:G_EXP.Q, notes:[]},
  {id:'R', name:'Step R: Last year’s California refund', type:'check', expected:G_EXP.R, notes:[], tip:G_N14},
  {id:'R2', name:'Step R2: Itemize or not', type:'check', expected:G_EXP.R2, notes:[], hints:{fed_12e:G_N15, ca540_18:G_N15}},
  {id:'S', name:'Step S: Education credit (1098-T)', type:'check', expected:G_EXP.S, notes:[], hints:{fed_20:G_N16, fed_29:G_N16}},
  {id:'U', name:'Step U: no change expected from Step S', type:'nochange', basis:'Step S', expected:G_EXP.S, notes:[]},
  {id:'V', name:'Step V: no change expected from Step S', type:'nochange', basis:'Step S', expected:G_EXP.S, notes:[]},
  {id:'W', name:'Step W: no change expected from Step S', type:'nochange', basis:'Step S', expected:G_EXP.S, notes:[]}
];

var G_ORDER = ['fed_1h','fed_4a','fed_4b','fed_4c1','fed_4c2','fed_5a','fed_5b','fed_5c2','fed_6a','fed_6b','fed_8','fed_9','fed_10','fed_11a',
  'fed_12e','fed_13b','fed_15','fed_16','fed_19','fed_20','fed_21','fed_23','fed_24','fed_25d','fed_27a','fed_28','fed_29','fed_33','fed_35a','fed_37',
  'N1','NN_C','NN_E','NN_F','NN_G','NN_K','NN_L','NN_M','NN_P',
  'sch1_3','sch1_11','sch1_15','sch1_17','sch1_19a','sch1_21','sch2_4','sch2_8','schA_1','schA_16',
  'ca540_14','ca540_16','ca540_18','ca540_19','ca540_31','ca540_32','ca540_46','ca540_63','ca540_71','ca540_75','ca540_78','ca540_111','ca540_115',
  'schCA_5b_B','schCA_19'];

var G_TSNOTE_COACH="Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.";
function gNN(step,what,example){ return {form:'fed', kind:'confirm', chip:'NN', name:'TS Note added for Step '+step, mark:'nn_'+step,
  confirm:'I added a TS Note for Step '+step+' ('+what+') in TaxSlayer', example:example, coach:G_TSNOTE_COACH}; }
var G_NOTES = {
  N1:{form:'fed', kind:'filing', name:'Filing status and dependents', status:/married filing jointly/i, taxpayer:'STACEY', taxpayerName:'Stacey',
    deps:[{first:'JOSHUA', name:'Joshua', box:'ctc'}, {first:'JEREMY', name:'Jeremy', box:'odc'}, {first:'GAIL', name:'Gail', box:'odc'}],
    key:"Filing status = MFJ. Stacey should be listed as the Taxpayer. Using the QC/QR Resource Tool, Joshua = Box 35, CTC. Jeremy = Box 35, ODC. Gail = Chart 2 Box 25, ODC, No EIC.",
    coach:"Walk each dependent through the 'Qualifying Child or Relative Resource Tool' and the handout 'CTC ODC Chart': Joshua is a qualifying child for the child tax credit; Jeremy and Gail qualify only for the credit for other dependents. List Stacey as the taxpayer, then check the filing status and each dependent's credit on the dependent screens."},
  NN_C:gNN('C','the IRA rollover',"STEP C - IRA ROLLOVER: TP ROLLED ENTIRE IRA DISTRIBUTION BACK INTO AN IRA ACCOUNT WITHIN 60 DAYS SO THERE WAS NO EARLY WITHDRAWAL PENALTY."),
  NN_E:gNN('E','the early IRA distribution',"STEP E - EARLY IRA DIST: $1,825 EARLY WITHDRAWAL FROM WELLS FARGO WAS USED FOR CAR REPAIRS NEEDED TO COMMUTE TO WORK. $825 WAS EXEMPT FROM THE EARLY WITHDRAWAL PENALTY UNDER 'PERSONAL EMERGENCY EXPENSE'."),
  NN_F:gNN('F','the QCD',"STEP F - QCD: $20,000 OF THE $20,838 RMD FOR SEAN FROM WELLS FARGO WAS A QCD TO THEIR CHURCH AND EXCLUDED FROM TAXABLE INCOME."),
  NN_G:gNN('G','the PSO exclusion',"STEP G - PSO: EDC SHERIFF 1099-R FOR SEAN - BOX 2 TAXABLE AMOUNT WAS REDUCED BY $3K FOR PUBLIC SAFETY OFFICER HEALTH INSURANCE. ADDN'L $700 ENTERED ON SCH A ITEMIZED DEDUCTIONS."),
  NN_K:gNN('K','the Simplified Method',"STEP K - SIMPLIFIED METHOD: NATHANS HAMBURGER 1099-R IS A JOINT SURVIVOR ANNUITY, USED SIMPLIFIED METHOD. ANNUITY START DATE 9/1/2019. ANNUAL EXCLUSION $1,771. FINAL YEAR 2053 WITH AN EXCLUSION OF $1,466."),
  NN_L:gNN('L','the Simplified Method',"STEP L - SIMPLIFIED METHOD: NORTHERN TRUST 1099-R WAS NOT A JOINT SURVIVOR ANNUITY. ANNUITY START DATE 1/1/2017. ANNUAL EXCLUSION $271. THIS WAS THE LAST YEAR, THE UNRECOVERED $3,425 WAS ENTERED ON SCH A AS 'OTHER DEDUCTIONS'."),
  NN_M:gNN('M','the disability pension',"STEP M - DISABILITY PENSION: STACEY WENT ON DISABILITY AT AGE 45. NORMAL RETIREMENT AGE AT THE COMPANY IS 65. MUST CHECK THE DISABILITY BOX AT THE BOTTOM OF THE INPUT PAGE SO THE AMOUNT IS REPORTED AS WAGES."),
  NN_P:gNN('P','the CA military retirement exclusion',"STEP P - CA EXCLUSION FOR MILITARY RETIREMENT: SINCE SEAN WAS IN UNIFORMED SERVICE, $20,000 OF THE TAXABLE AMOUNT WAS EXCLUDED FOR CA.")
};

CASES.push({id:'graham', label:'Case: Graham (Stacey and Sean Graham, 2025)',
  lines:G_LINES, steps:G_STEPS, order:G_ORDER, notes:G_NOTES, worksheet:null, extract:function(pages){ return extractByLines(G_LINES,pages); }});
