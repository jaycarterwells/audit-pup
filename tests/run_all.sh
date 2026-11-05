#!/usr/bin/env bash
# Runs every Audit Pup test against the current build. Build first: cd ../source && node build_html.js
# Read each section; lines starting with FAIL, "SOME CASES FAILED", "SWEEP FAILED", or page errors other than "none" need attention.
cd "$(dirname "$0")"
[ -f ../source/tax-aide-quinn-checker.html ] || { echo "No build found. Run: cd source && npm install && node build_html.js"; exit 1; }
bad=0
for t in verify2 verify3 verify4 verify5 verify7 verify8 verify9 verify10 verify11 repro2 verify6 baylor1 baylor2 mutate; do
  echo "================ $t"
  out=$(timeout 900 node "$t.js" 2>&1); code=$?
  if [ "$t" = mutate ]; then echo "$out" | tail -3; else echo "$out"; fi
  if [ $code -ne 0 ] || echo "$out" | grep -qE '^FAIL|SOME CASES FAILED|SWEEP FAILED|ERROR MESSAGE SHOWN'; then echo ">>> $t NEEDS ATTENTION"; bad=1; fi
done
echo; [ $bad -eq 0 ] && echo "ALL TEST SCRIPTS FINISHED WITHOUT A FAILURE FLAG (still read verify3/4/5/6 output by eye)" || echo "SOME TESTS NEED ATTENTION"
exit $bad
