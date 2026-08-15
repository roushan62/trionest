import { page, esc, icon, ctaBand } from '../lib/layout.mjs';
import { locations, zonesWithLocations } from '../data/locations.mjs';
import { services } from '../data/services.mjs';
import { industries } from '../data/industries.mjs';
import { site } from '../data/site.mjs';
import { statBar } from '../lib/parts.mjs';

const svcIcon = { 'civil-interiors': 'layers', electrical: 'bolt', hvac: 'wind', 'amc-fms': 'tools' };
const industryBySlug = (s) => industries.find((i) => i.slug === s);

/* ====================================================== INDEX */
export const locationsIndex = page({
  title: 'PAN-India Coverage — Locations We Serve | TrioNest Spaces',
  desc: 'Corporate interiors, electrical contracting and HVAC engineering across every Indian state from our Delhi-NCR base. Free surveys, fixed-cost proposals, documented handovers.',
  path: '/locations/',
  crumbs: [{ label: 'PAN-India coverage', href: '/locations/' }],
  jsonld: [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'TrioNest Spaces service locations across India',
      url: site.url + '/locations/',
      numberOfItems: locations.length,
      itemListElement: locations.map((l, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: l.name,
        url: `${site.url}/locations/${l.slug}/`,
      })),
    },
  ],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">PAN-India coverage</span>
  <h1>One partner, <em>every state.</em></h1>
  <p class="lede">Active sites in ${site.cities.join(', ')} — and a delivery model built to carry the same specification, the same documentation and the same accountability to every state and union territory in the country.</p>
  <div class="phero__cta">
    <a class="btn btn--accent" href="/contact/">Request a survey in your city ${icon('arrow')}</a>
    <a class="btn btn--ghost" href="/projects/">See where we have delivered</a>
  </div>
</div></section>

${statBar()}

<section class="sec"><div class="wrap">
  <div class="sec__head"><span class="kicker">Service network</span><h2>${locations.length} states &amp; union territories, six zones.</h2>
  <p>Every page below sets out where we work in that state, what the market typically asks of us, and how delivery is run from our Delhi-NCR base.</p></div>
  ${zonesWithLocations
    .map(
      ({ zone, items }) => `<div class="mt-3">
    <h3 class="loc__zone">${esc(zone)} India</h3>
    <div class="loc__grid">
      ${items
        .map(
          (l) => `<a class="loc__card" href="/locations/${l.slug}/">
        <span class="loc__name">${esc(l.name)}${l.hasActiveSites ? ' <span class="loc__dot" title="Active site presence"></span>' : ''}</span>
        <span class="loc__meta">${esc(l.kind)} · ${esc(l.cities.slice(0, 3).join(', '))}</span>
      </a>`,
        )
        .join('')}
    </div>
  </div>`,
    )
    .join('')}
  <p class="logos__more mt-3">Locations marked <span class="loc__dot loc__dot--inline" aria-hidden="true"></span> have active TrioNest site presence today. For the remaining union territories — Ladakh, Andaman &amp; Nicobar, Lakshadweep and Dadra &amp; Nagar Haveli and Daman &amp; Diu — speak to us directly; remote projects are planned through the nearest regional hub.</p>
</div></section>

<section class="sec sec--alt"><div class="wrap">
  <div class="sec__head"><span class="kicker">How multi-state delivery works</span><h2>Same drawings. Same QC records. Same handover — in every state.</h2></div>
  <div class="grid grid--3">
    <div class="cell"><div class="cell__ico">${icon('doc')}</div><h3>One central specification</h3><p>Drawings, BOQ line structure and material specifications are produced centrally, so a branch in Patna and a branch in Pune are built to the same standard and priced on the same basis.</p></div>
    <div class="cell"><div class="cell__ico">${icon('pin')}</div><h3>Mobilised local teams</h3><p>Site teams are mobilised per project and led by our own project managers. Regional supply corridors — Guwahati for the Northeast, Siliguri for Sikkim, Chennai for the far south — are built into the programme, not discovered mid-way.</p></div>
    <div class="cell"><div class="cell__ico">${icon('layers')}</div><h3>One programme, weekly reports</h3><p>All sites sit on one baseline programme with weekly photographic reporting. A procurement or facilities head sees every city’s status in the same format, every week.</p></div>
  </div>
</div></section>

${ctaBand({
  title: 'Planning a project in any of these states?',
  text: 'We survey anywhere in India before quoting, and the proposal is fixed-cost against a frozen scope.',
  primary: { label: 'Request a site survey', href: '/contact/' },
})}
`,
});

/* ====================================================== STATE PAGE */
export const locationPage = (l) => {
  const citySentence =
    l.cities.length > 2
      ? `${l.cities.slice(0, -1).join(', ')} and ${l.cities[l.cities.length - 1]}`
      : l.cities.join(' and ');

  const faqs = [
    {
      q: `Do you take on projects anywhere in ${l.name}?`,
      a: `Yes. We work across ${l.name} — ${citySentence} and the districts between them. Every engagement starts with a physical site survey by our own team, wherever the site is. There is no minimum city tier; the deciding factor is scope, not postcode.`,
    },
    {
      q: `Which cities in ${l.name} do you cover?`,
      a: `Our regular circuit covers ${citySentence}. Sites outside these centres are serviceable — remote locations are planned with staged procurement and mobilised teams so the delivery standard does not change with the pin code.`,
    },
    {
      q: `How is quality controlled on a ${l.name} site when your office is in Delhi-NCR?`,
      a: `The same way it is controlled in Delhi: MIR and WIR inspection records at hold points, photographic stage records, weekly reports against the baseline programme, and testing and commissioning signed by the vertical head. The QC regime is documentation-driven, so it survives distance — and ${l.hasActiveSites ? `${l.name} already runs on it at our active sites there.` : `it is the same regime our active-site states already run on.`}`,
    },
  ];

  const focusIndustries = l.sectors.map(industryBySlug).filter(Boolean);

  return page({
    title: `${l.name}: Interiors, Electrical & HVAC | TrioNest`,
    desc: `Corporate interiors, electrical & HVAC in ${l.cities.slice(0, 3).join(', ')} and across ${l.name}. Free survey, fixed-cost proposal, documented handover by TrioNest.`,
    path: `/locations/${l.slug}/`,
    crumbs: [
      { label: 'PAN-India coverage', href: '/locations/' },
      { label: l.name, href: `/locations/${l.slug}/` },
    ],
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: `Corporate interiors, electrical and HVAC contracting in ${l.name}`,
        provider: { '@type': 'Organization', name: site.name, url: site.url, telephone: site.phone },
        areaServed: { '@type': 'State', name: l.name, containedInPlace: { '@type': 'Country', name: 'India' } },
        serviceType: 'Interior fit-out, electrical contracting, HVAC engineering',
        url: `${site.url}/locations/${l.slug}/`,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
    body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">${esc(l.zone)} India · ${esc(l.kind)}</span>
  <h1>Interiors, electrical &amp; HVAC in <em>${esc(l.name)}.</em></h1>
  <p class="lede">${esc(l.note)}</p>
  <div class="phero__cta">
    <a class="btn btn--accent" href="/contact/">Request a survey in ${esc(l.name)} ${icon('arrow')}</a>
    <a class="btn btn--ghost" href="${site.phoneHref}">${icon('phone')} ${esc(site.phone)}</a>
  </div>
  ${l.hasActiveSites ? `<p class="loc__live">${icon('pin')} TrioNest has active site presence in ${esc(l.name)} today.</p>` : ''}
</div></section>

<section class="sec"><div class="wrap split split--60">
  <div class="prose">
    <h2>Working in ${esc(l.name)}</h2>
    <p>${esc(l.note)}</p>
    <p>As elsewhere in India, scope here is bought best as one contract: civil and interiors, electrical and HVAC priced once against a frozen BOQ, coordinated on one drawing set and handed over as a single documented package. Our six-stage delivery process applies in ${esc(l.name)} exactly as it does at our Delhi-NCR base — survey before quoting, fixed-cost proposal, baseline programme, stage-wise inspection and a handover pack your facilities team can audit.</p>
    <p>Every project starts with our own engineers on your site — not a franchise agent and not a subcontracted survey. What we document there becomes the feasibility note, the indicative budget range and the outline programme you receive before spending anything.</p>
  </div>
  <div>
    <div class="tstep__deliv">
      <h3>Where we work in ${esc(l.name)}</h3>
      <ul>${l.cities.map((c) => `<li>${icon('pin')}<span>${esc(c)}</span></li>`).join('')}</ul>
      <p class="dim" style="font-size:.85rem;margin-top:.75rem">State capital: ${esc(l.capital)}. Other districts are served on a mobilised-site model.</p>
    </div>
    <div class="tstep__deliv mt-2">
      <h3>Typical sectors in ${esc(l.name)}</h3>
      <ul>${focusIndustries
        .map((i) => `<li>${icon('check')}<span><a href="/industries/${i.slug}/" style="color:inherit">${esc(i.title)}</a></span></li>`)
        .join('')}</ul>
    </div>
  </div>
</div></section>

<section class="sec sec--deep"><div class="wrap">
  <div class="sec__head"><span class="kicker">Scope in ${esc(l.name)}</span><h2>Four service lines, one contract.</h2>
  <p>Buy one vertical or all three. The pricing, documentation and handover standard are identical in every state we work in.</p></div>
  <div class="grid grid--4">
    ${services
      .map(
        (s) => `<a class="cell vcard" href="/services/${s.slug}/">
      <span class="cell__n">${s.n}</span>
      <div class="cell__ico">${icon(svcIcon[s.slug])}</div>
      <h3>${esc(s.title)}</h3>
      <p class="vcard__kicker">${esc(s.kicker)}</p>
      <p class="cell__foot"><span class="tlink">${esc(s.cta)} ${icon('arrow')}</span></p>
    </a>`,
      )
      .join('')}
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec__head"><span class="kicker">FAQ</span><h2>${esc(l.name)} — common questions.</h2></div>
  <div class="acc">
    ${faqs
      .map(
        (f, i) => `<details${i === 0 ? ' open' : ''}>
      <summary>${esc(f.q)}</summary>
      <div class="acc__body"><p>${esc(f.a)}</p></div>
    </details>`,
      )
      .join('')}
  </div>
  <p class="mt-2"><a class="tlink" href="/locations/">See all locations we serve ${icon('arrow')}</a></p>
</div></section>

${ctaBand({
  title: `Planning a project in ${l.name}?`,
  text: 'We survey the site before quoting — anywhere in India — then issue a fixed-cost proposal against a frozen scope.',
  primary: { label: 'Request a site survey', href: '/contact/' },
  secondary: { label: 'Download company profile', href: '/company-profile/' },
})}
`,
  });
};
