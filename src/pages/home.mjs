import { page, esc, icon, ctaBand } from '../lib/layout.mjs';
import { site, whyReasons } from '../data/site.mjs';
import { services } from '../data/services.mjs';
import { projects } from '../data/projects.mjs';
import { locations, zonesWithLocations } from '../data/locations.mjs';
import {
  statBar,
  logoStrip,
  processStrip,
  testimonialSection,
  projectCard,
  enquiryForm,
  clientOffices,
  img,
} from '../lib/parts.mjs';

const featured = projects.slice(0, 3);

const jsonld = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': site.url + '/#organization',
    name: site.name,
    url: site.url,
    logo: site.url + '/assets/brand/logo.png',
    image: site.url + '/assets/brand/og-default.png',
    description: site.shortDesc,
    slogan: site.tagline,
    telephone: site.phone,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street + ', ' + site.address.locality,
      addressLocality: site.address.region,
      addressRegion: 'Delhi',
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    areaServed: [
      { '@type': 'Country', name: 'India' },
      ...locations.map((l) => ({ '@type': 'State', name: l.name })),
      ...site.cities.map((c) => ({ '@type': 'City', name: c })),
    ],
    sameAs: site.social.map((s) => s.href),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': site.url + '/#localbusiness',
    name: site.name,
    url: site.url,
    image: site.url + '/assets/brand/og-default.png',
    telephone: site.phone,
    email: site.email,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street + ', ' + site.address.locality,
      addressLocality: site.address.region,
      addressRegion: 'Delhi',
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
    ],
    areaServed: [{ '@type': 'Country', name: 'India' }, ...locations.map((l) => ({ '@type': 'State', name: l.name }))],
    makesOffer: services.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.intro },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: site.url,
    name: site.name,
    publisher: { '@id': site.url + '/#organization' },
  },
];

const svcIcon = { 'civil-interiors': 'layers', electrical: 'bolt', hvac: 'wind', 'amc-fms': 'tools' };
const whyIcon = ['shield', 'users', 'clock', 'check', 'tools', 'globe'];

const body = `
<section class="hero">
  <div class="hero__bg">${img('/assets/img/hero-office.jpg', 'Corporate workspace delivered by TrioNest Spaces', {
    w: 2000,
    h: 1250,
    eager: true,
  })}</div>
  <div class="hero__orb hero__orb--a" aria-hidden="true"></div>
  <div class="hero__orb hero__orb--b" aria-hidden="true"></div>
  <div class="wrap hero__inner">
    <span class="kicker" data-reveal style="--rd:0ms">Corporate Interiors · Electrical · HVAC</span>
    <h1 data-reveal style="--rd:80ms">One partner. Three <em>disciplines</em>.</h1>
    <p class="hero__sub" data-reveal style="--rd:160ms">Design-driven corporate interiors, end-to-end electrical contracting and PMBOK-led HVAC engineering — delivered as a single, accountable handover.</p>
    <div class="hero__cta" data-reveal style="--rd:240ms">
      <a class="btn btn--accent btn--lg" href="/contact/">Start your project ${icon('arrow')}</a>
      <a class="btn btn--ghost btn--lg" href="/projects/">See our projects</a>
    </div>
    <ul class="hero__pills" data-reveal style="--rd:320ms">
      <li class="pill">${icon('layers')} Civil &amp; Interiors</li>
      <li class="pill">${icon('bolt')} Electrical</li>
      <li class="pill">${icon('wind')} HVAC</li>
    </ul>
  </div>
  <div class="hero__ticker" aria-hidden="true">
    <div class="ticker__track">
      <span>One partner</span><i></i><span>One contract</span><i></i><span>One handover</span><i></i>
      <span>Delhi-NCR</span><i></i><span>Lucknow</span><i></i><span>Patna</span><i></i>
      <span>Kolkata</span><i></i><span>Gwalior</span><i></i><span>Jabalpur</span><i></i><span>Mehsana</span><i></i>
      <span>One partner</span><i></i><span>One contract</span><i></i><span>One handover</span><i></i>
      <span>Delhi-NCR</span><i></i><span>Lucknow</span><i></i><span>Patna</span><i></i>
      <span>Kolkata</span><i></i><span>Gwalior</span><i></i><span>Jabalpur</span><i></i><span>Mehsana</span><i></i>
    </div>
  </div>
</section>

${statBar()}
${logoStrip()}

<section class="sec">
  <div class="wrap">
    <div class="sec__head sec__head--split">
      <div>
        <span class="kicker">What we offer</span>
        <h2>Three integrated verticals. <em>One delivery team.</em></h2>
      </div>
      <p>Each vertical operates with a dedicated discipline head, but works to shared drawings and one programme — so design, electrical and HVAC scope never collide on site.</p>
    </div>
    <div class="grid grid--4">
      ${services
        .map(
          (s) => `<a class="cell vcard" href="/services/${s.slug}/">
        <span class="cell__n">${s.n}</span>
        <div class="cell__ico">${icon(svcIcon[s.slug])}</div>
        <h3>${esc(s.title)}</h3>
        <p class="vcard__kicker">${esc(s.kicker)}</p>
        <ul class="cell__list">
          ${s.included
            .slice(0, 4)
            .map((i) => `<li>${icon('check')}<span>${esc(i.h)}</span></li>`)
            .join('')}
        </ul>
        <p class="cell__foot"><span class="tlink">Explore ${esc(s.title)} ${icon('arrow')}</span></p>
      </a>`,
        )
        .join('')}
    </div>
  </div>
</section>

<section class="sec sec--deep">
  <div class="wrap">
    <div class="sec__head sec__head--split">
      <div>
        <span class="kicker">Why TrioNest</span>
        <h2>Six reasons clients choose us as <em>their delivery partner.</em></h2>
      </div>
      <p>Every claim below is backed by a process, a document or a named project — not by an adjective.</p>
    </div>
    <div class="grid grid--3">
      ${whyReasons
        .map(
          (r, i) => `<div class="cell">
        <span class="cell__n">${r.n}</span>
        <div class="cell__ico">${icon(whyIcon[i])}</div>
        <h3>${esc(r.title)}</h3>
        <p>${esc(r.short)}</p>
      </div>`,
        )
        .join('')}
    </div>
    <p class="mt-2"><a class="tlink" href="/about/">Read the detail behind each ${icon('arrow')}</a></p>
  </div>
</section>

${processStrip()}

<section class="sec">
  <div class="wrap">
    <div class="sec__head sec__head--split">
      <div>
        <span class="kicker">Selected work</span>
        <h2>Delivered, in execution, and <em>PAN-India in scale.</em></h2>
      </div>
      <p>Projects executed for CARS24, Centricity, Concentrix, Indian Oil / PDIL, L&amp;T Finance, Panasonic, Marelli, Dalmia Cement and GS Hospital, across seven active cities.</p>
    </div>
    <div class="pgrid">${featured.map(projectCard).join('')}</div>
    <p class="mt-2"><a class="tlink" href="/projects/">View all projects ${icon('arrow')}</a></p>
  </div>
</section>

${clientOffices()}

${testimonialSection('Client feedback')}

<section class="sec" id="coverage">
  <div class="wrap">
    <div class="sec__head sec__head--split">
      <div>
        <span class="kicker">PAN-India delivery network</span>
        <h2>${locations.length} states &amp; UTs. <em>One delivery standard.</em></h2>
      </div>
      <p>Survey, execution and handover run to the same documented process in every state. Locations marked with a dot have active TrioNest sites today.</p>
    </div>
    ${zonesWithLocations
      .map(
        ({ zone, items }) => `<div class="mb-1">
      <p class="vcard__kicker cov__zone">${esc(zone)} India</p>
      <div class="cov__chips">
        ${items
          .map(
            (l) => `<a class="cov__chip${l.hasActiveSites ? ' cov__chip--active' : ''}" href="/locations/${l.slug}/">${esc(l.name)}</a>`,
          )
          .join('')}
      </div>
    </div>`,
      )
      .join('')}
    <p class="mt-2"><a class="tlink" href="/locations/">See how PAN-India delivery works ${icon('arrow')}</a></p>
  </div>
</section>

<section class="sec sec--alt">
  <div class="wrap">
    <div class="sec__head">
      <span class="kicker">Compliance &amp; assurance</span>
      <h2>Documentation a procurement team can audit.</h2>
      <p>Empanelment documents, statutory registrations and insurance cover are published in full on our certifications page — we list only what we actually hold.</p>
    </div>
    <div class="grid grid--4">
      <a class="cell" href="/certifications/"><div class="cell__ico">${icon('doc')}</div><h3>Certifications &amp; compliance</h3><p>Statutory registrations, licences and insurance cover, listed and verifiable.</p></a>
      <a class="cell" href="/quality-safety/"><div class="cell__ico">${icon('shield')}</div><h3>Quality &amp; HSE</h3><p>MIR, WIR, stage-wise QC, snag closure, permit-to-work and daily safety inspection.</p></a>
      <a class="cell" href="/team/"><div class="cell__ico">${icon('users')}</div><h3>Leadership &amp; team</h3><p>How we are structured: core team, vertical heads and site-level project teams.</p></a>
      <a class="cell" href="/company-profile/"><div class="cell__ico">${icon('download')}</div><h3>Company profile</h3><p>One document covering verticals, projects, clients, process and coverage.</p></a>
    </div>
  </div>
</section>

<section class="sec" id="enquire">
  <div class="wrap split split--60">
    <div>
      <span class="kicker">Get in touch</span>
      <h2>Let’s discuss your <em>next space.</em></h2>
      <p class="lede">Tell us about the site, the timeline and the brief. We’ll come back with a free survey and a fixed-cost proposal.</p>
      <div class="contactlist mt-2">
        <a href="${site.phoneHref}">${icon('phone')}<span><strong>Call us</strong>${esc(site.phone)}</span></a>
        <a href="mailto:${site.email}">${icon('mail')}<span><strong>Email us</strong>${esc(site.email)}</span></a>
        <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">${icon(
  'whatsapp',
)}<span><strong>WhatsApp</strong>Message the project team</span></a>
        <div>${icon('pin')}<span><strong>Visit us</strong>${site.addressLines.map(esc).join('<br>')}</span></div>
      </div>
    </div>
    <div>${enquiryForm({ compact: true, subject: 'Homepage enquiry', id: 'home' })}</div>
  </div>
</section>
`;

export default page({
  title: 'TrioNest Spaces | Interiors, Electrical & HVAC — PAN India',
  desc: 'Corporate interiors, electrical contracting and HVAC engineering under one contract — delivered PAN-India from Delhi-NCR. 100+ projects, 100+ HVAC installations.',
  path: '/',
  body,
  jsonld,
});
