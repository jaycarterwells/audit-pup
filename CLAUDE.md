# Audit Pup: working notes for Claude

Read this first in any session that works on Audit Pup. It carries the decisions and rules from earlier sessions.

## What Audit Pup is

A single self-contained HTML page that checks an AARP Tax-Aide counselor's TaxSlayer training PDF for one step of a case against that case's answer key. Built for El Dorado County Tax-Aide training classes (district D23). Owner: Carter Wells (GitHub `jaycarterwells`).

* Live site: https://jaycarterwells.github.io/audit-pup/ (GitHub Pages from `main`).
* Users: volunteer counselors, mostly over 55, on Chromebooks in Chrome. Some use Macs (Safari 15+ supported).
* All case data is fabricated TaxSlayer Practice Lab data. No real taxpayer information.
* Free for users: no accounts, no AI service, no server. Everything runs in the browser and works offline (except the reward dog, which uses the Dog API at dog.ceo).

## Rules (do not break these)

1. **False positives are the worst outcome.** Never let Audit Pup say a line is correct when it is wrong. Exact-match grading, no tolerance. Run the planted-mistake sweep (`tests/mutate.js`, must print SWEEP OK) before every release that touches grading or cases.
2. **One deliverable file.** `index.html` is a build output of the template plus inlined pdf.js. Never edit `index.html` by hand.
3. **The counselor guide must match the code.** Every release updates `docs/chromebook-guide.md` for anything counselors can see (steps, buttons, labels, statuses, colors, exact message wording). Carter does not edit the guide separately.
4. **Semantic versioning.** PATCH for fixes and answer key corrections, MINOR for new cases, checks, or features, MAJOR for breaking changes. 0.x means beta. Each version needs a matching entry in the `CHANGELOG` list in the template; the build refuses otherwise. Do not tag by hand: the release workflow tags `v<version>` and publishes the GitHub Release after the tests pass on main.
5. **The repository is the single source of truth.** Releases are no longer saved to Google Drive.
6. **Writing style for Carter's documents:** never use em dashes or double hyphens; use commas, colons, or parentheses. Keep documents readable as standalone stories; put history in an appendix.
7. **Hints teach, they do not just tell.** Each failed line gets one hint: the answer key value plus where to look in the problem. No hint ladders.
8. **Large print and Chromebook fit.** Body text about 17px, generous tap targets, pinned score frame stays a modest share of a 1366x768 screen at 100 to 150% zoom.

## How it works (key decisions)

* Pages are identified by their printed TaxSlayer form header (Form 1040 title, 7-digit code plus "Form 540" or "FTB 3514"). Any other form is ignored; a missing checked form shows "Form missing."
* Values are read by geometry: federal lines by label row, California lines by the line-number token nearest the amount column. California refund (540 line 115) is read from the form, not the summary page.
* Cases live in the `CASES` list in the template (Quinn, Baylor). `useCase()` loads the chosen case into `LINES`, `STEPS`, `ORDER`, `NOTES`, `WORKSHEET`. Baylor lines name their reader (`read:['box',form,token]` or `['ca',token,valueMin]`); Quinn keeps its original readers.
* Baylor forms: 1040, Schedules 1, 2, 3, A, Form 8880, CA 540. A blank answer sheet cell is checked as "blank or $0"; a blank answer on an optional schedule (Sch 1, 2, 3, A, 8880) passes when that schedule is not printed.
* A step with no answer key column (Quinn D and F, Baylor P and R) must equal the previous checkpoint; a moved value shows "Changed."
* Wrong-step warning: only when the picked step passes and a column with more checks also fully passes.
* Same-file warning: a file that first passed a step cleanly and is checked again for a later step.
* Answer key notes (Quinn): N1 checked from the 1040 HOH box and TaxSlayer's dependent summary; N2 from the two refunds versus the circled MWP Worksheet option; N3 by the student typing the five worksheet totals and the circled option; NN (TS Note) by student checkbox, because TaxSlayer does not print TS Notes.
* Saved progress: browser localStorage key `auditpup.progress.v1.<case>`, not cookies. Quinn's TS Note box stays in the `nn` field; Baylor's per-step boxes are in `marks`. The last case used is in `auditpup.case`.
* Baylor notes read from the PDF: N1 (QSS, WILLIAM, child tax credit box), N2 (IP PIN 543456), N4 ("PO BOX 540" on the Betts W-2), NP (a Preparer Notes page). TS Notes at A, E, I, N are checkboxes.
* Baylor's answer key was generated from the answer sheet tables, not typed. Baylor Step P has no PDF; tests use Step O's PDF for it.
* pdf.js 3.11.174 legacy build runs on the main thread (no worker, no blob URLs), because some viewers block workers.
* After a confirmed step, Audit Pup selects the next unfinished step and clears the old file.

## Where things are

Everything needed to build, test, and release is in this repository. Nothing has to be fetched from Google Drive or a claude.ai Project.

* `index.html`: built page served by GitHub Pages. `README.md`.
* `docs/chromebook-guide.md`: counselor guide. `docs/release-checklist.md`: the release checklist, version rules, known exposures, and how to add a case. Follow it for every release.
* `source/`: `audit-pup-template.html` (the page source, including answer keys, hints, and the CHANGELOG), `build_html.js`, `VERSION`, `package.json`, `assets/` (fonts and dog drawings built into the page), and `art/` (original dog drawings, for new crops). The build replaces `__ASSET_<file>__` with base64 of `assets/<file>` and refuses if an asset or the changelog entry is missing.
* `cases/quinn/`, `cases/baylor/`: the correct TaxSlayer PDF for each step (`Quinn_Sec_A.pdf`, `Baylor_Sec_A.pdf`, and so on). New cases go in `cases/<case>/`.
* `cases/<case>/case.json`: what the tests need to know about a case (the PDF for each step, items left for the student, steps with identical returns, steps with their own TS Note box, the speed limit). The generic tests run over every case that has one.
* `tests/`: generic case tests that run over every `case.json` (`cases_steps.js`, `cases_matrix.js`, `cases_switch.js`, `mutate.js`), page-behavior scripts that use Quinn (`verify2.js` to `verify11.js`, `repro2.js`), `check_index.js`, the `cases.js` loader and `expect.js` helper, `run_all.sh`, `fixtures/` (Quinn PDFs with forms added or removed), and `mockdog.jpg`. Every script ends with a failure exit code when a check fails. Output goes to `tests/output/` (not committed).
* `.github/workflows/tests.yml`: GitHub Actions runs the build and `run_all.sh` on every pull request and push to main. `main` is protected by a ruleset: changes need a pull request with the "tests" check passing.
* `.github/workflows/release.yml`: after the tests pass on main, if `source/VERSION` has no tag yet, it checks that `index.html` is that version, tags `v<version>`, and publishes a GitHub Release with notes from `source/release_notes.js` (the page's CHANGELOG entry).
* `docs/test-plan.md`: how testing works today, the strategy (developer, check-in, release tiers), and the prioritized list of test changes.

To build and test:

```
cd source
npm install
npx playwright install chromium   # only if Playwright says its browser is missing
node build_html.js                # writes source/tax-aide-quinn-checker.html and source/dist/
npm test                          # runs tests/run_all.sh (about 6 minutes)
cp tax-aide-quinn-checker.html ../index.html
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

* 0.14.0 adds the Baylor case (15 steps) and checks on GitHub Actions. Test plan changes 1 to 3 are done; the next ones are in `docs/test-plan.md`, Part 3.
* 0.13.0 was the redesign (above). 0.12.0 was never published; 0.13.0 includes it.
* Cowork sessions cannot push to GitHub. A Claude Code session started from claude.ai/code with this repository selected can commit and push to its working branch and open and merge pull requests, but cannot push tags (the release workflow tags instead). Carter's own uploads go through a pull request because of the ruleset on main.
