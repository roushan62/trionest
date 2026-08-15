#!/usr/bin/env node
/**
 * TrioNest Spaces — static site build.
 * Outputs plain HTML/CSS/JS to /dist. No runtime server, no framework.
 * Deploy: GitHub Pages (dist/) or upload dist/* to Hostinger public_html.
 */
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site } from './src/data/site.mjs';
import { services } from './src/data/services.mjs';
import { industries } from './src/data/industries.mjs';
import { projects } from './src/data/projects.mjs';
import { posts } from './src/data/blog.mjs';

import home from './src/pages/home.mjs';
import { about, process as processPage, qualitySafety, certifications, team, clients, companyProfile, careers } from './src/pages/company.mjs';
import { servicesIndex, servicePage } from './src/pages/services.mjs';
import { industriesIndex, industryPage } from './src/pages/industries.mjs';
import { projectsIndex, projectPage } from './src/pages/projects.mjs';
import { blogIndex, blogPost, contact, privacy, terms, notFound } from './src/pages/misc.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

const written = [];

function write(routePath, html) {
  // '/' -> index.html ; '/about/' -> about/index.html ; '/404.html' -> 404.html
  let rel;
  if (routePath === '/') rel = 'index.html';
  else if (routePath.endsWith('.html')) rel = routePath.replace(/^\//, '');
  else rel = routePath.replace(/^\//, '').replace(/\/$/, '') + '/index.html';
  const out = join(DIST, rel);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  written.push(routePath);
}

/* ---------------------------------------------------------------- pages */
write('/', home);
write('/about/', about);
write('/services/', servicesIndex);
services.forEach((s) => write(`/services/${s.slug}/`, servicePage(s)));
write('/industries/', industriesIndex);
industries.forEach((i) => write(`/industries/${i.slug}/`, industryPage(i)));
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

/* ---------------------------------------------------------------- sitemap */
const today = new Date().toISOString().slice(0, 10);
const priority = (p) =>
  p === '/' ? '1.0' : /^\/(services|projects|industries|contact)\/$/.test(p) ? '0.9' : p.split('/').filter(Boolean).length > 1 ? '0.7' : '0.8';

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
<urlset xmlns="http://www.w3.org/1999/xhtml/sitemap/0.9" xmlns:x="x">
</urlset>`.replace(
    /<urlset[\s\S]*<\/urlset>/,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
  ),
);

writeFileSync(
  join(DIST, 'robots.txt'),
  `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`,
);

/* GitHub Pages: don't run Jekyll over the output */
writeFileSync(join(DIST, '.nojekyll'), '');

/* Hostinger/Apache: pretty URLs, 404 page, light caching */
writeFileSync(
  join(DIST, '.htaccess'),
  `# TrioNest Spaces — static hosting config (Apache / Hostinger)
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  # Serve /path as /path/index.html without a redirect loop
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.*)$ /$1/index.html [L]
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/json
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/html "access plus 1 hour"
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
`,
);

const count = (dir) =>
  readdirSync(dir).reduce(
    (n, f) => n + (statSync(join(dir, f)).isDirectory() ? count(join(dir, f)) : 1),
    0,
  );

console.log(`✓ built ${written.length} pages, ${count(DIST)} files → dist/`);
