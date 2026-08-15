import { page, esc, icon, ctaBand, fill } from '../lib/layout.mjs';
import { projects, sectors, verticalsList, cityList } from '../data/projects.mjs';
import { projectCard, img, statBar } from '../lib/parts.mjs';
import { site } from '../data/site.mjs';

export const projectsIndex = page({
  title: 'Projects & Case Studies | TrioNest Spaces',
  desc: 'Interior, electrical and HVAC projects delivered for CARS24, Centricity, Concentrix, Indian Oil/PDIL, L&T Finance, Panasonic and Dalmia Cement. Filter by sector, vertical and city.',
  path: '/projects/',
  crumbs: [{ label: 'Projects', href: '/projects/' }],
  jsonld: [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'TrioNest Spaces projects',
      url: site.url + '/projects/',
      hasPart: projects.map((p) => ({
        '@type': 'CreativeWork',
        name: p.name,
        url: `${site.url}/projects/${p.slug}/`,
        about: p.sector,
      })),
    },
  ],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Projects</span>
  <h1>Delivered, in execution, and <em>PAN-India in scale.</em></h1>
  <p class="lede">Filter by sector, vertical or city. Detailed case studies are published progressively as client approvals are received — we do not publish project detail we cannot evidence.</p>
</div></section>

${statBar()}

<section class="sec"><div class="wrap">
  <div class="sec__head"><span class="kicker">Portfolio</span><h2>Project list.</h2><p>Filter the list by sector, vertical or city.</p></div>
  <div class="filters">
    <div class="field">
      <label for="f-sector">Sector</label>
      <select id="f-sector"><option value="">All sectors</option>${sectors
        .map((s) => `<option value="${esc(s)}">${esc(s)}</option>`)
        .join('')}</select>
    </div>
    <div class="field">
      <label for="f-vertical">Vertical</label>
      <select id="f-vertical"><option value="">All verticals</option>${verticalsList
        .map((v) => `<option value="${esc(v)}">${esc(v)}</option>`)
        .join('')}</select>
    </div>
    <div class="field">
      <label for="f-city">City</label>
      <select id="f-city"><option value="">All cities</option>${cityList
        .map((c) => `<option value="${esc(c)}">${esc(c)}</option>`)
        .join('')}</select>
    </div>
  </div>
  <div class="flexrow" style="justify-content:space-between;align-items:center;margin-bottom:1.5rem">
    <p class="filters__count" id="f-count" role="status" aria-live="polite">${projects.length} projects</p>
    <button class="btn btn--ghost btn--sm" type="button" id="f-reset">Reset filters</button>
  </div>
  <div class="pgrid" id="project-grid">${projects.map(projectCard).join('')}</div>
  <div class="noresults mt-2" id="f-empty" hidden>No projects match those filters. <button class="tlink" type="button" onclick="document.getElementById('f-reset').click()" style="background:none;border:0;cursor:pointer">Reset filters</button></div>
</div></section>

<section class="sec sec--alt"><div class="wrap">
  <div class="sec__head"><span class="kicker">Note on disclosure</span><h2>Why some detail is not published.</h2>
  <p>Several of our clients treat floor area, project value and site photography as confidential. Where that applies we publish the client, the sector, the city and the scope, and withhold the rest. Full case-study detail, including planned versus actual duration and photographs, is released only with written client approval — and shared privately with prospective clients on request.</p></div>
  <div class="flexrow"><a class="btn btn--accent" href="/contact/">Request detailed references</a><a class="btn btn--ghost" href="/company-profile/">Download company profile</a></div>
</div></section>

${ctaBand({ primary: { label: 'Discuss your project', href: '/contact/' } })}
`,
});

export const projectPage = (p, all) => {
  const related = all.filter((x) => x.slug !== p.slug && (x.sectorSlug === p.sectorSlug || x.verticals.some((v) => p.verticals.includes(v)))).slice(0, 3);

  const factRow = (label, value, fallback = 'On request') =>
    `<div class="fact"><dt>${esc(label)}</dt><dd>${esc(value || fallback)}</dd></div>`;

  const section = (heading, content, fillLabel, fillNote) => `
    <h2>${esc(heading)}</h2>
    ${content ? `<p>${esc(content)}</p>` : fill(fillLabel, fillNote)}`;

  return page({
    title: `${p.shortName || p.name} | TrioNest Spaces`,
    desc: (p.metaDesc || p.summary).slice(0, 180),
    path: `/projects/${p.slug}/`,
    crumbs: [
      { label: 'Projects', href: '/projects/' },
      { label: p.name, href: `/projects/${p.slug}/` },
    ],
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: p.name,
        about: p.sector,
        description: p.summary,
        creator: { '@type': 'Organization', name: site.name, url: site.url },
        locationCreated: { '@type': 'Place', name: p.location },
      },
    ],
    body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">${esc(p.sector)} · ${esc(p.verticals.join(' + '))}</span>
  <h1>${esc(p.name)}</h1>
  <p class="lede">${esc(p.summary)}</p>
</div></section>

<section class="sec sec--tight"><div class="wrap">
  <dl class="facts">
    ${factRow('Client', p.client)}
    ${factRow('Location', p.location)}
    ${factRow('Sector', p.sector)}
    ${factRow('Scope', p.verticals.join(', '))}
    ${factRow('Area', p.area, 'Not disclosed')}
    ${factRow('Duration (planned)', p.durationPlanned, 'To be published')}
    ${factRow('Duration (actual)', p.durationActual, 'To be published')}
    ${factRow('Project value', p.value, 'Confidential')}
  </dl>
  ${
    !p.published
      ? fill(
          'Full case study in preparation',
          `Verified summary published. To complete this case study, fill in area, planned vs actual duration, requirement, design concept, execution breakdown, challenges and solutions, commissioning summary and photographs in src/data/projects.mjs, then set published: true. Planned versus actual duration is the single most persuasive number on this page — publish it when the client permits.`,
        )
      : ''
  }
</div></section>

<section class="sec"><div class="wrap split split--60">
  <div class="prose">
    ${section(
      'Client requirement',
      p.requirement,
      'Client requirement',
      'Two to three sentences on what the client asked for, the constraint that mattered most, and the date they had to meet.',
    )}
    ${section(
      'Design concept & space planning',
      p.concept,
      'Design concept and space planning summary',
      'How the brief translated into a layout: work-setting mix, circulation, materials strategy and any brand or compliance standard applied.',
    )}
    <h2>Execution</h2>
    ${
      p.execution
        ? `<h3>Civil &amp; interiors</h3><p>${esc(p.execution.civil || '—')}</p>
           <h3>Electrical</h3><p>${esc(p.execution.electrical || '—')}</p>
           <h3>HVAC</h3><p>${esc(p.execution.hvac || '—')}</p>`
        : fill(
            'Scope breakdown by vertical',
            'Break the delivered scope into civil/interiors, electrical and HVAC with specifics — partition area, DB count, panel ratings, tonnage installed, system type. Specifics are what a technical evaluator reads.',
          )
    }
    <h2>Challenges &amp; solutions</h2>
    ${
      p.challenges && p.challenges.length
        ? `<ul>${p.challenges.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`
        : fill(
            'Challenges and how they were solved',
            'This section builds more credibility than any other. Be specific and honest: the constraint encountered, what it threatened, what you did, and the outcome. Two or three real examples beat a page of adjectives.',
          )
    }
    ${section(
      'Testing, commissioning & handover',
      p.commissioning,
      'Testing, commissioning and handover summary',
      'Which tests were performed, what documentation was issued, how snags were closed and what training was given.',
    )}
  </div>
  <div>
    <div class="tstep__deliv">
      <h3>Verified summary</h3>
      <ul>
        <li>${icon('check')}<span>Client: ${esc(p.client)}</span></li>
        <li>${icon('check')}<span>Sector: ${esc(p.sector)}</span></li>
        <li>${icon('check')}<span>Location: ${esc(p.location)}</span></li>
        ${p.verticals.map((v) => `<li>${icon('check')}<span>Scope: ${esc(v)}</span></li>`).join('')}
      </ul>
    </div>
    <div class="mt-2 formcard">
      <h3 style="font-size:1.05rem">Want the detail?</h3>
      <p class="dim" style="font-size:.9rem">We can walk a prospective client through this project in detail, including documentation and, where the client permits, a reference call.</p>
      <a class="btn btn--accent btn--block" href="/contact/">Talk to the project team ${icon('arrow')}</a>
    </div>
  </div>
</div></section>

<section class="sec sec--alt"><div class="wrap">
  <div class="sec__head"><span class="kicker">Gallery</span><h2>Before, during and after.</h2></div>
  ${
    p.gallery && p.gallery.length
      ? `<div class="gallery">${p.gallery
          .map(
            (g) =>
              `<figure>${img(g.src, g.alt, { w: 800, h: 600 })}<figcaption>${esc(
                g.caption,
              )}</figcaption></figure>`,
          )
          .join('')}</div>`
      : fill(
          'Project photography — before, during and after',
          'Add 6–9 real photographs to src/assets/img/projects/' +
            p.slug +
            '/ and list them in the project gallery array. Include at least one progress shot showing services above the ceiling before closure — that image proves more about your work than a finished render.',
        )
  }
</div></section>

${
  p.testimonial
    ? `<section class="sec"><div class="wrap"><div class="quote">
        <blockquote>“${esc(p.testimonial.quote)}”</blockquote>
        <cite><strong>${esc(p.testimonial.name)}</strong>${esc(p.testimonial.designation)}, ${esc(
        p.testimonial.company,
      )}</cite>
      </div></div></section>`
    : ''
}

${
  related.length
    ? `<section class="sec"><div class="wrap">
      <div class="sec__head"><span class="kicker">More work</span><h2>Related projects.</h2></div>
      <div class="pgrid">${related.map(projectCard).join('')}</div>
    </div></section>`
    : ''
}

${ctaBand({
  title: 'Have a similar requirement?',
  primary: { label: 'Get a fixed-cost proposal', href: '/contact/' },
  secondary: { label: 'View all projects', href: '/projects/' },
})}
`,
  });
};
