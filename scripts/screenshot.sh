#!/bin/bash
#
# Screenshot a URL to a PNG, for visually checking UI work.
#
#   scripts/screenshot.sh http://localhost:3100/ shot.png 1440 11000
#
# Notes learned the hard way:
#  - macOS ships no `timeout`, hence the manual watchdog below (it exits 127).
#  - `--force-prefers-reduced-motion` freezes entrance animations on their final
#    frame, so the hero capsule is captured drawn rather than mid-flight.
#  - `--virtual-time-budget` hangs on this app; wall-clock plus a kill is fine.
#
# shot.sh <url> <out.png> [width] [height]
# Headless Chrome, installed outside the repo with:
#   npx @puppeteer/browsers install chrome-headless-shell@stable
BIN="${CHROME_HEADLESS_SHELL:-$(ls "$HOME"/.cache/puppeteer/chrome-headless-shell/*/chrome-headless-shell-*/chrome-headless-shell 2>/dev/null | head -1)}"
if [ ! -x "$BIN" ]; then
  echo "chrome-headless-shell not found. Install it with:" >&2
  echo "  npx @puppeteer/browsers install chrome-headless-shell@stable" >&2
  exit 1
fi
URL="$1"; OUT="$2"; W="${3:-1440}"; H="${4:-1000}"
rm -f "$OUT"
"$BIN" --headless --disable-gpu --no-sandbox --hide-scrollbars --force-prefers-reduced-motion \
  --force-device-scale-factor=1 --window-size="$W,$H" \
  --default-background-color=00000000 \
  --screenshot="$OUT" --user-data-dir="$(mktemp -d)" "$URL" >/dev/null 2>&1 &
PID=$!
( sleep 25; kill -9 $PID 2>/dev/null ) 2>/dev/null &
WATCHER=$!
wait $PID 2>/dev/null
kill $WATCHER 2>/dev/null
[ -s "$OUT" ] && echo "ok $(wc -c < "$OUT") bytes -> $OUT" || echo "FAILED $OUT"
