#!/usr/bin/env bash
# Developer test: the fast checks to run on every code change (about a minute). One line per check; a check's full
# output is shown only when it fails. GitHub runs the full suite (run_all.sh) on every pull request.
#
#   bash tests/dev_test.sh              all cases
#   bash tests/dev_test.sh baylor       case checks for Baylor only (engine, sweep, steps), the rest as usual
#
# What it covers: the build, the engine unit tests, the index.html rule, each answer key against its sheet (when
# LibreOffice is installed), every case's answer key, steps, and printouts at engine level, the planted-mistake
# sweep, and each step's own PDF through the page (answer key notes included).
cd "$(dirname "$0")/.."
mkdir -p tests/output
CASEARGS=""; [ $# -gt 0 ] && CASEARGS="--case $*"
bad=0
run(){ local name=$1; shift; local start=$SECONDS
  if "$@" > "tests/output/$name.log" 2>&1 && ! grep -qE '^FAIL|SWEEP FAILED' "tests/output/$name.log"; then
    echo "ok   $name ($((SECONDS-start)) s)$(grep -m1 -E '^SWEEP:|engine unit tests run' "tests/output/$name.log" | sed 's/^/ | /')"
  else echo "FAIL $name ($((SECONDS-start)) s)"; sed 's/^/    /' "tests/output/$name.log"; bad=1; fi; }
run build bash -c 'cd source && node build_html.js'
run unit_engine node tests/unit_engine.js
run check_index node tests/check_index.js
if command -v soffice >/dev/null; then
  for d in cases/*/; do c=$(basename "$d"); [ -n "$CASEARGS" ] && [[ " $* " != *" $c "* ]] && continue
    [ -f "$d/answer_key.json" ] || continue
    sheet=$(ls "$d"answer_sheet.* 2>/dev/null | head -1); out="tests/output/sheet-$c"; rm -rf "$out"; mkdir -p "$out"
    run "answer_sheet_$c" bash -c "timeout 120 soffice --headless --convert-to html --outdir '$out' '$sheet' >/dev/null 2>&1 && node source/tools/import_answer_sheet.js '$c' '$out/answer_sheet.html' --check"
  done
fi
run engine_cases node tests/engine_cases.js $CASEARGS
run engine_sweep node tests/engine_sweep.js $CASEARGS
run cases_steps node tests/cases_steps.js $CASEARGS
echo; [ $bad -eq 0 ] && echo "DEVELOPER TEST PASSED" || echo "DEVELOPER TEST FAILED"
exit $bad
