import { esc, icon, fill } from './layout.mjs';
import { site } from '../data/site.mjs';
import { allClients, officeShowcase, testimonials } from '../data/clients.mjs';
import { processStages } from '../data/site.mjs';

export const img = (src, alt, { w, h, cls = '', eager = false, ratio } = {}) => {
  const tag = `<img src="${src}" alt="${esc(alt)}"${w ? ` width="${w}"` : ''}${h ? ` height="${h}"` : ''}${
    cls ? ` class="${cls}"` : ''
  } ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${
    ratio ? ` style="aspect-ratio:${ratio}"` : ''
  }>`;
  /* Site photography ships with a WebP twin (see tools/build script); use it when the src is a local JPG */
  if (/^\/assets\/img\/.+\.jpe?g$/.test(src)) {
    return `<picture><source srcset="${src.replace(/\.jpe?g$/, '.webp')}" type="image/webp">${tag}</picture>`;
  }
  return tag;
};

export const clientLogo = (c) =>
  `<img src="/assets/clients/${c.logo}.${c.ext || 'webp'}" alt="${esc(c.name)} logo" width="220" height="104" loading="lazy" decoding="async">`;

export const statBar = () => `<section class="stats" aria-label="Company at a glance">
  <div class="wrap"><div class="stats__grid">
    ${site.stats
      .map((s) => {
        const m = s.value.match(/^(\d+)(.*)$/);
        return `<div class="stat"><div class="stat__v"${
          m ? ` data-count="${m[1]}" data-suffix="${esc(m[2])}"` : ''
        }>${m ? `<span class="stat__num">0</span>${esc(m[2])}` : esc(s.value)}</div><div class="stat__l">${esc(
          s.label,
        )}</div></div>`;
      })
      .join('')}
  </div></div>
</section>`;

export const logoStrip = (label = 'Trusted by leaders across BFSI, technology, retail &amp; industry') => {
  const row = (hidden = false) =>
    allClients
      .map((c) => `<div class="logos__cell"${hidden ? ' aria-hidden="true"' : ''}>${clientLogo(c)}<span class="logos__name">${esc(c.name)}</span></div>`)
      .join('');
  return `
<section class="logos sec--alt" aria-label="Client logos">
  <div class="wrap">
    <p class="logos__label">${label}</p>
  </div>
  <div class="logos__marquee" data-marquee>
    <div class="logos__track">${row()}${row(true)}</div>
  </div>
  <div class="wrap">
    <p class="logos__more">Client names shown are organisations for which TrioNest Spaces has executed interior, electrical or HVAC scope. Trademarks belong to their respective owners.</p>
  </div>
</section>`;
};

export const clientOffices = () => `<section class="sec offices" aria-label="Client offices delivered">
  <div class="wrap">
    <div class="sec__head sec__head--split">
      <div>
        <span class="kicker">Client offices</span>
        <h2>Spaces we have delivered <em>for the brands you know.</em></h2>
      </div>
      <p>Showroom floors, delivery centres, branch networks and hospital campuses — each delivered with the same six-stage process, in the cities shown.</p>
    </div>
    <div class="offices__grid">
      ${officeShowcase
        .map(
          (o, i) => `<article class="ocard" data-reveal style="--rd:${i * 70}ms">
        <div class="ocard__media">${img(`/assets/img/${o.image}.jpg`, o.alt, { w: 800, h: 500 })}
          <div class="ocard__logo">${clientLogo({ name: o.client, logo: o.logo, ext: o.ext })}</div>
        </div>
        <div class="ocard__body">
          <h3>${esc(o.client)}</h3>
          <p class="ocard__kind">${esc(o.kind)}</p>
          <div class="ocard__meta">
            ${o.cities.length ? `<span class="ocard__cities">${o.cities.map((c) => `<span class="tag">${esc(c)}</span>`).join('')}</span>` : ''}
            <span class="ocard__note">${esc(o.note)}</span>
          </div>
        </div>
      </article>`,
        )
        .join('')}
    </div>
  </div>
</section>`;

export const processStrip = () => `<section class="sec sec--alt">
  <div class="wrap">
    <div class="sec__head sec__head--split">
      <div>
        <span class="kicker">How we work</span>
        <h2>A six-stage delivery process — the same on every project.</h2>
      </div>
      <p>Interiors only, electrical only, HVAC only or all three combined — the stages, the documentation and the handover pack do not change.</p>
    </div>
    <div class="steps">
      ${processStages
        .map(
          (s) => `<div class="step">
        <span class="step__n">${s.n}</span>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.short)}</p>
      </div>`,
        )
        .join('')}
    </div>
    <p class="mt-2"><a class="tlink" href="/process/">See the full process with stage deliverables ${icon(
      'arrow',
    )}</a></p>
  </div>
</section>`;

export const testimonialSection = (heading = 'What clients say') => {
  if (!testimonials.length) {
    return `<section class="sec">
      <div class="wrap">
        <span class="kicker">Client feedback</span>
        <h2>${esc(heading)}</h2>
        ${fill(
          'Written client testimonials — not yet published',
          'We publish testimonials only with a named person, designation, company and project reference, and only with written permission. Request 5–8 testimonials from past clients, add them to src/data/clients.mjs, and this section will render automatically across the homepage, the clients page and the relevant case studies.',
        )}
      </div>
    </section>`;
  }
  return `<section class="sec">
    <div class="wrap">
      <span class="kicker">Client feedback</span>
      <h2>${esc(heading)}</h2>
      <div class="carousel mt-2" data-carousel>
        <div class="carousel__track">
          ${testimonials
            .map(
              (t) => `<div class="carousel__item">
            <div class="quote">
              <blockquote>“${esc(t.quote)}”</blockquote>
              <cite><strong>${esc(t.name)}</strong>${esc(t.designation)}, ${esc(t.company)}${
                t.project ? ` — ${esc(t.project)}` : ''
              }</cite>
            </div>
          </div>`,
            )
            .join('')}
        </div>
        <div class="carousel__nav">
          <button class="carousel__btn" type="button" data-car-prev aria-label="Previous testimonial">${icon(
            'arrow',
          )}</button>
          <button class="carousel__btn" type="button" data-car-next aria-label="Next testimonial">${icon(
            'arrow',
          )}</button>
        </div>
      </div>
    </div>
  </section>`;
};

export const projectCard = (p) => `<a class="pcard" href="/projects/${p.slug}/" data-project
  data-sector="${esc(p.sector)}" data-vertical="${esc(p.verticals.join('|'))}" data-city="${esc(
  p.cities.join('|'),
)}">
  <div class="pcard__media">${img(`/assets/img/${p.image}.jpg`, `${p.name} — ${p.sector} project by TrioNest Spaces`, {
    w: 800,
    h: 500,
  })}<span class="pcard__go">${icon('arrow')}</span></div>
  <div class="pcard__body">
    <p class="pcard__meta">${esc(p.sector)} · ${esc(p.location)}</p>
    <h3>${esc(p.name)}</h3>
    <p>${esc(p.summary)}</p>
    <div class="pcard__tags">
      ${p.verticals.map((v) => `<span class="tag tag--accent">${esc(v)}</span>`).join('')}
      ${p.cities
        .slice(0, 2)
        .map((c) => `<span class="tag">${esc(c)}</span>`)
        .join('')}
    </div>
  </div>
</a>`;

/* Enquiry form — posts to the bundled database-free PHP mailer; mailto fallback if unset. */
export const enquiryForm = ({ compact = false, subject = 'Website enquiry', id = 'enquiry' } = {}) => `
<form class="formcard" data-form data-subject="${esc(subject)}" action="${site.formEndpoint}" method="POST" id="${id}">
  <input type="hidden" name="_subject" value="${esc(subject)}">
  <div class="hp" aria-hidden="true"><label for="${id}-gotcha">Leave this empty</label><input id="${id}-gotcha" type="text" name="_gotcha" tabindex="-1" autocomplete="off"></div>
  <div class="formgrid">
    <div class="field"><label for="${id}-name">Name <span class="req" aria-hidden="true">*</span></label>
      <input id="${id}-name" name="Name" type="text" autocomplete="name" required></div>
    <div class="field"><label for="${id}-company">Company <span class="req" aria-hidden="true">*</span></label>
      <input id="${id}-company" name="Company" type="text" autocomplete="organization" required></div>
    ${
      compact
        ? ''
        : `<div class="field"><label for="${id}-designation">Designation</label>
      <input id="${id}-designation" name="Designation" type="text" autocomplete="organization-title"></div>`
    }
    <div class="field"><label for="${id}-email">Work email <span class="req" aria-hidden="true">*</span></label>
      <input id="${id}-email" name="Email" type="email" autocomplete="email" required></div>
    <div class="field"><label for="${id}-phone">Phone <span class="req" aria-hidden="true">*</span></label>
      <input id="${id}-phone" name="Phone" type="tel" autocomplete="tel" required></div>
    ${
      compact
        ? ''
        : `<div class="field"><label for="${id}-location">Project location</label>
      <input id="${id}-location" name="Project_location" type="text" placeholder="City / site address"></div>`
    }
    <div class="field"><label for="${id}-scope">Scope of work <span class="req" aria-hidden="true">*</span></label>
      <select id="${id}-scope" name="Scope" required>
        <option value="">Select a scope</option>
        <option>Civil &amp; Interiors</option>
        <option>Electrical</option>
        <option>HVAC</option>
        <option>Combined / Turnkey</option>
        <option>AMC / FMS</option>
        <option>Not sure yet</option>
      </select></div>
    ${
      compact
        ? ''
        : `<div class="field"><label for="${id}-area">Approximate area (sq.ft)</label>
      <input id="${id}-area" name="Approx_area" type="text" inputmode="numeric" placeholder="e.g. 12,000"></div>
    <div class="field"><label for="${id}-start">Expected start date</label>
      <input id="${id}-start" name="Expected_start" type="date"></div>`
    }
    <div class="field field--full"><label for="${id}-msg">Requirement <span class="req" aria-hidden="true">*</span></label>
      <textarea id="${id}-msg" name="Requirement" required placeholder="Site condition, scope, timeline, any tender or BOQ reference."></textarea></div>
  </div>
  <div class="mt-1"><button class="btn btn--accent btn--lg btn--block" type="submit">Send enquiry ${icon(
    'arrow',
  )}</button></div>
  <div class="form__status" role="status" aria-live="polite"></div>
  <p class="form__note">Have a BOQ, floor plan or tender document? Email it to <a href="mailto:${
    site.email
  }" style="color:var(--accent)">${esc(site.email)}</a> quoting your company name. By submitting you agree to be contacted by ${esc(
  site.name,
)} about your enquiry. See our <a href="/privacy-policy/" style="color:var(--accent)">privacy policy</a>.</p>
</form>`;
