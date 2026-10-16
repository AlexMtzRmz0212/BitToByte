// Studio copy for the Nexus, the list view and the page metadata.
// Project copy lives in ./projects.ts; this file is everything around it.
// TODO(alex): every string here is a draft. Edit freely.

export const site = {
  name: 'BitToByte',
  tagline: 'Intelligent Systems Hub',
  url: 'https://bittobyte.qzz.io',
  description:
    'BitToByte is the studio of Alejandro Martínez, an AI and automation engineer in Ottawa. Travel four map-worlds to find eleven live projects, or skip straight to the list.',
  blurb:
    'BitToByte is the studio of Alejandro Martínez, an AI and automation engineer in Ottawa. I build data products, LLM tools and client sites, then ship them and keep them running. Eleven are live, spread across four worlds.',
  owner: {
    name: 'Alejandro Martínez',
    role: 'AI & Automation Engineer',
    location: 'Ottawa, Canada',
  },
  availability: 'Open to roles and collaborations',
  contact: {
    email: 'alejandro.martinez.rmz97@gmail.com',
    linkedin: 'https://www.linkedin.com/in/alejandro-mtz/',
    github: 'https://github.com/AlexMtzRmz0212',
  },
  profileUrl: 'https://alex.bittobyte.qzz.io',
  howTo: 'Click a portal to travel. Each world keeps a few live projects, and the Travel list has every one of them.',
  index: {
    title: 'Every project, no map required',
    intro: 'Eleven live builds across four worlds. Launch any of them from here.',
  },
  capabilities: [
    {
      title: 'AI engineering',
      body: 'LLM features, RAG and agents wired into products people actually use.',
    },
    {
      title: 'Automation',
      body: 'Pipelines that run the tedious parts on a schedule, without me.',
    },
    {
      title: 'Data visualization',
      body: 'Dashboards and maps that turn raw tables into decisions.',
    },
    {
      title: 'Mechatronics',
      body: 'Ten years of control systems, SCADA and the plant floor.',
    },
  ],
  legal: [
    { label: 'Terms of Service', href: '/terms.html' },
    { label: 'Privacy Policy', href: '/privacy.html' },
  ],
} as const;

export const mailto = `mailto:${site.contact.email}`;
