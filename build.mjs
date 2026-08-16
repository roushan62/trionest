#!/usr/bin/env node
/**
 * Build the single canonical TrioNest website into dist/ for Vercel.
 * CSS and JavaScript filenames are content-hashed so production can never
 * display an older cached theme after a deployment.
 */
import { createHash } from 'node:crypto';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(ROOT, 'site');
const DIST = join(ROOT, 'dist');
const hash = (value) => createHash('sha256').update(value).digest('hex').slice(0, 10);

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(SOURCE, DIST, { recursive: true });

const css = readFileSync(join(DIST, 'css/style.css'), 'utf8');
const js = readFileSync(join(DIST, 'js/main.js'), 'utf8');
const cssName = `style.${hash(css)}.css`;
const jsName = `main.${hash(js)}.js`;

writeFileSync(join(DIST, 'css', cssName), css);
writeFileSync(join(DIST, 'js', jsName), js);
rmSync(join(DIST, 'css/style.css'));
rmSync(join(DIST, 'js/main.js'));

const walk = (dir) => readdirSync(dir).flatMap((name) => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path) : [path];
});

const htmlFiles = walk(DIST).filter((path) => path.endsWith('.html'));
for (const path of htmlFiles) {
  const html = readFileSync(path, 'utf8')
    .replaceAll('css/style.css', `css/${cssName}`)
    .replaceAll('js/main.js', `js/${jsName}`);
  writeFileSync(path, html);
}

// Fail the deployment rather than publish a page with a broken local asset/link.
const broken = [];
const localRef = /(?:href|src)=["']([^"']+)["']/g;
for (const path of htmlFiles) {
  const html = readFileSync(path, 'utf8');
  for (const [, raw] of html.matchAll(localRef)) {
    if (/^(?:https?:|mailto:|tel:|#|data:|javascript:)/.test(raw)) continue;
    const clean = raw.split(/[?#]/)[0];
    if (!clean) continue;
    const target = clean.startsWith('/')
      ? join(DIST, clean)
      : resolve(dirname(path), clean);
    if (!existsSync(target)) broken.push(`${relative(DIST, path)} → ${raw}`);
  }
}
if (broken.length) {
  console.error(`Broken local references:\n${broken.join('\n')}`);
  process.exit(1);
}

const outputFiles = walk(DIST);
console.log(`✓ TrioNest production build: ${htmlFiles.length} pages, ${outputFiles.length} files`);
console.log(`✓ Cache-safe assets: css/${cssName}, js/${jsName}`);
console.log('✓ All local links and assets verified');
