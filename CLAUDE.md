# Audit Pup: working notes for Claude

Read this first in any session that works on Audit Pup. It carries the decisions and rules from earlier sessions.

## What Audit Pup is

A single self-contained HTML page that checks an AARP Tax-Aide counselor's TaxSlayer training PDF for one step of a case against that case's answer key. Built for El Dorado County Tax-Aide training classes (district D23). Owner: Carter Wells (GitHub `jaycarterwells`).

* Live site: https://jaycarterwells.github.io/audit-pup/ (GitHub Pages, deployed by the release workflow from the latest release tag).
* Users: volunteer counselors, mostly over 55, on Chromebooks in Chrome. Some use Macs (Safari 15+ supported).
* All case data is fabricated TaxSlayer Practice Lab data. No real taxpayer information.
* Free for users: no accounts, no AI service, no server. Everything runs in the browser and works offline (except the reward dog, which uses the Dog API at dog.ceo).

## Rules (do not break these)

1. **False positives are the worst outcome.** Never let Audit Pup say a line is correct when it is wrong. Exact-match grading, no tolerance. Run the planted-mistake sweep (`tests/engine_sweep.js`, must print SWEEP OK; it is part of `tests/dev_test.sh`) on every change that touches reading, an answer key, or a case.
2. **One deliverable file.** The live page is one self-contained file built from `source/` plus inlined pdf.js. The release workflow builds it and deploys it as `index.html`; it is not kept in the repository (`/index.html` is ignored). Never hand-edit a built page.
3. **The counselor guide must match the code.** Every release updates `docs/chromebook-guide.md` for anything counselors can see (steps, buttons, labels, statuses, colors, exact message wording). Carter does not edit the guide separately. `tests/guide_check.js` checks every bold phrase in the guide against the page's displayable text; a phrase that is not Audit Pup text goes in its `NOT_PAGE_TEXT` list with a reason.
4. **Semantic versioning.** PATCH for fixes and answer key corrections, MINOR for new cases, checks, or features, MAJOR for breaking changes. 0.x means beta. Each version needs a matching entry in the `CHANGELOG` list in the template; the build refuses otherwise. Do not tag by hand: the release workflow tags `v<version>` and publishes the GitHub Release after the tests pass on main.
5. **The repository is the single source of truth.** Releases are no longer saved to Google Drive.
6. **Writing style for Carter's documents:** never use em dashes or double hyphens; use commas, colons, or parentheses. `tests/style_check.js` enforces this in every text file. Keep documents readable as standalone stories; put history in an appendix.
7. **Hints teach, they do not just tell.** Each failed line gets one hint: the answer key value plus where to look in the problem. No hint ladders.
8. **Large print and Chromebook fit.** Body text about 17px, generous tap targets, pinned score frame stays a modest share of a 1366x768 screen at 100 to 150% zoom.

## How it works (key decisions)

* Pages are identified by their printed TaxSlayer form header (Form 1040 title, 7-digit code plus "Form 540" or "FTB 3514"). Any other form is ignored; a missing checked form shows "Form missing."
* Values are read by geometry: federal lines by label row, California lines by the line-number token nearest the amount column. California refund (540 line 115) is read from the form, not the summary page.
* Cases live in the `CASES` list in the template (Quinn, Baylor). `useCase()` loads the chosen case into `LINES`, `STEPS`, `ORDER`, `NOTES`, `WORKSHEET`. Every line names its reader (`read:['box',form,token]` or `['ca',token,valueMin,form]`, form ca540 unless named, e.g. ca3514), read by `extractByLines`.
* Baylor forms: 1040, Schedules 1, 2, 3, A, Form 8880, CA 540. Quinn forms: 1040, CA 540, FTB 3514. For both cases a blank answer sheet cell is checked as "blank or $0"; a blank answer on an optional form (Sch 1, 2, 3, A, 8880, FTB 3514) passes when that form is not printed.
* A step with no answer key column (Quinn D and F, Baylor P and R) must equal the previous checkpoint; a moved value shows "Changed."
* Lines whose answer is blank or $0 at a step are shown as ONE row, "Lines that should be blank" (Carter's choice, to keep the list short); it fails when any of them has an amount and lists each one. It counts as one check in the score.
* Wrong-step box ("Did you pick the right step?", `otherMatches`): when a check FAILS and the PDF matches every line of another step (most often the previous step's PDF), the box names that step and offers a button; steps with identical values are named once. When a check PASSES, it still warns if a step with more checks also passes (partial keys only). A result with the box showing is not saved to progress. If the same-file note shows, the box is not shown too. `engine_cases.js` proves every wrong printout names its own step.
* Same-file warning: a file that first passed a step cleanly and is checked again for a later step.
* Answer key notes (Quinn): N1 checked from the 1040 HOH box and TaxSlayer's dependent summary; N2 from the two refunds versus the circled MWP Worksheet option; N3 by the student typing the five worksheet totals and the circled option; NN (TS Note) by student checkbox, because TaxSlayer does not print TS Notes.
* Saved progress: browser localStorage key `auditpup.progress.v1.<case>`, not cookies. Quinn's TS Note box stays in the `nn` field; Baylor's per-step boxes are in `marks`. The last case used is in `auditpup.case`.
* Baylor notes read from the PDF: N1 (QSS, WILLIAM, child tax credit box), N2 (IP PIN 543456), N4 ("PO BOX 540" on the Betts W-2), NP (a Preparer Notes page). TS Notes at A, E, I, N are checkboxes.
* Both answer keys are made from the answer sheets by the import tool, never typed. Baylor Step P has no PDF; tests use Step O's PDF for it.
* pdf.js 3.11.174 legacy build runs on the main thread (no worker, no blob URLs), because some viewers block workers.
* After a confirmed step, Audit Pup selects the next unfinished step and clears the old file.

## Where things are

Everything needed to build, test, and release is in this repository. Nothing has to be fetched from Google Drive or a claude.ai Project.

* `README.md`. There is no `index.html` in the repository: the release workflow builds the page from the release tag and deploys it.
* `docs/chromebook-guide.md`: counselor guide. `docs/release-checklist.md`: the release checklist, version rules, known exposures, and how to add a case. Follow it for every release.
* `source/`: `audit-pup-template.html` (the page: layout, styles, the UI script, and the CHANGELOG), `engine.js` (the reading engine: pure functions that read amounts from PDF text and match them to an answer key), `cases/quinn.js` and `cases/baylor.js` (each case's lines, hints, steps, and notes), `tools/import_answer_sheet.js` (makes `answer_key.json` from an answer sheet), `release_notes.js`, `build_html.js` (puts the engine, the answer keys, and the case files into the page at `/*__ENGINE_AND_CASES__*/`), `VERSION`, `package.json`, `assets/` (fonts and dog drawings built into the page), and `art/` (original dog drawings, for new crops). The build replaces `__ASSET_<file>__` with base64 of `assets/<file>` and refuses if an asset or the changelog entry is missing.
* `cases/quinn/`, `cases/baylor/`: the correct TaxSlayer PDF for each step (`Quinn_Sec_A.pdf`, `Baylor_Sec_A.pdf`, and so on). New cases go in `cases/<case>/`.
* `cases/<case>/answer_sheet.doc` and `answer_key.json` (both cases): the answer sheet and the key made from it by the import tool. Never edit `answer_key.json` by hand: re-run the import. The tests check that the sheet's fingerprint matches.
* `cases/<case>/case.json`: what the tests need to know about a case (the PDF for each step, items left for the student, steps with identical returns, steps with their own TS Note box, the speed limit). The generic tests run over every case that has one.
* `tests/dev_test.sh`: the developer test (about 50 seconds: ESLint, the style rule, the build, the HTML check, the guide check, then the engine and case tests; `bash tests/dev_test.sh baylor` for one case). Run it on every change before pushing.
* `tests/`: checks before a browser opens (`lint.js` ESLint for all JavaScript including the page script taken out of the template, `style_check.js`, `html_check.js` html-validate on the built page, `guide_check.js`), `a11y_check.js` (axe-core, WCAG 2.1 A and AA, 14 screens in light and dark themes), `webkit_check.js` (the main counselor paths in WebKit, Safari's engine; installed on GitHub, reported as skipped where it is not installed, and a failure on GitHub if missing), engine tests in Node with no browser (`unit_engine.js`, `engine_cases.js` for answer keys and every printout against every step, `engine_sweep.js` for the planted-mistake sweep, the `engine.js` loader), `engine_parity.js` (proves the page and Node read every PDF identically), page tests over every `case.json` (`cases_steps.js`, `cases_matrix.js` with sample pairs, `cases_switch.js`), page-behavior scripts that use Quinn (`verify3.js`, `verify4.js`, `verify6.js` to `verify11.js`, `repro2.js`), `page.js` (waits on the page's own signals; page tests never wait a fixed time), `live_check.js` (the live site check), the `cases.js` loader and `expect.js` helper, `run_all.sh`, `fixtures/` (Quinn PDFs with forms added or removed; `fixtures/storage/`, the saved progress each released version left, made by `make_storage_fixture.js` and loaded by `storage_upgrade.js`), and `mockdog.jpg`. Every script ends with a failure exit code when a check fails. Output goes to `tests/output/` (not committed).
* `.github/workflows/tests.yml`: GitHub Actions runs the build and `run_all.sh` on every pull request and push to main. `main` is protected by a ruleset: changes need a pull request with the "tests" check passing.
* `.github/workflows/release.yml`: after the tests pass on main, if `source/VERSION` has no tag yet, it tags `v<version>`, publishes a GitHub Release with notes from `source/release_notes.js` (the page's CHANGELOG entry), builds the page from that tag (dated with the release commit's date), deploys it to GitHub Pages with a Jekyll site build (as branch-based Pages did), then checks the live site with `tests/live_check.js`. Run it by hand with a tag to deploy that release again.
* `.github/workflows/weekly.yml`: every Sunday, the full suite on main and the live site check. `.github/dependabot.yml`: monthly update pull requests for the npm tools and workflow actions (major pdf.js versions held back).
* `docs/test-plan.md`: how testing works today (what the tests protect, the developer, check-in, release, and weekly tiers, every test, how a case is tested) and, in Part 6 "Moving forward", the only list of future test work.

To build and test:

```
cd source
npm install
npx playwright install chromium   # only if Playwright says its browser is missing
node build_html.js                # writes source/tax-aide-quinn-checker.html and source/dist/
npm run dev-test                  # tests/dev_test.sh: the fast developer test (about 45 seconds)
npm test                          # tests/run_all.sh: the full suite GitHub runs (about 5 minutes)
open tax-aide-quinn-checker.html          # to look at the built page locally
```

## Look and feel (0.13.0)

* Logo: the "Seal of Approval" (Zeke's drawing in a gold and graphite ring, "AUDIT PUP" on top, "EL DORADO TAX-AIDE" below, small gold dog bones at left and right). No green check in the logo: green checks are kept for good results.
* Three dogs (drawings made with Google Gemini; no credit line needed): Zeke, chief inspector, is the guide (speech bubble at the top) and the green result; Zion, corrections officer, is the red result; Bailey, follow-up clerk, is the yellow result. The result dog, with its title under its name, always matches the bar color. Original drawings are in `source/art/`.
* The random Dog API photo stays as the reward on every finished step, shown in an "Approved!" snapshot with a paw-print burst (skipped when reduced motion is on).
* Paw-print step trail wraps onto more rows for 15 to 20 step cases. Status classes on `.pchip` stay `done`, `fix`, `todo`, `none`, plus `sel`.
* Drop box and Check button name the selected step. Tests wait on `#grade` `data-state="ready"` (it is `busy` while reading).
* Results stay focused on results: next-step guidance lives only in Zeke's bubble at the top.
* Colors: cream paper, pencil gray, El Dorado gold; red, yellow, green only for results. Fonts: Atkinson Hyperlegible (text) and Bitter (headings), embedded.

## Current state

* 0.16.0 (November 9, 2026): blank lines shown as one row, and the "Did you pick the right step?" box for a failing check whose PDF matches another step (both Carter's requests).
* 0.15.0 (November 9, 2026): Quinn's answer key is imported from its sheet and its blank cells are checked as blank or $0, like Baylor (Carter's choice), adding 9 lines (1040 lines 15, 16, 24, 37; CA 540 lines 14, 16, 35, 64, 111), so Quinn's scores grew (Step A 34 checks, B and D 33, E and F 36). Also the New tag color and the screen reader and keyboard fixes. The hints for every case are listed in `docs/hints.md` (made by `source/tools/hints_report.js`; the tests fail if it is stale) for expert review; Quinn's 9 new hints were written by Claude and are awaiting that review. The test work through bucket E is done; what is left is in `docs/test-plan.md`, Part 6 "Moving forward".
* 0.14.0 added the Baylor case (15 steps) and checks on GitHub Actions.
* 0.13.0 was the redesign (above). 0.12.0 was never published; 0.13.0 includes it.
* Cowork sessions cannot push to GitHub. A Claude Code session started from claude.ai/code with this repository selected can commit and push to its working branch and open and merge pull requests, but cannot push tags (the release workflow tags instead). Carter's own uploads go through a pull request because of the ruleset on main.
