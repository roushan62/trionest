#!/usr/bin/env node
/**
 * Image optimization for the built site.
 * Optimizes JPG/PNG images using sharp (if available) or logs warnings.
 * 
 * Usage:
 *   npm run images
 *   node tools/optimize-images.mjs
 */
import { readdirSync, statSync, cpSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = fileURLToPath(import.meta.url);
const DIST_IMG = join(__dirname, '..', 'dist', 'assets', 'img');
const DIST_CLIENTS = join(__dirname, '..', 'dist', 'assets', 'clients');

function walk(dir) {
  const results = [];
  try {
    const items = readdirSync(dir);
    for (const item of items) {
      const fullPath = join(dir, item);
      if (statSync(fullPath).isDirectory()) {
        results.push(...walk(fullPath));
      } else {
        const ext = extname(fullPath).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  } catch (e) {
    // Directory doesn't exist yet
  }
  return results;
}

console.log('🖼️  Image optimization for Hostinger deployment\n');

const images = [...walk(DIST_IMG), ...walk(DIST_CLIENTS)];

if (images.length === 0) {
  console.log('No images found. Run the build first: npm run build');
  process.exit(0);
}

console.log(`Found ${images.length} images to optimize.\n`);

// Try using sharp if available
try {
  const sharp = (await import('sharp')).default;
  let optimized = 0;
  let savedBytes = 0;

  for (const img of images) {
    const before = statSync(img).size;
    const ext = extname(img).toLowerCase();

    try {
      if (ext === '.jpg' || ext === '.jpeg') {
        await sharp(img)
          .jpeg({ quality: 82, mozjpeg: true, progressive: true })
          .toFile(img + '.tmp');
      } else if (ext === '.png') {
        await sharp(img)
          .png({ quality: 80, compressionLevel: 9, progressive: true })
          .toFile(img + '.tmp');
      } else if (ext === '.webp') {
        await sharp(img)
          .webp({ quality: 80 })
          .toFile(img + '.tmp');
      }

      const after = statSync(img + '.tmp').size;
      if (after < before) {
        cpSync(img + '.tmp', img, { force: true });
        savedBytes += before - after;
        optimized++;
      }

      // Clean up temp file
      try { execSync(`rm "${img}.tmp"`); } catch {}
    } catch (e) {
      console.log(`  ⚠ Failed to optimize ${img}: ${e.message}`);
    }
  }

  console.log(`\n✓ Optimized ${optimized}/${images.length} images`);
  console.log(`  Saved: ${(savedBytes / 1024).toFixed(1)} KB`);
} catch (e) {
  console.log('⚠ Sharp not available. Install for image optimization:');
  console.log('  npm install sharp\n');
  console.log('Alternatively, optimize images manually using:');
  console.log('  - TinyPNG.com (online)');
  console.log('  - ImageOptim (macOS)');
  console.log('  - RIOT (Windows)');
  console.log('  - cwebp/libjpeg-turbo (CLI)');
}
