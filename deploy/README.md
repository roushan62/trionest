# Deployment

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
