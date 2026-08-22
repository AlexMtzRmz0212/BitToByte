import { projects } from '@bittobyte/content';

/**
 * Split the shared catalog the way the portfolio presents it.
 *
 * Lives outside the component file so Fast Refresh keeps working: a module that
 * exports both components and plain functions loses hot-reload boundaries.
 */
export const groupedProjects = () => ({
  featured: projects.filter((p) => p.featured),
  more: projects.filter((p) => !p.featured && p.group !== 'archive'),
  archive: projects.filter((p) => p.group === 'archive'),
});
