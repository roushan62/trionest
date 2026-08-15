# Deployment

## Vercel

`vercel.json` in the repo root configures everything, so no dashboard settings
are required:

- `buildCommand: npm run build` → runs `node build.mjs`
- `outputDirectory: dist` → tells Vercel where the static output lives
  (without this Vercel looks for a `public/` folder and fails with
  *"No Output Directory named 'public' found after the Build completed"*)
- `trailingSlash: true` → matches the generated `/about/index.html` structure
  and the canonical URLs / sitemap
- long-lived cache headers for `/assets/*`, no-cache for HTML, plus basic
  security headers

If the project was previously created with an explicit **Output Directory** in
**Project Settings → Build & Development Settings**, clear that override (or set
it to `dist`) so `vercel.json` takes effect.

## GitHub Pages

The workflow file is kept here because the connected GitHub App cannot push files
into `.github/workflows/` directly. To enable automatic deploys, run once:

```bash
mkdir -p .github/workflows
git mv deploy/github-pages-workflow.yml .github/workflows/deploy.yml
git commit -m "Enable GitHub Pages deploy workflow"
git push
```

Then in **Settings → Pages**, set **Source: GitHub Actions**.

The workflow builds the site, runs the QA checker (failing the deploy on broken
links or missing alt text) and publishes `dist/`.

## Hostinger / any shared host

```bash
npm run build
```

Upload the **contents** of `dist/` into `public_html/`. The included `.htaccess`
handles clean URLs, the custom 404, gzip compression and cache headers.

Because all internal links are root-relative (`/about/`), the site must be served
from a domain root, not a subfolder.

## Pre-deploy gate

```bash
npm run check
```

Verifies internal links, image alt text, unique titles and meta descriptions,
heading hierarchy, asset existence and sitemap accuracy.
