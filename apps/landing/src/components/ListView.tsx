import { useEffect } from 'react';
import { MapIcon } from 'lucide-react';
import { PLACES, isWorldId } from '../data/worlds';
import { projects } from '../data/projects';
import { site } from '../data/site';
import type { Route } from '../state/url';
import { hasMap } from '../worlds/registry';
import BrandLockup from './BrandLockup';
import ContactLinks from './ContactLinks';
import ProjectList from './ProjectList';
import RouteLink from './RouteLink';
import SiteFooter from './SiteFooter';
import WorldDock from './WorldDock';

/**
 * The full-featured fallback: every project, every link, no map. Shown for
 * "Skip the map", for reduced motion, and if a world's map fails to load. It
 * takes the current world's theme like everything else.
 */
export default function ListView({ route, notice }: { route: Route; notice?: string }) {
  const world = isWorldId(route.place) ? route.place : null;
  const place = PLACES[route.place];
  const mapAvailable = world ? hasMap(world) : false;

  useEffect(() => {
    if (!route.project) return;
    const el = document.getElementById(route.project);
    el?.scrollIntoView({ block: 'center' });
    el?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
  }, [route.project]);

  return (
    <div className="min-h-dvh pb-28">
      <header className="sticky top-0 z-20 border-b-[length:var(--w-bw)] border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <BrandLockup />
          <div className="flex items-center gap-2">
            {world && mapAvailable && (
              <RouteLink
                to={{ place: world, project: route.project, view: 'map' }}
                className="btn btn-ghost btn-sm"
              >
                <MapIcon className="h-4 w-4" aria-hidden="true" />
                Show the map
              </RouteLink>
            )}
            <ContactLinks hideEmailOnMobile />
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <h1 className="type-display text-4xl leading-[1.05] text-ink sm:text-5xl">
          {world ? place.name : `All ${projects.length} projects`}
        </h1>
        <p className="mt-3 max-w-[60ch] text-lg text-muted">
          {world
            ? `The same ${projects.length} projects, as a list. ${place.tagline}.`
            : site.index.intro}
        </p>
        {notice && (
          <p role="status" className="mt-5 max-w-[60ch] rounded-card border-[length:var(--w-bw)] border-line bg-surface p-4 text-ink">
            {notice}
          </p>
        )}
        <div className="mt-10">
          <ProjectList variant="full" world={world} mapAvailable={mapAvailable} focus={route.project} />
        </div>
      </main>

      {route.place === 'nexus' ? <SiteFooter /> : <LegalLine />}

      <div className="pointer-events-none fixed inset-x-0 bottom-3 z-20 px-3 pb-[env(safe-area-inset-bottom)]">
        <WorldDock current={route.place} view="list" />
      </div>
    </div>
  );
}

function LegalLine() {
  return (
    <footer className="mx-auto mt-20 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t-[length:var(--w-bw)] border-line px-4 pt-6 text-sm text-muted sm:px-6">
      <p>© {new Date().getFullYear()} BitToByte</p>
      <nav aria-label="Legal" className="flex gap-4">
        {site.legal.map((link) => (
          <a key={link.href} href={link.href} className="inline-flex min-h-11 items-center hover:text-ink">
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
