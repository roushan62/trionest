#!/usr/bin/env node
/**
 * TrioNest Spaces — static site build.
 * Outputs plain HTML/CSS/JS to /dist. No runtime server, no framework.
 * Deploy: push to `main` — Vercel builds this script and serves dist/.
 * CSS and JS are content-hashed (style.<hash>.css, main.<hash>.js) so the
 * 1-year immutable cache never serves a stale stylesheet after a deploy.
 */
import { mkdirSync, writeFileSync, readFileSync, cpSync, rmSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from './src/data/site.mjs';
import { services } from './src/data/services.mjs';
import { industries } from './src/data/industries.mjs';
import { projects } from './src/data/projects.mjs';
import { posts } from './src/data/blog.mjs';
import { locations } from './src/data/locations.mjs';

import home from './src/pages/home.mjs';
import { about, process as processPage, qualitySafety, certifications, team, clients, companyProfile, careers } from './src/pages/company.mjs';
import { servicesIndex, servicePage } from './src/pages/services.mjs';
import { industriesIndex, industryPage } from './src/pages/industries.mjs';
import { projectsIndex, projectPage } from './src/pages/projects.mjs';
import { blogIndex, blogPost, contact, privacy, terms, notFound } from './src/pages/misc.mjs';
import { locationsIndex, locationPage } from './src/pages/locations.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

const written = [];

/* ---------- simple HTML minifier (no external deps) ---------- */
function minifyHTML(html) {
  return html
    // Remove HTML comments (but keep conditional comments)
    .replace(/<!--(?!\[if).*?-->/gs, '')
    // Collapse whitespace between tags
    .replace(/>\s+</g, '><')
    // Remove extra whitespace
    .replace(/\s{2,}/g, ' ')
    // Remove whitespace around tags
    .replace(/\s*(<\/?(?:div|section|article|header|footer|main|nav|ul|ol|li|p|head|body|html)[^>]*>)\s*/g, '$1')
    .trim();
}

function write(routePath, html) {
  // '/' -> index.html ; '/about/' -> about/index.html ; '/404.html' -> 404.html
  let rel;
  if (routePath === '/') rel = 'index.html';
  else if (routePath.endsWith('.html')) rel = routePath.replace(/^\//, '');
  else rel = routePath.replace(/^\//, '').replace(/\/$/, '') + '/index.html';
  const out = join(DIST, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, minifyHTML(html));
  written.push(routePath);
}

/* ---------------------------------------------------------------- pages */
write('/', home);
write('/about/', about);
write('/services/', servicesIndex);
services.forEach((s) => write(`/services/${s.slug}/`, servicePage(s)));
write('/industries/', industriesIndex);
industries.forEach((i) => write(`/industries/${i.slug}/`, industryPage(i)));
write('/locations/', locationsIndex);
locations.forEach((l) => write(`/locations/${l.slug}/`, locationPage(l)));
write('/projects/', projectsIndex);
projects.forEach((p) => write(`/projects/${p.slug}/`, projectPage(p, projects)));
write('/process/', processPage);
write('/quality-safety/', qualitySafety);
write('/certifications/', certifications);
write('/team/', team);
write('/clients/', clients);
write('/company-profile/', companyProfile);
write('/careers/', careers);
write('/blog/', blogIndex);
posts.forEach((p) => write(`/blog/${p.slug}/`, blogPost(p, posts)));
write('/contact/', contact);
write('/privacy-policy/', privacy);
write('/terms/', terms);
write('/404.html', notFound);

/* ---------------------------------------------------------------- assets */
cpSync(join(__dirname, 'src/assets'), join(DIST, 'assets'), { recursive: true });

/* Minify the stylesheet in dist only — the src copy stays human-readable */
function minifyCSS(css) {
  return css
    .replace(/\/\*[^]*?\*\//g, '') // block comments
    .replace(/\s+/g, ' ') // collapse whitespace
    .replace(/\s*([{}:;,>])\s*/g, '$1') // structural chars
    .replace(/;}/g, '}')
    .trim();
}

/* Content hash: each deploy gets fresh filenames, so the `immutable` cache
   header in vercel.json can never serve yesterday's CSS/JS. */
const digest = (str) => createHash('sha256').update(str).digest('hex').slice(0, 10);
const cssKb = (b) => (b / 1024).toFixed(1) + 'KB';

const cssSrc = readFileSync(join(DIST, 'assets/css/style.css'), 'utf8');
const cssFile = `style.${digest(minifyCSS(cssSrc))}.css`;
writeFileSync(join(DIST, 'assets/css', cssFile), minifyCSS(cssSrc));
rmSync(join(DIST, 'assets/css/style.css'));
console.log(`✓ css minified ${cssKb(Buffer.byteLength(cssSrc))} → ${cssKb(statSync(join(DIST, 'assets/css', cssFile)).size)} → ${cssFile}`);

const jsSrc = readFileSync(join(DIST, 'assets/js/main.js'), 'utf8');
const jsFile = `main.${digest(jsSrc)}.js`;
writeFileSync(join(DIST, 'assets/js', jsFile), jsSrc);
rmSync(join(DIST, 'assets/js/main.js'));

/* Point every generated page at the hashed CSS/JS files */
function rewritePages(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) rewritePages(p);
    else if (f.endsWith('.html')) {
      const html = readFileSync(p, 'utf8');
      writeFileSync(
        p,
        html
          .replaceAll('/assets/css/style.css', `/assets/css/${cssFile}`)
          .replaceAll('/assets/js/main.js', `/assets/js/${jsFile}`),
      );
    }
  }
}
rewritePages(DIST);
console.log(`✓ assets fingerprinted: ${cssFile}, ${jsFile}`);

/* ---------------------------------------------------------------- sitemap */
const today = new Date().toISOString().slice(0, 10);
const priority = (p) =>
  p === '/'
    ? '1.0'
    : /^\/(services|projects|industries|contact|locations)\/$/.test(p)
      ? '0.9'
      : /^\/locations\/[^/]+\/$/.test(p)
        ? '0.8'
        : p.split('/').filter(Boolean).length > 1
          ? '0.7'
          : '0.8';

const urls = written
  .filter((p) => !p.endsWith('.html'))
  .map(
    (p) => `  <url>
    <loc>${site.url}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority(p)}</priority>
  </url>`,
  )
  .join('\n');

writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`,
);

writeFileSync(
  join(DIST, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`,
);

const count = (dir) =>
  readdirSync(dir).reduce(
    (n, f) => n + (statSync(join(dir, f)).isDirectory() ? count(join(dir, f)) : 1),
    0,
  );

console.log(`✓ built ${written.length} pages, ${count(DIST)} files → dist/`);
