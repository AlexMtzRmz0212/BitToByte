import { ArrowUpRightIcon, ListIcon, XIcon } from 'lucide-react';
import { mailto, site } from '../data/site';
import ContactLinks from './ContactLinks';
import RouteLink from './RouteLink';

interface Props {
  onExplore: () => void;
}

/**
 * The five-second answer, sitting on top of the hub map: who this is, what
 * BitToByte is, and how to see the work. Dismissed once, it stays out of the
 * way for returning visitors; the HQ building brings it back.
 */
export default function IntroCard({ onExplore }: Props) {
  return (
    <section id="intro" className="intro-card chrome" aria-labelledby="intro-title">
      <button type="button" className="card-close" onClick={onExplore} aria-label="Close the intro and explore the map">
        <XIcon className="h-5 w-5" aria-hidden="true" />
      </button>

      <p className="availability">
        <span className="availability-dot" aria-hidden="true" />
        {site.availability}
        <a href={mailto} className="availability-link">
          Email me
        </a>
      </p>

      <h2 id="intro-title" className="wordmark">
        <span className="w-bit">Bit</span>
        <span className="w-to">To</span>
        <span className="w-byte">Byte</span>
      </h2>
      <p className="intro-tagline">{site.tagline}</p>
      <p className="intro-blurb">{site.blurb}</p>
      <p className="intro-how">{site.howTo}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-primary" onClick={onExplore}>
          Start exploring
        </button>
        <RouteLink to={{ place: 'nexus', project: null, view: 'list' }} className="btn btn-ghost">
          <ListIcon className="h-4 w-4" aria-hidden="true" />
          Skip the map
        </RouteLink>
      </div>

      <div className="intro-contact">
        <ContactLinks className="-ml-2.5" />
        <a href={site.profileUrl} className="inline-flex min-h-11 items-center gap-1 font-semibold text-accent-text hover:underline">
          Résumé and profile
          <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
