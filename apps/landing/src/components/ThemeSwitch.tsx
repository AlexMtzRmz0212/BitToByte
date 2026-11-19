import { PlaneIcon } from 'lucide-react';
import { resolvePlace, type PlaceId } from '../data/worlds';
import { requestFlight, useApp, useTheme } from '../state/app';

/** Whether a place has a theme to switch (Vice City and Leonida fly to Los Santos, and back). */
const canSwitchTheme = (place: PlaceId) => place === 'sunset' || place === 'leonida';

/**
 * "Fly to Los Santos" / "Fly to Vice City": switches the world's theme with the
 * flight transition. Renders nothing in places that have no other theme.
 */
export default function ThemeSwitch({ place, variant = 'hud' }: { place: PlaceId; variant?: 'hud' | 'list' }) {
  const theme = useTheme(place);
  const flying = useApp((s) => s.flying);
  if (!canSwitchTheme(place)) return null;
  const target = theme === 'santos' ? 'vice' : 'santos';
  const name = resolvePlace('sunset', target).name;
  return (
    <button
      type="button"
      className={variant === 'hud' ? 'hud-button chrome-pill' : 'btn btn-ghost btn-sm'}
      onClick={() => requestFlight(target)}
      disabled={flying}
      aria-label={`Fly to ${name}`}
      title={`Fly to ${name} and switch the theme`}
      data-theme-switch={target}
    >
      <PlaneIcon className="h-4 w-4" aria-hidden="true" />
      <span className={variant === 'hud' ? 'hidden md:inline' : undefined}>{name}</span>
    </button>
  );
}
