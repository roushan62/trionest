import { page, esc, icon, ctaBand, fill } from '../lib/layout.mjs';
import { services } from '../data/services.mjs';
import { projects, byVertical } from '../data/projects.mjs';
import { logoStrip, projectCard, img, statBar } from '../lib/parts.mjs';
import { site } from '../data/site.mjs';

const svcIcon = { 'civil-interiors': 'layers', electrical: 'bolt', hvac: 'wind', 'amc-fms': 'tools' };

export const servicesIndex = page({
  title: 'Services — Interiors, Electrical, HVAC & AMC | TrioNest Spaces',
  desc: 'Four service lines under one contract: civil and interior fit-out, electrical contracting, HVAC engineering, and AMC and facility management across India.',
  path: '/services/',
  crumbs: [{ label: 'Services', href: '/services/' }],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Services</span>
  <h1>Three integrated verticals. <em>One delivery team.</em></h1>
  <p class="lede">Buy one, two or all three. The scope is priced once, coordinated internally and handed over as a single documented package.</p>
  <div class="phero__cta">
    <a class="btn btn--accent" href="/contact/">Get a fixed-cost proposal ${icon('arrow')}</a>
    <a class="btn btn--ghost" href="/process/">See how we deliver</a>
  </div>
</div></section>

${statBar()}

<section class="sec"><div class="wrap">
  <div class="sec__head"><span class="kicker">Service lines</span><h2>Four scopes, one contract.</h2><p>Each line is delivered by a dedicated discipline team and can be bought on its own or combined into a single turnkey package.</p></div>
  <div class="grid grid--2">
    ${services
      .map(
        (s) => `<a class="cell vcard" href="/services/${s.slug}/">
      <span class="cell__n">${s.n}</span>
      <div class="cell__ico">${icon(svcIcon[s.slug])}</div>
      <h3>${esc(s.title)}</h3>
      <p class="vcard__kicker">${esc(s.kicker)}</p>
      <p>${esc(s.intro)}</p>
      <ul class="cell__list">
        ${s.included.map((i) => `<li>${icon('check')}<span>${esc(i.h)}</span></li>`).join('')}
      </ul>
      <p class="cell__foot"><span class="tlink">${esc(s.cta)} ${icon('arrow')}</span></p>
    </a>`,
      )
      .join('')}
  </div>
</div></section>

<section class="sec sec--alt"><div class="wrap">
  <div class="sec__head"><span class="kicker">Proof point</span><h2>The scope combination is the differentiator.</h2></div>
  <div class="prose">
    <p>On a combined project, the interface items that normally fall between three contracts — the supply from the DB to the HVAC indoor unit, the fire-alarm interface, the condensate drain and its pump, the containment shared between power and data — are priced once in one BOQ and installed by teams reporting to one project manager.</p>
    <p>That is why our project list includes clients who started with a single vertical and added the others: Concentrix (HVAC and electrical), L&amp;T Finance (interiors with MEP), CARS24 (interiors and electrical).</p>
  </div>
  <div class="flexrow mt-2">
    <a class="btn btn--ghost" href="/projects/">See the project list</a>
    <a class="btn btn--ghost" href="/industries/">Browse by sector</a>
  </div>
</div></section>

${logoStrip('Delivered for')}
${ctaBand({ primary: { label: 'Get a fixed-cost proposal', href: '/contact/' } })}
`,
});

export const servicePage = (s) => {
  const related = byVertical(s.vertical).slice(0, 3);
  const relatedBlock = related.length
    ? `<div class="pgrid">${related.map(projectCard).join('')}</div>
       <p class="mt-2"><a class="tlink" href="/projects/?vertical=${encodeURIComponent(
         s.vertical,
       )}">View all ${esc(s.title)} projects ${icon('arrow')}</a></p>`
    : `<div class="prose"><p>Projects for this service line are listed across our portfolio. ${
        s.slug === 'amc-fms'
          ? 'AMC scope typically follows a TrioNest-delivered project, or is taken up on an existing installation after an asset survey.'
          : ''
      }</p></div>
       <p class="mt-1"><a class="tlink" href="/projects/">View all projects ${icon('arrow')}</a></p>`;

  return page({
    title: s.metaTitle,
    desc: s.metaDesc,
    path: `/services/${s.slug}/`,
    crumbs: [
      { label: 'Services', href: '/services/' },
      { label: s.title, href: `/services/${s.slug}/` },
    ],
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: s.title,
        serviceType: s.title,
        description: s.intro,
        provider: { '@type': 'Organization', name: site.name, url: site.url },
        areaServed: site.cities.map((c) => ({ '@type': 'Place', name: c })),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${s.title} scope`,
          itemListElement: s.included.map((i) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: i.h },
          })),
        },
      },
    ],
    body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">${esc(s.kicker)}</span>
  <h1>${esc(s.title)}</h1>
  <p class="lede">${esc(s.intro)}</p>
  <div class="phero__cta">
    <a class="btn btn--accent" href="/contact/?scope=${encodeURIComponent(s.title)}">${esc(s.cta)} ${icon(
      'arrow',
    )}</a>
    <a class="btn btn--ghost" href="${site.phoneHref}">${icon('phone')} ${esc(site.phone)}</a>
  </div>
</div></section>

<section class="sec"><div class="wrap split split--60">
  <div>
    <span class="kicker">What’s included</span>
    <h2>Scope of work.</h2>
    <div class="acc mt-2">
      ${s.included
        .map(
          (i, idx) => `<details${idx === 0 ? ' open' : ''}>
        <summary>${esc(i.h)}</summary>
        <div class="acc__body"><p>${esc(i.p)}</p></div>
      </details>`,
        )
        .join('')}
    </div>
  </div>
  <div>
    <div class="pcard pcard--static">
      <div class="pcard__media">${img(`/assets/img/svc-${s.slug}.jpg`, `${s.title} work by TrioNest Spaces`, {
        w: 800,
        h: 500,
      })}</div>
      <div class="pcard__body">
        <p class="pcard__meta">Typical project types</p>
        <ul class="cell__list">
          ${s.projectTypes.map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('')}
        </ul>
      </div>
    </div>
  </div>
</div></section>

${
  s.gallery
    ? `<section class="sec sec--alt"><div class="wrap">
  <div class="sec__head sec__head--split">
    <div><span class="kicker">Environments</span><h2>The spaces a ${esc(s.title.toLowerCase())} scope delivers.</h2></div>
    <p>From reception to the last workstation — every environment in the programme is designed, drawn, built and snagged to the same standard.</p>
  </div>
  <div class="gallery">
    ${s.gallery
      .map(
        (g) => `<figure>${img(`/assets/img/${g.img}.jpg`, g.caption, { w: 800, h: 600 })}<figcaption>${esc(g.caption)}</figcaption></figure>`,
      )
      .join('')}
  </div>
</div></section>`
    : ''
}

<section class="sec sec--deep"><div class="wrap">
  <div class="sec__head sec__head--split">
    <div><span class="kicker">Delivery</span><h2>Our process for ${esc(s.title.toLowerCase())}.</h2></div>
    <p>${esc(s.processNote)}</p>
  </div>
  <p><a class="tlink" href="/process/">See all six stages and their deliverables ${icon('arrow')}</a></p>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec__head"><span class="kicker">Proof</span><h2>Relevant projects.</h2></div>
  ${relatedBlock}
</div></section>

${ctaBand({
  title: `${s.cta}.`,
  text: 'We survey the site before quoting, then issue a fixed-cost proposal against a frozen scope.',
  primary: { label: 'Request a site visit', href: '/contact/' },
  secondary: { label: 'Download company profile', href: '/company-profile/' },
})}
`,
  });
};
