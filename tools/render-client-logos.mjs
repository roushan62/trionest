#!/usr/bin/env node
/* Render the SVG client logos (and brand logo) to PNG previews for review.
   Output goes to tmp/logo-preview/ (gitignored). Requires: npm i (resvg-js). */
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src/assets/clients');
const OUT = join(ROOT, 'tmp/logo-preview');
mkdirSync(OUT, { recursive: true });

let n = 0;
for (const f of readdirSync(SRC).filter((x) => x.endsWith('.svg')).sort()) {
  const svg = readFileSync(join(SRC, f), 'utf8');
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 260 }, background: 'white' })
    .render()
    .asPng();
  writeFileSync(join(OUT, f.replace(/\.svg$/, '.png')), Buffer.from(png));
  n++;
}
console.log(`✓ rendered ${n} client logo previews → tmp/logo-preview/`);
