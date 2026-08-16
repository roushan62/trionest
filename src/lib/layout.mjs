import { site, nav } from '../data/site.mjs';

export const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* Emphasise the last word(s) of a heading, matching the existing site rhythm */
export const em = (s) => s;

export const icon = (name) => {
  const p = {
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    phone:
      '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<path d="M4 4h16v16H4z"/><path d="m4 6 8 6 8-6"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    whatsapp:
      '<path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3L3 21z"/><path d="M8.8 8.4c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.3 0 .6a7 7 0 0 0 2.8 2.4c.3.1.5.1.7-.1l.5-.6c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .5-.3 1.2-.9 1.5-.5.3-1.2.5-2 .3a9 9 0 0 1-5.7-5.1c-.3-.9-.2-1.7 0-2.2z"/>',
    linkedin:
      '<path d="M4 9h3v11H4zM5.5 4a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10 9h3v1.5a3.3 3.3 0 0 1 3-1.6c2.4 0 4 1.5 4 4.6V20h-3v-6c0-1.6-.6-2.5-2-2.5s-2 .9-2 2.5v6h-3z"/>',
    shield: '<path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z"/><path d="m9 12 2 2 4-4"/>',
    users:
      '<path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9.5" cy="7" r="3.5"/><path d="M21 20v-2a4 4 0 0 0-3-3.9"/><path d="M16 3.6a4 4 0 0 1 0 7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    wind: '<path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 12h15a3 3 0 1 1-3 3"/><path d="M3 16h8"/>',
    tools: '<path d="M14 7a4 4 0 0 1 5.5 5.2l-8.3 8.3a2 2 0 0 1-2.8-2.8l8.3-8.3"/><path d="M6 6l3 3"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
    download: '<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    warn: '<path d="M12 3 2 20h20z"/><path d="M12 9v5"/><path d="M12 17.5v.5"/>',
    star: '<path d="m12 3 2.7 5.6 6.3.9-4.5 4.4 1 6.1-5.5-2.9L6.5 20l1-6.1L3 9.5l6.3-.9z"/>',
    quote: '<path d="M7 7h5v5c0 3-2 5-5 5V7zM15 7h5v5c0 3-2 5-5 5V7z"/>',
  }[name];
  if (!p) return '';
  return `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${p}</svg>`;
};

const chev = `<svg class="nav__chev" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const isCurrent = (item, current) =>
  current === item.href ||
  (item.href !== '/' && !item.children && current.startsWith(item.href));

const hasActiveChild = (item, current) =>
  !!item.children && item.children.some((c) => current === c.href || current.startsWith(c.href));

/* ---------- desktop navigation (lives inside the sticky header) ---------- */
const navMarkup = (current) =>
  nav
    .map((item) => {
      const active = isCurrent(item, current) ? ' aria-current="page"' : '';
      if (!item.children) {
        return `<li class="nav__item"><a class="nav__link" href="${item.href}"${active}>${esc(item.label)}</a></li>`;
      }
      const childActive = hasActiveChild(item, current) || current === item.href;
      const id = `sub-${slug(item.label)}`;
      return `<li class="nav__item nav__item--has-sub">
        <button class="nav__link nav__toggle" type="button" aria-expanded="false" aria-controls="${id}"${
          childActive ? ' data-active="true"' : ''
        }><span>${esc(item.label)}</span>${chev}</button>
        <div class="subnav" id="${id}">
          <ul class="subnav__list">
            <li><a class="subnav__link subnav__link--all" href="${item.href}"${
              current === item.href ? ' aria-current="page"' : ''
            }>All ${esc(item.label)} ${icon('arrow')}</a></li>
            ${item.children
              .map(
                (c) =>
                  `<li><a class="subnav__link" href="${c.href}"${
                    c.href === current ? ' aria-current="page"' : ''
                  }>${esc(c.label)}</a></li>`,
              )
              .join('')}
          </ul>
        </div>
      </li>`;
    })
    .join('');

/* ---------- mobile drawer (rendered at body level, never inside the header) ----------
   The header uses backdrop-filter, which makes it a containing block for fixed
   positioning. Keeping the drawer outside the header is what guarantees a
   full-height, glitch-free panel on every device. */
const drawerMarkup = (current) => `<div class="drawer" id="mobile-nav" aria-hidden="true">
  <div class="drawer__scrim" data-nav-close hidden></div>
  <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Site menu" tabindex="-1">
    <div class="drawer__top">
      <a class="brandmark" href="/" aria-label="${esc(site.name)} — home">
        <img src="/assets/brand/logo.svg" alt="${esc(site.name)} logo" width="150" height="34" loading="lazy" decoding="async">
      </a>
      <button class="drawer__close" type="button" data-nav-close aria-label="Close menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <nav class="drawer__nav" aria-label="Mobile primary">
      <ul class="mnav">
        ${nav
          .map((item) => {
            if (!item.children) {
              return `<li class="mnav__item"><a class="mnav__link" href="${item.href}"${
                isCurrent(item, current) ? ' aria-current="page"' : ''
              }>${esc(item.label)}</a></li>`;
            }
            const open = hasActiveChild(item, current) || current === item.href;
            const id = `m-${slug(item.label)}`;
            return `<li class="mnav__item mnav__item--has-sub">
              <button class="mnav__link mnav__toggle" type="button" aria-expanded="${open}" aria-controls="${id}">
                <span>${esc(item.label)}</span>${chev}
              </button>
              <div class="msub" id="${id}"${open ? '' : ' hidden'}>
                <ul>
                  <li><a class="msub__link" href="${item.href}"${
                    current === item.href ? ' aria-current="page"' : ''
                  }>All ${esc(item.label)}</a></li>
                  ${item.children
                    .map(
                      (c) =>
                        `<li><a class="msub__link" href="${c.href}"${
                          c.href === current ? ' aria-current="page"' : ''
                        }>${esc(c.label)}</a></li>`,
                    )
                    .join('')}
                </ul>
              </div>
            </li>`;
          })
          .join('')}
      </ul>
    </nav>
    <div class="drawer__foot">
      <a class="btn btn--accent btn--block" href="/contact/">Request proposal ${icon('arrow')}</a>
      <div class="drawer__contact">
        <a href="${site.phoneHref}">${icon('phone')}<span>${esc(site.phone)}</span></a>
        <a href="mailto:${site.email}">${icon('mail')}<span>${esc(site.email)}</span></a>
      </div>
    </div>
  </div>
</div>`;

export const breadcrumbs = (trail) => {
  if (!trail || !trail.length) return '';
  const items = [{ label: 'Home', href: '/' }, ...trail];
  return `<nav class="crumbs" aria-label="Breadcrumb"><div class="wrap"><ol>
    ${items
      .map((c, i) =>
        i === items.length - 1
          ? `<li><span aria-current="page">${esc(c.label)}</span></li>`
          : `<li><a href="${c.href}">${esc(c.label)}</a></li>`,
      )
      .join('')}
  </ol></div></nav>`;
};

export const fill = (label, note = '') => `<div class="fill" role="note">
  <span class="fill__tag">${icon('warn')} Content placeholder</span>
  <p class="fill__label">${esc(label)}</p>
  ${note ? `<p class="fill__note">${esc(note)}</p>` : ''}
</div>`;

export const ctaBand = ({
  title = 'Let’s discuss your next space.',
  text = 'Tell us about the site, the timeline and the brief. We’ll come back with a free survey and a fixed-cost proposal.',
  primary = { label: 'Request a fixed-cost proposal', href: '/contact/' },
  secondary = { label: 'Download company profile', href: '/company-profile/' },
} = {}) => `<section class="band">
  <div class="wrap band__inner">
    <div>
      <h2 class="band__title">${title}</h2>
      <p class="band__text">${esc(text)}</p>
    </div>
    <div class="band__actions">
      <a class="btn btn--accent" href="${primary.href}">${esc(primary.label)} ${icon('arrow')}</a>
      ${secondary ? `<a class="btn btn--ghost" href="${secondary.href}">${esc(secondary.label)}</a>` : ''}
      <div class="band__contact">
        <a href="${site.phoneHref}">${icon('phone')} ${esc(site.phone)}</a>
        <a href="mailto:${site.email}">${icon('mail')} ${esc(site.email)}</a>
      </div>
    </div>
  </div>
</section>`;

const footer = () => `<footer class="foot">
  <div class="wrap foot__grid">
    <div class="foot__brand">
      <a href="/" class="brandmark brandmark--foot" aria-label="TrioNest Spaces — home">
        <img src="/assets/brand/logo.svg" alt="TrioNest Spaces logo" width="150" height="34" loading="lazy" decoding="async">
      </a>
      <p class="foot__tag">${esc(site.tagline)}</p>
      <p class="foot__desc">${esc(site.shortDesc)}</p>
      <ul class="foot__social">
        ${site.social
          .map(
            (s) =>
              `<li><a href="${s.href}" rel="noopener" target="_blank" aria-label="${esc(
                site.name,
              )} on ${esc(s.label)}">${icon(s.icon)}</a></li>`,
          )
          .join('')}
      </ul>
    </div>
    <div class="foot__col">
      <h2 class="foot__h">Verticals</h2>
      <ul>
        <li><a href="/services/civil-interiors/">Civil &amp; Interiors</a></li>
        <li><a href="/services/electrical/">Electrical</a></li>
        <li><a href="/services/hvac/">HVAC</a></li>
        <li><a href="/services/amc-fms/">AMC &amp; FMS</a></li>
        <li><a href="/industries/">Industries</a></li>
      </ul>
    </div>
    <div class="foot__col">
      <h2 class="foot__h">Company</h2>
      <ul>
        <li><a href="/about/">About us</a></li>
        <li><a href="/process/">Our process</a></li>
        <li><a href="/quality-safety/">Quality &amp; safety</a></li>
        <li><a href="/certifications/">Certifications</a></li>
        <li><a href="/team/">Leadership &amp; team</a></li>
        <li><a href="/projects/">Projects</a></li>
        <li><a href="/clients/">Clients</a></li>
        <li><a href="/blog/">Insights</a></li>
        <li><a href="/careers/">Careers</a></li>
      </ul>
    </div>
    <div class="foot__col">
      <h2 class="foot__h">Coverage</h2>
      <ul>
        <li><a href="/locations/"><strong>PAN-India — all states</strong></a></li>
        <li><a href="/locations/delhi/">Delhi-NCR</a></li>
        <li><a href="/locations/maharashtra/">Maharashtra</a></li>
        <li><a href="/locations/karnataka/">Karnataka</a></li>
        <li><a href="/locations/telangana/">Telangana</a></li>
        <li><a href="/locations/tamil-nadu/">Tamil Nadu</a></li>
        <li><a href="/locations/uttar-pradesh/">Uttar Pradesh</a></li>
        <li><a href="/locations/gujarat/">Gujarat</a></li>
        <li><a href="/locations/west-bengal/">West Bengal</a></li>
      </ul>
    </div>
    <div class="foot__col foot__col--contact">
      <h2 class="foot__h">Contact</h2>
      <ul class="foot__contact">
        <li><a href="${site.phoneHref}">${icon('phone')}<span>${esc(site.phone)}</span></a></li>
        <li><a href="mailto:${site.email}">${icon('mail')}<span>${esc(site.email)}</span></a></li>
        <li><span class="foot__addr">${icon('pin')}<span>${site.addressLines
          .map(esc)
          .join('<br>')}</span></span></li>
      </ul>
      <a class="btn btn--accent btn--sm" href="/contact/">Request a proposal ${icon('arrow')}</a>
    </div>
  </div>
  <div class="wrap foot__base">
    <p>&copy; ${new Date().getFullYear()} ${esc(site.name)}. All rights reserved.</p>
    <ul>
      <li><a href="/privacy-policy/">Privacy policy</a></li>
      <li><a href="/terms/">Terms of service</a></li>
      <li><a href="/company-profile/">Company profile</a></li>
      <li><a href="/contact/">Contact</a></li>
    </ul>
  </div>
</footer>`;

/**
 * page({ title, desc, path, body, crumbs, jsonld, bodyClass, ogImage })
 */
export function page({
  title,
  desc,
  path,
  body,
  crumbs = null,
  jsonld = [],
  bodyClass = '',
  noindex = false,
  ogImage = null,
}) {
  const canonical = site.url + path;
  const og = ogImage ? site.url + ogImage : `${site.url}/assets/brand/og-default.png`;

  /* Automatic BreadcrumbList schema whenever breadcrumbs render */
  const allLd = [...jsonld];
  if (crumbs && crumbs.length) {
    const items = [{ label: 'Home', href: '/' }, ...crumbs];
    allLd.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.label,
        ...(i < items.length - 1 ? { item: site.url + c.href } : {}),
      })),
    });
  }
  const ld = allLd
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join('\n  ');

  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<script>document.documentElement.classList.add('js');</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow">'}
<meta name="theme-color" content="#faf8f4">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${og}">
<link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/brand/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
<link rel="dns-prefetch" href="https://maps.google.com">
<link rel="dns-prefetch" href="https://wa.me">
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700&display=swap"></noscript>
<link rel="preload" as="style" href="/assets/css/style.css">
<link rel="stylesheet" href="/assets/css/style.css">
${ld}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">Skip to main content</a>
<header class="head" id="head">
  <div class="wrap head__inner">
    <a class="brandmark" href="/" aria-label="TrioNest Spaces — home">
      <img src="/assets/brand/logo.svg" alt="TrioNest Spaces logo" width="164" height="36" fetchpriority="high" decoding="async">
    </a>
    <nav class="nav" id="nav" aria-label="Primary">
      <ul class="nav__list">${navMarkup(path)}</ul>
    </nav>
    <div class="head__actions">
      <a class="head__phone" href="${site.phoneHref}">${icon('phone')}<span>${esc(site.phone)}</span></a>
      <a class="btn btn--accent btn--sm head__cta" href="/contact/"><span class="head__cta-full">Request proposal</span><span class="head__cta-short">Enquire</span></a>
      <button class="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>
${drawerMarkup(path)}
${crumbs ? breadcrumbs(crumbs) : ''}
<main id="main">
${body}
</main>
${footer()}
<a class="wa" href="https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    'Hello TrioNest Spaces, I would like to discuss a project.',
  )}" target="_blank" rel="noopener" aria-label="Chat with TrioNest Spaces on WhatsApp">
  ${icon('whatsapp')}<span>WhatsApp</span>
</a>
<script src="/assets/js/main.js" defer></script>
</body>
</html>`;
}
