#!/usr/bin/env node
/* Deep DOM audit of the built site.
   Loads every page in jsdom, boots main.js and checks for the classes of bug
   that break real browsers: duplicate ids, unlabelled controls, broken ARIA
   wiring, nav/drawer regressions, fixed-size inline styles, unclosed tags. */
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM, VirtualConsole } from 'jsdom';

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

const htmlFiles = walk(ROOT).filter((f) => f.endsWith('.html'));
const js = readFileSync(join(ROOT, 'assets/js/main.js'), 'utf8');
const rel = (f) => '/' + f.slice(ROOT.length + 1).replace(/\\/g, '/');

function makeDom(html, url) {
  const vc = new VirtualConsole();
  const jsErrors = [];
  vc.on('jsdomError', (e) => jsErrors.push(e.message));
  const dom = new JSDOM(html, { url, runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc });
  const w = dom.window;
  w.matchMedia = (q) => ({
    matches: /min-width:\s*(\d+)/.test(q) ? Number(RegExp.$1) <= 1280 : false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  });
  w.IntersectionObserver = class {
    constructor(cb) { this.cb = cb; }
    observe(el) { this.cb([{ isIntersecting: true, target: el }], this); }
    unobserve() {}
    disconnect() {}
  };
  w.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
  w.scrollTo = () => {};
  return { dom, w, jsErrors };
}

for (const file of htmlFiles) {
  const page = rel(file);
  const html = readFileSync(file, 'utf8');
  const { w, jsErrors } = makeDom(html, 'https://trionest.in' + page.replace(/index\.html$/, ''));

  try { w.eval(js); } catch (e) { errors.push(`${page}: main.js threw — ${e.message}`); }
  const d = w.document;

  /* ---- duplicate ids ---- */
  const ids = new Map();
  d.querySelectorAll('[id]').forEach((el) => {
    const id = el.id;
    ids.set(id, (ids.get(id) || 0) + 1);
  });
  for (const [id, n] of ids) if (n > 1) errors.push(`${page}: duplicate id "${id}" (${n}×)`);

  /* ---- aria-controls must resolve ---- */
  d.querySelectorAll('[aria-controls]').forEach((el) => {
    const target = el.getAttribute('aria-controls');
    if (!d.getElementById(target)) errors.push(`${page}: aria-controls="${target}" has no matching element`);
  });

  /* ---- labelled controls ---- */
  d.querySelectorAll('input, select, textarea').forEach((el) => {
    if (el.type === 'hidden') return;
    const labelled =
      (el.id && d.querySelector(`label[for="${el.id}"]`)) ||
      el.closest('label') ||
      el.getAttribute('aria-label') ||
      el.getAttribute('aria-labelledby');
    if (!labelled) errors.push(`${page}: <${el.tagName.toLowerCase()} name="${el.name}"> has no label`);
  });

  d.querySelectorAll('button').forEach((b) => {
    if (!b.textContent.trim() && !b.getAttribute('aria-label')) {
      errors.push(`${page}: <button> with no accessible name`);
    }
  });

  d.querySelectorAll('a[href]').forEach((a) => {
    if (!a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img[alt]:not([alt=""])')) {
      errors.push(`${page}: <a href="${a.getAttribute('href')}"> with no accessible name`);
    }
    if (a.getAttribute('target') === '_blank' && !/noopener/.test(a.getAttribute('rel') || '')) {
      warnings.push(`${page}: target=_blank without rel=noopener → ${a.getAttribute('href')}`);
    }
  });

  /* ---- header + drawer structure ---- */
  const head = d.getElementById('head');
  if (!head) errors.push(`${page}: no #head`);
  const drawer = d.getElementById('mobile-nav');
  const burger = d.querySelector('.burger');
  if (!drawer) errors.push(`${page}: mobile drawer missing`);
  if (!burger) errors.push(`${page}: burger missing`);
  if (drawer && head && head.contains(drawer)) {
    errors.push(`${page}: drawer is nested inside .head (backdrop-filter will clip it)`);
  }

  /* ---- drawer interaction ---- */
  if (drawer && burger) {
    burger.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    if (!drawer.classList.contains('is-open')) errors.push(`${page}: burger click did not open the drawer`);
    if (burger.getAttribute('aria-expanded') !== 'true') errors.push(`${page}: burger aria-expanded not set on open`);
    if (!d.body.classList.contains('nav-open')) errors.push(`${page}: body.nav-open not set on open`);

    const sub = drawer.querySelector('.mnav__toggle');
    if (sub) {
      const panel = d.getElementById(sub.getAttribute('aria-controls'));
      const before = sub.getAttribute('aria-expanded');
      sub.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
      if (sub.getAttribute('aria-expanded') === before) errors.push(`${page}: drawer submenu toggle did nothing`);
      if (panel && panel.hasAttribute('hidden') === (sub.getAttribute('aria-expanded') === 'true')) {
        errors.push(`${page}: drawer submenu hidden state out of sync`);
      }
      if (drawer.classList.contains('is-open') === false) {
        errors.push(`${page}: submenu toggle closed the whole drawer`);
      }
    }

    const link = drawer.querySelector('.mnav__link[href], .msub__link');
    if (link) {
      link.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
      if (drawer.classList.contains('is-open')) errors.push(`${page}: navigating from the drawer left it open`);
    }

    burger.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    burger.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
    if (drawer.classList.contains('is-open')) errors.push(`${page}: burger toggle did not close the drawer`);
    if (d.body.classList.contains('nav-open')) errors.push(`${page}: body.nav-open stuck after close`);
  }

  /* ---- every nav entry present ---- */
  const desktopLinks = d.querySelectorAll('.nav__list .nav__link').length;
  if (desktopLinks < 7) errors.push(`${page}: desktop nav renders only ${desktopLinks} top-level entries`);
  const mobileLinks = d.querySelectorAll('.mnav .mnav__link').length;
  if (mobileLinks < 7) errors.push(`${page}: mobile nav renders only ${mobileLinks} top-level entries`);
  d.querySelectorAll('.nav__item--has-sub').forEach((item) => {
    const t = item.querySelector('.nav__toggle');
    const panel = item.querySelector('.subnav');
    if (!t || !panel) errors.push(`${page}: dropdown item missing toggle or panel`);
    if (panel && !panel.querySelectorAll('.subnav__link').length) {
      errors.push(`${page}: dropdown "${t && t.textContent.trim()}" renders no links`);
    }
  });

  /* ---- headings ---- */
  const h1s = d.querySelectorAll('h1');
  if (h1s.length !== 1) errors.push(`${page}: ${h1s.length} <h1> elements`);

  /* ---- fixed pixel widths in inline styles (mobile overflow risk) ---- */
  d.querySelectorAll('[style]').forEach((el) => {
    const st = el.getAttribute('style');
    if (/(^|[^-])width:\s*\d{3,}px/.test(st)) warnings.push(`${page}: inline fixed width → ${st}`);
    if (/grid-template-columns:\s*inherit/.test(st)) errors.push(`${page}: grid-template-columns:inherit hack still present`);
  });

  /* ---- images ---- */
  d.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('alt')) errors.push(`${page}: <img src="${img.getAttribute('src')}"> without alt`);
    const eager = img.getAttribute('fetchpriority') === 'high';
    if (!eager && img.getAttribute('loading') !== 'lazy') {
      warnings.push(`${page}: img not lazy → ${img.getAttribute('src')}`);
    }
  });

  /* ---- iframes ---- */
  d.querySelectorAll('iframe').forEach((f) => {
    if (!f.getAttribute('title')) errors.push(`${page}: <iframe> without title`);
    if (f.getAttribute('loading') !== 'lazy') warnings.push(`${page}: iframe not lazy-loaded`);
  });

  /* ---- viewport meta must allow zoom ---- */
  const vp = d.querySelector('meta[name="viewport"]');
  if (!vp) errors.push(`${page}: no viewport meta`);
  else if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/.test(vp.content)) {
    errors.push(`${page}: viewport blocks pinch-zoom`);
  }

  /* ---- JSON-LD parses ---- */
  d.querySelectorAll('script[type="application/ld+json"]').forEach((s, i) => {
    try { JSON.parse(s.textContent); } catch (e) { errors.push(`${page}: JSON-LD block ${i + 1} is invalid — ${e.message}`); }
  });

  /* ---- runtime errors ---- */
  jsErrors.forEach((e) => errors.push(`${page}: runtime error — ${e.split('\n')[0]}`));
}

/* ============================================================================
   Static CSS audit — the responsive rules that cause "formatting breaks on
   phone / desktop" symptoms cannot be caught by jsdom (no layout engine), so
   they are asserted against the stylesheet source instead.
   ========================================================================== */
const css = readFileSync(join(ROOT, 'assets/css/style.css'), 'utf8');

const cssChecks = [
  ['balanced braces', (css.match(/{/g) || []).length === (css.match(/}/g) || []).length],
  ['header does not clip the drawer (no contain on .head)', !/\.head\{[^}]*contain:/.test(css)],
  ['body does not use overflow-x:hidden alone (breaks sticky)', /overflow-x:clip/.test(css)],
  ['[hidden] wins over display rules', /\[hidden\]\{display:none ?!important\}/.test(css)],
  ['drawer is fixed and full height', /\.drawer\{position:fixed;inset:0/.test(css)],
  ['no fixed-column grid without minmax on cards', !/\.(pgrid|grid--[234]|steps|offices__grid)\{[^}]*grid-template-columns:repeat\(\d+,1fr\)/.test(css)],
  ['scroll-padding-top set for sticky-header anchors', /scroll-padding-top/.test(css)],
  ['touch targets >= 44px on nav', /\.mnav__link\{[^}]*min-height:48px/.test(css)],
  ['inputs are 16px on mobile (no iOS zoom)', /@media \(max-width:900px\)\{\.field select,\.field input,\.field textarea\{font-size:1rem\}\}/.test(css)],
  ['reduced-motion honoured', /prefers-reduced-motion/.test(css)],
  ['safe-area insets used for floating buttons', /env\(safe-area-inset-bottom/.test(css)],
  ['print styles hide the drawer', /@media print\{[^}]*\.drawer/.test(css)],
];

for (const [label, pass] of cssChecks) {
  if (!pass) errors.push(`stylesheet: ${label} — FAILED`);
}

/* Any remaining inline style attribute in the built HTML is a formatting risk */
let inlineStyles = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const matches = html.match(/ style="[^"]*"/g) || [];
  for (const m of matches) {
    if (/--rd:|aspect-ratio:/.test(m)) continue;
    inlineStyles++;
    warnings.push(`${rel(file)}: inline style →${m.trim()}`);
  }
}
if (inlineStyles) warnings.push(`${inlineStyles} inline style attributes remain`);

console.log(`Audited ${htmlFiles.length} pages.\n`);
if (warnings.length) {
  const shown = warnings.slice(0, 15);
  console.log(`⚠ ${warnings.length} warnings`);
  shown.forEach((wn) => console.log('  ' + wn));
  if (warnings.length > shown.length) console.log(`  …and ${warnings.length - shown.length} more`);
  console.log('');
}
if (errors.length) {
  console.log(`✗ ${errors.length} errors`);
  errors.slice(0, 40).forEach((e) => console.log('  ' + e));
  if (errors.length > 40) console.log(`  …and ${errors.length - 40} more`);
  process.exit(1);
}
console.log('✓ No structural errors. Nav, drawer, ARIA wiring, ids, labels and schema all clean.');
