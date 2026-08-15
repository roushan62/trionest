#!/usr/bin/env bash
# Optimize all site photography in src/assets/img:
#   - cap width (hero 1920px, everything else 1408px)
#   - strip metadata, progressive JPEG, quality 82
#   - emit a WebP twin (quality 80) next to every JPG
# Idempotent: safe to re-run. Uses ImageMagick (`convert`).
set -euo pipefail
IMG_DIR="$(cd "$(dirname "$0")/../src/assets/img" && pwd)"

for f in "$IMG_DIR"/*.jpg; do
  base="$(basename "$f")"
  maxw=1408
  case "$base" in
    hero-*.jpg) maxw=1920 ;;
  esac
  convert "$f" -resize "${maxw}x>" -strip -interlace Plane -quality 82 "$f"
  convert "$f" -strip -quality 80 -define webp:method=6 "${f%.jpg}.webp"
  echo "  ok $base -> ${maxw}px max + webp"
done
echo "Done. JPEGs optimized and WebP twins generated in src/assets/img/"
