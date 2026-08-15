#!/usr/bin/env bash
# Import real client logos (downloaded via image search) into src/assets/clients/.
# Normalises: trim → auto-orient → white-on-transparent detection (invert) →
# contain 240x110 → pad 250x120 → WebP.
#
# Rules:
#  - Opaque (white-background) logos are kept as-is (shown on white cards).
#  - Transparent logos that are near-white when composited on black are
#    "dark-background versions" → inverted to a dark version for light sites.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=image-search
DST=src/assets/clients
mkdir -p "$DST/.tmp"

# key|source file
map=(
  "client_yesbank|yes-bank-official-logo-png-transparent-b-1.png"
  "client_lntfinance|l-t-finance-holdings-logo-2.webp"
  "centrum|centrum-group-centrum-wealth-logo-png-1.png"
  "client_centricity|centricity-wealth-management-india-logo-2.png"
  "concentrix|concentrix-official-logo-png-2.png"
  "client_teleperformance|teleperformance-official-logo-png-1.png"
  "epam|epam-systems-official-logo-png-transpare-2.png"
  "client_avaya|avaya-official-logo-png-transparent-1.png"
  "client_anaptyss|anaptyss-logo-png-1.webp"
  "klearnow|klearnow-supply-chain-startup-logo-2.jpg"
  "novo|novo-bank-fintech-logo-png-1.png"
  "client_cars24|cars24-official-logo-png-transparent-1.png"
  "client_indianoil|indian-oil-corporation-logo-png-transpar-2.png"
  "client_panasonic|panasonic-logo-png-transparent-512-1.png"
  "client_marelli|marelli-logo-png-2.png"
  "client_dalmia|dalmia-bharat-cement-logo-png-1.jpg"
  "induslaw|induslaw-law-firm-logo-2.jpg"
  "trilegal|trilegal-logo-official-law-firm-1.png"
  "client_cbre|cbre-official-logo-transparent-png-2.png"
  "client_cushman|cushman-wakefield-official-logo-transpar-1.png"
  "client_gshospital|gs-hospital-logo-ghaziabad-delhi-1.png"
)

for entry in "${map[@]}"; do
  key="${entry%%|*}"
  src="${entry#*|}"
  in="$SRC/$src"
  tmp="$DST/.tmp/$key.png"
  out="$DST/$key.webp"
  [ -f "$in" ] || { echo "!! missing $in"; continue; }

  opaque=$(identify -format "%[opaque]" "$in" 2>/dev/null)
  inv="0"
  if [ "$opaque" = "false" ]; then
    # mean luminance of the logo composited on black
    lum=$(convert "$in" -background black -flatten -colorspace Gray -format "%[fx:mean]" info: 2>/dev/null)
    inv=$(awk -v l="$lum" 'BEGIN{ if (l+0 > 0.55) print "1"; else print "0" }')
    echo "$key <- $src  (transparent, black-comp lum=$lum)"
  else
    echo "$key <- $src  (opaque — keep colours)"
  fi

  ops=(-auto-orient -trim +repage)
  if [ "$inv" = "1" ]; then
    echo "   -> white-version detected, inverting"
    ops+=(-channel RGB -negate +channel)
  fi

  convert "$in" "${ops[@]}" \
    -resize 240x110 \
    -background none -gravity center -extent 250x120 \
    "$tmp"

  if [ "$opaque" = "true" ]; then
    convert "$tmp" -background white -flatten -quality 92 -strip "$out"
  else
    convert "$tmp" -quality 92 -strip "$out"
  fi
  echo "   -> $out"
done

rm -rf "$DST/.tmp"
echo "done."
