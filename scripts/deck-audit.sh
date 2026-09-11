#!/usr/bin/env bash
# Renders the deck headlessly and reports, per slide, how much of the page the
# content filled before auto-fit, the scale auto-fit chose, and the fill after.
#
#   make deck-audit                 # English, every slide
#   make deck-audit LOCALE=ko       # Korean
#   ONLY=title,why,contact make deck-audit
set -euo pipefail
LOCALE="${1:-en}"
PORT="${PORT:-8455}"
[ -d out ] || { echo "no out/ — run make build first" >&2; exit 1; }
python3 -m http.server "$PORT" --bind 127.0.0.1 --directory out >/dev/null 2>&1 &
srv=$!
trap 'kill $srv 2>/dev/null' EXIT
until curl -sfo /dev/null "http://localhost:$PORT/"; do sleep 0.2; done
url="http://localhost:$PORT/$LOCALE/deck/"
[ -n "${ONLY:-}" ] && url="$url?only=$ONLY"
google-chrome --headless --disable-gpu --no-sandbox --window-size=1440,1000 --virtual-time-budget=6000 --dump-dom "$url" 2>/dev/null \
| python3 "$(dirname "$0")/deck-audit.py"
