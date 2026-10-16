import type { World } from '../../data/worlds';
import { tokenStyle } from '../../theme/tokens';
import RouteLink from '../RouteLink';
import Miniature from './Miniatures';

/**
 * A portal: a ring with a live miniature of its world inside. The orb carries
 * the destination world's tokens inline, so the miniature (and the ring's glow)
 * render in that world's palette while the rest of the Nexus stays dark.
 */
export default function PortalRing({ world }: { world: World }) {
  return (
    <RouteLink
      to={{ place: world.id, project: null, view: 'auto' }}
      className="portal group"
      aria-label={`Enter ${world.name}. ${world.tagline}.`}
    >
      <span className="portal-orb" style={tokenStyle(world.tokens)} aria-hidden="true">
        <span className="portal-halo" />
        <span className="portal-window">
          <Miniature id={world.id} />
        </span>
      </span>
      <span className="portal-name" aria-hidden="true">
        {world.name}
      </span>
      <span className="portal-tagline" aria-hidden="true">
        {world.tagline}
      </span>
    </RouteLink>
  );
}
