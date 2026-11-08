# Audit Pup: Release Checklist and Backlog

Audit Pup (El Dorado Tax-Aide Case Checker) is a single HTML file that grades a counselor's TaxSlayer PDF for one step of a training case against that case's answer key. This page lists what must happen before each new release, the version rules, and the known gaps we have chosen to accept for now. The release notes for every version live inside the page itself: counselors open them with the Version button.

## Where things live (all in this repository)

| Path | What it is |
| --- | --- |
| `index.html` | The built Audit Pup page that GitHub Pages serves. Never edit it by hand. |
| `docs/chromebook-guide.md` | The counselor guide. Must match the page exactly. |
| `docs/release-checklist.md` | This page. |
| `CLAUDE.md` | Working rules and design decisions for Claude sessions. |
| `source/` | `audit-pup-template.html` (the page source), `build_html.js`, `VERSION`, `package.json`, `assets/` (built-in fonts and dog drawings), `art/` (the original dog drawings, for new crops). |
| `cases/quinn/`, `cases/baylor/` | The correct TaxSlayer PDF for each step of each case. The tests read these. |
| `.github/workflows/tests.yml` | Runs the build and every test on each pull request and push to main. |
| `docs/test-plan.md` | How testing works and the planned changes to it. |
| `tests/` | Test scripts, `run_all.sh`, `fixtures/` (Quinn PDFs with forms added or removed), and `mockdog.jpg` (a stand-in reward photo). Results and screenshots go to `tests/output/`, which is not committed. |

The live site is https://jaycarterwells.github.io/audit-pup/ (GitHub Pages from `main`). Each release is tagged `v<version>`.

## Running the tests

```
cd source
npm install
npx playwright install chromium   # only if Playwright says its browser is missing
node build_html.js
npm test                          # runs tests/run_all.sh
```

`run_all.sh` runs every script below, prints one line per test, and shows a script's full output only when it fails. Every script ends with a failure exit code when any check fails, so nothing needs a read by eye. The full run takes about 6 minutes. GitHub Actions runs the same suite on every pull request (see `docs/test-plan.md`).

## Release checklist

0. **GitHub checks.** The "tests" check on the release pull request is green. It runs everything below except the real-device checks.
1. **Planted-mistake sweep.** `mutate.js` changes one printed number at a time in every Quinn step PDF and confirms each checked line is read from exactly its own spot on the form. Required result: "SWEEP OK" (every checked line has exactly 1 reader, a $1 error fails, a blanked line fails). Quinn and Baylor (0.14.0): 9,026 planted mistakes, 0 missed, including $5 planted in every line whose answer is blank.
2. **Step and file matrix.** `verify5.js`: every step's PDF checked against every step. Correct pairings pass with no warning; an earlier step picked for a later PDF shows the wrong-step warning; no on-screen error in any cell.
3. **Added and removed forms.** `verify2.js` with the fixture PDFs. Extra forms are ignored; a missing checked form shows "Form missing."
4. **Notes and manual items.** `verify3.js` (N1, N2, N3 entries, NN checkbox) and `verify4.js` (bar colors, reward online and offline, pinned frame).
5. **Look and dogs.** `verify11.js`: drop box and button name the step, Zeke's guide messages, Zion, Bailey, and Zeke (with titles) match red, yellow, and green, the Approved! reward, built-in fonts load, a 19-step trail wraps onto 3 rows with no sideways scroll, and no paw burst when reduced motion is on.
6. **Startup and damaged copies.** `repro2.js`: scripts blocked, file cut off in three places (made fresh from the current build), file dropped outside the box, older Safari file reading.
7. **Same file reused.** `verify7.js`: a file that passed one step and is checked again for a later step shows the same-file warning; retries, corrections, and earlier steps do not.
8. **What's new panel.** `verify8.js`: Version button, "New" tag, panel opens and closes, fits a Chromebook screen.
9. **Saved progress.** `verify9.js`: progress, worksheet entries, TS Note box, and same-file memory survive closing and reopening; Start over clears them; a browser that refuses storage still checks and says progress is not saved.
10. **Moving to the next step.** `verify10.js`: a confirmed step selects the next unfinished step, clears the old file, and Zeke's bubble names it (the results hold no next-step button); failures, warnings, and unfinished manual items do not advance; a finished case says so.
11. **Chromebook sizes and speed.** `verify6.js` at 1366x768 with 100%, 125%, and 150% zoom and a slowed processor. Required result: no sideways scrolling, pinned frame stays at the top and stays a modest share of the screen, the largest PDF checks in a few seconds.
12. **Real devices.** Open the build on a managed Tax-Aide Chromebook and on a Mac (Chrome and Safari) and check one step end to end. On the Chromebook, also sign out and back in to confirm saved progress survives.
13. **Guide matches the code.** Update `docs/chromebook-guide.md` for every change counselors can see: steps, buttons, labels, statuses, colors, dog titles, and the exact wording of every message in "If something goes wrong." Read the guide against the built page before releasing. Carter does not edit the guide separately.
14. **Version and release notes.** Set the new version in `source/VERSION` using the rules below, and add a matching entry at the top of the `CHANGELOG` list in the template, written for counselors. The build refuses to run if the version has no release notes.
15. **Build.** In `source/`, run `node build_html.js`, then copy `source/tax-aide-quinn-checker.html` (or the file in `source/dist/`) to `index.html` at the repository root.
16. **Publish.** Commit `index.html`, the guide, and any source, test, or case changes together, tag the commit `v<version>`, and push to `main`. A Claude Code session started from claude.ai/code with this repository selected can push. Without that, Carter uploads the changed files on GitHub (Add file, Upload files) and creates the tag under Releases. GitHub Pages updates the live site within a few minutes; open it and confirm the Version button shows the new number.

## Adding a new case

1. Add the correct TaxSlayer PDF for each step under `cases/<case>/`.
2. Add the case's lines, answer key columns, notes, and one teaching hint per line to the template (see the Quinn data as the pattern).
3. Run the planted-mistake sweep against every step of the new case before release (extend `mutate.js` with the new case's PDFs).
4. This is a MINOR version.

## Version rules (semantic versioning, MAJOR.MINOR.PATCH)

* **PATCH** (0.13.0 to 0.13.1): fixes and corrections, such as a bug, a wrong answer key value, or hint wording.
* **MINOR** (0.13.0 to 0.14.0): additions that do not disrupt anyone, such as a new case, a new check, or a new feature.
* **MAJOR** (1.x to 2.0.0): changes that break how people use it, such as dropping a supported browser or removing a case.
* Versions starting with 0 mean beta. Version 1.0.0 is the first general release, once beta testing is complete.
* Each part counts up on its own, so 0.10.0 ("zero point ten") comes after 0.9.0.
* Changes to the counselor guide or README alone do not need a new Audit Pup version.

## Saved progress: how it works

Audit Pup saves each case's progress in the browser's local storage, under the key `auditpup.progress.v1.<case>`. It holds each step's latest result (Done, Fix, or To finish, with score, time, and file name), the N3 worksheet entries, the NN checkbox, and the same-file fingerprints. Nothing is sent anywhere. Progress on the live site is kept separately from progress in a downloaded copy of the file. Cookies were not used because they are meant for sending data to a web server with every request, hold only about 4 KB, and are often refused for files opened from the computer. If the storage format ever changes, the `v1` in the key changes so old records are not misread.

In Chrome Guest mode or an Incognito window, saving works while the window is open and is erased when it closes, without any warning. The "not saving progress" message appears only when the browser refuses storage outright.

## Known exposures (accepted for now)

* **Mistakes on lines the answer key does not check.** Audit Pup only verifies the lines and notes in the answer key. An error that does not change any checked line (for example a wrong W-2 Medicare box) will pass. Possible future fix: compare every amount on the main forms and the W-2 summary page against the correct PDF for that step, shown as warnings that hold back the dog but do not change the score.
* **Self-reported items.** The N3 worksheet totals and the NN TS Note checkbox rely on the student's honesty. TaxSlayer does not print TS Notes in the return PDF.
* **Steps with identical answers.** Steps B and D, and Steps E and F, have the same expected values by design, so their PDFs cannot be told apart. The same-file warning covers the common case of reusing the earlier step's PDF.
* **Saved progress stays on one browser and computer.** It is erased if the counselor clears browsing data, and may be erased at sign-out on a Chromebook set up to wipe local data.
* **Public answer keys.** The live site and repository are public, so anyone can see the answer key values and the correct step PDFs. Accepted because the data is fabricated and students already receive the answer keys.

## Decided not to do

* Comparing repeated copies of the same form within one PDF. TaxSlayer is trusted to print a repeated form identically.
* Extra labeling of self-reported items. The checkbox wording already makes this clear.

## Browser requirements

* Chrome (Chromebook, Mac, Windows): current versions work.
* Safari on Mac: version 15 or newer (2021). Older Safari shows the steps but cannot read PDFs; Audit Pup says so and suggests updating or using Chrome.
* A downloaded copy must be opened in a browser, not in an email, Google Drive, or Quick Look preview. If it is shown in a preview, a red "Audit Pup did not start" message explains how to open it.
* The reward dog photo needs internet (Dog API at dog.ceo). Checking works offline once the page is open; the dog drawings and fonts are built into the file.

## Planned

* Add the live site link to the D23 bookmark import file.

## Appendix: beta issue log

* **Mac tester, early November 2026.** Step list empty in Safari and Chrome; dropping a PDF opened it in the browser. Cause: the page's script never ran (file shown in a preview with scripts blocked, or a cut-off copy). Fix (in 0.9.0): "did not start" message, incomplete-copy detection, drop anywhere on the page, older-Safari file reading, and an accurate message for Safari older than 15.
* **Hosting, November 4, 2026.** Version 0.11.0 published to GitHub Pages with a counselor guide at `docs/chromebook-guide.md`.
* **Auto-advance, November 5, 2026.** While building 0.12.0, clearing the old file after a passed step broke the same-file memory. Caught by `verify10.js`, fixed before release. Test scripts now fail on any on-screen error message.
* **New look, November 5, 2026 (0.13.0).** Seal of Approval logo chosen by the beta group, with the green check removed (green checks are kept for good results) and dog bones added. Three dogs for results with titles: Zion, corrections officer (red); Bailey, follow-up clerk (yellow); Zeke, chief inspector (green and the guide). Drawings made with Google Gemini. The paw-print burst first pushed the page sideways on narrow screens; caught by `verify11.js` and fixed. 0.12.0 was never published; 0.13.0 includes it. Source, tests, and the Quinn step PDFs moved into this repository, so a Claude Code session has everything it needs.
* **Second case, November 8, 2026 (0.14.0).** Added Baylor (15 steps, 430 checks, Schedules 1, 2, 3, A, Form 8880). The answer key was generated from the answer sheet tables and every value compared with the step PDFs before any code changed. Blank answer sheet cells are checked as blank or $0. The sweep now also plants $5 in every blank-answer line. Tests now fail with an exit code and run on GitHub Actions.
