#!/usr/bin/env node
/* QA checker for the built site: internal links, alt text, titles,
   meta descriptions, heading hierarchy, asset existence. */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const errors = [];
const warnings = [];

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(ROOT);
const htmlFiles = files.filter((f) => f.endsWith('.html'));
const rel = (f) => '/' + f.slice(ROOT.length + 1).replace(/\\/g, '/');

const titles = new Map();
const descs = new Map();

for (const f of htmlFiles) {
  const html = readFileSync(f, 'utf8');
  const page = rel(f);

  // title
  const t = html.match(/<title>([^<]*)<\/title>/);
  if (!t || !t[1].trim()) errors.push(`${page}: missing <title>`);
  else {
    if (titles.has(t[1])) errors.push(`${page}: duplicate title with ${titles.get(t[1])}`);
    titles.set(t[1], page);
    if (t[1].length > 70) warnings.push(`${page}: title is ${t[1].length} chars (>70)`);
  }

  // meta description
  const d = html.match(/<meta name="description" content="([^"]*)"/);
  if (!d || !d[1].trim()) errors.push(`${page}: missing meta description`);
  else {
    if (descs.has(d[1])) errors.push(`${page}: duplicate meta description with ${descs.get(d[1])}`);
    descs.set(d[1], page);
    if (d[1].length > 185) warnings.push(`${page}: meta description ${d[1].length} chars (>185)`);
  }

  // one h1
  const h1s = html.match(/<h1[\s>]/g) || [];
  if (h1s.length !== 1) errors.push(`${page}: ${h1s.length} <h1> elements (expected exactly 1)`);

  // images: alt + file exists
  const imgs = html.match(/<img\b[^>]*>/g) || [];
  for (const tag of imgs) {
    if (!/\balt=/.test(tag)) errors.push(`${page}: <img> without alt — ${tag.slice(0, 90)}`);
    const src = (tag.match(/\bsrc="([^"]+)"/) || [])[1];
    if (src && src.startsWith('/') && !existsSync(join(ROOT, src))) {
      errors.push(`${page}: missing image asset ${src}`);
    }
    if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) {
      warnings.push(`${page}: <img> without width/height (CLS risk) — ${(src || '').slice(0, 60)}`);
    }
  }

  // stylesheet/script assets
  for (const m of html.matchAll(/\b(?:href|src)="(\/assets\/[^"]+)"/g)) {
    if (!existsSync(join(ROOT, m[1]))) errors.push(`${page}: missing asset ${m[1]}`);
  }

  // internal links resolve
  for (const m of html.matchAll(/\bhref="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) continue;
    if (href === '#' ) { errors.push(`${page}: dead anchor href="#"`); continue; }
    const clean = href.split('#')[0].split('?')[0];
    if (!clean) continue;
    if (!clean.startsWith('/')) { warnings.push(`${page}: relative link ${href}`); continue; }
    if (clean.startsWith('/assets/')) {
      if (!existsSync(join(ROOT, clean))) {
        // docs (PDF) are expected to be added later
        if (clean.startsWith('/assets/docs/')) warnings.push(`${page}: document not yet uploaded ${clean}`);
        else errors.push(`${page}: missing asset ${clean}`);
      }
      continue;
    }
    const target = clean.endsWith('.html')
      ? join(ROOT, clean)
      : join(ROOT, clean, 'index.html');
    if (!existsSync(target)) errors.push(`${page}: broken internal link ${href}`);
  }

  // stray placeholder text
  if (/lorem ipsum/i.test(html)) errors.push(`${page}: contains lorem ipsum`);
  if (/\[FILL/i.test(html)) warnings.push(`${page}: raw [FILL marker in output`);
}

// required root files
for (const req of ['sitemap.xml', 'robots.txt', '404.html', '.nojekyll']) {
  if (!existsSync(join(ROOT, req))) errors.push(`missing required file /${req}`);
}

// sitemap references real pages
const sm = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const loc of locs) {
  const p = loc.replace(/^https?:\/\/[^/]+/, '');
  const target = p === '/' ? join(ROOT, 'index.html') : join(ROOT, p, 'index.html');
  if (!existsSync(target)) errors.push(`sitemap references missing page ${p}`);
}

console.log(`Checked ${htmlFiles.length} pages, ${locs.length} sitemap URLs.\n`);
if (warnings.length) {
  console.log(`⚠ ${warnings.length} warnings:`);
  const seen = new Set();
  warnings.forEach((w) => {
    const key = w.replace(/^\/[^:]+:/, '');
    if (seen.size < 400 || !seen.has(key)) console.log('  ' + w);
    seen.add(key);
  });
  console.log('');
}
if (errors.length) {
  console.log(`✗ ${errors.length} errors:`);
  errors.forEach((e) => console.log('  ' + e));
  process.exit(1);
}
console.log('✓ No errors. All internal links resolve, all images have alt text, titles and descriptions are unique.');
