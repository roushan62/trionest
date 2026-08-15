import { page, esc, icon, ctaBand, fill } from '../lib/layout.mjs';
import { site, whyReasons, processStages } from '../data/site.mjs';
import { services } from '../data/services.mjs';
import { projects } from '../data/projects.mjs';
import { clientGroups, allClients, testimonials } from '../data/clients.mjs';
import { statBar, logoStrip, testimonialSection, enquiryForm, img, projectCard, clientLogo } from '../lib/parts.mjs';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const PROFILE_PDF = '/assets/docs/trionest-company-profile.pdf';
const profileReady = existsSync(
  join(dirname(fileURLToPath(import.meta.url)), '../assets/docs/trionest-company-profile.pdf'),
);

/* ============================================================ ABOUT */
export const about = page({
  title: 'About TrioNest Spaces | Single-Window Interiors, Electrical & HVAC',
  desc: 'TrioNest Spaces delivers corporate interiors, electrical contracting and HVAC engineering under one contract. Company snapshot, capabilities and how we are structured.',
  path: '/about/',
  crumbs: [{ label: 'About', href: '/about/' }],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">About us</span>
  <h1>One TrioNest. <em>Three end-to-end disciplines.</em></h1>
  <p class="lede">A design-driven interior and engineering solutions company delivering functional, aesthetic and future-ready environments across India — with electrical and HVAC held in-house rather than subcontracted away.</p>
</div></section>

${statBar()}

<section class="sec"><div class="wrap split split--60">
  <div class="prose">
    <h2>The problem we exist to solve</h2>
    <p>A corporate fit-out is usually bought as three contracts. An interior contractor builds the space. An electrical contractor wires it. An HVAC contractor cools it. Each is competent. Each is priced separately. And each is accountable only for their own scope.</p>
    <p>The gaps between those three contracts are where fit-out projects fail. The duct route that clashes with the ceiling grid. The supply from the DB to the indoor unit that nobody priced. The ceiling that cannot close because services above it are incomplete. None of these are build failures. They are coordination failures, and they are resolved through commercial negotiation between vendors while the client absorbs the delay.</p>
    <p>TrioNest Spaces was built to remove those gaps. Civil and interiors, electrical, and HVAC are three in-house verticals under one contract, one programme and one handover. Coordination happens as an internal design review before pricing, not as a site dispute after installation.</p>
    <p><strong>One partner. One contract. One handover.</strong></p>

    <h2>What we do</h2>
    <p>Building on our core strength in corporate interiors and turnkey fit-outs, we operate specialised in-house verticals for electrical contracting and HVAC engineering and maintenance. Backed by 15+ years of cumulative leadership experience across these trades, our combined teams have delivered 100+ HVAC installations, electrification of corporate, retail, hospitality and industrial sites, and PAN-India interior fit-outs.</p>
    <p>From concept to commissioning, every project moves under one accountable process — design, procurement, execution, MEP integration and post-handover support — so clients no longer juggle multiple vendors.</p>
  </div>
  <div>
    <div class="tablewrap">
      <table class="table">
        <caption class="vh">TrioNest Spaces company snapshot</caption>
        <tbody>
          <tr><th scope="row">Company</th><td>${esc(site.name)}</td></tr>
          <tr><th scope="row">Positioning</th><td>Corporate interiors, electrical contracting and HVAC engineering under a single accountable delivery team</td></tr>
          <tr><th scope="row">Verticals</th><td>Civil &amp; Interiors · Electrical · HVAC (plus AMC &amp; FMS)</td></tr>
          <tr><th scope="row">Headquarters</th><td>${site.addressLines.map(esc).join('<br>')}</td></tr>
          <tr><th scope="row">Coverage</th><td>${site.cities.map(esc).join(' · ')} — and PAN-India on rollout programmes</td></tr>
          <tr><th scope="row">Projects delivered</th><td>100+ projects, including 100+ HVAC installations</td></tr>
          <tr><th scope="row">Leadership experience</th><td>15+ years combined across interiors, electrical and HVAC</td></tr>
          <tr><th scope="row">Delivery method</th><td>PMBOK-based lifecycle, fixed-cost contracts, milestone payment plans</td></tr>
        </tbody>
      </table>
    </div>
    ${fill(
      'Founding year, legal entity type, registration numbers and team size',
      'Add the incorporation year, entity type (proprietorship / LLP / Pvt Ltd), CIN or registration number and current team size to complete this snapshot. Procurement teams look for these first.',
    )}
  </div>
</div></section>

<section class="sec sec--deep"><div class="wrap">
  <div class="sec__head"><span class="kicker">Capability summary</span><h2>What we hold in-house.</h2></div>
  <div class="grid grid--3">
    <div class="cell"><div class="cell__ico">${icon('layers')}</div><h3>Design</h3><p>Space planning, concept and 3D, GFC drawing sets, and MEP coordination drawings produced against the ceiling plan before pricing.</p></div>
    <div class="cell"><div class="cell__ico">${icon('tools')}</div><h3>Execution</h3><p>Civil, joinery, ceilings, flooring and finishes delivered by supervised site teams to a weekly-reported baseline programme.</p></div>
    <div class="cell"><div class="cell__ico">${icon('doc')}</div><h3>Procurement</h3><p>One consolidated plan across all three verticals, with a long-lead register released ahead of the construction sequence.</p></div>
    <div class="cell"><div class="cell__ico">${icon('bolt')}</div><h3>MEP engineering</h3><p>Electrical load schedules, SLDs and lighting design; HVAC heat-load calculation, equipment selection and duct design, in-house.</p></div>
    <div class="cell"><div class="cell__ico">${icon('clock')}</div><h3>Project management</h3><p>PMBOK-based lifecycle with a baseline programme, weekly reporting, a written variation process and a defined escalation path.</p></div>
    <div class="cell"><div class="cell__ico">${icon('shield')}</div><h3>Safety &amp; quality</h3><p>Permit-to-work, PPE enforcement and toolbox talks; MIR, WIR, stage-wise inspection, snagging and documented commissioning.</p></div>
  </div>
</div></section>

<section class="sec sec--alt"><div class="wrap">
  <div class="sec__head sec__head--split">
    <div><span class="kicker">The environments we build</span><h2>Every floor we hand over feels <em>like this.</em></h2></div>
    <p>Reception, workspace, boardroom, cafe, cabin and training floor — each environment is drawn, built and snagged to the same documented standard.</p>
  </div>
  <div class="gallery">
    <figure>${img('/assets/img/office-reception.jpg', 'Corporate reception lobby delivered by TrioNest Spaces', { w: 800, h: 600 })}<figcaption>Receptions — the brand's first impression</figcaption></figure>
    <figure>${img('/assets/img/office-boardroom.jpg', 'Executive boardroom delivered by TrioNest Spaces', { w: 800, h: 600 })}<figcaption>Boardrooms — acoustically treated, AV-ready</figcaption></figure>
    <figure>${img('/assets/img/office-cafe.jpg', 'Office cafeteria and breakout delivered by TrioNest Spaces', { w: 800, h: 600 })}<figcaption>Breakouts — where the floor actually meets</figcaption></figure>
  </div>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec__head"><span class="kicker">Why clients choose us</span><h2>Six commitments, and what each one actually means.</h2></div>
  <div class="grid grid--2">
    ${whyReasons
      .map(
        (r) => `<div class="cell"><span class="cell__n">${r.n}</span><h3>${esc(r.title)}</h3><p>${esc(
          r.long,
        )}</p></div>`,
      )
      .join('')}
  </div>
  <div class="flexrow mt-3">
    <a class="btn btn--ghost" href="/team/">Meet the leadership team</a>
    <a class="btn btn--ghost" href="/certifications/">View certifications &amp; compliance</a>
    <a class="btn btn--ghost" href="/quality-safety/">Our quality &amp; HSE regime</a>
  </div>
</div></section>

${logoStrip('Organisations we have delivered for')}
${ctaBand({
  title: 'Talk to the project team.',
  primary: { label: 'Request a site visit', href: '/contact/' },
})}
`,
});

/* ============================================================ PROCESS */
export const process = page({
  title: 'Our Delivery Process — Six Stages, With Deliverables | TrioNest Spaces',
  desc: 'From free survey and brief to handover and AMC: the six-stage TrioNest delivery process, with the documents and deliverables produced at every stage.',
  path: '/process/',
  crumbs: [{ label: 'Our process', href: '/process/' }],
  jsonld: [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'TrioNest Spaces six-stage project delivery process',
      description:
        'The delivery lifecycle used on every TrioNest Spaces interiors, electrical and HVAC project.',
      step: processStages.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.title,
        text: s.detail,
      })),
    },
  ],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">How we work</span>
  <h1>A six-stage delivery process — <em>same on every project.</em></h1>
  <p class="lede">Interiors only, electrical only, HVAC only, or all three combined. The stages do not change, and neither does the documentation you receive at each one.</p>
  <div class="phero__cta">
    <a class="btn btn--accent" href="/contact/">Request a free site survey ${icon('arrow')}</a>
    <a class="btn btn--ghost" href="/quality-safety/">See the QA/QC and HSE detail</a>
  </div>
</div></section>

<section class="sec sec--tight"><div class="wrap">
  <figure class="mbanner">
    ${img('/assets/img/process.jpg', 'TrioNest engineers reviewing coordinated drawings on a live fit-out site', { w: 1408, h: 768, eager: true })}
    <figcaption>Stage 2 in real life — the MEP coordination review that resolves services clashes on paper before they reach the site.</figcaption>
  </figure>
</div></section>

<section class="sec"><div class="wrap">
  <div class="timeline">
    ${processStages
      .map(
        (s) => `<article class="tstep" id="${s.slug}">
      <div class="tstep__num">${s.n}<span>STAGE ${s.n}</span></div>
      <div>
        <h2>${esc(s.title)}</h2>
        <p>${esc(s.detail)}</p>
      </div>
      <div class="tstep__deliv">
        <h3>Deliverables</h3>
        <ul>${s.deliverables.map((d) => `<li>${icon('check')}<span>${esc(d)}</span></li>`).join('')}</ul>
      </div>
    </article>`,
      )
      .join('')}
  </div>
</div></section>

<section class="sec sec--alt"><div class="wrap">
  <div class="sec__head"><span class="kicker">Reporting</span><h2>What you see while the project runs.</h2></div>
  <div class="grid grid--3">
    <div class="cell"><div class="cell__ico">${icon('doc')}</div><h3>Daily progress report</h3><p>Manpower deployed, activities completed, materials received and issues raised — recorded on site each working day.</p></div>
    <div class="cell"><div class="cell__ico">${icon('clock')}</div><h3>Weekly report vs baseline</h3><p>Progress measured against the baseline programme with photographs, so slippage is visible in week two rather than week ten.</p></div>
    <div class="cell"><div class="cell__ico">${icon('check')}</div><h3>Inspection records</h3><p>MIR and WIR raised at defined hold points, with signed checklists forming part of the handover pack.</p></div>
  </div>
</div></section>

${ctaBand({
  title: 'Start with a free survey.',
  text: 'We visit the site before quoting. You get a feasibility note, an indicative budget range and an outline programme.',
  primary: { label: 'Request a site visit', href: '/contact/' },
  secondary: { label: 'See our projects', href: '/projects/' },
})}
`,
});

/* ============================================================ QUALITY & SAFETY */
export const qualitySafety = page({
  title: 'Quality Control & HSE | TrioNest Spaces',
  desc: 'Our QA/QC regime — material inspection, mock-up and drawing approval, stage-wise inspection, snagging, testing and commissioning — and our health, safety and environment procedures.',
  path: '/quality-safety/',
  crumbs: [{ label: 'Quality & safety', href: '/quality-safety/' }],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Quality &amp; HSE</span>
  <h1>Quality is a record, <em>not a promise.</em></h1>
  <p class="lede">Every stage of a TrioNest project produces a signed document. That is what makes quality auditable rather than asserted — and it is what a client facilities or audit team can actually inspect.</p>
</div></section>

<section class="sec"><div class="wrap">
  <div class="sec__head"><span class="kicker">Quality control</span><h2>Seven control points between drawing and handover.</h2>
  <p>Each control point is a hold: work does not proceed past it until the record is signed.</p></div>
  <figure class="mbanner mb-2">
    ${img('/assets/img/quality.jpg', 'QC engineer with checklist inspecting services above the ceiling before closure', { w: 1408, h: 768 })}
    <figcaption>Stage-wise inspection in progress — services above the ceiling checked against the coordination drawing before closure.</figcaption>
  </figure>
  <div class="grid grid--3">
    <div class="cell"><span class="cell__n">01</span><h3>Material inspection</h3><p>Every delivery checked against the approved specification, quantity and condition, and recorded on a Material Inspection Request (MIR). Non-conforming material is rejected at the gate, not discovered at installation.</p></div>
    <div class="cell"><span class="cell__n">02</span><h3>Mock-up approval</h3><p>For repeated elements — workstation clusters, partition systems, ceiling details, typical joinery — a physical mock-up is built and approved before bulk production, so a detail error is caught once rather than a hundred times.</p></div>
    <div class="cell"><span class="cell__n">03</span><h3>Drawing approval</h3><p>Work proceeds only from the latest approved GFC revision. Superseded drawings are withdrawn from site, and the MEP coordination drawing governs where services and ceiling elements conflict.</p></div>
    <div class="cell"><span class="cell__n">04</span><h3>Stage-wise inspection</h3><p>Work Inspection Requests (WIR) raised at defined hold points — before concealment, before ceiling closure, before finishes. Concealed services are photographed before they are covered.</p></div>
    <div class="cell"><span class="cell__n">05</span><h3>Snagging</h3><p>A joint snag walk produces a numbered list with location, trade, owner and target date. The list is tracked to closure and re-inspected, rather than closed on a verbal assurance.</p></div>
    <div class="cell"><span class="cell__n">06</span><h3>Testing &amp; commissioning</h3><p>Electrical: insulation resistance, earth resistance, polarity and phase sequence, protective device operation, panel functional testing, emergency lighting. HVAC: airflow balancing, refrigerant charge, temperature and control verification.</p></div>
    <div class="cell"><span class="cell__n">07</span><h3>Final inspection &amp; handover</h3><p>Joint inspection against the approved drawings and BOQ, signed snag closure, and issue of the complete handover pack including as-builts, test reports, O&amp;M manuals, warranties and the asset list.</p></div>
    <div class="cell"><div class="cell__ico">${icon('doc')}</div><h3>Document types you receive</h3>
      <ul class="cell__list">
        <li>${icon('check')}<span>Material Inspection Request (MIR)</span></li>
        <li>${icon('check')}<span>Work Inspection Request (WIR)</span></li>
        <li>${icon('check')}<span>Stage-wise QC checklists</span></li>
        <li>${icon('check')}<span>Numbered snag list with closure sign-off</span></li>
        <li>${icon('check')}<span>Electrical and HVAC testing reports</span></li>
        <li>${icon('check')}<span>As-built drawings and O&amp;M manuals</span></li>
      </ul>
    </div>
  </div>
  ${fill(
    'Redacted sample documents — MIR, WIR, QC checklist, snag list, test report',
    'Upload one redacted example of each document type to src/assets/docs/ and link them here. A procurement team that can see your actual inspection paperwork is far more likely to shortlist you than one reading a description of it.',
  )}
</div></section>

<section class="sec sec--deep"><div class="wrap">
  <div class="sec__head"><span class="kicker">Health, safety &amp; environment</span><h2>What we enforce on site, every day.</h2>
  <p>Fit-out sites combine wet trades, work at height, hot works and partially energised systems, often inside an occupied building. Our HSE regime is built around that reality.</p></div>
  <figure class="mbanner mb-2">
    ${img('/assets/img/safety.jpg', 'Morning toolbox talk with site workers in full PPE on a TrioNest fit-out site', { w: 1408, h: 768 })}
    <figcaption>The daily toolbox talk — attendance recorded before work starts, every crew, every site, every day.</figcaption>
  </figure>
  <div class="grid grid--3">
    <div class="cell"><div class="cell__ico">${icon('shield')}</div><h3>Safety induction</h3><p>No worker enters the site without an induction covering the site layout, hazards, emergency routes, assembly point and reporting lines. Induction is recorded and re-run for every new crew.</p></div>
    <div class="cell"><div class="cell__ico">${icon('check')}</div><h3>PPE compliance</h3><p>Helmet, safety shoes, high-visibility vest and task-specific PPE — gloves, eye protection, full-body harness, insulated tools — enforced as a condition of site access, checked at entry and during daily inspections.</p></div>
    <div class="cell"><div class="cell__ico">${icon('users')}</div><h3>Toolbox talks</h3><p>A short daily briefing before work starts, covering the day's activities, the specific hazards involved and the controls in place. Attendance is recorded.</p></div>
    <div class="cell"><div class="cell__ico">${icon('doc')}</div><h3>Permit to work</h3><p>Written permits for hot works, work at height, confined space entry, electrical work and any activity affecting base-building systems. Each permit names the work, the controls, the competent person and the time window, and is closed on completion.</p></div>
    <div class="cell"><div class="cell__ico">${icon('layers')}</div><h3>Work at height</h3><p>Scaffolding erected and inspected before use, mobile towers with outriggers and locked castors, full-body harness with anchor point above the work position, and exclusion zones below overhead work.</p></div>
    <div class="cell"><div class="cell__ico">${icon('bolt')}</div><h3>Electrical safety</h3><p>Isolation, lock-out and tag-out before work on any circuit; proving dead at the point of work; RCD-protected temporary distribution; cables routed off the floor and out of wet areas; only qualified electricians on electrical systems.</p></div>
    <div class="cell"><div class="cell__ico">${icon('warn')}</div><h3>Fire safety</h3><p>Extinguishers at hot-work locations and on every floor in use, fire watch maintained during and after hot works, escape routes kept clear, flammable material stored away from ignition sources, and base-building detection isolated and restored under permit.</p></div>
    <div class="cell"><div class="cell__ico">${icon('tools')}</div><h3>Housekeeping &amp; waste</h3><p>Daily clearance of debris, segregated waste, designated material storage, protected access routes and dust containment where works adjoin occupied areas.</p></div>
    <div class="cell"><div class="cell__ico">${icon('phone')}</div><h3>Incident reporting &amp; emergency response</h3><p>All incidents and near-misses reported and investigated for root cause, with corrective action recorded. Emergency contacts, assembly points and evacuation routes displayed on site and covered in every induction.</p></div>
  </div>
  ${fill(
    'Safety statistics, HSE certifications and insurance cover',
    'Add real, verifiable figures only — e.g. lost-time injury count, safe man-hours, ISO 45001 status, workmen compensation and public liability policy details. Do not publish a safety statistic you cannot evidence from records.',
  )}
</div></section>

${ctaBand({
  title: 'Need our HSE and QA/QC documentation for empanelment?',
  text: 'We can share our method statements, inspection formats and compliance documents for vendor registration and tender submission.',
  primary: { label: 'Talk to the project team', href: '/contact/' },
  secondary: { label: 'View certifications', href: '/certifications/' },
})}
`,
});

/* ============================================================ CERTIFICATIONS */
const certItems = [
  ['GST registration', 'Goods and Services Tax registration number', 'doc'],
  ['PAN', 'Permanent Account Number of the entity', 'doc'],
  ['CIN / LLP / entity registration', 'Company or LLP registration details', 'doc'],
  ['MSME / Udyam registration', 'Udyam registration number and category', 'doc'],
  ['ISO 9001 — Quality management', 'Certificate number, issuing body and validity', 'shield'],
  ['ISO 14001 — Environmental management', 'Certificate number, issuing body and validity', 'shield'],
  ['ISO 45001 — Occupational health & safety', 'Certificate number, issuing body and validity', 'shield'],
  ['PF registration', 'Employees Provident Fund establishment code', 'users'],
  ['ESIC registration', 'Employees State Insurance registration number', 'users'],
  ['Labour licence / compliance', 'Contract labour licence and compliance status', 'doc'],
  ['Electrical contractor licence', 'Licence number, class and issuing state authority', 'bolt'],
  ['Workmen compensation insurance', 'Policy number, insurer and sum insured', 'shield'],
  ['Public liability insurance', 'Policy number, insurer and sum insured', 'shield'],
  ['Professional indemnity insurance', 'Policy number, insurer and sum insured', 'shield'],
  ['OEM / channel authorisations', 'HVAC brand authorisations held, with validity', 'wind'],
];

export const certifications = page({
  title: 'Certifications & Compliance | TrioNest Spaces',
  desc: 'Statutory registrations, licences, insurance cover and OEM authorisations held by TrioNest Spaces — published for vendor empanelment and tender submission.',
  path: '/certifications/',
  crumbs: [{ label: 'Certifications', href: '/certifications/' }],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Certifications &amp; compliance</span>
  <h1>We publish only <em>what we actually hold.</em></h1>
  <p class="lede">This page exists for procurement and vendor-empanelment teams. Each item below is listed with its status. Nothing is claimed that cannot be evidenced with a document.</p>
</div></section>

<section class="sec"><div class="wrap">
  ${fill(
    'Certification data not yet published',
    'For each item below, add the registration or certificate number, issuing authority and validity date, and upload a copy (redacted where necessary) to src/assets/docs/. Remove any item you do not hold — an accurate short list is worth more than a long list with unverifiable entries.',
  )}
  <h2 class="mt-3" style="font-size:1.3rem">Registrations, licences and insurance</h2>
  <div class="badges mt-2">
    ${certItems
      .map(
        ([t, note, ic]) => `<div class="badge">
      <div class="badge__ico">${icon(ic)}</div>
      <span class="badge__state">Awaiting details</span>
      <h3>${esc(t)}</h3>
      <p>${esc(note)}</p>
    </div>`,
      )
      .join('')}
  </div>
  <div class="prose mt-3">
    <h2>What we can provide on request today</h2>
    <p>Pending publication of the items above, we can share the following directly with a procurement or empanelment team:</p>
    <ul>
      <li>Company profile and capability statement</li>
      <li>Client and project reference list, with contactable references where the client permits</li>
      <li>QA/QC inspection formats and HSE method statements</li>
      <li>Statutory and insurance documents applicable to your tender requirements</li>
    </ul>
    <p><a href="/contact/">Request our compliance pack</a> and specify the documents your process requires.</p>
  </div>
</div></section>

${ctaBand({
  title: 'Need documents for vendor empanelment?',
  text: 'Tell us which documents your procurement process requires and we will send the pack.',
  primary: { label: 'Request compliance pack', href: '/contact/' },
  secondary: { label: 'Download company profile', href: '/company-profile/' },
})}
`,
});

/* ============================================================ TEAM */
const roles = [
  ['Founder / Director', 'Overall delivery accountability, client relationships and commercial governance.'],
  ['Design Head', 'Space planning, concept and GFC drawing sets, material specification and design sign-off.'],
  ['Project Director', 'Programme ownership across live sites, resourcing and escalation management.'],
  ['Project Manager', 'Day-to-day site delivery, baseline programme, weekly reporting and client coordination.'],
  ['QS / Commercial Head', 'BOQ, measurement, variation control, billing and subcontractor commercial management.'],
  ['Procurement Head', 'Consolidated procurement plan, long-lead register, vendor management and material approvals.'],
  ['Electrical Head', 'Electrical design, load schedules and SLDs, installation supervision, testing and commissioning.'],
  ['HVAC Head', 'Heat-load design, equipment selection, installation supervision, balancing and commissioning.'],
  ['Safety Head', 'HSE regime, inductions, permits, daily safety inspection and incident investigation.'],
];

export const team = page({
  title: 'Leadership & Team | TrioNest Spaces',
  desc: 'How TrioNest Spaces is structured: core leadership, vertical discipline heads and site-level project teams supported by a vetted vendor network.',
  path: '/team/',
  crumbs: [{ label: 'Leadership & team', href: '/team/' }],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Leadership &amp; team</span>
  <h1>Discipline heads, <em>not generalists.</em></h1>
  <p class="lede">Each vertical is owned by a lead who signs off drawings, material approvals and testing for that trade. The project manager coordinates the programme; the vertical head owns the engineering.</p>
</div></section>

<section class="sec sec--tight"><div class="wrap">
  <figure class="mbanner">
    ${img('/assets/img/team.jpg', 'The TrioNest Spaces project team on a completed office floor', { w: 1408, h: 768 })}
    <figcaption>The delivery team on a recently handed-over floor — the same people from survey to snag closure.</figcaption>
  </figure>
</div></section>

<section class="sec"><div class="wrap">
  <div class="split split--60">
    <div class="prose">
      <h2>How we are structured</h2>
      <p>TrioNest runs on three layers, and we describe them honestly because the question every procurement team asks — how does a focused team deliver 100+ projects — deserves a straight answer.</p>
      <p><strong>A core leadership team</strong> holds client relationships, commercial governance and delivery accountability. This group is small by design, and it does not change between the pitch and the project.</p>
      <p><strong>Vertical discipline heads</strong> own the engineering for interiors, electrical and HVAC across every live site. Technical decisions, drawing approvals and testing sign-off sit here, which is how a multi-city rollout stays consistent.</p>
      <p><strong>Site-level project teams</strong> — project managers, site engineers, supervisors and safety officers — are deployed per project and scaled to the size and city of the job, supported by a vetted network of specialist subcontractors and labour contractors who work with us repeatedly and to our QA/QC and HSE standards.</p>
      <p>That structure is what lets us hold a fixed core team while running simultaneous sites in several cities. It also means the accountability line is short: a site issue reaches the vertical head and the project director the same day.</p>
    </div>
    <div>
      <div class="tablewrap">
        <table class="table">
          <caption class="vh">Delivery structure</caption>
          <tbody>
            <tr><th scope="row">Core leadership</th><td>Client relationship, commercial governance, delivery accountability</td></tr>
            <tr><th scope="row">Vertical heads</th><td>Interiors, electrical, HVAC — engineering and sign-off across all sites</td></tr>
            <tr><th scope="row">Site teams</th><td>Project manager, site engineers, supervisors, safety officer per project</td></tr>
            <tr><th scope="row">Vendor network</th><td>Vetted specialist subcontractors working to TrioNest QA/QC and HSE standards</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div></section>

<section class="sec sec--deep"><div class="wrap">
  <div class="sec__head"><span class="kicker">The team</span><h2>Roles that own your project.</h2>
  <p>Named profiles are being published progressively. The roles below are the ones staffed on a typical TrioNest project.</p></div>
  ${fill(
    'Leadership names, designations, experience and photographs',
    'Publicly associated with TrioNest on LinkedIn today: Ajay Pandey and Moin Khan. Add each leader’s real name, designation, years of experience, one-line specialisation and a photograph (square crop, 800×800, saved to src/assets/img/team/). An invisible team is the single biggest credibility gap on a B2B contracting site.',
  )}
  <div class="people mt-2">
    ${roles
      .map(
        ([r, s]) => `<div class="person">
      <div class="person__ph">${icon('users')}</div>
      <div class="person__b">
        <h3>Name to be published</h3>
        <p class="person__role">${esc(r)}</p>
        <p>${esc(s)}</p>
      </div>
    </div>`,
      )
      .join('')}
  </div>
</div></section>

${ctaBand({
  title: 'Want to meet the team before you appoint?',
  text: 'We will bring the project manager and the relevant vertical head to the first meeting, not just a salesperson.',
  primary: { label: 'Arrange a meeting', href: '/contact/' },
  secondary: { label: 'See our process', href: '/process/' },
})}
`,
});

/* ============================================================ CLIENTS */
export const clients = page({
  title: 'Clients & Testimonials | TrioNest Spaces',
  desc: 'Organisations across BFSI, technology, retail, industrial, legal and healthcare sectors for which TrioNest Spaces has delivered interior, electrical and HVAC scope.',
  path: '/clients/',
  crumbs: [{ label: 'Clients', href: '/clients/' }],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Clients</span>
  <h1>Trusted across <em>BFSI, technology, retail &amp; industry.</em></h1>
  <p class="lede">${allClients.length} organisations, seven active cities, and scope spanning interiors, electrical and HVAC. Every name below is a client we have executed work for.</p>
</div></section>

${statBar()}

<section class="sec"><div class="wrap">
  ${clientGroups
    .map(
      (g) => `<div class="mt-3">
    <h2 style="font-size:1.15rem;margin-bottom:1rem">${esc(g.sector)}</h2>
    <div class="logos__grid">
      ${g.clients
        .map((c) => `<div class="logos__cell" title="${esc(c.name)}">${clientLogo(c)}</div>`)
        .join('')}
    </div>
  </div>`,
    )
    .join('')}
  <p class="logos__more mt-3">Trademarks belong to their respective owners; names are shown to identify projects executed by TrioNest Spaces. Sector grouping reflects the client’s primary industry.</p>
</div></section>

${testimonialSection('Testimonials')}

<section class="sec sec--alt"><div class="wrap">
  <div class="sec__head"><span class="kicker">Reviews</span><h2>Google Business Profile.</h2></div>
  ${fill(
    'Google Reviews embed',
    'Once your Google Business Profile has verified reviews, embed the reviews widget here. Do not use a third-party widget that displays reviews from other sources, and never generate placeholder reviews.',
  )}
</div></section>

${ctaBand({
  title: 'Ask us for a client reference.',
  text: 'Where the client permits it, we will put you in touch with a facilities or procurement contact who has worked with us.',
  primary: { label: 'Request a reference', href: '/contact/' },
  secondary: { label: 'View projects', href: '/projects/' },
})}
`,
});

/* ============================================================ COMPANY PROFILE */
export const companyProfile = page({
  title: 'Download Company Profile | TrioNest Spaces',
  desc: 'Download the TrioNest Spaces company profile — verticals, team, projects, clients, certifications, safety, QA/QC, delivery process and geographic coverage in one document.',
  path: '/company-profile/',
  crumbs: [{ label: 'Company profile', href: '/company-profile/' }],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Company profile</span>
  <h1>One document for <em>your procurement file.</em></h1>
  <p class="lede">Everything a shortlisting or empanelment team needs to evaluate TrioNest Spaces, in a single PDF.</p>
</div></section>

<section class="sec"><div class="wrap split split--60">
  <div class="prose">
    <h2>What is inside</h2>
    <ul>
      <li>Company introduction, positioning and legal entity details</li>
      <li>The three verticals — Civil &amp; Interiors, Electrical, HVAC — with full scope of services</li>
      <li>Delivery structure: core team, vertical heads and site-level project teams</li>
      <li>Project list and selected case studies</li>
      <li>Client list by sector</li>
      <li>Certifications, statutory registrations and insurance cover</li>
      <li>QA/QC regime and inspection document formats</li>
      <li>HSE policy and site safety procedures</li>
      <li>The six-stage delivery process with stage deliverables</li>
      <li>Geographic coverage and contact details</li>
    </ul>
    ${fill(
      'company-profile.pdf not yet uploaded',
      'Place the finished PDF at src/assets/docs/trionest-company-profile.pdf. The button opposite already points at that path, so the download works the moment the file exists. Keep it under 8 MB so it opens quickly on mobile.',
    )}
    <h2>Capability statement</h2>
    <p>A shorter capability statement for tender and procurement teams — scope, capacity, compliance and references on two pages — is in preparation and will be published here.</p>
  </div>
  <div>
    <div class="formcard">
      <h2 style="font-size:1.2rem">Download the profile</h2>
      <p class="dim" style="font-size:.92rem">No gate, no form. Take the document to your procurement meeting.</p>
      ${
        profileReady
          ? `<a class="btn btn--accent btn--lg btn--block mt-1" href="${PROFILE_PDF}" download>${icon(
              'download',
            )} Download company profile (PDF)</a>
      <p class="form__note">Approximately 3 MB. If you need it with a tailored reference list, email <a href="mailto:${
        site.email
      }" style="color:var(--accent)">${esc(site.email)}</a>.</p>`
          : `<a class="btn btn--accent btn--lg btn--block mt-1" href="mailto:${
              site.email
            }?subject=Company%20profile%20request">${icon(
              'mail',
            )} Request the company profile</a>
      <p class="form__note">The PDF is being finalised. Email us and we will send the current profile and a project reference list the same working day. Once <code>src/assets/docs/trionest-company-profile.pdf</code> exists, this button becomes a direct download automatically.</p>`
      }
      <hr>
      <h3 style="font-size:1.02rem">Want it sent with a tailored reference list?</h3>
      <p class="dim" style="font-size:.9rem">Tell us your sector and we will include the most relevant projects.</p>
      <a class="btn btn--ghost btn--block" href="/contact/">Request a tailored profile</a>
    </div>
  </div>
</div></section>

${ctaBand({
  title: 'Evaluating contractors for a live requirement?',
  primary: { label: 'Get a fixed-cost proposal', href: '/contact/' },
  secondary: { label: 'View certifications', href: '/certifications/' },
})}
`,
});

/* ============================================================ CAREERS */
export const careers = page({
  title: 'Careers | TrioNest Spaces',
  desc: 'Work with TrioNest Spaces — site engineers, MEP designers, project managers and safety officers across interiors, electrical and HVAC delivery.',
  path: '/careers/',
  crumbs: [{ label: 'Careers', href: '/careers/' }],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Careers</span>
  <h1>Build spaces that <em>outlast the warranty.</em></h1>
  <p class="lede">We are always interested in hearing from experienced site engineers, MEP designers and project managers.</p>
</div></section>

<section class="sec"><div class="wrap split split--60">
  <div class="prose">
    <h2>Working at TrioNest</h2>
    <p>Our teams run interiors, electrical and HVAC on the same project, which means engineers here see the whole delivery rather than one trade in isolation. You will work to a documented process — baseline programmes, inspection records, permits, testing reports — and you will be accountable for your scope end to end. We are a focused team, so responsibility arrives early and decisions are not buried in layers of approval.</p>
    <h2>Roles we regularly hire</h2>
    <ul>
      <li>Site engineers — civil and interiors</li>
      <li>Electrical engineers — installation, testing and commissioning</li>
      <li>HVAC engineers — design, installation and commissioning</li>
      <li>MEP designers and CAD draughtspersons</li>
      <li>Project managers and planning engineers</li>
      <li>Quantity surveyors and billing engineers</li>
      <li>Safety officers</li>
      <li>Procurement and store executives</li>
    </ul>
    <h2>How to apply</h2>
    <p>Email your CV to <a href="mailto:${site.email}?subject=Application%20%E2%80%94%20%5Brole%5D">${esc(
    site.email,
  )}</a> with the role in the subject line. Include the cities you can work in, your years of experience by trade, and two or three projects you have delivered with your specific responsibility on each. We read every application and reply to those we can take forward.</p>
  </div>
  <div>
    <div class="formcard">
      <h2 style="font-size:1.15rem">Current openings</h2>
      <p class="dim" style="font-size:.93rem">We do not have dated vacancies listed at the moment. Applications from experienced candidates in the roles listed are welcome year-round, and we keep strong CVs on file for the next mobilisation.</p>
      <a class="btn btn--accent btn--block mt-1" href="mailto:${site.email}?subject=Application%20%E2%80%94%20TrioNest%20Spaces">${icon(
    'mail',
  )} Email your CV</a>
      <a class="btn btn--ghost btn--block mt-1" href="${site.social[0].href}" target="_blank" rel="noopener">Follow us on LinkedIn</a>
    </div>
  </div>
</div></section>
`,
});
