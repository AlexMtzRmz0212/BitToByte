import { ArrowUpRightIcon, InfoIcon, ListIcon } from 'lucide-react';
import { PLACES, type PlaceId } from '../../data/worlds';
import { site } from '../../data/site';
import BrandLockup from '../BrandLockup';
import RouteLink from '../RouteLink';
import FoundCounter from './FoundCounter';
import SecretsCounter from './SecretsCounter';

interface Props {
  place: PlaceId;
  /** Hub only: reopens the intro card. */
  onAbout?: () => void;
}

export default function TopHud({ place, onAbout }: Props) {
  return (
    <header className="hud-top">
      <div className="hud-group chrome-pill">
        <BrandLockup showName={false} />
        <h1 className="hud-title type-display">
          <span className="sr-only">BitToByte: </span>
          {PLACES[place].name}
        </h1>
      </div>
      <div className="hud-group">
        <FoundCounter place={place} />
        <div className="chrome-pill hidden sm:flex">
          <SecretsCounter />
        </div>
        {onAbout && (
          <button type="button" className="hud-button chrome-pill" onClick={onAbout} aria-label="About BitToByte" title="About BitToByte">
            <InfoIcon className="h-4 w-4" aria-hidden="true" />
            <span className="hidden md:inline">About</span>
          </button>
        )}
        <RouteLink
          to={{ place, project: null, view: 'list' }}
          className="hud-button chrome-pill"
          aria-label="Skip the map: show every project as a list"
          title="Skip the map"
        >
          <ListIcon className="h-4 w-4" aria-hidden="true" />
          <span className="hidden md:inline">List</span>
        </RouteLink>
        <a href={site.profileUrl} className="hud-button chrome-pill hidden lg:inline-flex">
          Résumé
          <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
