// Pointer-glow control: storage + mapping helpers. Kept out of the component file
// so the module only exports functions (mirrors the consent.js split and keeps
// React Fast Refresh happy).
//
// The page stays dark; a single 0..100 slider level drives only the cursor
// spotlight. Both its strength and its size grow with the level, until near 100
// the glow is large enough to flood the whole page. The mappings live here so the
// component and App stay declarative.
export const THEME_KEY = 'bittobyte-theme-level';

// Clamp to the valid slider range.
const clamp = (n) => Math.min(100, Math.max(0, n));

// First-load default: a gentle, clearly visible spotlight over the dark page. Tunable.
export const DEFAULT_LEVEL = 20;

// Read the persisted level (0..100) or null if never set. Safe on any host.
export const getStoredThemeLevel = () => {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(THEME_KEY);
    if (v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? clamp(n) : null;
  } catch {
    return null;
  }
};

// Persist the level. Safe on any host.
export const storeThemeLevel = (level) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(THEME_KEY, String(clamp(level)));
  } catch {
    /* ignore write failures (private mode, quota) */
  }
};

// Level (0..100) -> spotlight core opacity. Rises quickly early (sqrt) so even a
// low level reads as a real glow, up to a strong, page-filling wash at the top.
export const levelToStrength = (level) => +(0.6 * Math.sqrt(clamp(level) / 100)).toFixed(3);

// Level (0..100) -> spotlight size (0 = compact spotlight .. 1 = uniform full page).
// Eased so growth is gentle through the midrange, then reaches full coverage a touch
// before 100 (clamped): the top few percent is a locked uniform "light reached" zone
// where moving the pointer no longer changes anything.
export const levelToSpread = (level) => +Math.min(1, Math.pow(clamp(level) / 96, 1.8)).toFixed(4);
