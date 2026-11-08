# Audit Pup Test Plan

This page describes how Audit Pup is tested today, from a code change through check-in and release. The last two parts describe the testing strategy we are moving toward and the changes to make, in priority order, so the testing still works when Audit Pup has 5 or 6 cases as large as Baylor.

## Part 1: Testing today

### What we protect

1. **No false passes.** Audit Pup must never mark a line correct when it is wrong. This matters more than anything else.
2. **The page works on a counselor's Chromebook**, in Chrome, at 100 to 150% zoom, offline once loaded.
3. **Progress is not lost** when a counselor closes the page, switches cases, or gets a new version.
4. **The counselor guide matches the page.**

### The tests we have

All tests are Playwright scripts in `tests/`. They open the built page (`source/tax-aide-quinn-checker.html`) in Chromium and drop real TaxSlayer PDFs from `cases/` onto it. The reward dog photo is blocked so no test needs the internet.

| Test | What it proves | Case | Time |
| --- | --- | --- | --- |
| `mutate.js` (planted-mistake sweep) | Changes every printed amount on every checked form, one at a time, and confirms each checked line is read from exactly one spot. A $1 error fails, a blanked line fails, and $5 put in a line that should be blank fails. | Quinn, Baylor | 17 s |
| `baylor1.js` (replaced in change 4 by `cases_steps.js`) | Every Baylor step's correct PDF passes its own step. | Baylor | 12 s |
| `baylor2.js` (replaced in change 4 by `cases_matrix.js` and `cases_switch.js`) | Every Baylor PDF against every step (no wrong PDF passes), switching cases, TS Note boxes per step, Start over per case, speed of the longest PDF on a slowed processor. | Baylor, Quinn | 2 min 19 s |
| `verify2.js` | Each Quinn step passes; added and removed forms; viewers that block background workers. | Quinn | 10 s |
| `verify3.js` | Quinn notes N1, N2, N3 worksheet entries, and the TS Note box. | Quinn | 6 s |
| `verify4.js` | Bar colors, reward online and offline, pinned score frame. | Quinn | 14 s |
| `verify5.js` | Every Quinn PDF against every Quinn step, and the wrong-step warning. | Quinn | 23 s |
| `verify6.js` | Chromebook screen at 100, 125, 150% zoom, and speed on a slowed processor. | Quinn | 20 s |
| `verify7.js` | Same-file warning. | Quinn | 9 s |
| `verify8.js` | Version button and What's new panel. | Quinn | 3 s |
| `verify9.js` | Saved progress survives a reload, Start over, a browser that blocks storage. | Quinn | 8 s |
| `verify10.js` | Moving to the next step after a step is done. | Quinn | 9 s |
| `verify11.js` | The dogs, fonts, step trail wrapping, reduced motion. | Quinn | 6 s |
| `repro2.js` | Startup failures: scripts blocked, a cut-off file, older Safari file reading. | Quinn | 6 s |

`tests/run_all.sh` runs them all in a row (about 5 minutes) and flags any line that starts with FAIL.

### When the tests run

| Moment | What happens today | Who |
| --- | --- | --- |
| **Code change** (developer test) | Claude builds the page and runs the scripts it judges relevant, usually the whole suite. | Claude, by hand |
| **Check-in** (pull request) | Nothing runs automatically. The pull request is merged on trust in the developer test. | Nobody |
| **Release** | `docs/release-checklist.md`: full suite, the planted-mistake sweep, real Chromebook and Mac checks, guide read against the page, version and release notes, build, copy the build to `index.html`, tag. | Claude and Carter, by hand |
| **After release** | Carter opens the live site and checks the version number. | Carter |

### Gaps in today's testing

This audit was written for 0.13.0. In 0.14.0, gaps 1 to 3 were closed: the tests run on GitHub Actions for every pull request, every script fails with an exit code, and `tests/check_index.js` checks `index.html`. Requiring the check before a merge is a GitHub setting Carter turns on.

1. **Nothing runs on GitHub.** A change can reach `main`, and so the live site, without any test running. There is no rule that tests must pass before a merge.
2. **`index.html` is copied by hand.** Nothing checks that the live `index.html` is the build of the source in the same commit.
3. **Many tests do not fail cleanly.** 8 of the 14 scripts end with "success" even when a check fails; only `run_all.sh` catches the FAIL text. Four scripts print tables that still need "a quick read by eye".
4. **Most tests know only Quinn.** 11 scripts have Quinn's steps and files written into them. Baylor needed two new scripts, and each new case would need more.
5. **Developer testing is all or nothing.** The quickest way to test a change is the whole suite. There is no fast tier for a small change, and the long output costs tokens to read.
6. **The answer key is copied into the page by hand or by a one-off script** that is not in the repository. Nothing re-checks the key against the answer sheet.
7. **Only Chromium is tested.** Safari 15 or newer is supported but never tested automatically.
8. **No checks on the code itself:** no lint, no HTML check, no accessibility check, and no check of the writing style rules (for example, no em dashes).
9. **The guide is checked by reading it.** Nothing confirms that the messages quoted in the guide still exist in the page.
10. **Fixed waits.** The scripts wait fixed times (69 waits in all), which slows them and can make them flaky on a slower machine.

## Part 2: Testing strategy

The goal is to catch as much as possible while the code is being written, quickly and cheaply, and to leave only what truly needs more time, more browsers, or a person to check-in and release.

### Three tiers

**Developer test (while writing code: under 2 minutes, run by Claude on every change).**

* Build the page.
* Unit tests of the reading engine in plain Node, with no browser: how amounts are parsed, matched, and read from a page. These run in under a second.
* Answer key check for the case being changed: every answer key value equals what the correct PDF prints.
* Each step of the case being changed, checked with its own correct PDF.
* The planted-mistake sweep for the case being changed only.
* Quick static checks: lint, the writing style rules, and that `index.html` matches the build.
* Output stays to one line per test unless something fails, so reading it costs few tokens.
* A change touching only docs runs only the docs checks.

**Check-in test (every pull request, on GitHub Actions: about 10 to 15 minutes, automatic).**

* Everything in the developer test, for every case.
* The full planted-mistake sweep and every PDF against every step, for every case, at the engine level and split by case so cases run in parallel.
* The page-behavior tests (saved progress, switching cases, warnings, layout at Chromebook zoom levels, startup failures, speed).
* The same tests in WebKit (Safari's engine) for the most important paths.
* An accessibility scan.
* Screenshots and reports saved with the run, to look at when something fails.
* The pull request cannot be merged until these pass.

**Release test (before a version goes live, partly automatic and partly by people).**

* The check-in test on the exact commit being released.
* Carter checks one step end to end on a managed Tax-Aide Chromebook and on a Mac with Safari.
* Carter approves any new hints and the guide changes.
* After the site updates, an automatic check opens the live site, confirms the new version number, and checks one PDF from each case.
* A weekly scheduled run of the full check-in test, to catch changes in Chrome or in the tools before a counselor does.

### Principles

* **Data, not code, describes a case.** Each case keeps a small description file (steps, the PDF for each step, the answer key, notes). The same tests run on every case without being rewritten.
* **Fail loudly.** Every test ends with a failure exit code when any check fails, so GitHub can block the merge. Nothing needs a read by eye.
* **The sweep is the safety net.** Any change to reading or to an answer key runs the sweep for that case in the developer test and for all cases at check-in.
* **Use what GitHub gives for free.** GitHub Actions (free for public repositories), required checks on `main`, deploying the site from Actions, Dependabot, and scheduled runs.
* **Keep people for what only people can judge:** real devices, hint wording, and the guide.

### Size at the peak (6 cases as large as Baylor)

| Item | Today | At 6 Baylor-size cases |
| --- | --- | --- |
| Checks (lines and notes) | 530 (Quinn 100, Baylor 430) | about 2,600 |
| Steps | 20 | about 90 |
| Planted mistakes in the sweep | 9,026 | about 42,000 |
| Sweep time on one machine | 17 s | about 2 minutes |
| Every PDF against every step, through the page | 2 min 19 s (Baylor) | about 14 minutes |
| Test PDFs (`cases/` and `tests/fixtures/`) | 23 (about 18 MB) | about 95 (about 85 MB) |

The slowest part is checking every PDF against every step through the page, because it grows with the square of the number of steps and drives the whole page each time. The same comparison can be done at the reading-engine level, the way the sweep works, in seconds per case. The page itself then only needs a few sample pairings per case.

## Part 3: Changes to make, in priority order

**Done after 0.14.0:** change 4. Each case has `cases/<case>/case.json`, and `cases_steps.js`, `cases_matrix.js`, `cases_switch.js`, and `mutate.js` run over every case listed. `baylor1.js` and `baylor2.js` are gone. The Quinn-only scripts that test page behavior (saved progress, What's new, startup, layout) stay as they are: they test the page, not a case. The expectations for case tests come from `case.json`, never from the page under test.

**Done in 0.14.0:** changes 1, 2, and the check half of 3 (`tests/check_index.js`). Still to do for 3: deploy the site from GitHub Actions once Pages is set to deploy from Actions. Also done: `main` is protected by a ruleset that requires the "tests" check, and releases are tagged and published by `.github/workflows/release.yml` after the tests pass.

| # | Change | Why | Size |
| --- | --- | --- | --- |
| 1 | **Make every test fail cleanly** (failure exit code), and turn the "read by eye" tables into checks. | GitHub can only block on tests that fail properly. Needed before anything automatic. | Small |
| 2 | **Run the tests on every pull request with GitHub Actions**, and make them required on `main` (branch protection). | Today nothing stops an untested change from going live. This is the biggest risk. | Small |
| 3 | **Build and deploy the site from GitHub Actions** instead of copying `index.html` by hand, or at least check that `index.html` matches the build. | Removes the chance that the live page differs from the tested source. | Small |
| 4 | **Describe each case in a data file** and make the tests run over every case listed. Replace `baylor1.js`, `baylor2.js`, and the Quinn-only scripts step by step. | Must be done before the third case, or each case adds new scripts. | Medium |
| 5 | **Keep the answer key import in the repository**: a script that reads the answer sheet table into the case file, plus a test that compares every key value to the correct PDF. | This is how Baylor's 281 values were checked. It should be repeatable for every case. | Medium |
| 6 | **Fast developer tier**: move the reading engine into its own file (still built into the one page), add Node unit tests, add `npm run dev-test` that tests only the changed case and prints one line per test. | Fast iteration and low token use. | Medium |
| 7 | **Check every PDF against every step at the engine level**, the way the sweep does, and keep only a few sample pairings through the page. Split check-in jobs by case. | The page-level version takes over 2 minutes for Baylor alone and about 14 minutes at 6 cases. The engine-level version takes seconds. | Medium |
| 8 | **Replace fixed waits** with waits on the page's own signals (the Check button's ready state is already one). | Faster and less flaky. | Small |
| 9 | **Static checks**: ESLint, an HTML check, the writing style rules (no em dashes or double hyphens), and a check that every message the guide quotes exists in the page. | Catches mistakes before a browser opens. | Small |
| 10 | **WebKit and accessibility in check-in**: Playwright's WebKit browser for the main paths and an axe accessibility scan. | Covers Safari users and the large-print, keyboard, and screen reader needs of older volunteers. | Small |
| 11 | **Live site check after each deploy, and a weekly scheduled run.** | Confirms the release reached the site and catches drift in Chrome or in the tools. | Small |
| 12 | **Dependabot** for pdf.js and Playwright, with the full tests on each update. | Keeps the tools current without surprises. | Small |
| 13 | **Saved progress from older versions**: keep a stored record from each released version and confirm the new page loads it. | Protects counselors' progress across releases as the storage grows. | Small |
| 14 | **New tax year check**: when TaxSlayer moves to a new year, run the answer key check and the sweep on one new PDF per form before updating cases. | Form layouts can move from year to year, which would break reading. | Small, once a year |

### What I need from you

* **No new paid tools are needed.** Everything above uses GitHub (Actions, branch protection, Pages, Dependabot) and free npm packages (Playwright, which we already use, plus ESLint, an HTML checker, and axe).
* **Three settings only you can change on GitHub:**
  1. Allow GitHub Actions for the repository (Settings, Actions), if it is not already on.
  2. Require the check-in tests to pass before merging into `main` (Settings, Branches or Rules).
  3. Set Pages to deploy from GitHub Actions (Settings, Pages, Source) when we reach change 3.
* **Workflow files:** the Claude GitHub connection may not be allowed to add files under `.github/workflows`. If a push is refused for that reason, you would add the file through the GitHub web page, the same way you upload releases today.
* **Testing on real Safari and real ChromeOS automatically** would need a paid device service such as BrowserStack. I do not recommend it now. WebKit in GitHub Actions plus your checks on a real Chromebook and Mac at release cover it well enough.
