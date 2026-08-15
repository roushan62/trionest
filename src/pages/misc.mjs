import { page, esc, icon, ctaBand, fill } from '../lib/layout.mjs';
import { posts } from '../data/blog.mjs';
import { site } from '../data/site.mjs';
import { enquiryForm, img } from '../lib/parts.mjs';

/* ============================================================ BLOG */
export const blogIndex = page({
  title: 'Insights | TrioNest Spaces',
  desc: 'Practical notes on commercial fit-out delivery, HVAC coordination, BOQ review, electrical safety and multi-city rollouts, written by the TrioNest delivery team.',
  path: '/blog/',
  crumbs: [{ label: 'Insights', href: '/blog/' }],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Insights</span>
  <h1>Notes from <em>the delivery side.</em></h1>
  <p class="lede">Written for the people who commission fit-outs — facilities heads, procurement teams and project sponsors. Specifics, not marketing.</p>
</div></section>

<section class="postlist">
  ${posts
    .map(
      (p) => `<article class="post"><div class="wrap" style="display:grid;grid-template-columns:inherit;gap:inherit">
    <div class="post__meta">
      <span class="post__cat">${esc(p.category)}</span>
      <span>${esc(p.dateLabel)}</span>
      <span>${esc(p.readTime)}</span>
    </div>
    <div>
      <h2><a href="/blog/${p.slug}/">${esc(p.title)}</a></h2>
      <p>${esc(p.excerpt)}</p>
      <a class="tlink" href="/blog/${p.slug}/">Read the article ${icon('arrow')}</a>
    </div>
  </div></article>`,
    )
    .join('')}
</section>

${ctaBand({
  title: 'Planning a project rather than reading about one?',
  primary: { label: 'Get a fixed-cost proposal', href: '/contact/' },
  secondary: { label: 'See our process', href: '/process/' },
})}
`,
});

const renderBody = (blocks) =>
  blocks
    .map((b) => {
      if (b.t === 'h2') return `<h2>${esc(b.c)}</h2>`;
      if (b.t === 'h3') return `<h3>${esc(b.c)}</h3>`;
      if (b.t === 'ul') return `<ul>${b.c.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
      return `<p>${esc(b.c)}</p>`;
    })
    .join('\n');

export const blogPost = (p, all) => {
  const more = all.filter((x) => x.slug !== p.slug).slice(0, 3);
  return page({
    title: `${p.metaTitle || p.title} | TrioNest Spaces`,
    desc: p.metaDesc || p.excerpt,
    path: `/blog/${p.slug}/`,
    crumbs: [
      { label: 'Insights', href: '/blog/' },
      { label: p.title, href: `/blog/${p.slug}/` },
    ],
    jsonld: [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.excerpt,
        datePublished: p.date,
        dateModified: p.date,
        articleSection: p.category,
        author: { '@type': 'Organization', name: site.name, url: site.url },
        publisher: {
          '@type': 'Organization',
          name: site.name,
          logo: { '@type': 'ImageObject', url: site.url + '/assets/brand/logo.svg' },
        },
        mainEntityOfPage: `${site.url}/blog/${p.slug}/`,
        image: site.url + '/assets/brand/og-default.png',
      },
    ],
    body: `
<section class="phero"><div class="wrap phero__inner article__head">
  <span class="kicker">${esc(p.category)}</span>
  <h1>${esc(p.title)}</h1>
  <div class="article__meta">
    <span>${esc(p.dateLabel)}</span><span>${esc(p.readTime)}</span><span>TrioNest Spaces delivery team</span>
  </div>
  <p class="lede">${esc(p.excerpt)}</p>
</div></section>

<section class="sec"><div class="wrap">
  <article class="prose">${renderBody(p.body)}</article>
  <hr>
  <div class="flexrow">
    <a class="btn btn--accent" href="/contact/">Talk to the project team ${icon('arrow')}</a>
    <a class="btn btn--ghost" href="/process/">See our delivery process</a>
  </div>
</div></section>

<section class="sec sec--alt"><div class="wrap">
  <div class="sec__head"><span class="kicker">More insights</span><h2>Related reading.</h2></div>
  <div class="grid grid--3">
    ${more
      .map(
        (m) => `<a class="cell" href="/blog/${m.slug}/">
      <span class="cell__n">${esc(m.category)}</span>
      <h3>${esc(m.title)}</h3>
      <p>${esc(m.excerpt)}</p>
    </a>`,
      )
      .join('')}
  </div>
</div></section>
`,
  });
};

/* ============================================================ CONTACT */
export const contact = page({
  title: 'Contact & Request for Proposal | TrioNest Spaces',
  desc: 'Request a free site survey and a fixed-cost proposal for interiors, electrical or HVAC scope. Call +91 93195 74674 or email spaces@trionest.in.',
  path: '/contact/',
  crumbs: [{ label: 'Contact', href: '/contact/' }],
  jsonld: [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      url: site.url + '/contact/',
      mainEntity: {
        '@type': 'Organization',
        name: site.name,
        telephone: site.phone,
        email: site.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address.street + ', ' + site.address.locality,
          addressLocality: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: 'IN',
        },
      },
    },
  ],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Contact</span>
  <h1>Request a survey and a <em>fixed-cost proposal.</em></h1>
  <p class="lede">Tell us about the site, the scope and the date you need to occupy. We survey before quoting, and we quote against a frozen scope with written exclusions.</p>
</div></section>

<section class="sec"><div class="wrap split split--60">
  <div>
    <h2 style="font-size:1.3rem">Project enquiry</h2>
    ${enquiryForm({ subject: 'Request for proposal — website', id: 'rfp' })}
  </div>
  <div class="stack">
    <div class="contactlist">
      <a href="${site.phoneHref}">${icon('phone')}<span><strong>Call</strong>${esc(site.phone)}</span></a>
      <a href="mailto:${site.email}">${icon('mail')}<span><strong>Email</strong>${esc(site.email)}</span></a>
      <a href="https://wa.me/${site.whatsapp}" target="_blank" rel="noopener">${icon(
    'whatsapp',
  )}<span><strong>WhatsApp</strong>Message the project team</span></a>
      <div>${icon('pin')}<span><strong>Office</strong>${site.addressLines.map(esc).join('<br>')}</span></div>
      <div>${icon('clock')}<span><strong>Office hours</strong>${esc(site.hours)}</span></div>
      <div>${icon('globe')}<span><strong>Active locations</strong>${esc(site.cities.join(' · '))}</span></div>
    </div>

    <div class="map">
      <iframe
        title="Map showing the TrioNest Spaces office in Mustafabad, New Delhi"
        src="https://www.google.com/maps?q=${encodeURIComponent(
          'Mustafabad, New Delhi, 110094',
        )}&output=embed"
        loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>

    <div class="tstep__deliv">
      <h3>What happens next</h3>
      <ul>
        <li>${icon('check')}<span>We acknowledge your enquiry, usually within one working day.</span></li>
        <li>${icon('check')}<span>We arrange a free site survey at a time that suits your building access.</span></li>
        <li>${icon('check')}<span>You receive a feasibility note, an indicative budget range and an outline programme.</span></li>
        <li>${icon('check')}<span>On approval to proceed, we issue drawings, a priced BOQ and a fixed-cost proposal.</span></li>
      </ul>
    </div>
  </div>
</div></section>
`,
});

/* ============================================================ LEGAL */
const legalNote = fill(
  'Have a lawyer review before publishing',
  'This is a reasonable standard document generated for a static corporate site. It has not been reviewed by a legal professional and must be checked against the Digital Personal Data Protection Act 2023, your actual data handling practices and your contract terms before you rely on it.',
);

export const privacy = page({
  title: 'Privacy Policy | TrioNest Spaces',
  desc: 'How TrioNest Spaces collects, uses, stores and protects personal information submitted through this website.',
  path: '/privacy-policy/',
  crumbs: [{ label: 'Privacy policy', href: '/privacy-policy/' }],
  noindex: false,
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Legal</span><h1>Privacy policy</h1>
  <p class="lede">Last updated: 15 August 2026</p>
</div></section>
<section class="sec"><div class="wrap"><div class="prose">
  ${legalNote}
  <h2>1. Who we are</h2>
  <p>${esc(site.name)} ("TrioNest", "we", "us") operates this website. Our registered address is ${site.addressLines
    .map(esc)
    .join(', ')}. You can contact us at <a href="mailto:${site.email}">${esc(
    site.email,
  )}</a> or ${esc(site.phone)}.</p>

  <h2>2. Information we collect</h2>
  <p>We collect only the information you choose to give us. Through the enquiry and proposal-request forms on this site, that is typically your name, company, designation, email address, telephone number, project location, scope of work, approximate area, expected start date and the details of your requirement.</p>
  <p>If you email or message us documents such as floor plans, BOQs or tender documents, we hold those as part of your enquiry record.</p>
  <p>Our web host and any form-processing service we use may automatically record technical information such as IP address, browser type and pages requested, for security and operational purposes.</p>

  <h2>3. How we use your information</h2>
  <ul>
    <li>To respond to your enquiry and arrange a site survey</li>
    <li>To prepare drawings, a BOQ and a proposal for your project</li>
    <li>To deliver and administer a project you appoint us for</li>
    <li>To meet legal, tax, statutory and contractual obligations</li>
    <li>To send occasional information about our services, where you have asked to receive it</li>
  </ul>
  <p>We do not sell your personal information, and we do not share it for third-party marketing.</p>

  <h2>4. Legal basis and consent</h2>
  <p>We process the information you submit on the basis of your consent, given when you send an enquiry, and where relevant for the performance of a contract or to comply with a legal obligation. You may withdraw consent at any time by contacting us; this does not affect processing already carried out.</p>

  <h2>5. Sharing with third parties</h2>
  <p>We may share information with service providers who help us operate, specifically our website host, our form-processing provider and our email provider. We may share project-related information with subcontractors, suppliers or consultants where it is necessary to deliver your project, and with professional advisers or authorities where the law requires it. Each is expected to protect the information and use it only for the stated purpose.</p>

  <h2>6. Retention</h2>
  <p>Enquiry records are retained for as long as necessary to respond and to maintain a record of business correspondence. Project records are retained for the duration of the contract, the warranty and any statutory retention period that applies afterwards.</p>

  <h2>7. Security</h2>
  <p>We apply reasonable technical and organisational measures to protect personal information against unauthorised access, alteration, disclosure or destruction. This site is served over HTTPS. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.</p>

  <h2>8. Your rights</h2>
  <p>Subject to applicable law, you may ask us to confirm what personal information we hold about you, to correct inaccurate information, to erase information we no longer need, or to stop sending you marketing communications. Write to <a href="mailto:${
    site.email
  }">${esc(site.email)}</a> and we will respond within a reasonable period.</p>

  <h2>9. Cookies</h2>
  <p>This website does not set advertising or tracking cookies. Embedded third-party content, such as the Google Maps frame on our contact page, may set cookies under its own provider's policy. Fonts are loaded from Google Fonts. You can block or delete cookies in your browser settings.</p>

  <h2>10. Children</h2>
  <p>This website is intended for business use and is not directed at children. We do not knowingly collect personal information from children.</p>

  <h2>11. Changes</h2>
  <p>We may update this policy from time to time. The current version is always published on this page with its revision date.</p>

  <h2>12. Contact</h2>
  <p>Questions about this policy or about how we handle your information: <a href="mailto:${
    site.email
  }">${esc(site.email)}</a> · ${esc(site.phone)} · ${site.addressLines.map(esc).join(', ')}.</p>
</div></div></section>
`,
});

export const terms = page({
  title: 'Terms of Service | TrioNest Spaces',
  desc: 'Terms governing use of the TrioNest Spaces website, including content accuracy, intellectual property, enquiries and limitation of liability.',
  path: '/terms/',
  crumbs: [{ label: 'Terms', href: '/terms/' }],
  body: `
<section class="phero"><div class="wrap phero__inner">
  <span class="kicker">Legal</span><h1>Terms of service</h1>
  <p class="lede">Last updated: 15 August 2026</p>
</div></section>
<section class="sec"><div class="wrap"><div class="prose">
  ${legalNote}
  <h2>1. Acceptance</h2>
  <p>By accessing or using this website you agree to these terms. If you do not accept them, please do not use the site.</p>

  <h2>2. About this website</h2>
  <p>This site is operated by ${esc(site.name)}, ${site.addressLines
    .map(esc)
    .join(', ')}. It provides information about our interior fit-out, electrical contracting and HVAC engineering services.</p>

  <h2>3. Information is indicative, not an offer</h2>
  <p>Content on this site is provided for general information. Descriptions of services, scope, capability and past projects are indicative and do not constitute an offer, a quotation or a contractual commitment. Any proposal we issue is governed by its own written terms, scope, exclusions and conditions, which prevail over anything stated here.</p>

  <h2>4. Accuracy</h2>
  <p>We take care to keep the site accurate and current, but we do not warrant that it is complete, error-free or up to date at all times. Sections marked as placeholders indicate content that is being prepared and should not be relied upon.</p>

  <h2>5. Intellectual property</h2>
  <p>The design, text, graphics, photographs and other content on this site are owned by or licensed to ${esc(
    site.name,
  )} and are protected by applicable intellectual property law. You may view and print pages for your own business evaluation. You may not reproduce, republish, distribute or use our content commercially without our written permission.</p>
  <p>Third-party names and logos shown on this site, including client logos, remain the property of their respective owners and are used to identify projects executed by ${esc(
    site.name,
  )}.</p>

  <h2>6. Enquiries and submissions</h2>
  <p>Information you submit through our forms must be accurate and must be information you are entitled to share. Do not submit confidential third-party material without authority. Submitting an enquiry does not create a contract; a contract arises only when a written proposal is accepted and a work order or purchase order is issued.</p>

  <h2>7. Third-party links and embeds</h2>
  <p>This site may link to or embed third-party services, such as mapping, messaging or form processing. We do not control those services and are not responsible for their content, availability or privacy practices.</p>

  <h2>8. Limitation of liability</h2>
  <p>To the fullest extent permitted by law, ${esc(
    site.name,
  )} shall not be liable for any indirect, incidental, special or consequential loss, or for any loss of profit, revenue, data or business, arising out of or in connection with your use of this website or reliance on its content.</p>

  <h2>9. Availability</h2>
  <p>We may modify, suspend or withdraw all or part of this website at any time without notice.</p>

  <h2>10. Governing law and jurisdiction</h2>
  <p>These terms are governed by the laws of India. The courts at Delhi shall have exclusive jurisdiction over any dispute arising from them.</p>

  <h2>11. Contact</h2>
  <p><a href="mailto:${site.email}">${esc(site.email)}</a> · ${esc(site.phone)}</p>
</div></div></section>
`,
});

/* ============================================================ 404 */
export const notFound = page({
  title: 'Page not found | TrioNest Spaces',
  desc: 'The page you requested could not be found. Return to the TrioNest Spaces homepage or contact our team.',
  path: '/404.html',
  noindex: true,
  body: `
<section class="e404"><div class="wrap">
  <div class="code">404</div>
  <h1>That page doesn’t exist.</h1>
  <p class="lede" style="margin-inline:auto">The link may be out of date, or the page may have moved. Everything on this site is one click from the menu above.</p>
  <div class="flexrow mt-2" style="justify-content:center">
    <a class="btn btn--accent btn--lg" href="/">Back to home ${icon('arrow')}</a>
    <a class="btn btn--ghost btn--lg" href="/contact/">Contact us</a>
    <a class="btn btn--ghost btn--lg" href="/projects/">See our projects</a>
  </div>
</div></section>
`,
});
