import { ArrowUpRightIcon, ListIcon, MapIcon } from 'lucide-react';
import { DEFAULT_WORLD, WORLD_IDS, WORLDS } from '../../data/worlds';
import { mailto, site } from '../../data/site';
import { useApp } from '../../state/app';
import BrandLockup from '../BrandLockup';
import ContactLinks from '../ContactLinks';
import ProjectList from '../ProjectList';
import RouteLink from '../RouteLink';
import SiteFooter from '../SiteFooter';
import PortalRing from './PortalRing';
import SecretsCounter from './SecretsCounter';
import Starfield from './Starfield';
import './nexus.css';

/**
 * The hub. In five seconds: who (Alejandro, AI and automation engineer), what
 * (BitToByte, his studio of live systems) and how to see the work (a map, four
 * portals, or the plain list right below).
 */
export default function Nexus() {
  const lastWorld = useApp((s) => s.progress.lastWorld);

  return (
    <div className="relative">
      <Starfield />

      <header className="relative z-20 mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6">
        <BrandLockup />
        <div className="flex items-center gap-1 sm:gap-2">
          <SecretsCounter />
          <a href={site.profileUrl} className="btn btn-ghost btn-sm">
            <span>
              Résumé<span className="hidden md:inline"> and profile</span>
            </span>
            <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
          </a>
          <ContactLinks hideEmailOnMobile />
        </div>
      </header>

      <main id="main">
        <section
          aria-labelledby="nexus-title"
          className="mx-auto grid max-w-7xl items-center gap-x-10 gap-y-14 px-4 pb-20 pt-8 sm:px-6 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:pb-16 lg:pt-0"
        >
          <div className="max-w-xl">
            <p className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-control border border-line bg-surface/70 py-1.5 pl-3.5 pr-1.5 text-sm text-ink backdrop-blur">
              <span className="availability-dot" aria-hidden="true" />
              {site.availability}
              <a
                href={mailto}
                className="inline-flex min-h-8 items-center rounded-control px-2.5 font-semibold text-accent-text hover:underline"
              >
                Email me
              </a>
            </p>

            <h1 id="nexus-title" className="mt-7 text-ink">
              <span className="wordmark">
                <span className="w-bit">Bit</span>
                <span className="w-to">To</span>
                <span className="w-byte">Byte</span>
              </span>
              <span className="mt-3 block text-2xl font-medium tracking-tight text-muted sm:text-3xl">
                {site.tagline}
              </span>
            </h1>

            <p className="mt-6 max-w-[52ch] leading-relaxed text-ink/85 sm:text-lg">{site.blurb}</p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <RouteLink
                to={{ place: lastWorld ?? DEFAULT_WORLD, project: null, view: 'auto' }}
                className="btn btn-primary"
              >
                <MapIcon className="h-4 w-4" aria-hidden="true" />
                Explore the map
              </RouteLink>
              <RouteLink to={{ place: 'nexus', project: null, view: 'list' }} className="btn btn-ghost">
                <ListIcon className="h-4 w-4" aria-hidden="true" />
                Skip the map
              </RouteLink>
            </div>
          </div>

          <div>
            <ul className="constellation grid grid-cols-2 justify-items-center gap-x-2 gap-y-8 sm:gap-x-8">
              {WORLD_IDS.map((id) => (
                <li key={id}>
                  <PortalRing world={WORLDS[id]} />
                </li>
              ))}
            </ul>
            <p className="mt-6 text-center text-sm text-muted lg:mt-28">{site.portalsCaption}</p>
          </div>
        </section>

        <section
          id="projects"
          aria-labelledby="index-title"
          className="mx-auto max-w-7xl border-t border-line px-4 pt-16 sm:px-6 sm:pt-20"
        >
          <h2 id="index-title" className="type-display text-3xl leading-tight text-ink sm:text-4xl">
            {site.index.title}
          </h2>
          <p className="mt-3 max-w-[60ch] text-lg text-muted">{site.index.intro}</p>
          <div className="mt-12">
            <ProjectList variant="index" headingLevel={3} />
          </div>
        </section>

        <section
          aria-labelledby="build-title"
          className="mx-auto mt-24 max-w-7xl px-4 sm:px-6"
        >
          <h2 id="build-title" className="type-display text-3xl leading-tight text-ink sm:text-4xl">
            What I build
          </h2>
          <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {site.capabilities.map((item) => (
              <li key={item.title} className="border-l-2 border-accent pl-4">
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="mt-1.5 leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 text-muted">
            <span>
              {site.owner.name}. {site.owner.role}, {site.owner.location}.
            </span>
            <a
              href={site.profileUrl}
              className="inline-flex min-h-11 items-center gap-1 font-semibold text-accent-text hover:underline"
            >
              Résumé and profile
              <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
            </a>
            <ContactLinks className="-ml-3" />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
