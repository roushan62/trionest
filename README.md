# TrioNest Spaces — Website

Production-grade static website for **TrioNest Spaces** — *One Partner. Three Disciplines.*
Corporate interiors + electrical contracting + HVAC engineering.

**75 pages. Zero runtime dependencies. Pure HTML/CSS/vanilla JS output.**
Includes full PAN-India SEO coverage: an index plus 32 state/UT landing pages under
`/locations/` (28 states + Delhi, Chandigarh, Jammu & Kashmir, Puducherry), each with
unique market-specific content, city lists, FAQs and `Service` + `FAQPage` +
`BreadcrumbList` schema.

Built for GitHub Pages first and Hostinger shared hosting later: the `dist/` folder is
plain static files with no Node server, no database and no serverless functions.

---

## Quick start

```bash
npm run build            # build the static site into dist/ (minifies CSS too)
npm run serve            # build + preview at http://localhost:4321
npm run check            # build + run the QA checker (links | alt | meta | schema | headings | webp)
npm run smoke            # build + DOM smoke test of the JS enhancement layer (jsdom)
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

### 1. Connect the contact form (required)
Currently forms fall back to opening the user's email client, so no lead is lost —
but you should wire up a real service.

1. Create a form at [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com) (both have free tiers and work on static hosting).
2. Put the endpoint URL in `formEndpoint` in `src/data/site.mjs`.
3. Rebuild, submit a test enquiry, and confirm you receive it.

### 2. Replace the logo
`src/assets/brand/logo.svg` is a clean stand-in of the real brand mark (green
three-arm triangle + wordmark). Drop your real `logo.svg` (or `logo.png` — update the
two `<img>` references in `src/lib/layout.mjs`) in place when the original artwork is available.

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
