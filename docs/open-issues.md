# Audit Pup: open issues

Items that must be settled before the next release. Each one says what is known, who it waits on, and what happens once it is answered. When an item is resolved, move it to "Resolved" with how it was settled.

## Must resolve before the next release

Nothing open. 0.17.0 was released on November 18, 2026.

## Also pending (not blocking a release)

* Expert review of every hint in `docs/hints.md` (all cases; the Parks hints are new in 0.18.0), which Carter is arranging.
* Real Chromebook and Mac checks for 0.17.0.
* **Next case, Kent:** the case author expects printout problems like Graham's (sections redone after the printouts were made). Compare every printout with every answer key column before writing code, as for Graham, and send the owner one list of questions.

## Resolved

### 1. Baylor Step I: the Preparer Note (NP), November 18, 2026

* The case producer confirmed Audit Pup was right: the student's printout had no Preparer Note. No change to the check. Students confuse TS Notes and Preparer Notes, so the hint now says the missing item is a Preparer Note, not a TS Note, and that Pub 4012, "Election Worker Income", gives the steps for entering it for election workers.

### 2. Graham answer key and printouts, November 17 to 18, 2026

The case author confirmed all three findings. No corrected files will be sent, so each is handled in the repository, with the confirmation recorded:

* **Step G printout** (Schedule A line 1 shows $983; the sheet's $700 is right): kept as a known printout error in `cases/graham/case.json` "printoutErrors". The tests allow exactly that line on that printout. It does not hold back a release.
* **Steps N and O** (sheet typo: $3,475 is line 17; the right value is $3,425): fixed by `cases/graham/answer_sheet_corrections.json`, which the import tool applies. The key records each correction and why. The import stops if the sheet ever stops saying $3,475 there.
* **Steps R and R2 printouts** (the QCD mistake from note N5): Step Q's printout stands in, as its values are the same.

### 3. Notes checked again at later steps, November 17, 2026

* Carter chose: notes Audit Pup reads from the PDF and that stay in the return are checked again at every later step, in one row, "Notes from earlier steps", that fails when one is missing. TS Note boxes and worksheets are one-time checks and are never asked again. Every note in every case says which it is (`carry`), and the tests enforce it.
* Continuous: Quinn N1; Baylor N1, N2, NP; Graham N1 (after the reader learned the "Child tax" label printed as one piece, as on Iris's Step H printout). One-time: everything the student ticks or enters, and Baylor N4 (later printouts do not show that W-2 address).
