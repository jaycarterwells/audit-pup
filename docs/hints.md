# Audit Pup hints for review

Every hint a counselor can see, for every case, as Audit Pup 0.15.0 shows it. Made from the case files by `source/tools/hints_report.js`, so it always matches the page: change a hint in `source/cases/<case>.js`, then run the tool.

How hints work: when a line fails, the counselor opens one hint. It shows the answer key value ("Answer key: ...", or "blank or $0" for a blank answer sheet cell) and the text below, which says where to look in the problem. A step can replace a line's hint with an answer sheet note for that step only. Answer key notes have their own text.

Reviewers: please check that each hint teaches without giving more away than the answer key value, points to the right place in the problem, the handouts, or TaxSlayer, and is correct for the case.

* [Quinn (Raymond Quinn, 2025)](#quinn)
* [Baylor (Michael Baylor, 2025)](#baylor)

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
| Line 27 | Earned income credit (EIC) | The EIC depends on earned income and the qualifying person. Re-check the dependent entry and whether earned income was entered as the problem intends. |
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

