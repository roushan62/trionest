# TrioNest Spaces

The repository contains one canonical, production-ready static website for
**TrioNest Spaces**. Its visual system uses the colours from the supplied official
logo: deep blue, cyan, red, yellow and green.

- Source: `site/`
- Vercel output: `dist/` (generated and gitignored)
- Production domain: <https://trionest.vercel.app>
- Phone and WhatsApp: **+91 87965 75719**
- Email: **spaces@trionest.in**

## Verify locally

```bash
npm run check
```

The build copies the site, fingerprints CSS/JavaScript to prevent stale production
caches, and rejects broken local links or assets.

## Vercel deployment

Vercel is configured to run `npm run build` and publish `dist/`. Only a commit merged
to the Vercel Production Branch (`main`) becomes the current deployment on
`trionest.vercel.app`. Arena working branches do not create unnecessary preview
deployments.

Vercel always assigns its own immutable deployment URL and may also display a Git
branch alias. Those are aliases for the same build, not extra websites. The public
URL to share is always `https://trionest.vercel.app`.

## Editing

Edit files only in `site/`, then run `npm run check`. Do not edit `dist/` because it
is rebuilt on every deployment.
