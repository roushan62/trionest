/* Core company facts. Single source of truth for the whole site.
   Only verified facts live here. Anything unverified must be a FILL block. */

export const site = {
  name: 'TrioNest Spaces',
  tagline: 'One Partner. Three Disciplines.',
  shortDesc:
    'Design-driven corporate interiors, end-to-end electrical contracting and HVAC engineering, delivered as a single accountable handover.',
  url: 'https://trionest.in',
  phone: '+91 93195 74674',
  phoneHref: 'tel:+919319574674',
  whatsapp: '919319574674',
  email: 'spaces@trionest.in',
  address: {
    street: 'KH No. 361-362, H.No. 8, Gali 22',
    locality: 'Mustafabad',
    region: 'New Delhi',
    postalCode: '110094',
    country: 'IN',
  },
  addressLines: ['KH No. 361-362, H.No. 8, Gali 22', 'Mustafabad, New Delhi, 110094'],
  hours: 'Monday to Saturday, 10:00 – 19:00 IST',
  // Verified stats only. Do not round up.
  stats: [
    { value: '100+', label: 'Projects delivered' },
    { value: '15+', label: 'Years combined expertise' },
    { value: 'PAN', label: 'India footprint' },
    { value: '100+', label: 'HVAC installations' },
  ],
  cities: [
    'Delhi-NCR',
    'Lucknow',
    'Patna',
    'Kolkata',
    'Gwalior',
    'Jabalpur',
    'Mehsana',
  ],
  // Contact form endpoint. This site runs on Vercel (static hosting), so a PHP
  // mailer cannot execute. Leave '' and the form opens a pre-filled email to
  // spaces@trionest.in (nothing is lost). To submit over HTTPS instead, put a
  // Formspree or Web3Forms endpoint URL here.
  formEndpoint: '',
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/trionest-spaces/', icon: 'linkedin' },
  ],
};

export const whyReasons = [
  {
    n: '01',
    title: 'One Accountable Partner',
    short:
      'Single contract for design, civil, electrical and HVAC — no vendor finger-pointing, no scope gaps between trades.',
    long:
      'Most fit-out delays are not build failures. They are coordination failures between three separate contracts: the interior contractor, the electrical contractor and the HVAC contractor. TrioNest holds all three under one contract, one project manager and one handover. When a ceiling grid clashes with a duct route, it is resolved in a single internal review, not in a three-way email chain between vendors who each bill separately for the rework.',
  },
  {
    n: '02',
    title: 'Specialist Vertical Heads',
    short:
      'Dedicated discipline leads owning each trade end-to-end, instead of generalist project managers stretched thin.',
    long:
      'Each vertical — Civil & Interiors, Electrical, HVAC — is owned by a discipline lead who signs off drawings, material approvals and testing for that trade. The project manager coordinates the programme; the vertical head owns the engineering. That separation keeps technical decisions with the people qualified to make them.',
  },
  {
    n: '03',
    title: 'On-Time, On-Budget',
    short:
      'PMBOK-based delivery lifecycle, fixed-cost contracts, milestone payment plans and an escalation-free track record.',
    long:
      'Scope is frozen at BOQ stage and priced as a fixed-cost proposal with a milestone payment plan. Progress is tracked against a baseline programme and reported weekly, so slippage is visible in week two rather than week ten. Variations are quoted and approved in writing before work proceeds.',
  },
  {
    n: '04',
    title: 'Quality, Non-Negotiable',
    short:
      'Documented QC processes, manufacturer-backed warranties and snag-free handovers — checked, signed and delivered.',
    long:
      'Material inspection requests, mock-up approvals, stage-wise inspections, a tracked snag list and documented testing and commissioning. Every stage produces a signed record, so quality is auditable rather than asserted.',
  },
  {
    n: '05',
    title: '24×7 AMC & FMS',
    short:
      'Post-handover SLAs, preventive maintenance schedules and breakdown response cells across all three verticals.',
    long:
      'Handover is not the end of the contract. Preventive maintenance schedules, defined response and resolution SLAs, and a breakdown cell covering interiors, electrical and HVAC keep the space performing after the warranty period begins.',
  },
  {
    n: '06',
    title: 'PAN-India Delivery',
    short:
      'Active sites across Delhi-NCR, Lucknow, Patna, Kolkata, Gwalior, Jabalpur, Mehsana and beyond.',
    long:
      'Multi-city rollouts are run from a single programme with a common specification, a central procurement plan and local site teams. Clients get the same drawing set, the same QA/QC records and the same handover pack in every city.',
  },
];

export const processStages = [
  {
    n: '01',
    slug: 'survey',
    title: 'Free Survey & Brief',
    short: 'On-site assessment, requirement capture, technical feasibility check.',
    detail:
      'We visit the site before quoting. The survey captures the existing shell condition, slab-to-slab height, available electrical load and supply point, existing HVAC provisions, fire and building-management constraints, and access and working-hour restrictions imposed by the landlord. In parallel we capture the brief: headcount, work-setting mix, meeting and support spaces, IT and AV requirements, target occupancy date.',
    deliverables: [
      'Site measurement and existing-condition record',
      'Requirement brief and headcount / space programme',
      'Technical feasibility note (load, HVAC provision, access, base-build constraints)',
      'Indicative budget range and outline programme',
    ],
  },
  {
    n: '02',
    slug: 'design-boq',
    title: 'Design & BOQ',
    short: 'Concept, 3D, working drawings, MEP coordination drawings, BOQ.',
    detail:
      'Concept layout and 3D views are issued for sign-off, then developed into a working drawing set. Electrical and HVAC design run alongside the interior drawings, not after them: heat-load calculations, load schedules, single-line diagrams and duct and cable routing are coordinated against the reflected ceiling plan before anything is priced. The BOQ is built from the approved drawings with named material specifications.',
    deliverables: [
      'Concept layout, space plan and 3D visualisation',
      'GFC / working drawing set (civil, joinery, flooring, ceiling)',
      'Electrical design: load schedule, SLD, DB schedule, lighting layout',
      'HVAC design: heat-load calculation, equipment selection, duct and piping layout',
      'MEP coordination drawing (services versus ceiling)',
      'Priced BOQ with material specification sheet',
    ],
  },
  {
    n: '03',
    slug: 'proposal-po',
    title: 'Proposal & PO',
    short: 'Fixed-cost proposal, contract, milestone payment plan, kick-off.',
    detail:
      'The proposal is issued as a fixed cost against the frozen BOQ, with exclusions and assumptions written down rather than left implied. On PO, a kick-off meeting sets the baseline programme, the reporting format, the approval matrix and the escalation path.',
    deliverables: [
      'Fixed-cost proposal with itemised BOQ, inclusions and exclusions',
      'Milestone-linked payment plan',
      'Contract / work order and statutory documentation',
      'Baseline programme and kick-off minutes',
    ],
  },
  {
    n: '04',
    slug: 'procurement',
    title: 'Procurement',
    short: 'Centralised, on-time material planning across civil, electrical and HVAC.',
    detail:
      'One procurement plan covers all three verticals, sequenced against the construction programme so long-lead items — HVAC equipment, panels, imported finishes, workstations — are released first. Material approvals and samples are cleared with the client before ordering, and delivery dates are tracked against the site programme.',
    deliverables: [
      'Consolidated procurement plan with long-lead register',
      'Material approval sheets and physical samples',
      'Purchase orders to approved vendors and OEM channels',
      'Delivery tracker aligned to the site programme',
    ],
  },
  {
    n: '05',
    slug: 'execution',
    title: 'Execution & T&C',
    short: 'Site execution, inspections, testing & commissioning, snag closure.',
    detail:
      'Site execution runs under a documented QA/QC and safety regime: daily progress records, weekly progress reports against baseline, stage-wise inspection requests, and safety inductions, toolbox talks and permit-to-work for high-risk activity. Testing and commissioning covers electrical (insulation resistance, earth resistance, load and phase checks, panel testing) and HVAC (airflow balancing, refrigerant charge, temperature and control verification).',
    deliverables: [
      'Daily progress report (DPR) and weekly progress report against baseline',
      'Material inspection requests (MIR) and work inspection requests (WIR)',
      'Stage-wise QC checklists and photographic records',
      'Safety induction records, toolbox talk records, permit-to-work register',
      'Testing and commissioning reports (electrical and HVAC)',
      'Snag list, tracked to closure',
    ],
  },
  {
    n: '06',
    slug: 'handover',
    title: 'Handover & AMC',
    short: 'Documented handover, free warranty support and AMC conversion.',
    detail:
      'Handover is a document pack, not a set of keys. As-built drawings, test reports, O&M manuals, warranty certificates and the asset list are issued together, the snag list is closed and signed, and the client facilities team is trained on the installed systems. The AMC scope is agreed before the warranty period ends so there is no coverage gap.',
    deliverables: [
      'As-built drawing set (civil, electrical, HVAC)',
      'Testing and commissioning reports, compiled',
      'O&M manuals and equipment documentation',
      'Warranty certificates and OEM registrations',
      'Asset list with make, model and serial numbers',
      'Signed snag closure and handover certificate',
      'Facilities team training and AMC proposal',
    ],
  },
];

export const nav = [
  { label: 'About', href: '/about/' },
  {
    label: 'Services',
    href: '/services/',
    children: [
      { label: 'Civil & Interiors', href: '/services/civil-interiors/' },
      { label: 'Electrical', href: '/services/electrical/' },
      { label: 'HVAC', href: '/services/hvac/' },
      { label: 'AMC & FMS', href: '/services/amc-fms/' },
    ],
  },
  {
    label: 'Industries',
    href: '/industries/',
    children: [
      { label: 'Corporate Offices', href: '/industries/corporate-offices/' },
      { label: 'Retail & Showrooms', href: '/industries/retail-showrooms/' },
      { label: 'Hospitality', href: '/industries/hospitality/' },
      { label: 'Healthcare', href: '/industries/healthcare/' },
      { label: 'BFSI & Banking', href: '/industries/bfsi-banking/' },
      { label: 'Industrial', href: '/industries/industrial/' },
      { label: 'Co-working', href: '/industries/co-working/' },
    ],
  },
  { label: 'Projects', href: '/projects/' },
  {
    label: 'Capability',
    href: '/process/',
    children: [
      { label: 'Our Process', href: '/process/' },
      { label: 'Quality & Safety', href: '/quality-safety/' },
      { label: 'Certifications', href: '/certifications/' },
      { label: 'Leadership & Team', href: '/team/' },
      { label: 'Clients & Testimonials', href: '/clients/' },
      { label: 'PAN-India Coverage', href: '/locations/' },
      { label: 'Company Profile', href: '/company-profile/' },
    ],
  },
  { label: 'Insights', href: '/blog/' },
  { label: 'Contact', href: '/contact/' },
];
