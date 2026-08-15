/* DOM-level smoke test for the built site (jsdom).
   Loads dist/index.html, runs main.js, and asserts that the
   progressive-enhancement layer boots without runtime errors. */
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';

const ROOT = new URL('..', import.meta.url).pathname;
const htmlPath = `${ROOT}dist/index.html`;
const jsPath = `${ROOT}dist/assets/js/main.js`;

if (!existsSync(htmlPath)) {
  console.error('✗ dist/index.html missing — run `npm run build` first.');
  process.exit(1);
}

const html = readFileSync(htmlPath, 'utf8');
const js = readFileSync(jsPath, 'utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => errors.push(e.message));

const dom = new JSDOM(html, { url: 'https://trionest.in/', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc });
const w = dom.window;
w.matchMedia ||= () => ({ matches: false, media: '', addEventListener() {}, removeEventListener() {} });
w.IntersectionObserver ||= class {
  constructor(cb) { this.cb = cb; }
  observe(el) { this.cb([{ isIntersecting: true, target: el }]); }
  unobserve() {}
  disconnect() {}
};
w.requestAnimationFrame ||= (cb) => setTimeout(() => cb(Date.now()), 16);

try {
  w.eval(js);
} catch (e) {
  errors.push(`main.js threw: ${e.message}`);
}

await new Promise((r) => setTimeout(r, 350));

const d = w.document;
const checks = [
  ['progress bar mounts', !!d.querySelector('.prog')],
  ['back-to-top mounts', !!d.querySelector('.totop')],
  ['hero entrance reveal works', !!d.querySelector('.hero h1.is-in')],
  ['logo marquee duplicated (seamless loop)', d.querySelectorAll('.logos__cell').length >= 40],
  ['stat counters wired', d.querySelectorAll('[data-count]').length === 3],
  ['client-office showcase cards', d.querySelectorAll('.ocard').length === 6],
  ['hero ticker present', d.querySelectorAll('.hero__ticker span').length > 0],
  ['no runtime errors', errors.length === 0],
];

let ok = true;
for (const [label, pass] of checks) {
  console.log(`${pass ? '✓' : '✗'} ${label}`);
  if (!pass) ok = false;
}
if (errors.length) console.log('errors:', errors);
process.exit(ok ? 0 : 1);
