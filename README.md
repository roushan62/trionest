# TrioNest Spaces — Website

Production-grade static website for **TrioNest Spaces** — *One Partner. Three Disciplines.*
Corporate interiors + electrical contracting + HVAC engineering.

**78 pages. Zero runtime dependencies. Pure HTML/CSS/vanilla JS output.**
Premium emerald theme with frosted-glass panels, 3D card tilts, a full-bleed hero
with a looping background video over 3D office renders, and full PAN-India SEO
coverage: an index plus 32 state/UT pages and dedicated **Gurugram / Noida /
Ghaziabad** city landing pages under `/locations/`, each with unique market
content, corridors, 2026 cost benchmarks, FAQs and `Service` + `FAQPage` +
`BreadcrumbList` schema.

Hosted on **GitHub Pages** (static): push to `main` and the Actions workflow
(`.github/workflows/deploy.yml`) runs `node build.mjs` and publishes `dist/`.
No Node server, no database, no build dependencies.

---

## Quick start

```bash
npm run build         # build the static site into dist/ (minifies CSS, hashes assets,
                      # relativises all internal links for GitHub Pages)
npm run serve         # build + preview at http://localhost:4321
npm run check         # build + QA checker (links | alt | meta | schema | headings | assets)
npm run audit         # build + deep DOM/CSS audit (nav, drawer, ARIA, ids, labels, responsive rules)
npm run smoke         # build + DOM smoke test of the JS enhancement layer (jsdom)
npm run qa            # build + check + audit + smoke — run this before every deploy
```

Requires Node 18+. `npm install` is only needed for the QA tools (jsdom) —
**the build itself has no dependencies** and works on a clean checkout
(which is exactly what the GitHub Actions workflow runs).

---

## Deploying (GitHub Pages)

The repo contains a ready-made Pages workflow:

1. **Settings → Pages → Source: "GitHub Actions"** (one-time, in the GitHub UI).
2. **Push to `main`** — the workflow builds `dist/` and deploys it automatically.
   The site goes live at `https://<user>.github.io/<repo>/`.
3. Manual re-deploy any time: **Actions → "Deploy to GitHub Pages" → Run workflow**.

### Why this works at any sub-path

The build **rewrites every internal link to a relative path**
(`href="/contact/"` → `href="../contact/"` on a nested page), so the same
`dist/` works at `user.github.io/repo/`, at a domain root, or anywhere else —
no base-path config, no repo-specific URLs in the HTML. Canonical/OG/sitemap
URLs stay absolute on `https://trionest.in` (set once in `src/data/site.mjs`).

### Recommended: point a custom domain at the Pages site

For the best SEO (sitemap, robots.txt, canonical URLs all served from the
domain root) add your domain (e.g. `trionest.in`) in **Settings → Pages →
Custom domain**. On a plain `user.github.io/repo/` sub-path the site works
fully; only the 404 page's own links assume a root host.

### Caching

CSS and JS are **content-hashed** at build time (`style.<hash>.css`,
`main.<hash>.js`) and every page references the hashed names, so a stale
cache can never serve yesterday's stylesheet after a deploy. If a page still
looks old after a deploy, do one hard refresh (`Ctrl+Shift+R`).

---

## The hero (video + 3D renders)

The homepage hero stacks, back to front:

1. **Four 3D office renders** (`src/assets/img/hero-3d-1..4.jpg` + WebP twins)
   in a slow CSS crossfade with Ken Burns motion — pure CSS, so it works with
   JS off, offline, or if the video fails.
2. **A looping background video** (`<video autoplay muted loop playsinline>`).
   The default clip is a free Pexels office loop (commercial licence, no
   attribution required) referenced in `src/pages/home.mjs` → `PEXELS_HERO_LOOP`.
   JS fades the video in only once it actually starts playing, and pauses it
   when it scrolls out of view.
3. A deep-pine gradient scrim for text contrast, then the glass content.

**To self-host the video (zero external requests):**
drop a short MP4 (1080p, ~10–20 s, no audio, under ~8 MB) at
`src/assets/media/hero-loop.mp4` and set `heroVideo: '/assets/media/hero-loop.mp4'`
in `src/data/site.mjs`. The build copies it and the page streams it from your
own origin — the Pexels fallback and its preconnect are dropped automatically.

`prefers-reduced-motion` users get the still first render instead of video.

---

## Editing content

Everything is data-driven. **You never need to touch HTML to change copy.**

| To change… | Edit |
|---|---|
| Phone, email, address, stats, cities, hero video | `src/data/site.mjs` |
| Navigation menu | `nav` in `src/data/site.mjs` |
| The 6 process stages and their deliverables | `processStages` in `src/data/site.mjs` |
| Contact form endpoint (Formspree/Web3Forms URL) | `formEndpoint` in `src/data/site.mjs` |
| Service scope copy | `src/data/services.mjs` |
| Sector copy and FAQs | `src/data/industries.mjs` |
| State / city coverage pages | `src/data/locations.mjs` (`locations` = states, `ncrCities` = Gurugram/Noida/Ghaziabad) |
| Projects and case studies | `src/data/projects.mjs` |
| Client logo wall | `src/data/clients.mjs` |
| Testimonials | `testimonials` in `src/data/clients.mjs` |
| Blog articles | `src/data/blog.mjs` |
| Colours, glass, 3D, spacing | `:root` in `src/assets/css/style.css` |

Then run `npm run build`.

---

## Before you launch — the fill-in checklist

The site is built to be **honest by default**: nothing is invented. Where real data is
missing, a clearly-styled placeholder block appears instead of fabricated content.
Search the site for those blocks, or work through this list.

### 1. Verify the contact form (required)
Hosting is static, so a PHP mailer cannot run. The form now opens a
**pre-filled email to `spaces@trionest.in`** with every field included — no lead is
lost. If you prefer HTTPS form submission, sign up for a free Formspree or Web3Forms
account and paste its endpoint into `formEndpoint` in `src/data/site.mjs`. After
deploying, submit one test enquiry and confirm it arrives.

### 2. Brand logo — already set
The official TrioNest Spaces logo ships in `src/assets/brand/` (transparent PNG —
on the dark footer it sits on a white glass chip so the navy wordmark stays readable):

| File | Used for |
|---|---|
| `logo.png` | Header, mobile drawer, footer, Organization schema |
| `favicon.ico` | Browser tab (16 + 32 px) |
| `icon-192.png`, `icon-512.png` | PWA manifest icons |
| `apple-touch-icon.png` | iOS home screen |
| `og-default.png` | Social share card (1200×630) |

### 3. Brand colour — already set
The accent is premium emerald (`--accent: #0a6b4d`) with deep-pine dark sections
(`--pine-900`/`--pine-950`) and mint highlights (`--mint`) on them, over a
mint-white base. Changing the accent is **one line** in `src/assets/css/style.css`.

### 4. Replace the photography when real shoots exist
`src/assets/img/` holds the site photography: the four AI 3D hero renders
(`hero-3d-1..4`, used as the hero backdrop, video poster and the 3D showcase
gallery), per-service shots, per-project shots, and process / QC / team photos.
Swap in real TrioNest project photography with the same filenames whenever a
real shoot is done. Keep WebP twins alongside JPGs (`tools/` conversion:
`convert x.jpg -quality 80 x.webp`).

### 5. Client logos — currently brand-accurate SVG wordmarks
`src/assets/clients/*.svg` are faithful wordmark reproductions of the 22 public
clients. When the original vector files are available, drop them in at the same
paths. **Confirm usage rights before launch.**

### 6. Fill in the real data
- **Certifications** (`src/pages/company.mjs` → `certItems`) — publish only what you hold.
- **Team** (`src/pages/company.mjs` → `roles`) — real names, designations, experience, photos.
- **Projects** (`src/data/projects.mjs`) — fill area, planned vs actual duration, requirement, concept, execution, challenges, commissioning, gallery; then set `published: true`.
- **Testimonials** (`src/data/clients.mjs`) — 5–8 real quotes with name, designation, company and project. The section stays hidden until they exist.
- **Safety stats** (`/quality-safety/`) — only figures you can evidence from records.
- **Company profile PDF** — save to `src/assets/docs/trionest-company-profile.pdf`. The page auto-switches from "request" to a direct download once the file exists.

### 7. Legal review
`/privacy-policy/` and `/terms/` are reasonable standard drafts, flagged on-page.
Have a lawyer check them against the DPDP Act 2023 and your actual practices.

### 8. Verify before going live
```bash
npm run qa
```
Confirms: no broken internal links (relative or absolute), every image has alt
text, unique titles and meta descriptions, correct heading hierarchy, sitemap
accuracy, clean ARIA/label wiring on all 78 pages, and no runtime errors.

---

## Repository layout

```
.github/workflows/deploy.yml   GitHub Pages build & deploy workflow
build.mjs                      Build script — writes every page into dist/
                               (CSS/JS fingerprinted, links relativised)
src/
  data/                        ← ALL CONTENT LIVES HERE (edit these, not the HTML)
    site.mjs                   Company facts, stats, nav, process, heroVideo
    services.mjs               4 service lines with full scope copy
    industries.mjs             7 sector pages with copy + FAQs
    locations.mjs              32 state/UT pages + 3 NCR city pages (Gurugram, Noida, Ghaziabad)
    projects.mjs               Project list + case-study fields
    clients.mjs                Client logo wall + testimonials
    blog.mjs                   6 full-length insight articles
  lib/
    layout.mjs                 Page shell: head, header, nav, breadcrumbs, footer, icons
    parts.mjs                  Reusable blocks: stat bar, logo strip, cards, forms
  pages/                       Page templates (home, company, services, industries, …)
  assets/
    css/style.css              Design system (one file, CSS custom properties)
    js/main.js                 Nav, filters, carousel, video, forms (no libraries)
    brand/                     Logo, favicon, OG image
    img/                       Photography + hero 3D renders (JPG + WebP twins)
    clients/                   Client logos
    docs/                      Company profile PDF, sample QA documents
tools/
  serve.mjs                    Local static preview server
  check.mjs                    QA checker — run before every deploy
  audit.mjs                    Deep DOM/CSS audit (78 pages)
  smoke.mjs                    DOM smoke test of the JS enhancement layer
dist/                          Build output (gitignored) — what GitHub Pages serves
```

---

## Post-launch SEO

- Submit `https://trionest.in/sitemap.xml` in Google Search Console (77 URLs, incl. every state and NCR city page).
- Claim/complete the Google Business Profile, then embed reviews on `/clients/`.
- Create or verify city business listings (Bing Places, Justdial, IndiaMART, Sulekha) for local SEO reinforcement — the Gurugram / Noida / Ghaziabad pages target those queries directly.
- Run Lighthouse on the live URL and confirm 90+ across all four categories.

---

## Design system

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f6faf7` | Mint-white page background |
| `--surface` | `#ffffff` | Cards, forms |
| `--sand` | `#edf4ef` | Alternating sections, stats, breadcrumbs |
| `--ink-900` | `#0c2018` | Green-charcoal headings / text |
| `--accent` | `#0a6b4d` | Premium emerald — CTAs, kickers, numbers |
| `--accent-grad` | pine→emerald→mint | Buttons, progress bar |
| `--pine-950/900/800` | `#04150f`… | Dark sections: hero scrim, deep sections, CTA band, footer |
| `--mint` | `#6fe3ae` | Text/line accents on dark surfaces |
| `--glass` / `--glass-dark` | frosted | Stats card, logo cells, subnav, hero pills, deep-section cards |
| `--f-head` | Fraunces | Editorial serif display headings |
| `--f-body` | Inter | Body copy and UI |

Premium light/dark theme keyed to the logo mark: emerald + deep pine + mint,
frosted glass on light surfaces, glass-dark cards on pine sections, 3D card
tilts (pointer devices only), soft shadows, pill buttons, 18px card radii,
serif display type. Responsive breakpoints: 360 / 700 / 900 / 1100 / 1240px.
Mobile-first throughout. Accessibility: skip link, one H1 per page,
keyboard-navigable menus, visible focus rings, `aria-current` on active nav,
WCAG AA contrast, `prefers-reduced-motion` respected (also stops the hero video).

---

## Content principles baked into this build

1. **No claim without evidence.** Every stat, service and sector page ends with a project, a process or a document — never a bare adjective.
2. **Nothing invented.** No fabricated clients, numbers, certifications, testimonials or reviews. Market cost ranges are published 2026 NCR benchmarks, always labelled as typical market ranges.
3. **Numbers over adjectives.** Short sentences, engineering-grade tone, specifics first.
4. **Trust signals repeat.** Stats, logos, certifications and process appear across the site, not just on About.
5. **No dead ends.** No "coming soon" pages in primary navigation; no `href="#"` links.
