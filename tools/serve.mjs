#!/usr/bin/env node
/* Minimal static server for local preview of dist/. Mirrors Hostinger behaviour:
   /path/ -> /path/index.html, unknown -> 404.html */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = process.env.PORT || 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
};

async function resolve(urlPath) {
  let p = decodeURIComponent(urlPath.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let file = join(ROOT, p);
  try {
    const s = await stat(file);
    if (s.isDirectory()) file = join(file, 'index.html');
    return file;
  } catch {
    try {
      const alt = join(ROOT, p, 'index.html');
      await stat(alt);
      return alt;
    } catch {
      return null;
    }
  }
}

createServer(async (req, res) => {
  // The local preview is deliberately static and must never expose PHP source or
  // pretend that an email was sent. Hostinger executes this endpoint in production.
  if (req.url.split('?')[0] === '/send-mail.php') {
    res.writeHead(501, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
    return res.end(JSON.stringify({
      ok: false,
      message: 'Email delivery is available after deployment to the PHP-enabled Hostinger server. Please email spaces@trionest.in while using this local preview.',
    }));
  }

  const file = await resolve(req.url);
  if (!file) {
    const nf = join(ROOT, '404.html');
    try {
      const body = await readFile(nf);
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(body);
    } catch {
      res.writeHead(404);
      return res.end('Not found');
    }
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': TYPES[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(body);
  } catch (e) {
    res.writeHead(500);
    res.end('Server error');
  }
}).listen(PORT, '0.0.0.0', () => {
  console.log(`TrioNest static preview → http://0.0.0.0:${PORT}`);
});
