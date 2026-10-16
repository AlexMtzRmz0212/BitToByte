import type { CSSProperties } from 'react';
import { NEXUS, PLACES, TOKEN_NAMES, WORLD_IDS, type PlaceId, type TokenName, type Tokens } from '../data/worlds';

// Theme tokens -> CSS custom properties.
//
// One <style id="world-tokens"> holds a rule per place: the Nexus on :root, and
// each world on :root[data-world="<id>"]. Switching worlds only flips the
// data-world attribute, so the swap is atomic and costs one style recalc. The
// prerender step inlines the same stylesheet into index.html, so the first paint
// is already themed.

export const THEME_STYLE_ID = 'world-tokens';

export const cssVar = (name: TokenName) => `--w-${name}`;

/** Native scrollbars and controls follow the page: dark on the dark worlds. */
export function colorScheme(bg: string): 'dark' | 'light' {
  const n = parseInt(bg.slice(1, 7), 16);
  const brightness = 0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return brightness < 128 ? 'dark' : 'light';
}

const declarations = (tokens: Tokens) =>
  TOKEN_NAMES.map((name) => `${cssVar(name)}:${tokens[name]}`).join(';') + `;color-scheme:${colorScheme(tokens.bg)}`;

export function buildThemeCss(): string {
  let css = `:root{${declarations(NEXUS.tokens)}}`;
  for (const id of WORLD_IDS) {
    css += `:root[data-world="${id}"]{${declarations(PLACES[id].tokens)}}`;
  }
  return css;
}

/** Inline style that scopes a place's tokens to one element (used by portal rings). */
export function tokenStyle(tokens: Tokens): CSSProperties {
  const style: Record<string, string> = {};
  for (const name of TOKEN_NAMES) style[cssVar(name)] = tokens[name];
  return style as CSSProperties;
}

export function ensureThemeStyle(): void {
  if (typeof document === 'undefined' || document.getElementById(THEME_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = THEME_STYLE_ID;
  style.textContent = buildThemeCss();
  document.head.appendChild(style);
}

/** Re-theme the whole document. Called at the midpoint of a portal transition. */
export function applyPlace(id: PlaceId): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (root.dataset.world === id) return;
  root.dataset.world = id;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = PLACES[id].tokens.bg;
}
