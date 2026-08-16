# TrioNest Spaces — Website

Production-grade static website for **TrioNest Spaces** — *One Partner. Three Disciplines.*
Corporate interiors + electrical contracting + HVAC engineering.

**75 pages. Zero runtime dependencies. Pure HTML/CSS/vanilla JS output.**
Includes full PAN-India SEO coverage: an index plus 32 state/UT landing pages under
`/locations/` (28 states + Delhi, Chandigarh, Jammu & Kashmir, Puducherry), each with
unique market-specific content, city lists, FAQs and `Service` + `FAQPage` +
`BreadcrumbList` schema.

Built for Hostinger shared hosting: the `dist/` folder is plain HTML/CSS/vanilla JS with
no Node server, database or serverless functions. A single dependency-free PHP mailer is
included only to deliver contact-form submissions to `spaces@trionest.in`.

---

## Quick start

```bash
npm run build            # build the static site into dist/ (minifies CSS too)
npm run serve            # build + preview at http://localhost:4321
npm run check            # build + run the QA checker (links | alt | meta | schema | headings | webp)
npm run audit            # build + deep DOM/CSS audit (nav, drawer, ARIA, ids, labels, responsive rules)
npm run smoke            # build + DOM smoke test of the JS enhancement layer (jsdom)
npm run qa               # build + check + audit + smoke — run this before every deploy
npm run prepare-images   # resize + recompress JPEGs and generate WebP twins (needs ImageMagick)
npm run logos            # render SVG client logos to PNG previews in tmp/ for review
npm run images           # regenerate brand assets and photo placeholders
bash tools/import-logos.sh  # re-import real client logos from image-search/ into src/assets/clients/
```

Requires Node 18+. `npm run images` additionally needs Python 3 with Pillow
(`pip install pillow`) — you only need it if you want to regenerate placeholders.

There are **no npm dependencies to install** for the build itself. `npm run build` works on a
clean checkout. `npm run smoke` needs the `jsdom` devDependency (`npm i`).

---

## Cross-device fixes (v1.3)

The header, navigation and every responsive grid were rebuilt to remove the layout
glitches that showed up on phones and on wide desktops.

* **Mobile menu no longer opens half way.** The drawer used to be a `position: fixed`
  panel *inside* `<header class="head">` — but `.head` applies `backdrop-filter`, and a
  backdrop-filter makes an element the containing block for its fixed descendants. The
  panel was therefore clipped to the header box. The drawer is now rendered at body level
  (`#mobile-nav`, see `drawerMarkup()` in `src/lib/layout.mjs`) as a full-height sheet with
  a scrim, focus trap, Escape-to-close, and auto-close on navigate or breakpoint change.
* **All 7 nav sections + 21 sub-pages are reachable on every device.** Each dropdown now
  also carries an "All <section>" link so the parent index page is never orphaned, and the
  right-most dropdowns flip their alignment so they cannot spill off-screen.
* **Desktop dropdowns work on click and keyboard**, not hover only.
* **`overflow-x: clip` instead of `hidden` on `<body>`** — `hidden` turns the body into a
  scroll container, which silently breaks `position: sticky` on the header.
* **Every multi-column grid uses `minmax(0, 1fr)`.** `1fr` defaults to `min-content`
  minimum, so any long word or wide image pushed columns past the viewport. This was the
  root cause of the "formatting breaks" reports on both phone and desktop.
* **Anchor links clear the sticky header** (`scroll-padding-top` + JS offset), and
  `content-visibility: auto` was removed from `.sec` because it made anchor targets and
  scroll restoration land in the wrong place.
* **`[hidden] { display: none !important }`** — without it the project filter could not
  hide flex cards, so filtering appeared to do nothing.
* Stat figures render server-side (correct with JS off), stacked key/value tables below
  560px, 16px form inputs on mobile (no iOS zoom-on-focus), 44–48px touch targets,
  safe-area insets for the floating buttons, and a scroll-reveal failsafe so content can
  never stay invisible.
* **`npm run qa`** runs the full gate: build → link/meta check → deep DOM + CSS audit
  (`tools/audit.mjs`, 75 pages) → JS smoke test.

## Redesign layer (v1.2)

* **Real client logos** — official brand logos for all 22 published clients, imported from
  brand sources via `tools/import-logos.sh` into `src/assets/clients/*.webp`
  (Fleetx and Centrum keep the rendered SVG wordmark where no clean source was available).
* **Client-office showcase** — a homepage section pairing each delivered space with the
  client's real logo, AI-generated interior visual (styled per brand, referenced from the
  site's real photography) and the verified project cities.
* **Motion system** — scroll-reveal with stagger, animated stat counters, seamless logo
  marquee, hero ticker, scroll progress bar, cursor glow, card tilt and back-to-top — all
  vanilla JS/CSS, GPU-friendly, and disabled under `prefers-reduced-motion`.
* **New environments imagery** — six generated corporate interior scenes (reception,
  workstations, boardroom, cafe, cabin, training room) used on the About page and the
  Civil & Interiors service page.

## Repository layout

```
build.mjs                 Build script — writes every page into dist/
src/
  data/                   ← ALL CONTENT LIVES HERE (edit these, not the HTML)
    site.mjs              Company facts, stats, nav, 6-stage process, "why us"
    services.mjs          4 service lines with full scope copy
    industries.mjs        7 sector pages with copy + FAQs
    locations.mjs         32 state/UT pages: cities, sectors, market notes, FAQs
    projects.mjs          Project list + case-study fields
    clients.mjs           Client logo wall (grouped by sector) + testimonials
    blog.mjs              6 full-length insight articles
  lib/
    layout.mjs            Page shell: head, header, nav, breadcrumbs, footer, icons
    parts.mjs             Reusable blocks: stat bar, logo strip, cards, forms
  pages/                  Page templates (home, company, services, industries, …)
  send-mail.php           Database-free Hostinger contact-form mailer
  assets/
    css/style.css         Design system (one file, CSS custom properties)
    js/main.js            Nav, filters, carousel, form handling (no libraries)
    brand/                Logo, favicon, OG image
    img/                  Photography — placeholders, replace with real photos
    clients/              Client logos
    docs/                 Company profile PDF, sample QA documents
tools/
  gen-images.py           Generates brand assets + on-brand photo placeholders
  serve.mjs               Local static preview server
  check.mjs               QA checker — run before every deploy
dist/                     Build output (gitignored) — this is what you upload
```

---

## Editing content

Everything is data-driven. **You never need to touch HTML to change copy.**

| To change… | Edit |
|---|---|
| Phone, email, address, stats, cities | `src/data/site.mjs` |
| Navigation menu | `nav` in `src/data/site.mjs` |
| The 6 process stages and their deliverables | `processStages` in `src/data/site.mjs` |
| Service scope copy | `src/data/services.mjs` |
| Sector copy and FAQs | `src/data/industries.mjs` |
| State / city coverage pages | `src/data/locations.mjs` |
| Projects and case studies | `src/data/projects.mjs` |
| Client logo wall | `src/data/clients.mjs` |
| Testimonials | `testimonials` in `src/data/clients.mjs` |
| Blog articles | `src/data/blog.mjs` |
| Colours, type, spacing | `:root` in `src/assets/css/style.css` |

Then run `npm run build`.

---

## Before you launch — the fill-in checklist

The site is built to be **honest by default**: nothing is invented. Where real data is
missing, a clearly-styled placeholder block appears instead of fabricated content.
Search the site for those blocks, or work through this list.

### 1. Verify the contact form (required)
The bundled `send-mail.php` validates submissions and sends them directly to
`spaces@trionest.in` using Hostinger's PHP `mail()` transport. It stores no data and
needs no database, API key or third-party form account. After deployment, submit one
test enquiry and confirm both Inbox and Spam. If Hostinger has outbound mail disabled,
enable PHP mail in hPanel or ask Hostinger support to enable it for the domain.

### 2. Brand logo — already set
`src/assets/brand/logo.svg` and `favicon.svg` use the official green impossible-triangle
mark from trionest.in, paired with the TrioNest Spaces wordmark.

### 3. Brand colour — already set
The accent is the real brand green (`--accent: #2e7d43`) sampled from the TrioNest
mark. If the live-site accent ever changes, it is **one line** in
`src/assets/css/style.css` — and everything follows.

### 4. Replace the photography when real shoots exist
`src/assets/img/` holds photorealistic site photography matched to each page's topic
(hero office, per-service shots, per-project shots, plus process / QC / toolbox-talk /
team photos wired into `/process/`, `/quality-safety/` and `/team/`). Swap in real
TrioNest project photography with the same filenames whenever a real shoot is done,
then re-run `npm run prepare-images` to regenerate the resized JPEGs + WebP twins.

### 5. Client logos — currently brand-accurate SVG wordmarks
`src/assets/clients/*.svg` are faithful wordmark reproductions (real brand colours and
styling) of the 22 public clients. When the original vector files are available from
the client or their press kits, drop them in at the same paths. **Confirm usage rights
before launch.**

### 6. Fill in the real data
- **Certifications** (`src/pages/company.mjs` → `certItems`) — publish only what you hold: GST, PAN, CIN/Udyam, ISO, PF/ESIC, electrical contractor licence, insurance, OEM authorisations. Delete rows you don't have.
- **Team** (`src/pages/company.mjs` → `roles`) — real names, designations, experience, photos. Ajay Pandey and Moin Khan are already public on LinkedIn; start there.
- **Projects** (`src/data/projects.mjs`) — fill area, planned vs actual duration, requirement, concept, execution, challenges, commissioning, gallery; then set `published: true`. *Planned vs actual duration is the single most persuasive number on the site.*
- **Testimonials** (`src/data/clients.mjs`) — 5–8 real quotes with name, designation, company and project. The section stays hidden until they exist.
- **Safety stats** (`/quality-safety/`) — only figures you can evidence from records.
- **Company profile PDF** — save to `src/assets/docs/trionest-company-profile.pdf`. The page auto-switches from "request" to a direct download once the file exists.

### 7. Legal review
`/privacy-policy/` and `/terms/` are reasonable standard drafts, flagged on-page.
Have a lawyer check them against the DPDP Act 2023 and your actual practices.

### 8. Verify before going live
```bash
npm run check
```
Confirms: no broken internal links, every image has alt text, unique titles and meta
descriptions, correct heading hierarchy, sitemap accuracy, no lorem ipsum.

---

## Deploying

### GitHub Pages
A workflow at `.github/workflows/deploy.yml` builds and deploys automatically.
In **Settings → Pages**, set Source to **GitHub Actions**. Using a custom domain?
Add it in the same screen and set `CNAME` content in the workflow.

### Hostinger (or any shared host)
```bash
npm run build
```
Upload the **contents** of `dist/` (not the folder itself) into `public_html/` via
File Manager or FTP. `.htaccess` is included and handles clean URLs, the 404 page,
compression and cache headers.

The build is fully portable: open `dist/index.html` behind any static server and it
behaves identically. All internal links are root-relative (`/about/`), so the site must
be served from a domain root — not from a subfolder.

### Post-launch
- Submit `https://trionest.in/sitemap.xml` in Google Search Console (74 URLs, incl. every state page).
- Claim/complete the Google Business Profile, then embed reviews on `/clients/`.
- Create or verify state/city business listings (Bing Places, Justdial, IndiaMART, Sulekha) for local SEO reinforcement.
- Run Lighthouse on the live URL and confirm 90+ across all four categories.

---

## Design system

| Token | Value | Use |
|---|---|---|
| `--bg` | `#faf8f4` | Warm ivory page background |
| `--surface` | `#ffffff` | Cards, header, form |
| `--sand` | `#f4efe6` | Alternating sections, footer |
| `--ink-900` | `#1c2a25` | Pine-charcoal headings / text |
| `--accent` | `#2e7d43` | TrioNest brand green — CTAs, kickers, numbers |
| `--teal` | `#0d5f56` | Supporting deep teal |
| `--f-head` | Fraunces | Editorial serif display headings |
| `--f-body` | Inter | Body copy and UI |

Bright, light-only theme (no dark sections). Warm, premium interior-studio feel:
soft warm shadows, pill buttons, 18px card radii, serif display type.
Responsive breakpoints: 360 / 700 / 900 / 1100 / 1240px. Mobile-first throughout.
Accessibility: skip link, one H1 per page, keyboard-navigable menus, visible focus
rings, `aria-current` on active nav, WCAG AA contrast throughout,
`prefers-reduced-motion` respected.

---

## Content principles baked into this build

1. **No claim without evidence.** Every stat, service and sector page ends with a project, a process or a document — never a bare adjective.
2. **Nothing invented.** No fabricated clients, numbers, certifications, testimonials or reviews. Missing data shows a placeholder, not a guess.
3. **Numbers over adjectives.** Short sentences, engineering-grade tone, specifics first.
4. **Trust signals repeat.** Stats, logos, certifications and process appear across the site, not just on About.
5. **No dead ends.** No "coming soon" pages in primary navigation; no `href="#"` links.
