import { describe, expect, it } from 'vitest';
import { PLACES, TOKEN_NAMES, WORLDS, resolvePlace, type PlaceId, type TokenName, type Tokens } from '../data/worlds';
import { buildThemeCss, colorScheme } from './tokens';

// WCAG 2.x relative luminance and contrast ratio for #RRGGBB colors.
function luminance(hex: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) throw new Error(`not a #RRGGBB color: ${hex}`);
  const n = parseInt(m[1]!, 16);
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum ratio]
const PAIRS: [TokenName, TokenName, number][] = [
  ['ink', 'bg', 4.5],
  ['ink', 'surface', 4.5],
  ['ink', 'raised', 4.5],
  ['muted', 'bg', 4.5],
  ['muted', 'surface', 4.5],
  ['muted', 'raised', 4.5],
  ['accent-ink', 'accent', 4.5],
  ['accent-text', 'bg', 4.5],
  ['accent-text', 'surface', 4.5],
  ['focus', 'bg', 3],
  ['focus', 'surface', 3],
];

// Every look a place can wear: each place, plus each alternate theme of a world.
const LOOKS: [string, Tokens][] = [
  ...(Object.keys(PLACES) as PlaceId[]).map((id): [string, Tokens] => [id, PLACES[id].tokens]),
  ...Object.values(WORLDS).flatMap((world) =>
    Object.entries(world.themes ?? {}).map(([theme, face]): [string, Tokens] => [`${world.id}/${theme}`, face.tokens])
  ),
];

describe('theme tokens', () => {
  for (const [name, tokens] of LOOKS) {
    describe(name, () => {
      it('defines every token', () => {
        for (const token of TOKEN_NAMES) expect(tokens[token], token).toBeTruthy();
      });
      for (const [fg, bg, min] of PAIRS) {
        it(`${fg} on ${bg} meets ${min}:1`, () => {
          expect(contrast(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(min);
        });
      }
    });
  }

  it('builds one rule per place, and one per alternate theme', () => {
    const css = buildThemeCss();
    expect(css.startsWith(':root{--w-bg:#030712')).toBe(true);
    for (const id of Object.keys(PLACES)) {
      if (id !== 'nexus') expect(css).toContain(`:root[data-world="${id}"]{`);
    }
    expect(css).toContain(':root[data-world="sunset"][data-theme="santos"]{');
  });

  it('keeps Vice City as the default face and Los Santos as the alternate', () => {
    expect(PLACES.sunset.name).toBe('Vice City');
    expect(resolvePlace('sunset').name).toBe('Vice City');
    expect(resolvePlace('sunset', 'vice').name).toBe('Vice City');
    expect(resolvePlace('sunset', 'santos').name).toBe('Los Santos');
    expect(resolvePlace('sunset', 'santos').tokens.bg).not.toBe(PLACES.sunset.tokens.bg);
    // Leonida is the same state of mind as Vice City.
    expect(PLACES.leonida.tokens).toBe(PLACES.sunset.tokens);
    // A theme on a world without one changes nothing.
    expect(resolvePlace('noir', 'santos')).toBe(PLACES.noir);
  });

  it('gives dark worlds dark native scrollbars and controls', () => {
    expect(colorScheme(PLACES.nexus.tokens.bg)).toBe('dark');
    expect(colorScheme(PLACES.noir.tokens.bg)).toBe('dark');
    expect(colorScheme(PLACES.manuscript.tokens.bg)).toBe('light');
    expect(colorScheme(PLACES.voxel.tokens.bg)).toBe('light');
    expect(colorScheme(PLACES.pop.tokens.bg)).toBe('light');
    expect(colorScheme(PLACES.frontier.tokens.bg)).toBe('light');
    // Vice City is a golden-hour light theme; Los Santos is the dusk one.
    expect(colorScheme(PLACES.sunset.tokens.bg)).toBe('light');
    expect(colorScheme(resolvePlace('sunset', 'santos').tokens.bg)).toBe('dark');
  });
});
