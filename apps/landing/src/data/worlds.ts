// Every place a visitor can stand: the Nexus hub plus four map-worlds.
//
// This file is data only. It holds each place's copy and its theme tokens, and
// (for the worlds) the map layout: district lots, portals, fog and the hidden
// secret. The drawing code for a world lives in src/worlds/<id>/ and is loaded
// on demand, so nothing here imports React or a world's art.
//
// Theme tokens become CSS custom properties named --w-<token> (see
// src/theme/tokens.ts). Components only ever read those variables, so swapping a
// world is a single attribute change on <html>.

export const WORLD_IDS = ['manuscript', 'voxel', 'noir', 'pop'] as const;
export type WorldId = (typeof WORLD_IDS)[number];
export type PlaceId = 'nexus' | WorldId;

export const TOKEN_NAMES = [
  'bg', // page background
  'surface', // panels and cards
  'raised', // elevated surfaces: sheets, popovers
  'ink', // body text on bg and surface
  'muted', // secondary text on bg and surface
  'accent', // fills for primary actions
  'accent-ink', // text on an accent fill
  'accent-text', // accent-colored text and icons on bg/surface
  'line', // hairlines and borders
  'focus', // keyboard focus ring
  'route', // the traveler's route line
  'fog', // fog-of-war base color
  'deco-1', // decoration only, never text
  'deco-2',
  'deco-3',
  'font-display',
  'font-body',
  'display-weight',
  'display-case', // text-transform for display type
  'display-tracking', // letter-spacing for display type
  'r-card',
  'r-control',
  'bw', // border width
  'shadow-card',
  'shadow-pop',
  'dur-fast',
  'dur-slow',
  'ease',
  'ease-pop',
] as const;
export type TokenName = (typeof TOKEN_NAMES)[number];
export type Tokens = Record<TokenName, string>;

export interface Point {
  x: number;
  y: number;
}

export interface Place {
  id: PlaceId;
  name: string;
  /** Short label for the world dock. */
  short: string;
  /** One line under the portal ring. */
  tagline: string;
  tokens: Tokens;
}

export interface World extends Place {
  id: WorldId;
}

export const NEXUS: Place = {
  id: 'nexus',
  name: 'The Nexus',
  short: 'Nexus',
  tagline: 'The hub between worlds',
  tokens: {
    bg: '#030712',
    surface: '#0B1220',
    raised: '#111A2E',
    ink: '#F3F4F6',
    muted: '#9CA3AF',
    accent: '#2563EB',
    'accent-ink': '#F8FAFF',
    'accent-text': '#60A5FA',
    line: 'rgba(148, 163, 184, 0.16)',
    focus: '#93C5FD',
    route: '#60A5FA',
    fog: '#030712',
    'deco-1': '#60A5FA',
    'deco-2': '#A5B4FC',
    'deco-3': '#34D399',
    'font-display': "'Bricolage Grotesque Variable', 'Bricolage Grotesque', ui-sans-serif, sans-serif",
    'font-body': "'Bricolage Grotesque Variable', 'Bricolage Grotesque', ui-sans-serif, sans-serif",
    'display-weight': '700',
    'display-case': 'none',
    'display-tracking': '-0.025em',
    'r-card': '16px',
    'r-control': '9999px',
    bw: '1px',
    'shadow-card': '0 1px 0 rgba(255, 255, 255, 0.04) inset, 0 24px 48px -24px rgba(2, 6, 23, 0.8)',
    'shadow-pop': '0 12px 32px -12px rgba(37, 99, 235, 0.55)',
    'dur-fast': '200ms',
    'dur-slow': '600ms',
    ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    'ease-pop': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

export const WORLDS: Record<WorldId, World> = {
  manuscript: {
    id: 'manuscript',
    name: 'Manuscript Realm',
    short: 'Manuscript',
    tagline: 'Ink, parchment and tiny towers',
    tokens: {
      bg: '#E6D5B0',
      surface: '#F0E4C8',
      raised: '#F6EEDA',
      ink: '#3B2A1A',
      muted: '#5E4630',
      accent: '#7A1F1F',
      'accent-ink': '#F6EBD3',
      'accent-text': '#7A1F1F',
      line: 'rgba(59, 42, 26, 0.3)',
      focus: '#7A1F1F',
      route: '#7A1F1F',
      fog: '#8C7556',
      'deco-1': '#B8892E',
      'deco-2': '#4A6A7A',
      'deco-3': '#6B7B3A',
      'font-display': "'IM Fell English', 'EB Garamond Variable', Georgia, serif",
      'font-body': "'EB Garamond Variable', 'EB Garamond', Georgia, serif",
      'display-weight': '400',
      'display-case': 'none',
      'display-tracking': '0',
      'r-card': '3px',
      'r-control': '3px',
      bw: '1.5px',
      'shadow-card': '0 2px 0 rgba(59, 42, 26, 0.12), 0 18px 32px -18px rgba(59, 42, 26, 0.5)',
      'shadow-pop': '0 6px 18px -6px rgba(122, 31, 31, 0.45)',
      'dur-fast': '260ms',
      'dur-slow': '760ms',
      ease: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      'ease-pop': 'cubic-bezier(0.25, 1.25, 0.5, 1)',
    },
  },
  voxel: {
    id: 'voxel',
    name: 'Voxel Overworld',
    short: 'Voxel',
    tagline: 'Blocks, drones and a sky that keeps time',
    tokens: {
      bg: '#9BD7F0',
      surface: '#FDFBF4',
      raised: '#FFFDF8',
      ink: '#1B2A41',
      muted: '#36506B',
      accent: '#B83F26',
      'accent-ink': '#FFFDF8',
      'accent-text': '#8C2F1A',
      line: '#1B2A41',
      focus: '#1B2A41',
      route: '#B83F26',
      fog: '#E4EEF4',
      'deco-1': '#7FD8BE',
      'deco-2': '#F4D58D',
      'deco-3': '#3A86FF',
      'font-display': "'Pixelify Sans Variable', 'Pixelify Sans', 'Atkinson Hyperlegible', monospace",
      'font-body': "'Atkinson Hyperlegible', ui-sans-serif, sans-serif",
      'display-weight': '600',
      'display-case': 'none',
      'display-tracking': '0.01em',
      'r-card': '0px',
      'r-control': '0px',
      bw: '3px',
      'shadow-card': '4px 4px 0 #1B2A41',
      'shadow-pop': '6px 6px 0 #1B2A41',
      'dur-fast': '160ms',
      'dur-slow': '420ms',
      ease: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      'ease-pop': 'cubic-bezier(0.3, 1.4, 0.5, 1)',
    },
  },
  noir: {
    id: 'noir',
    name: 'Noir Metropolis',
    short: 'Noir',
    tagline: 'Rain, rooftops and one amber light',
    tokens: {
      bg: '#070B14',
      surface: '#0E1626',
      raised: '#15203A',
      ink: '#D7DEEA',
      muted: '#8C9AB3',
      accent: '#F2A93B',
      'accent-ink': '#1A1205',
      'accent-text': '#F2A93B',
      line: 'rgba(215, 222, 234, 0.14)',
      focus: '#F2A93B',
      route: '#F2A93B',
      fog: '#1C2740',
      'deco-1': '#FFD89A',
      'deco-2': '#5B7BA8',
      'deco-3': '#9FB3D1',
      'font-display': "'Antonio Variable', 'Antonio', 'Arial Narrow', sans-serif",
      'font-body': "'Courier Prime', 'Courier New', monospace",
      'display-weight': '600',
      'display-case': 'uppercase',
      'display-tracking': '0.03em',
      'r-card': '2px',
      'r-control': '2px',
      bw: '1px',
      'shadow-card': '0 30px 60px -30px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(215, 222, 234, 0.06)',
      'shadow-pop': '0 0 0 1px rgba(242, 169, 59, 0.5), 0 10px 30px -10px rgba(242, 169, 59, 0.35)',
      'dur-fast': '240ms',
      'dur-slow': '900ms',
      ease: 'cubic-bezier(0.65, 0, 0.35, 1)',
      'ease-pop': 'cubic-bezier(0.65, 0, 0.35, 1)',
    },
  },
  pop: {
    id: 'pop',
    name: 'Pop-Panel City',
    short: 'Pop',
    tagline: 'Halftone streets and loud little panels',
    tokens: {
      bg: '#F2EFE6',
      surface: '#FFFEFA',
      raised: '#FFF3B0',
      ink: '#161616',
      muted: '#3D3D3D',
      accent: '#C80F68',
      'accent-ink': '#FFFEFA',
      'accent-text': '#B80D5E',
      line: '#161616',
      focus: '#161616',
      route: '#161616',
      fog: '#00A6D6',
      'deco-1': '#00A6D6',
      'deco-2': '#FFD400',
      'deco-3': '#FF6FB0',
      'font-display': "'Bangers', Impact, sans-serif",
      'font-body': "'Comic Neue', 'Comic Sans MS', sans-serif",
      'display-weight': '400',
      'display-case': 'none',
      'display-tracking': '0.04em',
      'r-card': '0px',
      'r-control': '9999px',
      bw: '3px',
      'shadow-card': '6px 6px 0 #161616',
      'shadow-pop': '4px 4px 0 #161616',
      'dur-fast': '140ms',
      'dur-slow': '360ms',
      ease: 'cubic-bezier(0.2, 0.9, 0.3, 1.1)',
      'ease-pop': 'cubic-bezier(0.34, 1.8, 0.64, 1)',
    },
  },
};

export const PLACES: Record<PlaceId, Place> = { nexus: NEXUS, ...WORLDS };

export const isWorldId = (value: unknown): value is WorldId =>
  typeof value === 'string' && (WORLD_IDS as readonly string[]).includes(value);

/** The world the "Explore the map" button opens when there's no history yet. */
export const DEFAULT_WORLD: WorldId = 'manuscript';

/** One hidden secret per world; finding all four fills the Nexus counter. */
export const SECRET_IDS: Record<WorldId, string> = {
  manuscript: 'manuscript:margin-note',
  voxel: 'voxel:eight-bits',
  noir: 'noir:rooftop-line',
  pop: 'pop:bonus-panel',
};
