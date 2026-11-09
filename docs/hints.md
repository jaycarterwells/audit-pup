# Audit Pup hints for review

Every hint a counselor can see, for every case, as Audit Pup 0.17.0 shows it. Made from the case files by `source/tools/hints_report.js`, so it always matches the page: change a hint in `source/cases/<case>.js`, then run the tool.

How hints work: when a line fails, the counselor opens one hint. It shows the answer key value ("Answer key: ...") and the text below, which says where to look in the problem. Lines that are blank on the answer sheet are checked together in one row, "Lines that should be blank"; when it fails, its hint lists each line that has an amount, with that line's hint below. A step can replace a line's hint with an answer sheet note for that step only. Answer key notes have their own text.

Reviewers: please check that each hint teaches without giving more away than the answer key value, points to the right place in the problem, the handouts, or TaxSlayer, and is correct for the case.

* [Quinn (Raymond Quinn, 2025)](#quinn)
* [Baylor (Michael Baylor, 2025)](#baylor)
* [Graham (Stacey and Sean Graham, 2025)](#graham)

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

* Answer key: Filing status = HOH. Using the Resource Tool, James is a dependent of Raymond and lived in his home for more than half the year (Chart 2, Box 25).
* Hint: Walk James through the Resource Tool, Chart 2: his relationship to Raymond, the months he lived in the home, and support. That decides his dependent status, and his dependent status drives the filing status. Then check the dependent and filing status screens in TaxSlayer.

**N2: Both refunds match the option you chose** (Steps E, F)

* Hint: Both refunds should equal the results of the option you circled on your MWP Worksheet. If they do not, the W-2 screen in TaxSlayer is probably still set up for another option you tested. Re-check the Medicaid Waiver Payment field, the include in earned income box, and Box 16.

**N3: MWP Worksheet scenarios** (Steps E, F)

* Hint: For any option that does not match, set the W-2 screen back to that option's three settings (Medicaid Waiver Payment field, include in earned income box, Box 16) and read the results again.

**NN: TS Note added for this step** (Steps E, F)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
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
| Line 27a | Earned income credit (EIC) | The EIC depends on earned income and on Willie as a qualifying child. Re-check his dependent entry from Step A and the W-2 amounts. |
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
| N | California Form 540, Line 14 | Note N13: double-check the manual California changes for an HSA, using the last bullet under 'Distributions From HSA' in the handout 'HSA Notes'. |
| N | California Form 540, Line 16 | Note N13: double-check the manual California changes for an HSA, using the last bullet under 'Distributions From HSA' in the handout 'HSA Notes'. |

### Answer key notes

**N1: Filing status and dependent** (Step A)

* Answer key: Filing status = QSS. Using the 'Qualifying Child or Relative Resource Tool', Willie = Box 35, CTC.
* Hint: Joan died in 2023 and Michael supports his son, so check the qualifying surviving spouse rules. Walk Willie through the Resource Tool and the handout 'CTC ODC Chart' to decide his dependent status and the child tax credit box. Then check the filing status and dependent screens in TaxSlayer.

**N2: Identity Protection PIN entered** (Step A)

* Hint: Michael's IP PIN is in the Interview Notes. Enter it in TaxSlayer where the taxpayer's Identity Protection PIN is asked for, and add a TS Note about it (the next item).

**NN_A: TS Note added for Step A** (Step A)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Box the student ticks: I added a TS Note for Step A (the IP PIN) in TaxSlayer
* Example: STEP A - IP PIN: TP HAS AN IP PIN

**N4: Betts W-2 address matches the form** (Step B)

* Hint: The Betts Technology W-2 shows Michael's address as PO Box 540. Enter the address on the W-2 screen in TaxSlayer exactly as it is printed on the form.

**NP: Preparer Note added** (Step I)

* Hint: Pub 4012, 'Election Worker Income', says to add a Preparer Note when election worker pay is entered. Add one in TaxSlayer and print a new PDF.

**NN_E: TS Note added for Step E** (Step E)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Box the student ticks: I added a TS Note for Step E (the wage difference) in TaxSlayer
* Example: STEP E - FED/STATE WAGE DIFFERENCE: ESKATON PROPERTIES W-2 HAD A FED/STATE WAGE DIFFERENCE. A MANUAL ADJUSTMENT WAS MADE TO THE CA STATE RETURN.

**NN_I: TS Note added for Step I** (Step I)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Box the student ticks: I added a TS Note for Step I (election worker pay) in TaxSlayer
* Example: STEP I - ELECTION WORKER PAY: ELECTION WORKER PAY ENTERED AS HOUSEHOLD EMPLOYEE INCOME.

**NN_N: TS Note added for Step N** (Step N)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
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
| Line 4b | Taxable IRA distributions | Line 4b is only the taxable part of the IRA distributions. A rollover (Steps C and D) adds nothing here, and a qualified charitable distribution (Step F) is left out. Re-check box 2a and the rollover and QCD choices on each IRA 1099-R. |
| Line 4c box 1 | Rollover box | The Rollover box on line 4c is checked when an IRA distribution was rolled over (Steps C and D). On the 1099-R screen, mark the distribution as a rollover rather than only changing the taxable amount. |
| Line 4c box 2 | QCD box | The QCD box on line 4c is checked when part of an IRA distribution went straight to a charity (Step F). See 'Qualified Charitable Distributions' in Pub 4012 for where TaxSlayer asks about a QCD. |
| Line 5a | Pensions and annuities | Line 5a adds box 1 of every pension 1099-R entered so far. Compare each pension 1099-R you entered with box 1 of the forms in the problem. |
| Line 5b | Taxable pensions and annuities | Line 5b is the taxable part of the pensions. Look at the step's 1099-R: box 2a, the PSO health insurance exclusion (Step G), and the Simplified Method results (Steps K and L) all change it. |
| Line 5c box 2 | PSO box | The PSO box on line 5c is checked when a retired public safety officer's health insurance premiums reduce the taxable pension (Step G). Use the PSO option under box 2a on the 1099-R screen. |
| Line 6a | Social Security benefits | Line 6a is the net benefits from Sean's SSA-1099 (Step N) and the tier 1 benefits from his RRB-1099 (Step O). Compare box 5 of each form with what you entered. |
| Line 6b | Taxable Social Security benefits | TaxSlayer works out the taxable part of the benefits from the other income. If line 6a and the income lines above are right, this follows. |
| Line 8 | Additional income (Schedule 1, line 10) | Line 8 comes from Schedule 1, line 10, which here is Stacey's tutoring business income from Schedule C (Step B). Check the Schedule C income and expenses first. |
| Line 9 | Total income | Line 9 is the sum of the income lines above it. If it is off, the mistake is in one of those income entries, not on line 9 itself. |
| Line 10 | Adjustments to income (Schedule 1, line 26) | Line 10 comes from Schedule 1, line 26: the deductible part of self-employment tax, the self-employed health insurance, and from Step Q the educator expenses, alimony paid, and student loan interest. Check the Schedule 1 lines in this list. |
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
| Line 27a | Earned income credit (EIC) | The EIC depends on earned income (Stacey's business and disability pension) and on Joshua as a qualifying child. Gail does not qualify the family for the EIC. Re-check the dependent screens from Step A. |
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
| Line 14 | California subtractions | Line 14 comes from Schedule CA, column B: California does not tax Social Security or railroad tier 1 benefits, and Step P adds the military retirement exclusion. Check the CA adjustments you entered. |
| Line 16 | California additions | Line 16 comes from Schedule CA, column C. Look for an amount entered on a California adjustment screen that does not belong on this return. |
| Line 18 | California deduction | The California standard deduction follows from the filing status. Itemizing for California is right only when the California itemized total is larger (Step R2). |
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

**NN_C: TS Note added for Step C** (Step C)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Box the student ticks: I added a TS Note for Step C (the IRA rollover) in TaxSlayer
* Example: STEP C - IRA ROLLOVER: TP ROLLED ENTIRE IRA DISTRIBUTION BACK INTO AN IRA ACCOUNT WITHIN 60 DAYS SO THERE WAS NO EARLY WITHDRAWAL PENALTY.

**NN_E: TS Note added for Step E** (Step E)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Box the student ticks: I added a TS Note for Step E (the early IRA distribution) in TaxSlayer
* Example: STEP E - EARLY IRA DIST: $1,825 EARLY WITHDRAWAL FROM WELLS FARGO WAS USED FOR CAR REPAIRS NEEDED TO COMMUTE TO WORK. $825 WAS EXEMPT FROM THE EARLY WITHDRAWAL PENALTY UNDER 'PERSONAL EMERGENCY EXPENSE'.

**NN_F: TS Note added for Step F** (Step F)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Box the student ticks: I added a TS Note for Step F (the QCD) in TaxSlayer
* Example: STEP F - QCD: $20,000 OF THE $20,838 RMD FOR SEAN FROM WELLS FARGO WAS A QCD TO THEIR CHURCH AND EXCLUDED FROM TAXABLE INCOME.

**NN_G: TS Note added for Step G** (Step G)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Box the student ticks: I added a TS Note for Step G (the PSO exclusion) in TaxSlayer
* Example: STEP G - PSO: EDC SHERIFF 1099-R FOR SEAN - BOX 2 TAXABLE AMOUNT WAS REDUCED BY $3K FOR PUBLIC SAFETY OFFICER HEALTH INSURANCE. ADDN'L $700 ENTERED ON SCH A ITEMIZED DEDUCTIONS.

**NN_K: TS Note added for Step K** (Step K)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Box the student ticks: I added a TS Note for Step K (the Simplified Method) in TaxSlayer
* Example: STEP K - SIMPLIFIED METHOD: NATHANS HAMBURGER 1099-R IS A JOINT SURVIVOR ANNUITY, USED SIMPLIFIED METHOD. ANNUITY START DATE 9/1/2019. ANNUAL EXCLUSION $1,771. FINAL YEAR 2053 WITH AN EXCLUSION OF $1,466.

**NN_L: TS Note added for Step L** (Step L)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Box the student ticks: I added a TS Note for Step L (the Simplified Method) in TaxSlayer
* Example: STEP L - SIMPLIFIED METHOD: NORTHERN TRUST 1099-R WAS NOT A JOINT SURVIVOR ANNUITY. ANNUITY START DATE 1/1/2017. ANNUAL EXCLUSION $271. THIS WAS THE LAST YEAR, THE UNRECOVERED $3,425 WAS ENTERED ON SCH A AS 'OTHER DEDUCTIONS'.

**NN_M: TS Note added for Step M** (Step M)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Box the student ticks: I added a TS Note for Step M (the disability pension) in TaxSlayer
* Example: STEP M - DISABILITY PENSION: STACEY WENT ON DISABILITY AT AGE 45. NORMAL RETIREMENT AGE AT THE COMPANY IS 65. MUST CHECK THE DISABILITY BOX AT THE BOTTOM OF THE INPUT PAGE SO THE AMOUNT IS REPORTED AS WAGES.

**NN_P: TS Note added for Step P** (Step P)

* Hint: Good TS Notes explain why items are treated differently than expected and flag anything unusual that next year's counselor should know.
* Box the student ticks: I added a TS Note for Step P (the CA military retirement exclusion) in TaxSlayer
* Example: STEP P - CA EXCLUSION FOR MILITARY RETIREMENT: SINCE SEAN WAS IN UNIFORMED SERVICE, $20,000 OF THE TAXABLE AMOUNT WAS EXCLUDED FOR CA.

