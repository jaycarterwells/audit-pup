# Audit Pup hints for review

Every hint a counselor can see, for every case, as Audit Pup 0.19.2 shows it. Made from the case files by `source/tools/hints_report.js`, so it always matches the page: change a hint in `source/cases/<case>.js`, then run the tool.

How hints work: when a line fails, the counselor opens one hint. It shows the answer key value ("Answer key: ...") and the text below, which says where to look in the problem. Lines that are blank on the answer sheet are checked together in one row, "Lines that should be blank"; when it fails, its hint lists each line that has an amount, with that line's hint below. A step can replace a line's hint with an answer sheet note for that step only. Answer key notes have their own text.

Reviewers: please check that each hint teaches without giving more away than the answer key value, points to the right place in the problem, the handouts, or TaxSlayer, and is correct for the case.

* [Quinn (Raymond Quinn, 2025)](#quinn)
* [Baylor (Michael Baylor, 2025)](#baylor)
* [Graham (Stacey and Sean Graham, 2025)](#graham)
* [Kent (Karl Kent, 2025)](#kent)
* [Parks (Mary Parks, 2025)](#parks)

<a id="quinn"></a>

## Quinn (Raymond Quinn, 2025)

Steps: A, B, D, E, F.

### Federal Form 1040

| Line | What it is | Hint |
| --- | --- | --- |
| Line 1a | Wages (W-2 box 1) | Line 1a comes straight from box 1 of the W-2 you entered. Re-open that W-2 in TaxSlayer and compare box 1 to the source document. |
| Line 1d | Medicaid Waiver Payment not on a W-2 | Line 1d is where a Medicaid Waiver Payment with no W-2 is reported. Look again at the MWP handout and at the Medicaid Waiver Payment field below Box 14 on the W-2 screen. |
| Line 8 | Additional income (Schedule 1) | Line 8 pulls from Schedule 1, where the excludable MWP is subtracted back out. Revisit the handout on how the payment is removed from taxable income, and check your Medicaid Waiver Payment entry. |
| Line 9 | Total income | Line 9 is a sum of the income lines above it. If it is off, the mistake is in one of those income entries, not on line 9 itself. |
| Line 11a | Adjusted gross income | Line 11a is total income minus adjustments. If total income is right, look for an unexpected adjustment above this line. |
| Line 12e | Standard or itemized deduction | The standard deduction follows from filing status. Re-check the filing status for this taxpayer, using the dependent and head of household notes in the problem. |
| Line 15 | Taxable income | Taxable income is AGI minus the deduction (line 11a minus line 12e, never below zero). If lines 11a and 12e are right, this follows. |
| Line 16 | Tax | Tax comes from taxable income through the tax table. If taxable income (line 15) is right, this follows. |
| Line 24 | Total tax | Total tax is the tax minus credits plus other taxes. If line 16 is right, look for a credit or an extra tax entered in TaxSlayer that is not in the problem. |
| Line 25d | Federal tax withheld | Line 25d is federal withholding from your W-2 entries. Re-open the W-2 and compare box 2 to the source document. |
| Line 27a | Earned income credit (EIC) | The EIC depends on earned income and the qualifying person. Re-check the dependent entry and whether earned income was entered as the problem intends. |
| Line 33 | Total payments | Line 33 totals your payments and refundable credits. If it is off, the mistake is in a withholding or credit line above it. |
| Line 35a | Refund | The refund is the end result. If it is wrong, one of the checked lines above it is wrong. Fix those first and this should follow. |
| Line 37 | Amount you owe | The amount owed is the end result. If it is wrong, one of the checked lines above it is wrong. Fix those first and this should follow. |

### California Form 540

| Line | What it is | Hint |
| --- | --- | --- |
| Line 12 | State wages (W-2 box 16) | Line 12 is state wages from box 16 of the W-2. For an MWP return the handout explains how box 16 is set. Re-check box 16 and the handout note on California wages. |
| Line 14 | California subtractions | Line 14 comes from Schedule CA (540), column B. Look for an amount entered on a California adjustment screen in TaxSlayer that is not in the problem. |
| Line 16 | California additions | Line 16 comes from Schedule CA (540), column C. Look for an amount entered on a California adjustment screen in TaxSlayer that is not in the problem. |
| Line 17 | California AGI | CA AGI builds from federal AGI and the Schedule CA adjustments. If federal AGI is right, look at the Schedule CA entries. |
| Line 18 | California deduction | The California deduction follows from filing status. Confirm the filing status first, then confirm which standard deduction applies. |
| Line 19 | California taxable income | CA taxable income is CA AGI minus the deduction. If both of those are right, this follows. Otherwise re-check them. |
| Line 31 | California tax | CA tax comes from taxable income through the tax table. If taxable income is right, re-check that the correct table or method was used. |
| Line 32 | Exemption credit | The exemption credit depends on the taxpayer and the dependents claimed. Re-check the dependent and exemption entries. |
| Line 35 | California tax after credits | Line 35 is the California tax (line 31) minus the credits, starting with the exemption credit (line 32). If lines 31 and 32 are right, this follows. |
| Line 64 | California total tax | Line 64 adds any other California taxes to line 35. If line 35 is right, look for an extra California tax entered in TaxSlayer that is not in the problem. |
| Line 71 | California tax withheld | Line 71 is California withholding from box 17 of the W-2. Re-open the W-2 and compare box 17 to the source document. |
| Line 75 | California EITC | CA EITC depends on California earned income. Re-check the earned income entries, and for an MWP return see the handout on how California treats the payment for the credit. |
| Line 78 | Total payments | Line 78 totals California payments and credits. If it is off, the mistake is in a withholding or EITC line above it. |
| Line 111 | California amount you owe | The amount owed is the end result. If it is wrong, one of the checked California lines above it is wrong. Fix those first and this should follow. |
| Line 115 | California refund | The California refund is the end result. If it is wrong, one of the checked California lines above it is wrong. Fix those first. |

### California Form 3514 (EITC)

| Line | What it is | Hint |
| --- | --- | --- |
| Line 2 | Federal AGI | Line 2 carries federal AGI onto the 3514. If federal AGI is right this will match. Otherwise fix federal AGI first. |
| Line 13 | California wages | Line 13 is California wages used for the credit. For an MWP return the handout explains how the payment affects this figure. Re-check the handout and box 16. |
| Line 14 | IHSS / MWP payments | Line 14 is where IHSS and Medicaid Waiver Payments are reported for the California credit. Revisit the handout on how the payment flows to the 3514, and the Medicaid Waiver Payment field in TaxSlayer. |
| Line 19 | California earned income | Line 19 is your California earned income for the credit. Whether the MWP is included here depends on the option you chose. Re-check the option you selected on the MWP Worksheet. |

### Answer key notes

**N1: Filing status and dependent** (Step A)

* Answer key: Filing status = HOH. Using the Resource Tool, James is a dependent of Raymond and lived in his home for more than half the year (Chart 2, Box 25): 7 months, as the problem says.
* Hint: Walk James through the Resource Tool, Chart 2: his relationship to Raymond, the months he lived in the home, and support. That decides his dependent status, and his dependent status drives the filing status. Then check the dependent and filing status screens in TaxSlayer.
* Checked: at this step and again at every later step

**N2: Both refunds match the option you chose** (Steps E, F)

* Hint: Both refunds should equal the results of the option you circled on your MWP Worksheet. If they do not, the W-2 screen in TaxSlayer is probably still set up for another option you tested. Re-check the Medicaid Waiver Payment field, the include in earned income box, and Box 16.
* Checked: at this step only

**N3: MWP Worksheet scenarios** (Steps E, F)

* Hint: Compare your handout 2025 MWP Worksheet with the one attached to the answer sheet to see whether you did the scenarios correctly. For any option that does not match, set the W-2 screen back to that option's three settings (Medicaid Waiver Payment field, include in earned income box, Box 16) and read the results again.
* Checked: at this step only

**NN: TS Note added for this step** (Steps E, F)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step E in TaxSlayer
* Example: STEP E - MWP: FOR TAX YEAR 2025, THE MWP WORKSHEET WAS COMPLETED, ENTERED INTO TS AND THEN PLACED IN THE TP ENVELOPE. OPTION 1 WAS THE BEST ENTRY COMBINATION FOR THIS YEAR.


<a id="baylor"></a>

## Baylor (Michael Baylor, 2025)

Steps: A, B, C, E, F, G, H, I, J, L, M, N, O, P, R.

### Federal Form 1040

| Line | What it is | Hint |
| --- | --- | --- |
| Line 1a | Wages (W-2 box 1) | Line 1a adds box 1 of every W-2 entered so far. Compare each W-2 you entered in TaxSlayer with box 1 of the W-2s in the problem for the steps you have finished. |
| Line 1b | Household employee wages (election worker pay) | Line 1b is where the election worker pay goes. See 'Election Worker Income' in Pub 4012 for how to enter pay that came with no W-2 (Step I). |
| Line 2a | Tax-exempt interest | Line 2a is the $10 HSA interest from Step N. The handout 'HSA Notes' explains how to enter it so it is tax-exempt for the IRS but taxable for California. |
| Line 8 | Additional income (Schedule 1, line 10) | Line 8 comes from Schedule 1, line 10. Check the Schedule 1 lines in this list first; this total follows from them. |
| Line 9 | Total income | Line 9 is a sum of the income lines above it. If it is off, the mistake is in one of those income entries, not on line 9 itself. |
| Line 11a | Adjusted gross income | Line 11a is total income minus the adjustments on Schedule 1, line 26. If total income is right, look at the adjustments (jury pay given to the employer, the HSA deduction). |
| Line 12e | Standard or itemized deduction | The standard deduction follows from filing status. Michael is a qualifying surviving spouse (Step A, note N1). Itemizing is right only when Schedule A is larger, and here it is not. |
| Line 15 | Taxable income | Taxable income is AGI minus the deduction. If lines 11a and 12e are right, this follows. |
| Line 16 | Tax | Tax comes from taxable income through the tax table. If taxable income is right, this follows. |
| Line 24 | Total tax | Total tax is tax minus credits plus other taxes. Check Willie's child tax credit, the Schedule 3 credits, and the Schedule 2 taxes in this list. |
| Line 25d | Federal tax withheld | Line 25d adds federal withholding from every W-2 (box 2) and the unemployment Form 1099-G (box 4). Compare each one you entered with the problem. |
| Line 27a | Earned income credit (EIC) | The EIC depends on earned income and on Willie as a qualifying child. On the answer key it changes at Steps B and C, as the Betts and Supt of Schools W-2 wages are added. Re-check his dependent entry from Step A and the W-2 amounts. |
| Line 28 | Additional child tax credit (ACTC) | The additional child tax credit depends on Willie qualifying for the child tax credit (note N1) and on earned income. Re-check his dependent screen. |
| Line 33 | Total payments | Line 33 totals withholding and refundable credits. If it is off, the mistake is in a withholding or credit line above it. |
| Line 35a | Refund | The refund is the end result. If it is wrong, one of the checked lines above it is wrong. Fix those first and this should follow. |
| Line 37 | Amount you owe | The amount owed is the end result. If it is wrong, one of the checked lines above it is wrong. Fix those first and this should follow. |

### Schedule 1

| Line | What it is | Hint |
| --- | --- | --- |
| Line 7 | Unemployment compensation | Schedule 1, line 7 is box 1 of the unemployment Form 1099-G in Step G. |
| Line 8c | Cancellation of debt | Line 8c is box 2 of the Form 1099-C in Step H. Michael is not insolvent and the debt is personal, so the whole amount is income. |
| Line 8f | Income from Form 8889 (HSA) | Line 8f is HSA money not spent on qualified medical expenses. Go through each Step N distribution and decide which ones qualify (the Zumba classes had no letter of medical necessity). |
| Line 8h | Jury duty pay | Line 8h is all of the jury duty pay from Step J: 10 weekdays at $40 a day. |
| Line 13 | HSA deduction | Line 13 is the HSA deduction from Form 8889: the contribution Michael made himself in Step N. |
| Line 20 | IRA deduction | Nothing in this case is an IRA contribution. Look for an HSA or retirement amount that was entered as an IRA. |
| Line 24a | Jury pay given to the employer | Line 24a is the jury pay Michael had to give his employer: the 5 weekdays his salary continued, at $40 a day. |

### Schedule 2

| Line | What it is | Hint |
| --- | --- | --- |
| Line 17c | Additional tax on HSA distributions | Line 17c is the 20% additional tax on HSA money not spent on qualified medical expenses (Schedule 1, line 8f). |

### Schedule 3

| Line | What it is | Hint |
| --- | --- | --- |
| Line 2 | Child and dependent care credit | Schedule 3, line 2 is the child and dependent care credit from Form 2441, for Willie's care in Step L. |
| Line 3 | Education credit | Line 3 is the education credit from Form 8863 for the Step O Form 1098-T. Read the Step O notes to decide which credit Michael qualifies for, and do not rely on the TaxSlayer pop-up. |

### Schedule A

| Line | What it is | Hint |
| --- | --- | --- |
| Line 5a | State and local income tax | Schedule A, line 5a picks up California withholding (box 17) and CASDI (box 14) from the W-2s. Compare boxes 14 and 17 on each W-2 you entered with the problem. |
| Line 17 | Total itemized deductions | Schedule A, line 17 totals the itemized deductions entered. Only the state taxes from the W-2s belong here in this case. |

### Form 8880

| Line | What it is | Hint |
| --- | --- | --- |
| Line 2 | Elective deferrals | Form 8880, line 2 is the elective deferral in box 12 (code D) of the Betts Technology W-2. |

### California Form 540

| Line | What it is | Hint |
| --- | --- | --- |
| Line 12 | State wages (W-2 box 16) | Line 12 is state wages from box 16 of every W-2 entered so far. Compare box 16 of each W-2 in TaxSlayer with the problem. |
| Line 14 | California subtractions | Line 14 comes from Schedule CA. California does not tax unemployment, and some differences need a manual entry. See the 'CA Adjustments Worksheet'. |
| Line 16 | California additions | Line 16 comes from Schedule CA. California taxes the HSA money that the IRS does not (box 12 code W on the Betts W-2, and later the HSA interest). See the 'CA Adjustments Worksheet'. |
| Line 18 | California deduction | The California deduction follows from filing status. Confirm the filing status first (note N1). |
| Line 19 | California taxable income | CA taxable income is CA AGI minus the deduction. If the subtraction and addition lines are right, this follows. |
| Line 31 | California tax | CA tax comes from taxable income through the tax table. If taxable income is right, this follows. |
| Line 32 | Exemption credit | The exemption credit depends on filing status and dependents. Re-check the Step A filing status and Willie's dependent entry. |
| Line 40 | California child and dependent care credit | Line 40 follows from the Step L care expenses. Check the qualified expense amount you entered. |
| Line 46 | Renter’s credit | Line 46 is the nonrefundable renter's credit. Michael rents the land under his mobile home (Interview Notes). |
| Line 47 | Total California credits | Line 47 totals the California credits. Check the renter's credit first. |
| Line 71 | California tax withheld | Line 71 is California withholding from box 17 of each W-2. Compare box 17 of each W-2 in TaxSlayer with the problem. |
| Line 75 | California EITC | The California EITC depends on California earned income and on Willie as a qualifying child. |
| Line 78 | Total payments | Line 78 totals California payments and credits. If it is off, the mistake is in a withholding or EITC line above it. |
| Line 91 | Use tax | Michael said he owes $35 in California use tax (Interview Notes). Line 91 must not be left blank. |
| Line 111 | Amount you owe | The amount owed to California is the end result. Fix the checked California lines above it first. |
| Line 115 | California refund | The California refund is the end result. If it is wrong, one of the checked California lines above it is wrong. Fix those first. |

### Notes for one step only

At these steps the line's hint above is replaced by the answer sheet note, or the step shows a tip.

| Step | Line | Text |
| --- | --- | --- |
| A | California Form 540, Line 46 | Note N3: read the information on Renter's Credit in the Duck Book if your answer does not match. |
| B | California Form 540, Line 12 | Note N5: always enter the state information on a W-2, even when nothing is withheld. That is the only way TaxSlayer knows the income also belongs to California. |
| C | Form 8880, Line 2 | Note N6: review what you entered for box 14 of the W-2. The STRS amount was a required contribution, not an elective one. |
| E | California Form 540, Line 14 | Note N7: this needs a manual entry on the state return. The Eskaton W-2 box 1 and box 16 differ, so note the Fed/CA wage difference on line B-8z of the 'CA Adjustments Worksheet' and make the manual adjustment described under 'Line A-1 Wages' in the handout 'CA CA Instructions'. |
| F | California Form 540, Line 14 | Note N7: this needs a manual entry on the state return. The Eskaton W-2 box 1 and box 16 differ, so note the Fed/CA wage difference on line B-8z of the 'CA Adjustments Worksheet' and make the manual adjustment described under 'Line A-1 Wages' in the handout 'CA CA Instructions'. |
| F | (step tip) | Note N8: the Form 1099-G for last year's California refund should not be entered, because Michael did not itemize last year. |
| J | Schedule 1, Line 8h | Note N9: see Jury Duty in Pub 4012. The jury pay and the amount given to the employer cannot be netted against each other. |
| J | Schedule 1, Line 24a | Note N9: see Jury Duty in Pub 4012. The jury pay and the amount given to the employer cannot be netted against each other. |
| L | Schedule 3, Line 2 | Note N11: Willie qualifies for only 4 months of care, because he turned 13 on May 1. Enter only the qualified expenses, not the total paid. |
| L | California Form 540, Line 40 | Note N11: Willie qualifies for only 4 months of care, because he turned 13 on May 1. Enter only the qualified expenses, not the total paid. |
| M | Federal Form 1040, Line 12e | Note N12: Michael did not need to itemize. Compare the itemized total with his standard deduction before entering Step M. |
| M | Schedule A, Line 5a | Note N12: Michael did not need to itemize. Compare the itemized total with his standard deduction before entering Step M. |
| M | Schedule A, Line 17 | Note N12: Michael did not need to itemize. Compare the itemized total with his standard deduction before entering Step M. |
| N | California Form 540, Line 14 | Note N13: if the CA 540 numbers do not match, double-check the manual California changes for an HSA, using the last bullet under 'Distributions From HSA' in the handout 'HSA Notes'. |
| N | California Form 540, Line 16 | Note N13: if the CA 540 numbers do not match, double-check the manual California changes for an HSA, using the last bullet under 'Distributions From HSA' in the handout 'HSA Notes'. |

### Answer key notes

**N1: Filing status and dependent** (Step A)

* Answer key: Filing status = QSS. Using the 'Qualifying Child or Relative Resource Tool', Willie = Box 35, CTC.
* Hint: Joan died in 2023 and Michael supports his son, so check the qualifying surviving spouse rules. Walk Willie through the Resource Tool and the handout 'CTC ODC Chart' to decide his dependent status and the child tax credit box. Then check the filing status and dependent screens in TaxSlayer.
* Checked: at this step and again at every later step

**N2: Identity Protection PIN entered** (Step A)

* Hint: Michael's IP PIN is in the Interview Notes. Enter it in TaxSlayer where the taxpayer's Identity Protection PIN is asked for, and add a TS Note about it (the next item).
* Checked: at this step and again at every later step

**NN_A: TS Note added for Step A** (Step A)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step A (the IP PIN) in TaxSlayer
* Example: STEP A - IP PIN: TP HAS AN IP PIN

**N4: Betts W-2 address matches the form** (Step B)

* Hint: The Betts Technology W-2 shows Michael's address as PO Box 540. Enter the address on the W-2 screen in TaxSlayer exactly as it is printed on the form.
* Checked: at this step only

**NP: Preparer Note added** (Step I)

* Hint: What is missing is a Preparer Note, not a TS Note: they are two different notes in TaxSlayer, and the TS Note for this step is its own item. Pub 4012, 'Election Worker Income', gives the specific steps for entering the Preparer Note for election worker pay. TaxSlayer prints Preparer Notes on their own page, so add it, then print a new PDF.
* Checked: at this step and again at every later step

**NN_E: TS Note added for Step E** (Step E)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step E (the wage difference) in TaxSlayer
* Example: STEP E - FED/STATE WAGE DIFFERENCE: ESKATON PROPERTIES W-2 HAD A FED/STATE WAGE DIFFERENCE. A MANUAL ADJUSTMENT WAS MADE TO THE CA STATE RETURN.

**NN_I: TS Note added for Step I** (Step I)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step I (election worker pay) in TaxSlayer
* Example: STEP I - ELECTION WORKER PAY: ELECTION WORKER PAY ENTERED AS HOUSEHOLD EMPLOYEE INCOME.

**NN_N: TS Note added for Step N** (Step N)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step N (the HSA interest) in TaxSlayer
* Example: STEP N - HSA INTEREST: INTEREST AMOUNT OF $10 MUST BE REPORTED AS TAXABLE FOR CA. ENTERED ON 1099-INT, FED TAX EXEMPT MADE TAXABLE FOR CA.


<a id="graham"></a>

## Graham (Stacey and Sean Graham, 2025)

Steps: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, R2, S, U, V, W.

### Federal Form 1040

| Line | What it is | Hint |
| --- | --- | --- |
| Line 1h | Other earned income | Line 1h is where Stacey's disability pension goes until she reaches the company's normal retirement age (Step M). Re-open that 1099-R in TaxSlayer and check the disability box at the bottom of the screen. |
| Line 4a | IRA distributions | Line 4a adds box 1 of every IRA 1099-R entered so far (Steps C, D, E, and F), even the ones that were rolled over. Compare each IRA 1099-R you entered with box 1 of the forms in the problem. |
| Line 4b | Taxable IRA distributions | Line 4b is only the taxable part of the IRA distributions. It changes at Step E (the early distribution) and Step F (the RMD, less the qualified charitable distribution). The rollovers in Steps C and D add nothing here. Re-check box 2a and the rollover and QCD choices on each IRA 1099-R. |
| Line 4c box 1 | Rollover box | The Rollover box on line 4c is checked when an IRA distribution was rolled over (Steps C and D). On the 1099-R screen, mark the distribution as a rollover rather than only changing the taxable amount. |
| Line 4c box 2 | QCD box | The QCD box on line 4c is checked when part of an IRA distribution went straight to a charity (Step F). See 'Qualified Charitable Distributions' in Pub 4012 for where TaxSlayer asks about a QCD. |
| Line 5a | Pensions and annuities | Line 5a adds box 1 of every pension 1099-R entered so far. Compare each pension 1099-R you entered with box 1 of the forms in the problem. |
| Line 5b | Taxable pensions and annuities | Line 5b is the taxable part of the pensions. It changes at Steps G, H, I, K, L, O, and P: the PSO health insurance exclusion (G), OPM (H), Wells Fargo (I), the Simplified Method (K and L), railroad retirement (O), and military retirement (P). Compare box 2a and any exclusion on each pension 1099-R you entered for those steps. |
| Line 5c box 2 | PSO box | The PSO box on line 5c is checked when a retired public safety officer's health insurance premiums reduce the taxable pension (Step G). Use the PSO option under box 2a on the 1099-R screen. |
| Line 6a | Social Security benefits | Line 6a is the net benefits from Sean's SSA-1099 (Step N) and the tier 1 benefits from his RRB-1099 (Step O). Compare box 5 of each form with what you entered. |
| Line 6b | Taxable Social Security benefits | TaxSlayer works out the taxable part of the benefits from the other income. If line 6a and the income lines above are right, this follows. |
| Line 8 | Additional income (Schedule 1, line 10) | Line 8 comes from Schedule 1, line 10, which here is Stacey's tutoring business income from Schedule C (Step B). Check the Schedule C income and expenses first. |
| Line 9 | Total income | Line 9 is the sum of the income lines above it. If it is off, the mistake is in one of those income entries, not on line 9 itself. |
| Line 10 | Adjustments to income (Schedule 1, line 26) | Line 10 comes from Schedule 1, line 26. It changes at Step B (the deductible part of self-employment tax and the self-employed health insurance) and Step Q (educator expenses, alimony paid, and student loan interest). Check the Schedule 1 lines in this list. |
| Line 11a | Adjusted gross income | Line 11a is total income minus the adjustments. If lines 9 and 10 are right, this follows. |
| Line 12e | Standard or itemized deduction | The standard deduction follows from the filing status (married filing jointly) and the ages of Stacey and Sean. Itemizing is right only when Schedule A is larger. Re-check the filing status and birth dates from Step A. |
| Line 13b | Additional deductions (Schedule 1-A) | Line 13b comes from Schedule 1-A, the new additional deductions, such as the deduction for a taxpayer age 65 or older. Check the birth dates entered in Step A. |
| Line 15 | Taxable income | Taxable income is AGI minus the deductions on lines 12e through 13b, never below zero. If those lines are right, this follows. |
| Line 16 | Tax | Tax comes from taxable income through the tax table. If taxable income (line 15) is right, this follows. |
| Line 19 | Child tax credit and credit for other dependents | Line 19 depends on Joshua qualifying for the child tax credit and Jeremy and Gail for the credit for other dependents (note N1). Re-check the dependent screens from Step A. |
| Line 20 | Credits from Schedule 3, line 8 | Line 20 is the nonrefundable part of Jeremy's education credit, from Schedule 3 (Step S). Re-check the 1098-T and the education expenses you entered. |
| Line 21 | Total credits | Line 21 adds lines 19 and 20. If those are right, this follows. |
| Line 23 | Other taxes (Schedule 2, line 21) | Line 23 comes from Schedule 2, line 21: here the self-employment tax and the additional tax on the early IRA distribution. Check the Schedule 2 lines in this list. |
| Line 24 | Total tax | Total tax is the tax minus credits plus other taxes. Check lines 16, 21, and 23 first; this follows from them. |
| Line 25d | Federal tax withheld | Line 25d adds federal withholding (box 4) from every 1099-R and the SSA and RRB forms entered so far. Compare each form you entered with the problem. |
| Line 27a | Earned income credit (EIC) | The EIC depends on earned income (Stacey's business, Step B, and her disability pension, Step M) and on Joshua as a qualifying child; Gail does not qualify the family. The credit shrinks as income rises, so it also changes at Steps I, K, L, N, and O. Re-check the dependent screens from Step A and the income entries for those steps. |
| Line 28 | Additional child tax credit (ACTC) | The additional child tax credit depends on Joshua qualifying for the child tax credit (note N1) and on earned income. Re-check his dependent screen. |
| Line 29 | American opportunity credit (refundable part) | Line 29 is the refundable part of Jeremy's American opportunity credit (Step S). Re-check the 1098-T, the 1099-Q, and the expenses his parents paid. |
| Line 33 | Total payments | Line 33 totals withholding and refundable credits. If it is off, the mistake is in a withholding or credit line above it. |
| Line 35a | Refund | The refund is the end result. If it is wrong, one of the checked lines above it is wrong. Fix those first and this should follow. |
| Line 37 | Amount you owe | The amount owed is the end result. If it is wrong, one of the checked lines above it is wrong. Fix those first and this should follow. |

### Schedule 1

| Line | What it is | Hint |
| --- | --- | --- |
| Line 3 | Business income (Schedule C) | Schedule 1, line 3 is the profit from Stacey's tutoring business on Schedule C (Step B). Compare her income and each expense with the problem. |
| Line 11 | Educator expenses | Line 11 is the educator expense deduction from Step Q. Check who qualifies as an eligible educator and the limit in Pub 4012. |
| Line 15 | Deductible part of self-employment tax | Line 15 is half of the self-employment tax, worked out from the Schedule C profit. If Schedule 1, line 3 is right, this follows. |
| Line 17 | Self-employed health insurance deduction | Line 17 is the health insurance Stacey paid for herself and Joshua through her business (Step B). Check the premiums entered on the Schedule C health insurance screen. |
| Line 19a | Alimony paid | Line 19a is the alimony paid from Step Q. Check the amount and the divorce date in the problem: only a decree from before 2019 makes alimony deductible. |
| Line 21 | Student loan interest deduction | Line 21 is the student loan interest deduction from Step Q. Compare the 1098-E amount with what you entered. |

### Schedule 2

| Line | What it is | Hint |
| --- | --- | --- |
| Line 4 | Self-employment tax | Line 4 is the self-employment tax on Stacey's Schedule C profit. If Schedule 1, line 3 is right, this follows. |
| Line 8 | Additional tax on IRAs (Form 5329) | Line 8 is the 10% additional tax on the early IRA distribution from Step E, after any exception on Form 5329. Review the early distribution exception codes in Pub 4012. |

### Schedule A

| Line | What it is | Hint |
| --- | --- | --- |
| Line 1 | Medical and dental expenses | Schedule A, line 1 collects the medical insurance not already used elsewhere: what is left after the PSO exclusion (Step G), and the premiums on the OPM, SSA, and RRB forms (Steps H, N, and O). Do not count the same premium twice. |
| Line 16 | Other itemized deductions | Line 16 is the unrecovered investment in the Northern Trust pension, from the Pension Exclusion Calculator (Step L). See the comments on the Calculator results. |

### California Form 540

| Line | What it is | Hint |
| --- | --- | --- |
| Line 14 | California subtractions | Line 14 comes from Schedule CA, column B. It changes at Step N (Social Security, which California does not tax), Step O (railroad tier 1 benefits), Step P (the military retirement exclusion), and Step Q (the adjustments to income). Check the CA adjustments you entered for those steps. |
| Line 16 | California additions | Line 16 comes from Schedule CA, column C. Look for an amount entered on a California adjustment screen that does not belong on this return. |
| Line 18 | California deduction | The California standard deduction follows from the filing status set in Step A. Itemizing for California is right only when the California itemized total is larger (Step R2). |
| Line 19 | California taxable income | California taxable income is California AGI minus the deduction. If the federal income and the CA subtractions are right, this follows. |
| Line 31 | California tax | California tax comes from taxable income (line 19) through the tax table. If line 19 is right, this follows. |
| Line 32 | Exemption credits | The exemption credits follow from the filing status, the ages, and the number of dependents entered in Step A. Re-check those screens. |
| Line 46 | Nonrefundable renter’s credit | Line 46 is the renter's credit. Read its requirements in the Duck Book and check whether the Grahams qualify. |
| Line 63 | Other California taxes | Line 63 is California's additional tax on the early IRA distribution from Step E (form FTB 3805P). It follows from the federal Form 5329 entries. |
| Line 71 | California tax withheld | Line 71 adds the state tax withheld on the 1099-R forms (box 14). Compare each one you entered with the problem. |
| Line 75 | California EITC | The California earned income tax credit depends on earned income and on Joshua as a qualifying child. If the federal EIC lines are right, check the California credit screens. |
| Line 78 | Total payments | Line 78 totals California withholding and refundable credits. If it is off, the mistake is in a withholding or credit line above it. |
| Line 111 | California amount you owe | The amount owed is the end result. If it is wrong, one of the checked California lines above it is wrong. Fix those first and this should follow. |
| Line 115 | California refund | The refund is the end result. If it is wrong, one of the checked California lines above it is wrong. Fix those first and this should follow. |

### schCA

| Line | What it is | Hint |
| --- | --- | --- |
| Part I, line 5b, column B | Pension subtraction | Schedule CA, line 5b, column B is the part of the pensions California does not tax, including the military retirement exclusion from Step P. Review the handout on the CA exclusion for military retirement and enter the CA adjustment. |
| Part II, line 19 | Unreimbursed employee expenses | Schedule CA, Part II, line 19 is the unreimbursed employee expenses California still allows (Step Q). Enter them as a California adjustment, since they are not deductible on the federal return. |

### Notes for one step only

At these steps the line's hint above is replaced by the answer sheet note, or the step shows a tip.

| Step | Line | Text |
| --- | --- | --- |
| A | California Form 540, Line 46 | Note N2: if line 46 is more than $0, go back and review the California renter's credit requirements in the Duck Book. |
| B | Federal Form 1040, Line 8 | Note N2b: if your answer is incorrect, check Schedule C for the probable error: car and truck expenses, line 9 = $1,491; other interest, line 16b = $300; other expenses, line 27b = $108 ($75 for the DMV plus $33 for parking and tolls). |
| B | Schedule 1, Line 3 | Note N2b: if your answer is incorrect, check Schedule C for the probable error: car and truck expenses, line 9 = $1,491; other interest, line 16b = $300; other expenses, line 27b = $108 ($75 for the DMV plus $33 for parking and tolls). |
| C | Federal Form 1040, Line 4b | Note N3: did you forget to zero out box 2a and check the box at the bottom of the screen indicating it was a rollover? |
| C | Federal Form 1040, Line 4c box 1 | Note N3: did you forget to zero out box 2a and check the box at the bottom of the screen indicating it was a rollover? |
| D | Federal Form 1040, Line 4b | Note N3: did you forget to zero out box 2a and check the box at the bottom of the screen indicating it was a rollover? |
| D | Federal Form 1040, Line 4c box 1 | Note N3: did you forget to zero out box 2a and check the box at the bottom of the screen indicating it was a rollover? |
| E | Schedule 2, Line 8 | Note N4: review Pub 4012 on Form 5329 exception codes and the requirements for code 23. Be sure to read the footnotes for code 23. If that does not fix it, make sure you marked TP for both the 1099-R and Form 5329. |
| F | Federal Form 1040, Line 4b | Note N5: did you specify that the QCD was only $20,000 instead of the entire amount? |
| G | Federal Form 1040, Line 5c box 2 | Note N6: enter the 1099-R, including box 2a. Then click 'click here for option' below box 2a, choose the PSO option, and enter the health insurance amount. TaxSlayer works out the taxable amount and creates the 'nontaxable retirement distribution' entry. |
| G | Schedule A, Line 1 | Note N7: a public safety officer can use only up to $3,000 of health insurance premiums to reduce the taxable amount. The premiums above that can go on Schedule A when itemizing. |
| H | Schedule A, Line 1 | Note N8: box 5 of the OPM 1099-R ($283) goes on Schedule A as a medical expense, along with the $700 from Step G. |
| J | Federal Form 1040, Line 5b | Note N9: refer back to the handout 'Retirement Income (non-IRA)'. |
| K | Federal Form 1040, Line 5b | Note N10: on the Exclusion Calculator, did you check 'if deceased' and 'died in 20CC'? On the Simplified Method screen, did you check the box indicating the annuity benefits are based on the annuitant and beneficiary? |
| L | Schedule A, Line 16 | Note N11: did you enter the unrecovered investment in the pension from the Pension Exclusion Calculator? |
| M | Federal Form 1040, Line 1h | Note N12: did you mark this 1099-R as a disability, so the distribution is treated as wages? |
| P | undefined, Part I, line 5b, column B | Note N13: did you enter the California adjustment as instructed in the step? |
| R | (step tip) | Note N14: there is no need to enter the 1099-G, since the Grahams itemized and took the sales tax deduction last year. |
| R2 | Federal Form 1040, Line 12e | Note N15: Stacey did not have enough additional itemized deductions to exceed the California standard deduction. The health insurance premiums she listed were already entered in Steps B, G, H, N, and O. |
| R2 | California Form 540, Line 18 | Note N15: Stacey did not have enough additional itemized deductions to exceed the California standard deduction. The health insurance premiums she listed were already entered in Steps B, G, H, N, and O. |
| S | Federal Form 1040, Line 20 | Note N16: go back and review the video. |
| S | Federal Form 1040, Line 29 | Note N16: go back and review the video. |

### Answer key notes

**N1: Filing status and dependents** (Step A)

* Answer key: Filing status = MFJ. Stacey should be listed as the Taxpayer. Using the QC/QR Resource Tool, Joshua = Box 35, CTC. Jeremy = Box 35, ODC. Gail = Chart 2 Box 25, ODC, No EIC.
* Hint: Walk each dependent through the 'Qualifying Child or Relative Resource Tool' and the handout 'CTC ODC Chart': Joshua is a qualifying child for the child tax credit; Jeremy and Gail qualify only for the credit for other dependents. List Stacey as the taxpayer, then check the filing status and each dependent's credit on the dependent screens.
* Checked: at this step and again at every later step

**NN_C: TS Note added for Step C** (Step C)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step C (the IRA rollover) in TaxSlayer
* Example: STEP C - IRA ROLLOVER: TP ROLLED ENTIRE IRA DISTRIBUTION BACK INTO AN IRA ACCOUNT WITHIN 60 DAYS SO THERE WAS NO EARLY WITHDRAWAL PENALTY.

**NN_E: TS Note added for Step E** (Step E)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step E (the early IRA distribution) in TaxSlayer
* Example: STEP E - EARLY IRA DIST: $1,825 EARLY WITHDRAWAL FROM WELLS FARGO WAS USED FOR CAR REPAIRS NEEDED TO COMMUTE TO WORK. $825 WAS EXEMPT FROM THE EARLY WITHDRAWAL PENALTY UNDER 'PERSONAL EMERGENCY EXPENSE'.

**NN_F: TS Note added for Step F** (Step F)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step F (the QCD) in TaxSlayer
* Example: STEP F - QCD: $20,000 OF THE $20,838 RMD FOR SEAN FROM WELLS FARGO WAS A QCD TO THEIR CHURCH AND EXCLUDED FROM TAXABLE INCOME.

**NN_G: TS Note added for Step G** (Step G)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step G (the PSO exclusion) in TaxSlayer
* Example: STEP G - PSO: EDC SHERIFF 1099-R FOR SEAN - BOX 2 TAXABLE AMOUNT WAS REDUCED BY $3K FOR PUBLIC SAFETY OFFICER HEALTH INSURANCE. ADDN'L $700 ENTERED ON SCH A ITEMIZED DEDUCTIONS.

**NN_K: TS Note added for Step K** (Step K)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step K (the Simplified Method) in TaxSlayer
* Example: STEP K - SIMPLIFIED METHOD: NATHANS HAMBURGER 1099-R IS A JOINT SURVIVOR ANNUITY, USED SIMPLIFIED METHOD. ANNUITY START DATE 9/1/2019. ANNUAL EXCLUSION $1,771. FINAL YEAR 2053 WITH AN EXCLUSION OF $1,466.

**NN_L: TS Note added for Step L** (Step L)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step L (the Simplified Method) in TaxSlayer
* Example: STEP L - SIMPLIFIED METHOD: NORTHERN TRUST 1099-R WAS NOT A JOINT SURVIVOR ANNUITY. ANNUITY START DATE 1/1/2017. ANNUAL EXCLUSION $271. THIS WAS THE LAST YEAR, THE UNRECOVERED $3,425 WAS ENTERED ON SCH A AS 'OTHER DEDUCTIONS'.

**NN_M: TS Note added for Step M** (Step M)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step M (the disability pension) in TaxSlayer
* Example: STEP M - DISABILITY PENSION: STACEY WENT ON DISABILITY AT AGE 45. NORMAL RETIREMENT AGE AT THE COMPANY IS 65. MUST CHECK THE DISABILITY BOX AT THE BOTTOM OF THE INPUT PAGE SO THE AMOUNT IS REPORTED AS WAGES.

**NN_P: TS Note added for Step P** (Step P)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step P (the CA military retirement exclusion) in TaxSlayer
* Example: STEP P - CA EXCLUSION FOR MILITARY RETIREMENT: SINCE SEAN WAS IN UNIFORMED SERVICE, $20,000 OF THE TAXABLE AMOUNT WAS EXCLUDED FOR CA.


<a id="kent"></a>

## Kent (Karl Kent, 2025)

Steps: A, B, C, D, E, G, H, J, K, L, N, O, P, Q, R, S, T.

### Federal Form 1040

| Line | What it is | Hint |
| --- | --- | --- |
| Line 1a | Wages (W-2 box 1) | Line 1a is box 1 of Karl's W-2 (Step B). Compare the W-2 you entered with the form in the problem, box by box. |
| Line 2a | Tax-exempt interest | Line 2a adds the tax-exempt interest from the ZYX 1099-INT (Step D), the exempt-interest dividends from the 1099-DIVs (Steps E and G), and the K-1's tax-exempt interest (Step L). Review the handout 'Tax Exempt Interest & Dividends Quick Guide' for where each one is entered. |
| Line 2b | Taxable interest | Line 2b adds the seller-financed mortgage interest (Step C), the ZYX 1099-INT (Step D), and the K-1 interest (Step L). Check each amount you entered against the problem. |
| Line 3a | Qualified dividends | Line 3a is the qualified dividends (box 1b) from the 1099-DIVs and the K-1. Compare box 1b of each form you entered with the problem. |
| Line 3b | Ordinary dividends | Line 3b is the ordinary dividends (box 1a) from the 1099-DIVs and the K-1. Compare box 1a of each form you entered with the problem. |
| Line 7a | Capital gain or loss | Line 7a comes from Schedule D: the capital gain distributions (Step E), the home sale (Step J), the Schwab 1099-B sales (Step K), and the K-1 (Step L). A net loss is limited to $3,000. Look at Schedule D in your PDF to find which part is off. |
| Line 8 | Additional income (Schedule 1, line 10) | Line 8 comes from Schedule 1, line 10: last year's taxable state refund (Step H) and the K-1 partnership income on Schedule E (Step L). Check the Schedule 1 lines first. |
| Line 9 | Total income | Line 9 is the sum of the income lines above it. If it is off, the mistake is in one of those income entries, not on line 9 itself. |
| Line 10 | Adjustments to income (Schedule 1, line 26) | Line 10 comes from Schedule 1, line 26: the early withdrawal penalty from the 1099-INT (Step D) and, from Step Q, the IRA deduction. Check the Schedule 1 lines in this list. |
| Line 11a | Adjusted gross income | Line 11a is total income minus the adjustments. If lines 9 and 10 are right, this follows. |
| Line 12e | Standard or itemized deduction | Before Step N this is the standard deduction for head of household and Karl's age, set in Step A. From Step N, Karl itemizes, and the total changes again at Step O (last year's return and the sales tax), Step Q (the IRA deduction lowers AGI, which changes the medical floor), and Step R (the net premium tax credit reduces medical expenses). Re-check the Schedule A amounts the answer sheet lists for your step. |
| Line 13a | Qualified business income deduction | Line 13a is the qualified business income deduction from the Section 199A dividends on a 1099-DIV (Step E). Check box 5 of the 1099-DIV you entered. |
| Line 13b | Additional deductions (Schedule 1-A) | Line 13b comes from Schedule 1-A: the new deduction for a taxpayer age 65 or older, set by Karl's birth date in Step A. It phases out as income rises, so it shrinks at Steps D and E (the interest and dividends). If line 11a is right, this follows. |
| Line 15 | Taxable income | Taxable income is AGI minus the deductions on lines 12e through 13b, never below zero. If those lines are right, this follows. |
| Line 16 | Tax | Tax comes from taxable income, with qualified dividends and capital gains taxed at lower rates. If line 15 and the dividend and gain lines are right, this follows. |
| Line 19 | Child tax credit and credit for other dependents | Line 19 is the child tax credit for Jane (note N1), limited to the tax, so it grows at Steps B, C, and D as income and tax rise. Kendra and Susan are not dependents and are not listed. Re-check the dependent screens from Step A, then the income for those steps. |
| Line 20 | Credits from Schedule 3, line 8 | Line 20 comes from Schedule 3: the foreign tax credit from the ZYX 1099-INT (Step D), the ZYX 1099-DIV (Step E), and the K-1 (Step L), and from Step P the child and dependent care credit. Check the Schedule 3 lines in this list. |
| Line 21 | Total credits | Line 21 adds lines 19 and 20. If those are right, this follows. |
| Line 22 | Tax after credits | Line 22 is the tax minus the credits. Check lines 16 and 21 first. |
| Line 24 | Total tax | Total tax is the tax after credits plus any other taxes. Check lines 16 and 21 first; this follows from them. |
| Line 25d | Federal tax withheld | Line 25d adds the federal tax withheld on every form entered so far: the 1099-INT (Step D) and the 1099-DIV (Step E). Compare box 4 of each form you entered with the problem. |
| Line 26 | Estimated tax payments | Line 26 is the four federal estimated payments Karl made plus last year's refund applied to this year (Step O). Look at last year's return in the problem for the amount applied. |
| Line 31 | Other payments (Schedule 3, line 15) | Line 31 is the net premium tax credit from Form 8962 (Step R). Check the 1095-A entries: totals only when every month is the same, otherwise month by month. |
| Line 33 | Total payments | Line 33 adds withholding, estimated payments, and refundable credits. Check lines 25d, 26, and 31 first. |
| Line 35a | Refund | The refund is the payments minus the total tax. Check the total tax and the payment lines first. |
| Line 37 | Amount you owe | The amount owed is the total tax minus the payments. Check line 24 and the payment lines first. |

### Schedule 1

| Line | What it is | Hint |
| --- | --- | --- |
| Line 5 | Rental real estate, partnerships (Schedule E) | Line 5 is the K-1 partnership income from Schedule E (Step L). Check that the K-1 was entered as a passive, publicly traded partnership with all investment at risk, as note N10 describes. |
| Line 18 | Penalty on early withdrawal of savings | Line 18 is box 2 of the ZYX 1099-INT (Step D), the early withdrawal penalty. Compare the 1099-INT you entered with the brokerage statement. |
| Line 20 | IRA deduction | Line 20 is Karl's traditional IRA contribution (Step Q): the maximum for his age, limited by his earned income. See the handout 'IRA Contributions'. |

### Schedule 3

| Line | What it is | Hint |
| --- | --- | --- |
| Line 1 | Foreign tax credit | Line 1 adds the foreign tax paid on the 1099-DIVs (box 7) and on the K-1. Enter foreign tax on the federal interest or dividend screen, not on the state section. |
| Line 2 | Child and dependent care credit | Line 2 is the credit for the care of Susan (Step P). Jane is a qualifying person with no expenses, and Melissa is not a qualifying person. See Pub 4012, 'Child & Dependent Care Expenses'. |
| Line 9 | Net premium tax credit | Line 9 is the net premium tax credit from Form 8962 (Step R). Check the 1095-A entries month by month against the form in the problem. |

### Schedule A

| Line | What it is | Hint |
| --- | --- | --- |
| Line 5a | State and local income or sales tax | Line 5a is the larger of the state and local income taxes and the general sales tax. From Step B it holds the CASDI from box 14 of Karl's W-2. From Step N, use the sales tax worksheet in TaxSlayer, with the VA benefits added to the income for it (note N12). |

### California Form 540

| Line | What it is | Hint |
| --- | --- | --- |
| Line 11 | California exemption amount | The exemption amount follows from Karl's personal exemption and Jane as a dependent. Re-check the dependent entries from Step A, as note N1 describes. |
| Line 14 | California subtractions | California subtractions come from Schedule CA, column B: the U.S. Savings Bond interest (Step D) and last year's state refund (Step H). Mark savings bond interest as California exempt on the 1099-INT screen. |
| Line 16 | California additions | California taxes interest and exempt-interest dividends from other states' bonds, so they are added on Schedule CA, column C. Check the California taxable amounts on each 1099-INT, 1099-DIV, and K-1 entry, as the answer sheet notes describe. |
| Line 17 | California AGI | California AGI is the federal AGI minus the subtractions plus the additions. Check lines 14 and 16 first. |
| Line 18 | California deduction | California uses the larger of its standard deduction (set by the filing status in Step A) and its own itemized deductions. From Step N, the California itemized deductions start from Schedule A, and they change again at Step Q (the IRA deduction changes the medical floor) and Step R (the net premium tax credit). Check the Schedule A entries. |
| Line 19 | California taxable income | California taxable income is the California AGI minus line 18. Check lines 17 and 18 first. |
| Line 31 | California tax | California tax comes from taxable income (line 19). If line 19 is right, this follows. |
| Line 35 | California tax after exemption credits | Line 35 is the California tax minus the exemption credits. It stays $0 until the tax is larger than the credits, at Step D (the 1099-INT), and grows at Step E. Check line 31 and the dependent entries from Step A. |
| Line 46 | Nonrefundable renter’s credit | Karl rents his home on Rivermeade Drive. Read the Interview Notes and the Duck Book on the California renter's credit, including its income limit. |
| Line 48 | California tax after credits | Line 48 is the California tax minus the nonrefundable credits. Check lines 31 and 35 first. |
| Line 64 | California total tax | Line 64 is the California tax after credits plus any other taxes. Check line 48 first. |
| Line 72 | California estimated payments | Line 72 adds Karl's California estimated payments for the year (Step O), including the one made in January, plus last year's California refund applied to this year. Look at last year's return in the problem. |
| Line 76 | Young child tax credit | The young child tax credit depends on Jane being under 6 and on earned income. At Step A, with Jane entered and no income yet, it shows; once Karl has wages (Step B), it drops to $0. Check that Jane is entered as a qualifying child for the California EITC. |
| Line 78 | California total payments | Line 78 adds the California payments and refundable credits. Check line 72 first. |
| Line 111 | California amount you owe | The California amount owed is the total tax minus the payments. Check lines 64 and 78 first. |
| Line 115 | California refund | A California refund comes from the refundable credits (such as the young child tax credit) and payments being more than the tax. Check the California credit and payment lines. |

### Notes for one step only

At these steps the line's hint above is replaced by the answer sheet note, or the step shows a tip.

| Step | Line | Text |
| --- | --- | --- |
| A | California Form 540, Line 46 | Note N3: different answer? Go back and read the Interview Notes and the Duck Book on the California renter's credit. |
| A | California Form 540, Line 76 | Note N2: did you enter the number of months Jane lived with Karl as 12, not 7? |
| A | California Form 540, Line 115 | Note N2: did you enter the number of months Jane lived with Karl as 12, not 7? |
| D | California Form 540, Line 14 | Note N4: Schedule CA, line 2 should be 147; 63,519; 500; 25. Not matching? Watch the video. |
| D | California Form 540, Line 16 | Note N4: Schedule CA, line 2 should be 147; 63,519; 500; 25. Not matching? Watch the video. |
| E | California Form 540, Line 16 | Note N5: incorrect amount? Read the Duck Book about box 12 under 'Line 3 - Dividends', including the 'Note for CA returns'. Schedule CA line 2 should be 38,147; 63,519; 500; 38,025, and line 3 should be 150; 232; 0; 0. |
| G | California Form 540, Line 16 | Note N7: Schedule CA line 2 should be 38,933; 63,519; 500; 38,489, and line 3 should be 150; 232; 0; 0. |
| J | Federal Form 1040, Line 7a | Note N8: look at Schedule D line 10. Did you enter the sale of the main home correctly? The line should read 470,000; 240,000; -230,000; 0. |
| K | Federal Form 1040, Line 7a | Note N9: look at Schedule D. Line 1b = 6,203; 9,381; 200; -2,978. Line 7 = -2,978. Line 8a = 15,000; 12,000; 3,000. Line 9 = 27,403; 33,277; 0; -5,874. Line 10 stays 470,000; 240,000; -230,000; 0. Line 13 = 69; line 15 = -2,805. On the Capital Loss Carryover Worksheet, line 8 = 0 and line 13 = 2,783. |
| L | Schedule 1, Line 5 | Note N10: did you check the boxes for 'passive entity' and 'publicly traded partnership' on the K-1 form? Schedule D line 5 = -8 and line 12 = 13. |
| L | Federal Form 1040, Line 8 | Note N10: did you check the boxes for 'passive entity' and 'publicly traded partnership' on the K-1 form? Schedule D line 5 = -8 and line 12 = 13. |
| L | California Form 540, Line 16 | Note N11: Schedule CA line 2 should be 39,224; 63,564; 500; 38,780, and line 3 should be 175; 308; 0; 0. If not, tax-exempt interest and foreign taxes paid should be entered on the federal interest screen, not directly in the California state section. |
| N | Federal Form 1040, Line 12e | Note N12: Schedule A line 1 = $23,270; line 4 = $14,132; line 5a box checked, $1,949; line 7 = $8,005; line 10 = $7,065; line 14 = $11,425; line 17 = $40,627. If line 5a is off, did you increase the MAGI by the VA benefits (Pub 4012, page F-11)? |
| N | Schedule A, Line 5a | Note N12: Schedule A line 1 = $23,270; line 4 = $14,132; line 5a box checked, $1,949; line 7 = $8,005; line 10 = $7,065; line 14 = $11,425; line 17 = $40,627. If line 5a is off, did you increase the MAGI by the VA benefits (Pub 4012, page F-11)? |
| O | Federal Form 1040, Line 12e | Note N13: Schedule A line 1 = $23,270; line 4 = $14,132; line 5a box NOT checked, $2,459; line 7 = $8,515; line 10 = $7,065; line 14 = $11,425; line 17 = $41,137. |
| O | Federal Form 1040, Line 7a | Note N13b: on the Capital Loss Carryover Worksheet, line 8 = 786 and line 13 = 3,992. |
| O | Federal Form 1040, Line 15 | Note N13b: on the Capital Loss Carryover Worksheet, line 8 = 786 and line 13 = 3,992. |
| P | Schedule 3, Line 2 | Note N14: if you do not match, did you mark Jane as qualified but with no expenses? See Pub 4012, 'Child & Dependent Care Expenses', especially page G-15. |
| P | Federal Form 1040, Line 21 | Note N14: if you do not match, did you mark Jane as qualified but with no expenses? See Pub 4012, 'Child & Dependent Care Expenses', especially page G-15. |
| R | Federal Form 1040, Line 12e | Note N15: Schedule A line 1 = $21,058; line 4 = $12,520; line 5a box NOT checked, $2,459; line 7 = $8,515; line 10 = $7,065; line 14 = $11,425; line 17 = $39,525. |

### Answer key notes

**N1: Filing status and dependents** (Step A)

* Answer key: Filing status = HOH. Using the 'Qualifying Child or Relative Resource Tool', Jane = Box 35, CTC. Kendra and Susan = Chart 2 Box 12, not a dependent, no EIC, but medical and dependent care allowed. The CTC ODC Chart shows these two are not entered on the tax return in the dependents area.
* Hint: Start the 'Qualifying Child or Relative Resource Tool' with Karl and Kendra, then Jane and Susan. Only Jane is listed, for the child tax credit, and she lived with Karl all 12 months. Kendra and Susan are not entered as dependents at all, even as 'not a dependent'. Check the filing status and the dependents area.
* Checked: at this step and again at every later step

**NN_N: TS Note added for Step N** (Step N)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step N (the VA benefits) in TaxSlayer
* Example: STEP N - VA BENEFITS: ENTERED $30,000 OF NON-TAXABLE VA BENEFITS INTO THE SALES TAX MAGI.

**NN_Q: TS Note added for Step Q** (Step Q)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step Q (the IRA contribution) in TaxSlayer
* Example: STEP Q - IRA CONTRIBUTION: KARL AGREED TO MAKE HIS 2025 IRA CONTRIBUTION OF $8,000 PRIOR TO 4/15.


<a id="parks"></a>

## Parks (Mary Parks, 2025)

Steps: A, B, C, D, E, F, G, H, I, J, K, L, M, N, O.

### Federal Form 1040

| Line | What it is | Hint |
| --- | --- | --- |
| Line 4a | IRA distributions | Line 4a is box 1 of Mary's Wells Fargo 1099-R (Step K). Compare the 1099-R you entered with the form in the problem. |
| Line 4b | Taxable IRA distributions | Only part of Mary's IRA distribution is taxable, because she has basis from nondeductible contributions (Step K). The taxable amount comes from Form 8606, using last year's Form 8606 and the total value of her IRAs given in the step. |
| Line 6a | Social Security benefits | Line 6a holds Mary's Canada Pension Plan benefits (Step C), which are treated like U.S. Social Security for the federal return. Check how the Canadian pension was entered and the amount from the problem. |
| Line 6b | Taxable Social Security benefits | TaxSlayer works out the taxable part of the benefits from Mary's other income. If line 6a and the income lines above are right, this follows. |
| Line 8 | Additional income (Schedule 1, line 10) | Line 8 comes from Schedule 1, line 10: last year's state refund, the board member pay, the cell tower rent and royalties, the gambling winnings, the prize, and the alimony, each added in its own step. Check the Schedule 1 lines in this list first. |
| Line 9 | Total income | Line 9 is the sum of the income lines above it. If it is off, the mistake is in one of those income entries, not on line 9 itself. |
| Line 11a | Adjusted gross income | Mary has no adjustments to income, so line 11a equals total income. If line 9 is right, this follows. |
| Line 12e | Standard or itemized deduction | The standard deduction follows from the filing status (single) and Mary's age. Re-check the filing status and her birth date from Step A. |
| Line 15 | Taxable income | Taxable income is AGI minus the deduction, never below zero. If lines 11a and 12e are right, this follows. |
| Line 16 | Tax | Tax comes from taxable income through the tax table. If taxable income (line 15) is right, this follows. |
| Line 19 | Child tax credit and credit for other dependents | Line 19 is the credit for other dependents for Sue (note N1). It first shows at Step F, when the royalties give Mary tax to apply it against. Re-check Sue's dependent screen from Step A. |
| Line 24 | Total tax | Total tax is the tax minus the credits. Check lines 16 and 19 first; this follows from them. |
| Line 37 | Amount you owe | Mary has no withholding or payments, so the amount she owes equals the total tax. If line 24 is right, this follows. |

### Schedule 1

| Line | What it is | Hint |
| --- | --- | --- |
| Line 1 | Taxable state refund | Mary itemized last year, so her California refund from the 1099-G is taxable (Step B). Use last year's sales tax deduction worksheet to work out how much of the refund is taxable. |
| Line 2a | Alimony received | The alimony Mary receives (Step J) is taxable because the divorce was final before 2019. Enter it as alimony received, with the date of the divorce from the problem. |
| Line 5 | Rental real estate and royalties (Schedule E) | Line 5 comes from Schedule E: the cell tower rent (Step E) and the oil and gas royalties (Step F), each from a 1099-MISC. Check the property type and the amounts on each Schedule E entry. |
| Line 8b | Gambling winnings | Line 8b adds box 1 of every W-2G entered so far: the casino (Step G) and the California Lottery (Step H). Compare each W-2G you entered with the forms in the problem. |
| Line 8z | Other income | Line 8z holds the board member pay that was moved from the 1099-NEC to other income (Step D) and the prize from the 1099-MISC (Step I). Check that both went to other income, not to a business. |

### Schedule A

| Line | What it is | Hint |
| --- | --- | --- |
| Line 16 | Other itemized deductions (gambling losses) | Gambling losses go on Schedule A line 16, up to the gambling winnings: the casino losses (Step G) and the California Lottery losses (Step H). Check the losses entered with each W-2G. |

### California Form 540

| Line | What it is | Hint |
| --- | --- | --- |
| Line 11 | California exemption amount | The exemption amount follows from Mary's personal exemption and Sue as a dependent. Re-check the dependent entries from Step A, as note N1 describes. |
| Line 14 | California subtractions | California subtractions come from Schedule CA, column B: last year's state refund, the nontaxable part of the Canadian pension, and the California Lottery winnings. Check the Schedule CA lines for the step you are on. |
| Line 16 | California additions | California taxes the Canada Pension Plan benefits that the federal return treats like Social Security (note N3b), so the $10,000 is added back on Schedule CA. Enter it as a manual California adjustment. |
| Line 18 | California deduction | California uses the larger of its standard deduction (set by the filing status in Step A) and its own itemized deductions. Once Mary's itemized deductions are entered (Step L), California itemizes even though the federal return does not. Check the Schedule A entries. |
| Line 19 | California taxable income | California taxable income is the California AGI minus the deduction on line 18. Check the subtractions, additions, and line 18 first. |
| Line 31 | California tax | California tax comes from taxable income (line 19). If line 19 is right, this follows. |
| Line 46 | Nonrefundable renter’s credit | Mary rents, so she may qualify for the California renter's credit. Read the Interview Notes about her home, and the renter's credit questions in TaxSlayer's state section. |
| Line 48 | California tax after credits | Line 48 is the California tax minus the exemption and renter's credits. Check lines 31 and 46 first. |
| Line 78 | Total payments | Mary has no California withholding or estimated payments, so this line should be blank. Check that nothing was entered as California tax withheld on any form. |
| Line 96 | Individual shared responsibility penalty | Sue had no health insurance during the year, so California charges a shared responsibility penalty (Step M). Answer the California health coverage questions for each person, month by month, as the problem describes. |
| Line 111 | California amount you owe | The California amount owed is the tax after credits plus any penalty, minus payments. Check lines 48 and 96 first. |
| Line 115 | California refund | Mary owes California tax and has no payments, so there should be no refund. Check the California tax lines above. |

### schCA

| Line | What it is | Hint |
| --- | --- | --- |
| Section B, line 8b, column B | California Lottery winnings subtracted | California does not tax California Lottery winnings (note N5), so the lottery winnings from Step H are subtracted on Schedule CA. Enter it as a manual California adjustment. |
| Section B, line 9a, column B | Total additional income subtractions | Line 9a totals the column B subtractions in Section B. If the lottery subtraction on line 8b is right, this follows. |
| Part II, line 16, column B | California Lottery losses subtracted | California Lottery losses are not deductible for California (note N5), so they are subtracted from the itemized deductions on Schedule CA Part II. Enter it under the state section's itemized deduction adjustments. |

### Notes for one step only

At these steps the line's hint above is replaced by the answer sheet note, or the step shows a tip.

| Step | Line | Text |
| --- | --- | --- |
| A | California Form 540, Line 46 | Note N2: answer incorrect? The exercise said Mary rented a large townhouse. |
| B | Schedule 1, Line 1 | Note N3: did you use the State and Local General Sales Tax Deduction worksheet that was included in last year's tax return, beginning on page 10? |
| B | Federal Form 1040, Line 8 | Note N3: did you use the State and Local General Sales Tax Deduction worksheet that was included in last year's tax return, beginning on page 10? |
| C | California Form 540, Line 16 | Note N3b: see the Duck Book or the 'CA CA' handouts. You need to manually increase California income for the Canada Pension Plan benefits of $10,000. |
| D | Federal Form 1040, Line 8 | Note N4: if your answer is incorrect, see Pub 4012 or the Duck Book for 'Form 1099-NEC'. |
| H | undefined, Section B, line 8b, column B | Note N5: California Lottery winnings are not taxable to California, and California Lottery losses are not deductible. Manually decrease the income for the lottery winnings, and manually decrease (subtract) the California itemized deductions by $550. See the handout 'CA CA Instructions' or the Duck Book under 'Gambling Winnings'. |
| H | undefined, Section B, line 9a, column B | Note N5: California Lottery winnings are not taxable to California, and California Lottery losses are not deductible. Manually decrease the income for the lottery winnings, and manually decrease (subtract) the California itemized deductions by $550. See the handout 'CA CA Instructions' or the Duck Book under 'Gambling Winnings'. |
| H | undefined, Part II, line 16, column B | Note N5: California Lottery winnings are not taxable to California, and California Lottery losses are not deductible. Manually decrease the income for the lottery winnings, and manually decrease (subtract) the California itemized deductions by $550. See the handout 'CA CA Instructions' or the Duck Book under 'Gambling Winnings'. |
| K | Federal Form 1040, Line 4b | Note N6: enter the 1099-R and blank out box 2a. Then enter Form 8606: total basis in traditional IRAs from the 2024 Form 8606 line 14 ($22,343), total value of all traditional IRAs from the step ($110,000), and the distribution from 1099-R box 1 ($15,000). TaxSlayer shows the taxable amount after Continue. Go back to the 1099-R and put that amount in box 2a (it is also on the 2025 Form 8606 line 15c, $12,315). |
| L | California Form 540, Line 18 | Note N7: itemized deductions should be entered, because even though the federal return uses the standard deduction, California itemizes. Check Schedule A: line 1 = $2,617; line 4 = $0; line 7 = $921; line 14 = $9,000; line 16 = $1,050; line 17 = $10,971. |

### Answer key notes

**N1: Filing status and dependents** (Step A)

* Answer key: Filing status = Single. Using the 'Qualifying Child or Relative Resource Tool', Devon = Chart 1 Box 36, so he is NOT a dependent but is eligible for EIC. Pam = Chart 2 Box 2, is NOT a dependent and should NOT be listed on the tax return. Sue = Chart 2 Box 24, ODC, but no EIC. Her relationship = NONE.
* Hint: Walk Devon, Pam, and Sue through the 'Qualifying Child or Relative Resource Tool'. Only Sue is a dependent, for the credit for other dependents, with relationship None. Devon is listed for the EIC only, not as a dependent, and Pam is not listed at all. Check the filing status and each person's screen.
* Checked: at this step and again at every later step

**NN_C: TS Note added for Step C** (Step C)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step C (the Canadian pension) in TaxSlayer
* Example: STEP C - CANADIAN PENSION: MARY RECEIVES MONIES FROM A CANADIAN PENSION. BE SURE TO ASK HER FOR IT EACH YEAR IF SHE DOESN'T OFFER THE INFORMATION.

**NN_D: TS Note added for Step D** (Step D)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step D (the 1099-NEC) in TaxSlayer
* Example: STEP D - 1099-NEC: MARY IS A VOLUNTEER FOR EDAC. THE $30 THAT WAS REPORTED IN 1099-NEC BOX 1 IS NOT BUSINESS INCOME AND WAS MOVED TO 1099-MISC BOX 3 OTHER INCOME.

**NN_K: TS Note added for Step K** (Step K)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step K (the IRA basis) in TaxSlayer
* Example: STEP K - IRA BASIS: 2024 TAX RETURN HAD FORM 8606. ENTERED INFO FROM THAT, THE WELLS FARGO 1099-R, AND TOTAL VALUE OF IRAS TO GET TAXABLE AMOUNT SHOWN IN BOX 2A.

**NN_O: TS Note added for Step O** (Step O)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Checked: at this step only
* Box the student ticks: I added a TS Note for Step O (the estimated tax vouchers) in TaxSlayer
* Example: STEP O - EST VOUCHERS: CREATED EST. TAX VOUCHERS, FED ONLY, $803 A QTR.

