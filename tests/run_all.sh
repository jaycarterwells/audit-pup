#!/usr/bin/env bash
# Runs every Audit Pup test against the current build. Build first: cd ../source && node build_html.js
# Each script ends with a failure exit code when any of its checks fails; this script fails if any script does.
# Output is one line per script; the full output of a script is shown only when it fails.
cd "$(dirname "$0")"
[ -f ../source/tax-aide-quinn-checker.html ] || { echo "No build found. Run: cd source && npm install && node build_html.js"; exit 1; }
mkdir -p output
bad=0
for t in verify2 verify3 verify4 verify5 verify7 verify8 verify9 verify10 verify11 repro2 verify6 unit_engine engine_parity engine_cases engine_sweep cases_steps cases_switch cases_matrix; do
  start=$SECONDS
  timeout 900 node "$t.js" > "output/$t.log" 2>&1; code=$?
  if [ $code -ne 0 ] || grep -qE '^FAIL|SOME CASES FAILED|SWEEP FAILED|ERROR MESSAGE SHOWN' "output/$t.log"; then
    echo "FAIL $t ($((SECONDS-start)) s)"; sed 's/^/    /' "output/$t.log"; bad=1
  else
    echo "ok   $t ($((SECONDS-start)) s)$(grep -m1 "^SWEEP:" "output/$t.log" | sed "s/^/ | /")"
  fi
done
echo; [ $bad -eq 0 ] && echo "ALL TESTS PASSED" || echo "SOME TESTS FAILED"
exit $bad
