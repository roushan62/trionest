/* Client names already public on trionest.in. No additions without written permission.
   Logos: brand-accurate SVG wordmarks live in src/assets/clients/<logo>.svg, rendered
   by parts.mjs (clientLogo) on the home strip and /clients/. Replace with the client's
   official vector file when available; confirm usage rights before launch. */

export const clientGroups = [
  {
    sector: 'BFSI & Financial Services',
    clients: [
      { name: 'Yes Bank', logo: 'client_yesbank' },
      { name: 'L&T Finance', logo: 'client_lntfinance' },
      { name: 'Centrum Wealth', logo: 'centrum' },
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
      { name: 'Fleetx', logo: 'fleetx' },
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

/* Testimonials: REAL QUOTES ONLY.
   Leave this array empty until signed written testimonials are received.
   The site renders a FILL block while it is empty — it never fabricates quotes. */
export const testimonials = [];
