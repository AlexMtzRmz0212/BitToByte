// Pointer-glow control: storage + mapping helpers. Kept out of the component file
// so the module only exports functions (mirrors the consent.js split and keeps
// React Fast Refresh happy).
//
// The page stays dark; a single 0..100 slider level drives only the cursor
// spotlight. Both its strength and its size grow with the level, until near 100
// the glow is large enough to flood the whole page at a uniform brightness.
//
// Portfolio-specific vs landing: the accent is lime (high-luminance), so the max
// strength ceiling is lower than landing's blue to keep the full flood from reading
// too hot. Its own storage key keeps the choice independent from the landing site.
export const THEME_KEY = 'bittobyte-portfolio-theme-level';

// Clamp to the valid slider range.
const clamp = (n) => Math.min(100, Math.max(0, n));

// First-load default: matches the portfolio's previous fixed glow (~0.22 strength),
// so the page opens with a familiar gentle lime spotlight. Tunable.
export const DEFAULT_LEVEL = 30;

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
// low level reads as a real glow. Ceiling 0.4 (below landing's 0.6) because lime
// is high-luminance and a uniform full-page lime wash reads hot.
export const levelToStrength = (level) => +(0.4 * Math.sqrt(clamp(level) / 100)).toFixed(3);

// Level (0..100) -> spotlight size (0 = compact spotlight .. 1 = uniform full page).
// Eased so growth is gentle through the midrange, then reaches full coverage a touch
// before 100 (clamped): the top few percent is a locked uniform "light reached" zone
// where moving the pointer no longer changes anything.
export const levelToSpread = (level) => +Math.min(1, Math.pow(clamp(level) / 96, 1.8)).toFixed(4);
