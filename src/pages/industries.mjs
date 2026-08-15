import { page, esc, icon, ctaBand, fill } from '../lib/layout.mjs';
import { industries } from '../data/industries.mjs';
import { projects, bySectorSlug } from '../data/projects.mjs';
import { projectCard, logoStrip } from '../lib/parts.mjs';
import { site } from '../data/site.mjs';

const sectorIcon = {
  'corporate-offices': 'layers',
  'retail-showrooms': 'globe',
  hospitality: 'star',
  healthcare: 'shield',
  'bfsi-banking': 'doc',
  industrial: 'tools',
  'co-working': 'users',
};

export const industriesIndex = page({
  title: 'Industries We Serve | TrioNest Spaces',
  desc: 'Interior, electrical and HVAC delivery for corporate offices, retail, hospitality, healthcare, BFSI, industrial and co-working spaces across India.',
  path: '/industries/',
  crumbs: [{ label: 'Industries', href: '/industries/' }],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Industries</span>
  <h1>Different sectors. <em>Different constraints.</em></h1>
  <p class="lede">A hospital cannot stop operating. A store has a trading date. A plant has a shutdown window. Sector experience is mostly about knowing which constraint sets the programme.</p>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec__head"><span class="kicker">Sectors</span><h2>Seven sectors we deliver in.</h2><p>Each page sets out what that sector demands of a fit-out partner, the typical scope, our work in it, and the questions clients most often ask.</p></div>
  <div class="grid grid--3">
    ${industries
      .map(
        (i) => `<a class="cell" href="/industries/${i.slug}/">
      <div class="cell__ico">${icon(sectorIcon[i.slug])}</div>
      <h3>${esc(i.title)}</h3>
      <p>${esc(i.intro)}</p>
      <p class="cell__foot"><span class="tlink">${esc(i.title)} fit-outs ${icon('arrow')}</span></p>
    </a>`,
      )
      .join('')}
  </div>
</div></section>

${logoStrip('Clients by sector')}
${ctaBand({ primary: { label: 'Request a proposal for your project', href: '/contact/' } })}
`,
});

export const industryPage = (ind) => {
  const rel = bySectorSlug(ind.slug);
  const relBlock = rel.length
    ? `<section class="sec"><div class="wrap">
        <div class="sec__head"><span class="kicker">Proof</span><h2>Our ${esc(
          ind.title.toLowerCase(),
        )} projects.</h2></div>
        <div class="pgrid">${rel.map(projectCard).join('')}</div>
      </div></section>`
    : `<section class="sec"><div class="wrap">
        <div class="sec__head"><span class="kicker">Proof</span><h2>Related capability.</h2>
        <p>We have not yet published a case study specific to this sector. The scope above is delivered by the same teams and to the same documented process as our published work — see the full project list, or ask us for references closest to your requirement.</p></div>
        <div class="flexrow"><a class="btn btn--ghost" href="/projects/">View all projects</a><a class="btn btn--ghost" href="/contact/">Ask for relevant references</a></div>
      </div></section>`;

  return page({
    title: ind.metaTitle,
    desc: ind.metaDesc,
    path: `/industries/${ind.slug}/`,
    crumbs: [
      { label: 'Industries', href: '/industries/' },
      { label: ind.title, href: `/industries/${ind.slug}/` },
    ],
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: ind.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
    body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Industries</span>
  <h1>${esc(ind.title)}</h1>
  <p class="lede">${esc(ind.intro)}</p>
  <div class="phero__cta">
    <a class="btn btn--accent" href="/contact/">Request a proposal for your ${esc(
      ind.title.toLowerCase(),
    )} project ${icon('arrow')}</a>
  </div>
</div></section>

<section class="sec"><div class="wrap split split--60">
  <div class="prose">
    <h2>What this sector needs from a fit-out partner</h2>
    <p>${esc(ind.need)}</p>
  </div>
  <div>
    <div class="tstep__deliv">
      <h3>Typical scope</h3>
      <ul>${ind.scope.map((s) => `<li>${icon('check')}<span>${esc(s)}</span></li>`).join('')}</ul>
    </div>
  </div>
</div></section>

${relBlock}

<section class="sec sec--alt"><div class="wrap">
  <div class="sec__head"><span class="kicker">FAQ</span><h2>${esc(ind.title)} — common questions.</h2></div>
  <div class="acc">
    ${ind.faqs
      .map(
        (f, i) => `<details${i === 0 ? ' open' : ''}>
      <summary>${esc(f.q)}</summary>
      <div class="acc__body"><p>${esc(f.a)}</p></div>
    </details>`,
      )
      .join('')}
  </div>
</div></section>

${ctaBand({
  title: `Planning a ${ind.title.toLowerCase()} project?`,
  text: 'We survey the site before quoting and issue a fixed-cost proposal against a frozen scope.',
  primary: { label: `Request a proposal`, href: '/contact/' },
  secondary: { label: 'Download company profile', href: '/company-profile/' },
})}
`,
  });
};
