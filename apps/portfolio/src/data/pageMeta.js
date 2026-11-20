// Per-route SEO metadata: title, description, canonical path and JSON-LD.
//
// One source for two readers, so they cannot drift:
//   • the pages hand it to usePageMeta, which keeps the tab title right while a
//     visitor navigates client-side;
//   • scripts/prerender.mjs writes it into each route's static HTML, which is
//     what crawlers and link previews read.

import { projects, projectBySlug } from '@bittobyte/content';
import { caseStudies, hasCaseStudy } from './caseStudies';
import { profile } from './resume';

export const SITE_URL = 'https://alex.bittobyte.qzz.io';
export const STUDIO_URL = 'https://bittobyte.qzz.io';
export const SITE_NAME = 'Alejandro Martínez';

export const OG_IMAGE = {
  url: `${SITE_URL}/og.png`,
  width: 1200,
  height: 630,
  alt: 'Alejandro Martínez, AI & Automation Engineer: portfolio of data products, LLM tools and automation.',
};

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const SAME_AS = profile.links
  .filter((link) => link.href.startsWith('http'))
  .map((link) => link.href.replace('https://linkedin.com', 'https://www.linkedin.com'))
  .concat(STUDIO_URL);

const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: profile.name,
  jobTitle: profile.title,
  url: `${SITE_URL}/`,
  image: OG_IMAGE.url,
  description: profile.summary,
  address: { '@type': 'PostalAddress', addressLocality: 'Ottawa', addressRegion: 'ON', addressCountry: 'CA' },
  sameAs: SAME_AS,
};

const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: `${SITE_NAME} · Portfolio`,
  url: `${SITE_URL}/`,
  inLanguage: 'en',
  publisher: { '@id': PERSON_ID },
};

const breadcrumbs = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, path], index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name,
    item: `${SITE_URL}${path}`,
  })),
});

const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes });

const HOME_DESCRIPTION =
  'Alejandro Martínez, AI & Automation Engineer. Machine learning, data pipelines, full-stack apps, and SCADA systems.';

export const homeMeta = () => ({
  title: 'Alejandro Martínez | AI & Automation Engineer',
  description: HOME_DESCRIPTION,
  path: '/',
  jsonLd: graph(person, website, {
    '@type': 'WebPage',
    '@id': `${SITE_URL}/#webpage`,
    url: `${SITE_URL}/`,
    name: 'Alejandro Martínez | AI & Automation Engineer',
    description: HOME_DESCRIPTION,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': PERSON_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: OG_IMAGE.url, width: OG_IMAGE.width, height: OG_IMAGE.height },
  }),
});

// A project's own page on this site if it has a written case study, else where it lives.
const projectUrl = (project) =>
  hasCaseStudy(project.id) ? `${SITE_URL}/work/${project.slug}` : (project.liveUrl ?? project.repoUrl ?? `${SITE_URL}/work`);

export const workMeta = () => {
  const description =
    'Every project: live products, data experiments, and written case studies of hackathon and coursework builds.';
  return {
    title: 'Work · Alejandro Martínez',
    description,
    path: '/work',
    jsonLd: graph(
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/work#webpage`,
        url: `${SITE_URL}/work`,
        name: 'Work · Alejandro Martínez',
        description,
        inLanguage: 'en',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
      },
      {
        '@type': 'ItemList',
        name: 'Projects by Alejandro Martínez',
        itemListElement: projects.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'CreativeWork',
            name: project.name,
            description: project.tagline,
            url: projectUrl(project),
            creator: { '@id': PERSON_ID },
          },
        })),
      },
      breadcrumbs([
        ['Home', '/'],
        ['Work', '/work'],
      ])
    ),
  };
};

export const resumeMeta = () => {
  const description = `Curriculum vitae for ${profile.name}, ${profile.title}: experience, education, and skills.`;
  return {
    title: `Resume · ${profile.name}`,
    description,
    path: '/resume',
    jsonLd: graph(
      {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/resume#webpage`,
        url: `${SITE_URL}/resume`,
        name: `Resume · ${profile.name}`,
        description,
        inLanguage: 'en',
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': PERSON_ID },
      },
      person,
      breadcrumbs([
        ['Home', '/'],
        ['Resume', '/resume'],
      ])
    ),
  };
};

/** Metadata for /work/<slug>, or null when there is no such written case study. */
export const caseStudyMeta = (slug) => {
  const project = projectBySlug(slug);
  const study = project ? caseStudies[project.id] : null;
  if (!study) return null;
  const path = `/work/${project.slug}`;
  const description = `${study.headline}. A case study by ${profile.name}.`;
  // Search results cut titles at about 60 characters; the author name is the part to lose.
  const short = `${project.name} · Case study`;
  const full = `${short} | ${profile.name}`;
  return {
    title: full.length <= 60 ? full : short,
    description,
    path,
    jsonLd: graph(
      {
        '@type': 'Article',
        '@id': `${SITE_URL}${path}#article`,
        headline: study.headline,
        name: `${project.name} · Case study`,
        description,
        url: `${SITE_URL}${path}`,
        mainEntityOfPage: `${SITE_URL}${path}`,
        inLanguage: 'en',
        image: OG_IMAGE.url,
        keywords: project.tags.join(', '),
        author: { '@id': PERSON_ID },
        publisher: { '@id': PERSON_ID },
        isPartOf: { '@id': WEBSITE_ID },
      },
      person,
      breadcrumbs([
        ['Home', '/'],
        ['Work', '/work'],
        [project.name, path],
      ])
    ),
  };
};

/** No canonical and no JSON-LD: a 404 should not be treated as a page. */
export const notFoundMeta = () => ({
  title: 'Not found · Alejandro Martínez',
  description: 'That page does not exist.',
  path: null,
  jsonLd: null,
});

/** Every URL that gets a static HTML file and a sitemap entry. */
export const sitemapPaths = () => [
  '/',
  '/work',
  '/resume',
  ...projects.filter((project) => hasCaseStudy(project.id)).map((project) => `/work/${project.slug}`),
];

/** Metadata for a pathname, as prerendered. Unknown paths get the 404 metadata. */
export const metaForPath = (pathname) => {
  if (pathname === '/') return homeMeta();
  if (pathname === '/work') return workMeta();
  if (pathname === '/resume') return resumeMeta();
  const slug = /^\/work\/([^/]+)$/.exec(pathname)?.[1];
  return (slug && caseStudyMeta(slug)) || notFoundMeta();
};
