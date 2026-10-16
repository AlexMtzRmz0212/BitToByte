import { BitToByteMark } from '@alex_mtz/bittobyte-ui';
import { PLACES } from '../data/worlds';
import { NEXUS_ROUTE } from '../state/url';
import RouteLink from './RouteLink';

/** The B tile + wordmark. Always leads back to the hub. */
export default function BrandLockup({ showName = true }: { showName?: boolean }) {
  return (
    <RouteLink
      to={NEXUS_ROUTE}
      className="group flex min-h-11 items-center gap-2.5 rounded-control pr-2"
      aria-label={`BitToByte, back to ${PLACES.nexus.name}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#2563EB] text-[#F8FAFF] shadow-[0_6px_16px_-6px_rgba(37,99,235,0.7)] transition-transform duration-300 group-hover:scale-105">
        <BitToByteMark className="h-5 w-5" />
      </span>
      {showName && (
        <span className="type-display hidden text-lg leading-none sm:inline" aria-hidden="true">
          BitToByte
        </span>
      )}
    </RouteLink>
  );
}
