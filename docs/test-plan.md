# Audit Pup Test Plan

How Audit Pup is tested today, and what is left to do. Part 1 to Part 5 describe the tests as they are on `main`. Part 6, "Moving forward," is the only list of future work.

## Part 1: What the tests protect

Every test traces back to one of these promises to counselors and to Carter:

1. **Never pass a wrong line.** A false positive is the worst outcome. Grading is exact, with no tolerance, and every checked line is proven to be read from exactly one spot on the form.
2. **Never fail a right return.** Each step's correct TaxSlayer PDF passes its own step, with only the student's own items (worksheet entries, TS Note boxes) left to do.
3. **The answer key is the answer sheet.** No answer key value is typed. Each case's key is made from its answer sheet by a tool, and the tests prove the sheet has not changed since.
4. **One file that works everywhere counselors are.** Chromebooks in Chrome at 100 to 150% zoom, Macs with Safari 15 or newer, viewers that block background workers, offline use, and damaged or preview copies that must explain themselves.
5. **Progress is kept.** Saved progress survives closing the page, and progress saved by an older release loads in a newer one.
6. **Readable and usable by older volunteers.** Large print, color contrast, keyboard use, and screen reader names (WCAG 2.1 A and AA).
7. **The guide matches the page.** Every message the counselor guide quotes exists in the page.
8. **What is live is what was tested, and counselors use it.** The site is built from the release tag and checked after every deploy, and an open page or a downloaded copy that is out of date tells the counselor to update.

## Part 2: When the tests run

| Tier | When | What runs | Time |
| --- | --- | --- | --- |
| **Developer** | Every change, before pushing (`npm run dev-test`, or `bash tests/dev_test.sh baylor` for one case) | Code checks, the build, the HTML and guide checks, the engine tests, the answer sheet re-import check (when LibreOffice is installed), the planted-mistake sweep, and each step of every case through the page. One line per check. | About 55 seconds |
| **Check-in** | Every pull request and every push to `main` (`.github/workflows/tests.yml`) | The full suite, `tests/run_all.sh`, in Chromium and WebKit. Required: the ruleset on `main` blocks a merge until the "tests" check passes. Logs and screenshots are kept for 14 days when a run fails. | About 4 minutes of tests, about 5 minutes on GitHub with setup |
| **Release** | After the tests pass on a push to `main` with a new `source/VERSION` (`.github/workflows/release.yml`) | Tags `v<version>`, publishes the GitHub Release from the page's own release notes, builds the page from the tag, deploys it to GitHub Pages, then `live_check.js` opens the live site and checks the version and the first step of every case. Carter adds the real-device checks in `docs/release-checklist.md`. | A few minutes |
| **Weekly** | Every Sunday (`.github/workflows/weekly.yml`) | The full suite on `main` and the live site check, to catch drift in Chrome, Playwright, or the site. | About 6 minutes |
| **Tool updates** | Monthly (`.github/dependabot.yml`) | Dependabot opens pull requests for the npm tools and the workflow actions; each one runs the full check-in suite. Major pdf.js versions are held back. | |

## Part 3: The tests

All tests are in `tests/`. Page tests open the built page (`source/tax-aide-quinn-checker.html`) in Playwright and give it the real TaxSlayer PDFs from `cases/`. No test contacts the Dog API: the reward photo is blocked or replaced by `mockdog.jpg`. Every script ends with a failure exit code when any check fails, and `run_all.sh` prints one line per script, showing a script's full output only when it fails.

### Code checks (before a browser opens)

| Test | What it proves |
| --- | --- |
| `lint.js` | ESLint (recommended rules) over all JavaScript: the engine, the case files, the page's own script taken out of the template, the tools, and the tests. Names shared between the page files are collected from the files, so a misspelled name is an error. |
| `style_check.js` | No em dashes and no double hyphens used as dashes in any text file (rule 6). |
| `html_check.js` | html-validate (recommended rules) on the built page. Two intended exceptions are marked in the page with their reasons. |
| `hints_doc.js` | `docs/hints.md`, the hints page for expert review, matches every hint in the case files. |
| `guide_check.js` | Every bold phrase in `docs/chromebook-guide.md` is in the page's displayable text (comments and release notes are left out), or is listed as not Audit Pup text with a reason. |

### Engine tests (Node, no browser)

The reading engine (`source/engine.js`) and the case files load in Node exactly as the build puts them into the page. PDF text is read with the page's pdf.js version and kept in `tests/output/pdf-text/`, so later runs take seconds.

| Test | What it proves |
| --- | --- |
| `unit_engine.js` | 29 unit tests: amount parsing, exact matching, blank versus $0, Unread and Form missing, optional forms (including the FTB 3514), page recognition from the printed form header, the line readers, the IP PIN reader, answer keys from `answer_key.json`, and both wrong-step rules. |
| `engine_cases.js` | For every case: the answer sheet is the one the key was made from (fingerprint), every key row names a line the case reads, every step's expected values are the key's, every line has a reader, a name, and a teaching hint (rule 7), and every printout checked against every step: a step's own printout (or one with the same return) passes, any other printout fails or shows the wrong-step warning, and the "Did you pick the right step?" box names the printout's own step. |
| `engine_sweep.js` | The planted-mistake sweep (9,026 changes). In every step PDF of every case it changes each printed amount on the checked forms, one at a time, and proves each checked line is read from exactly one spot, a $1 error fails, a blanked amount fails, and $5 planted in the empty box of a line whose answer is blank fails. Must print SWEEP OK. |
| `engine_parity.js` | The page in Chromium and the Node engine read all 19 case PDFs identically (every text item and position), so the engine tests hold for the real page. |

### Case tests (every case with a `case.json`)

Each case has `cases/<case>/case.json`: the PDF for each step, the items left for the student, the steps with identical returns, the steps with their own TS Note box, and a speed limit. Expectations come from `case.json` and the answer key, never from the page under test. A new case needs a `case.json` and its PDFs, not new test scripts.

| Test | What it proves |
| --- | --- |
| `cases_steps.js` | `case.json` lists the page's steps in order; each step's correct PDF passes every check on the page with only the student's items left; the case's longest PDF checks in time with the processor slowed 6 times. |
| `cases_matrix.js` | A sample of printout and step pairs through the page (each printout against the steps it may pass and the next one it may not): no wrong pass, no on-screen error. The full every-pair check runs at engine level. |
| `cases_switch.js` | Switching cases keeps each case's progress, TS Note boxes are per step where `case.json` says so, and Start over clears only the case picked. |

### Page behavior tests (using Quinn)

These test the page itself, so they use one case.

| Test | What it proves |
| --- | --- |
| `verify3.js` | In a viewer that blocks background workers and blob links: Quinn's exact scores at every step (A 5/5, B and D 22/22, E and F 28/28, each with one row for the lines that should be blank), notes N1, N2, N3 (worksheet entries, a wrong total marks one field, a wrong circled option fails), the TS Note box, printouts with extra forms (ignored), a removed form that is not checked (no change), a removed 3514 (its filled lines show Form missing), and no console errors. |
| `verify4.js` | Bar colors for every state, the reward online (mocked photo) and offline (check mark only), unticking a note takes the reward back, and the score frame stays pinned at the top. |
| `verify6.js` | Chromebook screen at 100, 125, and 150% zoom: no sideways scrolling, the pinned frame stays a modest share of the screen, no text under 12px; the largest PDF checks in time with the processor slowed 6 times, and the page opens in under 5 seconds. |
| `verify7.js` | The same-file warning (a file that passed one step, checked again for a later step), and that retries, corrections, and earlier steps do not warn. The "Did you pick the right step?" box: a later printout checked too early and the previous step's printout checked again both fail and name their own step, Zeke says earlier or later, the button re-checks, and only one yellow box shows when the same-file note applies. The passing-check warning with a partial Step A key (see Part 5). |
| `verify8.js` | The Version button and New tag, the What's new panel opens and closes (Esc, a click outside, the footer link), fits a 150% zoom screen, and the footer shows the version with scripts blocked. |
| `update_check.js` | The newer-version check, with a stand-in website: a newer version shows the update box and turns Check off (also when it appears only at Check time, or when the tab comes back), Zeke says to update, Update loads the newest page; the same version or no answer changes nothing; a downloaded copy is told it is out of date, can still check, and is sent to the website. |
| `verify9.js` | Saved progress: statuses, worksheet entries, TS Note box, and same-file memory survive a reload; tapping a chip picks that step; Start over clears everything; only Audit Pup keys are stored; a browser that refuses storage still checks and says progress is not saved. |
| `storage_upgrade.js` | The saved progress left by every released version (`tests/fixtures/storage/`, made by `make_storage_fixture.js` from the released page) loads in the current page: the same step statuses, the first unfinished step, worksheet entries, TS Note boxes, same-file memory, the last case used, and nothing lost. Records for 0.13.0, 0.14.0, 0.15.0, 0.16.0, and 0.17.0 are kept. |
| `verify10.js` | Moving to the next step after a confirmed step, clearing the old file, Zeke's next-step message; failures, warnings, and unfinished items do not advance; a finished case says so. |
| `verify11.js` | Zeke, Zion, and Bailey with their titles match green, red, and yellow; the drop box and button name the step; the built-in fonts load; a 19-step trail wraps onto 3 rows; no paw-print burst with reduced motion. |
| `repro2.js` | Startup failures: scripts blocked (the "did not start" note), copies cut off in three places (made fresh from the current build), a PDF dropped outside the box, and older Safari file reading. |

### Browsers and accessibility

| Test | What it proves |
| --- | --- |
| `a11y_check.js` | axe-core (WCAG 2.1 A and AA) on 14 screens in light and dark themes: each case's start page, results with a failing line and its hint open, a finished step with the reward, and the What's new panel. Every finding fails. |
| `webkit_check.js` | The main counselor paths in WebKit, Safari's engine: the page starts, each case's first step passes, a wrong PDF fails and its hint opens, progress survives a reload, and the What's new panel opens and closes. GitHub installs WebKit; elsewhere the test reports skip, and on GitHub a missing WebKit fails. |

### Release

| Test | What it proves |
| --- | --- |
| `live_check.js` | After every deploy and every Sunday: the live site shows the released version, the first step of every case on it passes, `version.json` names the same version, and both the live page and a downloaded copy of it can read `version.json` (from 0.17.0). |

## Part 4: How a case is tested

1. **Answer sheet to answer key.** `source/tools/import_answer_sheet.js` reads the answer sheet (converted to HTML by LibreOffice) into `cases/<case>/answer_key.json`. It reads Form 1040 lines, Schedules 1, 2, 3, and A, Form 8880, a CA 540 section, and a CA 3514 section, treats an amount in parentheses as negative, and stops on any row it cannot place. A blank cell means "blank or $0." The key records the sheet's fingerprint; `engine_cases.js` fails if the sheet changes without a new import, and the developer test re-imports and compares when LibreOffice is installed. Both Quinn and Baylor are imported this way.
2. **Lines and readers.** Each line in `source/cases/<case>.js` names its reader and has one teaching hint. The sweep proves every reader reads its own spot and nothing else.
3. **Steps and printouts.** `case.json` ties each step to its correct PDF. The engine checks every printout against every step; the page checks each step and a sample of pairs.
4. **Optional forms.** A blank answer on a form TaxSlayer leaves out when nothing goes on it (Schedules 1, 2, 3, A, Form 8880, FTB 3514) passes when the form is not printed. A filled answer on a missing form shows Form missing.

Adding a case is in `docs/release-checklist.md`, "Adding a new case."

## Part 5: How the tests are written

* **Expectations come from outside the page:** the answer key, `case.json`, and fixed values in the test. A test never asks the page what the right answer is.
* **Every new check is proven to fail.** When a check is added, a planted bug shows it fails (for example: a changed storage key fails `storage_upgrade.js`, removing the motion wait fails the bar color check).
* **No fixed waits.** `tests/page.js` waits on the page's own signals: the page has started, the Check button is ready, CSS motion and scrolling have ended, and the mocked reward photo is in. Everything else the page does happens before the click or keypress returns.
* **No network.** The Dog API and the real website's `version.json` are blocked or mocked in every test (`offline()` and `noUpdateCheck()` in `tests/page.js`); only `live_check.js` reaches the real site.
* **Short output.** One line per test unless it fails, so a run costs few tokens to read.
* **The "Did you pick the right step?" box.** When a check fails and the PDF matches every line of another step, the box names that step. `engine_cases.js` proves, for every wrong printout and step pair of every case (204 today), that the box names the printout's own step and no other. A passing check also warns when a step with more checks passes too; only partial keys can do that, so `verify7.js` tests it with a partial Step A key.
* **Blank lines are one row.** Lines whose answer is blank or $0 are shown together in one row that lists any line with an amount. The engine and the sweep still check each of those lines on its own.

**Not covered by automatic tests** (covered by the release checklist or accepted): real Safari 15 (WebKit in Playwright is current WebKit), a real managed Chromebook (sign-out wiping, real zoom), TaxSlayer layout changes in a new tax year, and mistakes on lines the answer key does not check (see "Known exposures" in the release checklist).

## Part 6: Moving forward

In the order I recommend.

| # | What | Why | Needs from Carter | Size |
| --- | --- | --- | --- | --- |
| 1 | **Expert review of the hints.** `docs/hints.md` lists every hint of every case as the page shows it (Quinn's 9 lines added in 0.15.0 have not been reviewed yet). Fold the experts' changes into the case files, re-run `source/tools/hints_report.js`, and release them as a PATCH. Also do the real Chromebook and Mac checks for 0.17.0, including the update box: open the site, leave the tab open across the next release, and confirm the box appears. | Hints teach (rule 7); new hints need an expert's eye. | The experts' comments. | Small |
| 2 | **Keep a saved-progress record for each release.** Done for 0.15.0, 0.16.0, and 0.17.0 (release checklist step 18). Next: make `storage_upgrade.js` fail when a published version in the page's release notes has no record, so the step cannot be forgotten. | Protects counselors' progress across every future release, not only the two kept today. | Nothing. | Small |
| 3 | **New tax year (once a year).** When TaxSlayer moves to a new year: print one return of each form, run the answer key import, `engine_cases.js`, and the sweep on them before updating any case, and write the steps into the release checklist. | Form layouts can move between years, which would break reading. The sweep is the safety net, but only on new-year PDFs. | New-year printouts of each form, when TaxSlayer releases them. | Small, once a year |
| 4 | **Check every case's own notes in the page tests.** The page behavior tests use Quinn; Baylor's notes read from the PDF (N1, N2, N4, NP) are checked through `cases_steps.js` on correct PDFs only. Add one wrong-PDF check per note kind (for example a missing IP PIN fails N2), driven by `case.json`. | A note that always passes would be a false positive the sweep cannot see, since notes are not amounts. | Nothing. | Small |
| 5 | **A pdf.js upgrade plan.** pdf.js major versions are held back. When one is taken: `engine_parity.js`, the sweep, and `webkit_check.js` must pass, and the page's size and opening time compared before and after. | pdf.js reads every amount; a change in how it reports text positions would move every reader. | Approve the upgrade when it comes. | Small, when needed |
| 6 | **Split the GitHub check by case** only if the full suite passes 15 minutes as cases are added (about 1 minute per Baylor-size case today, so not before about 10 cases). The required check must keep the name "tests," or the ruleset on `main` must be updated with it. | Keeps check-in fast at the peak. | Update the ruleset if the check name changes. | Small |
| 7 | **Teacher golden PDFs (feature, waiting).** If the teachers want to check a class against their own correct PDF, it would reuse the engine and the sweep's one-spot proof. | Only if the teachers ask for it. | The teachers' answers. | Medium |
