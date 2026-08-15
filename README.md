# TrioNest Spaces — Website

Production-grade static website for **TrioNest Spaces** — *One Partner. Three Disciplines.*
Corporate interiors + electrical contracting + HVAC engineering.

**42 pages. Zero runtime dependencies. Pure HTML/CSS/vanilla JS output.**

Built for GitHub Pages first and Hostinger shared hosting later: the `dist/` folder is
plain static files with no Node server, no database and no serverless functions.

---

## Quick start

```bash
npm run build     # build the static site into dist/
npm run serve     # build + preview at http://localhost:4321
npm run check     # build + run the QA checker (links, alt text, meta, headings)
npm run images    # regenerate brand assets and photo placeholders
```

Requires Node 18+. `npm run images` additionally needs Python 3 with Pillow
(`pip install pillow`) — you only need it if you want to regenerate placeholders.

There are **no npm dependencies to install**. `npm run build` works on a clean checkout.

---

## Repository layout

```
build.mjs                 Build script — writes every page into dist/
src/
  data/                   ← ALL CONTENT LIVES HERE (edit these, not the HTML)
    site.mjs              Company facts, stats, nav, 6-stage process, "why us"
    services.mjs          4 service lines with full scope copy
    industries.mjs        7 sector pages with copy + FAQs
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
`src/assets/brand/logo.svg` is a faithful stand-in. Drop your real `logo.svg`
(or `logo.png` — update the two `<img>` references in `src/lib/layout.mjs`) in place.

### 3. Sample the real accent colour
The palette is dark charcoal + a copper accent. If your live-site accent differs,
change **one line** — `--accent` in `src/assets/css/style.css` — and everything follows.

### 4. Replace the photography
Every image in `src/assets/img/` is a marked placeholder. Replace with real TrioNest
project photography, keeping the same filenames and aspect ratios (16:10 for cards,
2000×1250 for the hero). Prioritise: site progress shots, services above the ceiling
before closure, finished spaces, MEP and panel work.

### 5. Replace the client logos
`src/assets/clients/*.png` are text-rendered stand-ins. Drop in the original logo files
from the current site, same filenames. **Confirm usage rights before launch.**

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
- Submit `https://trionest.in/sitemap.xml` in Google Search Console.
- Claim/complete the Google Business Profile, then embed reviews on `/clients/`.
- Run Lighthouse on the live URL and confirm 90+ across all four categories.

---

## Design system

| Token | Value | Use |
|---|---|---|
| `--ink-900` | `#08090b` | Page background |
| `--ink-850` | `#0c0e10` | Alternating sections, cards |
| `--accent` | `#d98a3d` | Single accent — CTAs, kickers, numbers |
| `--paper` | `#f4f5f6` | Body text |
| `--f-head` | Space Grotesk | Headings |
| `--f-body` | Inter | Body copy |

Responsive breakpoints: 360 / 700 / 900 / 1100 / 1240px. Mobile-first throughout.
Accessibility: skip link, one H1 per page, keyboard-navigable menus, visible focus
rings, `aria-current` on active nav, `prefers-reduced-motion` respected.

---

## Content principles baked into this build

1. **No claim without evidence.** Every stat, service and sector page ends with a project, a process or a document — never a bare adjective.
2. **Nothing invented.** No fabricated clients, numbers, certifications, testimonials or reviews. Missing data shows a placeholder, not a guess.
3. **Numbers over adjectives.** Short sentences, engineering-grade tone, specifics first.
4. **Trust signals repeat.** Stats, logos, certifications and process appear across the site, not just on About.
5. **No dead ends.** No "coming soon" pages in primary navigation; no `href="#"` links.
