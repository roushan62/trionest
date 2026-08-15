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

/* GitHub Pages: don't run Jekyll over the output */
writeFileSync(join(DIST, '.nojekyll'), '');

/* Hostinger/Apache: pretty URLs, 404 page, light caching */
writeFileSync(
  join(DIST, '.htaccess'),
  `# TrioNest Spaces — Hostinger/Apache hosting config
# Performance optimised: compression, caching, security headers

# ---------- Error pages ----------
ErrorDocument 404 /404.html

# ---------- Prevent directory listing ----------
Options -Indexes

# ---------- Prevent access to hidden files ----------
<FilesMatch "^\\.">
  Order allow,deny
  Deny from all
</FilesMatch>
<FilesMatch "^\\.htaccess">
  Order allow,deny
  Deny from all
</FilesMatch>

# ---------- Pretty URLs ----------
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Force HTTPS (uncomment when SSL is active)
  # RewriteCond %{HTTPS} off
  # RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  # Force www (uncomment if needed)
  # RewriteCond %{HTTP_HOST} !^www\\. [NC]
  # RewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [L,R=301]

  # Serve /path as /path/index.html without a redirect loop
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME}/index.html -f
  RewriteRule ^(.*)$ /$1/index.html [L]

  # Remove trailing slash from non-directory URLs
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^(.*)/$ /$1 [L,R=301]
</IfModule>

# ---------- Gzip/Brotli compression ----------
<IfModule mod_deflate.c>
  # Compress HTML, CSS, JavaScript, SVG, JSON, XML
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/json
  AddOutputFilterByType DEFLATE application/xml
  AddOutputFilterByType DEFLATE text/xml
  AddOutputFilterByType DEFLATE image/svg+xml
  AddOutputFilterByType DEFLATE text/plain

  # Remove browser bugs
  BrowserMatch ^Mozilla/4 gzip-only-text/html
  BrowserMatch ^Mozilla/4\\.0[678] no-gzip
  BrowserMatch \\bMSIE !no-gzip !gzip-only-text/html
</IfModule>

# ---------- Browser caching ----------
<IfModule mod_expires.c>
  ExpiresActive On

  # HTML: short cache
  ExpiresByType text/html "access plus 1 hour"

  # CSS & JavaScript: long cache (hashed filenames would allow longer)
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType text/javascript "access plus 1 year"

  # Images: long cache
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType image/x-icon "access plus 1 year"
  ExpiresByType image/vnd.microsoft.icon "access plus 1 year"

  # Fonts: long cache
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType font/woff "access plus 1 year"
  ExpiresByType font/ttf "access plus 1 year"
  ExpiresByType application/font-woff2 "access plus 1 year"
  ExpiresByType application/font-woff "access plus 1 year"

  # XML and TXT
  ExpiresByType application/xml "access plus 1 week"
  ExpiresByType text/xml "access plus 1 week"
  ExpiresByType text/plain "access plus 1 week"
</IfModule>

# ---------- Cache-Control headers for static assets ----------
<IfModule mod_headers.c>
  <FilesMatch "\\.(css|js)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.(jpg|jpeg|png|gif|webp|svg|ico)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.(woff2|woff|ttf)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.(html|htm)$">
    Header set Cache-Control "public, max-age=3600, must-revalidate"
  </FilesMatch>

  # ---------- Security headers ----------
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Permissions-Policy "camera=(), microphone=(), geolocation=()"

  # Remove server signature
  Header unset X-Powered-By
  Header unset Server
</IfModule>

# ---------- Prevent MIME type sniffing ----------
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType text/css .css
  AddType image/svg+xml .svg
  AddType font/woff2 .woff2
  AddType font/woff .woff
</IfModule>

# ---------- Default charset ----------
AddDefaultCharset UTF-8

# ---------- Prevent hotlinking of images ----------
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTP_REFERER} !^$
  RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?trionest\\.in [NC]
  RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?localhost [NC]
  RewriteRule \\.(jpg|jpeg|png|gif|webp|svg)$ - [F,NC,L]
</IfModule>
`,
);

const count = (dir) =>
  readdirSync(dir).reduce(
    (n, f) => n + (statSync(join(dir, f)).isDirectory() ? count(join(dir, f)) : 1),
    0,
  );

console.log(`✓ built ${written.length} pages, ${count(DIST)} files → dist/`);
