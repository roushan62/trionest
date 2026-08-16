/* Client names already public on trionest.in. No additions without written permission.
   Logos: real brand logos live in src/assets/clients/<logo>.webp
   (fleetx & centrum keep the rendered SVG wordmark).
   Trademarks belong to their respective owners. */

export const clientGroups = [
  {
    sector: 'BFSI & Financial Services',
    clients: [
      { name: 'Yes Bank', logo: 'client_yesbank' },
      { name: 'L&T Finance', logo: 'client_lntfinance' },
      { name: 'Centrum Wealth', logo: 'centrum', ext: 'svg' },
      { name: 'Centricity', logo: 'client_centricity' },
    ],
  },
  {
    sector: 'Technology & BPM',
    clients: [
      { name: 'Concentrix', logo: 'concentrix' },
      { name: 'Teleperformance', logo: 'client_teleperformance' },
      { name: 'EPAM', logo: 'epam' },
      { name: 'Avaya', logo: 'client_avaya' },
      { name: 'Anaptyss', logo: 'client_anaptyss' },
      { name: 'KlearNow', logo: 'klearnow' },
      { name: 'Fleetx', logo: 'fleetx', ext: 'svg' },
      { name: 'Novo', logo: 'novo' },
    ],
  },
  {
    sector: 'Retail & Mobility',
    clients: [{ name: 'CARS24', logo: 'client_cars24' }],
  },
  {
    sector: 'Industrial & Energy',
    clients: [
      { name: 'Indian Oil / PDIL', logo: 'client_indianoil' },
      { name: 'Panasonic', logo: 'client_panasonic' },
      { name: 'Marelli India', logo: 'client_marelli' },
      { name: 'Dalmia Cement', logo: 'client_dalmia' },
    ],
  },
  {
    sector: 'Legal & Professional',
    clients: [
      { name: 'IndusLaw', logo: 'induslaw' },
      { name: 'Trilegal', logo: 'trilegal' },
    ],
  },
  {
    sector: 'Real Estate Advisory',
    clients: [
      { name: 'CBRE', logo: 'client_cbre' },
      { name: 'Cushman & Wakefield', logo: 'client_cushman' },
    ],
  },
  {
    sector: 'Healthcare',
    clients: [{ name: 'GS Hospital', logo: 'client_gshospital' }],
  },
];

export const allClients = clientGroups.flatMap((g) => g.clients);

/* Client-office showcase on the homepage — images are AI-generated interior
   visuals styled per brand; cities are the verified locations published on
   trionest.in for that project. */
export const officeShowcase = [
  {
    client: 'CARS24',
    logo: 'client_cars24',
    image: 'project-cars24-showroom',
    alt: 'Automotive showroom interior delivered for CARS24',
    kind: 'Showroom interiors & electrical',
    cities: ['Lucknow', 'Patna'],
    note: 'Multi-city rollout',
  },
  {
    client: 'Concentrix',
    logo: 'concentrix',
    image: 'project-concentrix-office',
    alt: 'BPO delivery-centre office floor delivered for Concentrix',
    kind: 'HVAC & MEP scope',
    cities: ['Multi-city'],
    note: 'Delivery centres',
  },
  {
    client: 'Yes Bank',
    logo: 'client_yesbank',
    image: 'project-yesbank-branch',
    alt: 'Bank branch interior delivered for Yes Bank',
    kind: 'Branch interiors & MEP',
    cities: [],
    note: 'BFSI network',
  },
  {
    client: 'L&T Finance',
    logo: 'client_lntfinance',
    image: 'project-lnt-branch',
    alt: 'NBFC branch office interior delivered for L&T Finance',
    kind: 'Branch interiors & MEP',
    cities: ['Delhi-NCR'],
    note: 'Branch network',
  },
  {
    client: 'Centricity',
    logo: 'client_centricity',
    image: 'project-office',
    alt: 'Financial services office interior delivered for Centricity',
    kind: 'Office interiors',
    cities: ['Kolkata', 'Gwalior', 'Jabalpur', 'Mehsana'],
    note: 'Four-city programme',
  },
  {
    client: 'GS Hospital',
    logo: 'client_gshospital',
    image: 'project-healthcare',
    alt: 'Hospital HVAC and infrastructure delivered for GS Hospital',
    kind: 'Hospital HVAC & infra',
    cities: ['Delhi-NCR'],
    note: 'Healthcare campus',
  },
];

/* Testimonials: REAL QUOTES ONLY.
   Leave this array empty until signed written testimonials are received.
   The site renders a FILL block while it is empty — it never fabricates quotes. */
export const testimonials = [];
