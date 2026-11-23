# Audit Pup release notes

This is the one list of release notes. Audit Pup shows it under the Version button (What's new), and the release workflow copies each version's section to its GitHub Release, so the two always say the same thing.

How to edit it: change the words under a version, keep the headings as they are, and save. A new version goes at the top as `## <version>, <Month> <day>, <year>`, with any of the sections Added, Fixed, Changed, and What this version includes, each item starting with `* `. Write for counselors: plain words, no em dashes, and no user names.

Each item under Fixed (from 0.19.1 on) is a short title of 3 to 5 words that names the improvement, with every word capitalized, then three lines, each indented two spaces: `Symptom:` what the counselor saw, `Cause:` what was wrong in the code, and `Fix:` what changed. Keep each line to one or two short sentences, start every sentence with a capital letter (also right after Symptom, Cause, or Fix), and state facts only: generic, with no blame on a person or a source file. The build refuses a Fixed item that does not follow this.

## 0.21.0, November 23, 2026

### Added

* Kent Steps K and O check the Capital Loss Carryover Worksheet in your PDF (answer key notes N9 and N13b). Form 1040 line 7a stops at -$3,000, so a capital loss carryover mistake can leave that line correct; the worksheet shows it.

### Fixed

* Clearer Medicaid Waiver Hint
  Symptom: The Quinn hint for Form 1040 line 1d said the Medicaid Waiver Payment had no W-2.
  Cause: The hint did not match the problem, where the payment is on a W-2 with nothing in box 1.
  Fix: The hint and the line's name now say the payment is not in box 1 of a W-2.
* Complete Adjusted Gross Income Hint
  Symptom: The Baylor hint for Form 1040 line 11a listed only some of the items that change it.
  Cause: The hint named the adjustments but not the Schedule 1 income.
  Fix: The hint now names the Schedule 1 income on lines 1 through 9 as well.
* Kent Capital Gain Hint Completed
  Symptom: The Kent hint for Form 1040 line 7a did not name Step O.
  Cause: The hint left out last year's capital loss carryover, which Step O adds.
  Fix: The hint now names Step O and points to Schedule D lines 6 and 14.

## 0.19.2, November 20, 2026

### Changed

* What's new shows each fix with a short title, then what you saw (Symptom), why it happened (Cause), and what changed (Fix), each on its own line. The fixes in version 0.19.1 are written this way too.

## 0.19.1, November 20, 2026

### Fixed

* Dependent Months Checked Exactly
  Symptom: A dependent's months in the home could be marked correct when they did not match the problem.
  Cause: The check accepted any number of months from 7 up.
  Fix: The months must now match the problem exactly, in every case.
* Hints Name Every Step
  Symptom: Some hints named only some of the steps that change their line.
  Cause: Those hints did not list every step where the answer key changes the line.
  Fix: 17 hints now name every step that changes their line.
* Answer Key Notes Completed
  Symptom: Three Kent answer key notes were missing some numbers.
  Cause: Short lines of those notes were left out.
  Fix: The missing numbers are restored, and every note is now checked against the answer sheet.
* Corrected PDF Read Again
  Symptom: A corrected PDF chosen under the same file name was not checked.
  Cause: The file picker kept the last file chosen.
  Fix: The picker is now cleared after each choice.
* Congratulations After The Last Step
  Symptom: After the last step of a case, Zeke said to start Step A.
  Cause: The message pointed to the first step not yet checked.
  Fix: Zeke now congratulates you and names any steps not yet checked.

### Changed

* The Start over link now names the case, for example Start Kent Over, and asks you to confirm erasing that case only. Your other cases are never changed.

## 0.19.0, November 19, 2026

### Added

* A fifth case: Kent (Karl Kent, 2025), with 17 steps covering a W-2, seller-financed mortgage interest, interest and dividends from brokerage statements, last year's state refund, the sale of a home, brokerage sales, a partnership K-1, itemizing, estimated payments, dependent care, an IRA contribution, and the 1095-A. Drop a Kent PDF and Audit Pup picks the case for you, or choose it in the Case box.

## 0.18.0, November 19, 2026

### Added

* A fourth case: Parks (Mary Parks, 2025), with 15 steps covering last year's state refund, a Canadian pension, 1099-NEC and 1099-MISC income, casino and California Lottery winnings, alimony, an IRA distribution with basis, itemizing for California, and the California health coverage penalty. Drop a Parks PDF and Audit Pup picks the case for you, or choose it in the Case box.

## 0.17.0, November 18, 2026

### Added

* A third case: Graham (Stacey and Sean Graham, 2025), with 23 steps covering self-employment, IRA and pension 1099-R forms, Social Security, railroad retirement, military retirement, adjustments, itemizing, and the education credit. Drop a Graham PDF and Audit Pup picks the case for you, or choose it in the Case box.
* Some answer key notes, such as a Preparer Note or your filing status, are checked again at every later step, in one row, Notes from earlier steps. If one is missing from a later PDF, that row names it. Boxes you tick yourself, such as a TS Note, are not asked about again.
* Checkboxes on the return are checked too, such as the Rollover, QCD, and PSO boxes on Form 1040 lines 4c and 5c, and lines on California Schedule CA.
* Audit Pup checks for a newer version when you open it, when you come back to its tab, and before every check. If there is one, a yellow box asks you to click Update, and Check stays off until you do, so you never check against an old answer key. Your progress is kept.
* A downloaded copy of Audit Pup tells you when it is out of date and opens the website for you.
* Audit Pup picks the case for you from the name on the Form 1040. If you drop a PDF for a different case than the one showing, it switches to that case and Zeke tells you.
* A Users Guide button at the top opens the counselor guide inside Audit Pup, including a section for beta testers on what to try and how to report a problem.

### Fixed

* Baylor Step I: the Preparer Note hint now says plainly that a Preparer Note is not the same as a TS Note, and that Pub 4012 gives the steps for entering it for election worker pay.

### Changed

* The drop box is now at the top, with a solid outline and a Choose PDF button, and it lights up when you drag a file over the page. The case and step boxes and the Check button come next.
* After you choose a PDF, the drop box shrinks to one gray bar with your file name, and the Check button turns gold with an arrow, so the next click is clear. Until then it says Choose a PDF first. Your progress is now below it, with smaller paws (the step letter and its status), so long cases fit on two rows.

## 0.16.0, November 9, 2026

### Added

* If your PDF does not pass the step you picked but matches a different step, for example the PDF you printed for the previous step, a yellow box names that step, with a button to check against it. Your progress for the step you picked does not change.

### Changed

* The lines that should still be blank at your step are now checked together in one row, Lines that should be blank, at the end of the list. If any of them has an amount, that row lists each one. The list of checks is much shorter.

## 0.15.0, November 9, 2026

### Fixed

* Screen readers now read the step trail, the drop box, and the reward the same way they appear on screen, and the What's new panel can be scrolled with the keyboard.

### Changed

* Quinn now checks every line on its answer sheet, including the lines that should be blank or $0 (federal lines 15, 16, 24, and 37, and California lines 14, 16, 35, 64, and 111), the same way Baylor does. Quinn steps now have more checks, so a score such as 4 of 4 is now 34 of 34.
* Checking a later step's PDF for an earlier step now shows the lines that do not match, instead of a "Did you pick the right step?" box.
* The New tag on the Version button is a deeper gold, so it is easier to read.

## 0.14.0, November 8, 2026

### Added

* A second case: Baylor (Michael Baylor, 2025), with 15 steps from basic information to e-filing. Pick it in the first box.
* Each case keeps its own progress. Switch cases and come back without losing your place. Start over erases only the case you picked.
* Audit Pup opens on the case you used last.
* Lines that should still be blank at a step are checked too. If one has an amount, its hint shows the answer key as blank or $0.
* Some answer key notes are now read from your PDF: the Identity Protection PIN, a Preparer Note, the child tax credit box, and the address on a W-2.
* Baylor has a TS Note box at each step that needs one (Steps A, E, I, and N).

## 0.13.0, November 5, 2026

### Added

* A new look: the Audit Pup seal with a drawing of Zeke, warm sketchbook colors, and Atkinson Hyperlegible, a typeface made for easy reading.
* Zeke, the chief inspector, tells you what to do next in a speech bubble at the top of the page.
* Three dogs show your result: Zion, the corrections officer, when something needs fixing (red); Bailey, the follow-up clerk, when there is more to do (yellow); and Zeke when the step is done (green).
* Your progress is now a paw-print trail of steps. Long cases wrap onto more rows.
* The drop box and the Check button name the selected step, for example "Drop your Step D PDF here" and "Check Step D".
* The reward dog photo now appears in an "Approved!" snapshot with a few paw prints.

### Changed

* The "Check Step D now" button is gone from the results. Zeke names the next step at the top of the page instead, and the trail shows it selected.

## 0.12.0, November 5, 2026

### Added

* When a step is done, Audit Pup selects the next step for you and clears the old file. Tap "Check Step D now" (or whichever step is next) to jump back to the drop box.
* When every step of the case is done, Audit Pup tells you so.

### Fixed

* On the website, a page that did not finish loading now says to reload it, instead of asking you to download a fresh copy.

## 0.11.0, November 5, 2026

### Added

* Audit Pup now remembers your progress on this computer: which steps you finished, your MWP Worksheet totals, and your TS Note checkbox. It is still there after you close and reopen the page.
* A progress row under the step picker shows each step as Done, Fix, To finish, or Not checked. Tap a step to select it.
* Audit Pup opens on the first step you have not finished.
* Start over erases your saved progress for the case.

### Changed

* Progress is saved only in this browser on this computer. Clearing your browsing history erases it, and it does not follow you to another computer.

## 0.10.0, November 4, 2026

### Added

* A Version button at the top of the page. Tap it to see what changed in each version. A small "New" tag appears on it the first time you open a new version.

## 0.9.0, November 4, 2026

### Added

* Same-file warning: if you check a PDF for a later step that you already checked for an earlier step, Audit Pup asks you to print a new PDF from TaxSlayer first.
* The version number and build date at the bottom of the page and in the file name.
* A clear message if the file is opened in a preview instead of a browser, or if the file was damaged in sending.

### What this version includes

* Case: Quinn (Raymond Quinn, 2025), Steps A, B, D, E, and F.
* Checks for Form 1040, California Form 540, and FTB 3514 in answer key order, plus answer key notes N1, N2, N3, and NN.
* A hint with the answer key value on every line that needs another look.
* A warning if the PDF looks like it belongs to a later step.
* A score that stays at the top while you scroll, and a dog when everything is done.
* Large print, and a layout that fits Chromebook screens.
* Works offline in Chrome, and in Safari 15 or newer on a Mac.

## Earlier test copies

Earlier test copies had no version number (dated October 26 to November 4, 2026). If you still have one, replace it with this version.
