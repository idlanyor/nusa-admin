#!/usr/bin/env bash
# Builds the GitHub Pages site: docs at <base>, demo at <base>demo/, plus a 404.html that routes deep links.
# Usage: BASE_PATH=/nusa-admin/ SITE_URL=https://user.github.io/nusa-admin/ scripts/build-pages.sh
set -euo pipefail
BASE_PATH="${BASE_PATH:-/}"
SITE_URL="${SITE_URL:-}"
OUT="${OUT:-site}"
rm -rf "$OUT"
BASE_PATH="${BASE_PATH}demo/" bun --filter demo build
BASE_PATH="$BASE_PATH" VITE_DEMO_URL="${SITE_URL}demo" bun --filter docs build
cp -r apps/docs/dist "$OUT"
cp -r apps/demo/dist "$OUT/demo"
cp brand/og-image.png "$OUT/og-image.png"
cat > "$OUT/404.html" <<HTML
<!doctype html>
<meta charset="utf-8">
<title>Redirecting…</title>
<script>
  // GitHub Pages has no SPA routing: send deep links to the right app (docs or demo) with the path in ?p.
  var base = '${BASE_PATH}'
  var path = location.pathname.indexOf(base) === 0 ? location.pathname.slice(base.length) : location.pathname.replace(/^\//, '')
  var inDemo = path === 'demo' || path.indexOf('demo/') === 0
  var app = inDemo ? base + 'demo/' : base
  var rest = inDemo ? path.replace(/^demo\/?/, '') : path
  var q = location.search.slice(1)
  location.replace(app + '?p=' + encodeURIComponent(rest) + (q ? '&q=' + encodeURIComponent(q) : '') + location.hash)
</script>
HTML
if [ -n "$SITE_URL" ]; then
  # Social preview for the docs home
  META="<meta property=\"og:title\" content=\"Nusa Admin\" /><meta property=\"og:description\" content=\"The Vue 3 admin template, compact and complete.\" /><meta property=\"og:image\" content=\"${SITE_URL}og-image.png\" /><meta property=\"og:url\" content=\"${SITE_URL}\" /><meta name=\"twitter:card\" content=\"summary_large_image\" />"
  sed -i "s#</head>#${META}</head>#" "$OUT/index.html"
fi
touch "$OUT/.nojekyll"
echo "Pages site → $OUT (base $BASE_PATH)"
