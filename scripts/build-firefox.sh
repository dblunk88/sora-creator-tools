#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT/dist/firefox"
ZIP_OUT="$ROOT/dist/sora-creator-tools-firefox.zip"
XPI_OUT="$ROOT/dist/sora-creator-tools-firefox.xpi"

rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

# Copy extension assets (keep this list explicit to avoid leaking repo-only files).
cp "$ROOT/api.js" "$OUT_DIR/api.js"
cp "$ROOT/background.js" "$OUT_DIR/background.js"
cp "$ROOT/content.js" "$OUT_DIR/content.js"
cp "$ROOT/dashboard.css" "$OUT_DIR/dashboard.css"
cp "$ROOT/dashboard.html" "$OUT_DIR/dashboard.html"
cp "$ROOT/dashboard.js" "$OUT_DIR/dashboard.js"
cp "$ROOT/inject.js" "$OUT_DIR/inject.js"
cp "$ROOT/theme.js" "$OUT_DIR/theme.js"

cp "$ROOT/manifest.firefox.json" "$OUT_DIR/manifest.json"

mkdir -p "$OUT_DIR/icons"
cp -R "$ROOT/icons/." "$OUT_DIR/icons"

pushd "$OUT_DIR" >/dev/null
rm -f "$ZIP_OUT" "$XPI_OUT"
zip -rq "$ZIP_OUT" .
cp "$ZIP_OUT" "$XPI_OUT"
popd >/dev/null

echo "Built:"
echo "  $ZIP_OUT"
echo "  $XPI_OUT"
