# Audit Pup: open issues

Items that must be settled before the next release. Each one says what is known, who it waits on, and what happens once it is answered. Remove an item when it is resolved, and say how in the release notes or the history appendix of the release checklist.

## Must resolve before the next release

### 1. Baylor Step I: the Preparer Note (NP)

* **Reported:** November 17, 2026, by a beta tester's results (Baylor, Step I: "1 check needs another look", NP "Your return has no Preparer Note").
* **What is known:** Baylor's answer sheet asks for two notes at Step I: NN (a TS Note, which TaxSlayer does not print, so the student ticks a box) and NP (a Preparer Note). TaxSlayer prints a Preparer Note on its own "Preparer Notes" page: every correct printout in `cases/baylor/` from Step I on has it (Step I: page 20 of 36, "FORM 1040 LINE 1B - ELECTION WORKER INCOME FROM EL DORADO COUNTY"). The tester's PDF had no such page: either no Preparer Note was added, or the printout left the page out.
* **Waiting on:** the case producer (Carter sent it in). Question: should students add a Preparer Note at Step I, and does it always print?
* **Then:** keep NP as it is and make its hint clearer (it is not the TS Note; it prints as its own "Preparer Notes" page; check the printout includes it), or change NP to a box the student ticks, as the answer of the case producer decides.

### 2. Graham answer key and printouts (0.17.0 is held for these)

* **Step G printout:** shows Schedule A line 1 = $983 (the Step H amount); the answer sheet says $700. Waiting on a corrected Step G printout.
* **Answer sheet, Steps N and O:** Schedule A line 16 says $3,475; every printout shows $3,425 (a typo). Waiting on a corrected answer sheet.
* **Steps R and R2 printouts (optional):** the Drive printouts have the QCD mistake from note N5; Step Q's printout stands in.
* **Waiting on:** the case producer (the email Carter sent).
* **Then:** re-import the sheet, replace the Step G printout, remove the entries from `cases/graham/case.json` "awaiting" (the tests say when), and release 0.17.0. Hold all other Graham changes until then (Carter's instruction, November 17).

## Built, ships with the next release

### 3. Notes checked again at later steps (decided November 17)

* Carter chose: notes Audit Pup reads from the PDF and that stay in the return are checked again at every later step, in one row, "Notes from earlier steps", that fails when one is missing. TS Note boxes and worksheets are one-time checks and are never asked again. Every note in every case now says which it is (`carry`), and the tests enforce it.
* Continuous today: Quinn N1; Baylor N1, N2, NP. One-time: everything the student ticks or enters, Baylor N4 (later printouts do not show that W-2 address), and Graham N1 until its files arrive (Iris's Step H printout).
* With this, the beta tester's final Baylor printout (Step R, no Preparer Note) would show the row failing and naming NP.

## Also pending (not blocking a release)

* Expert review of the hints in `docs/hints.md`, including Quinn's 9 lines from 0.15.0 and all of Graham's.
* Real Chromebook and Mac checks for the next release.
