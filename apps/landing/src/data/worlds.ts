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

/**
 * A place's map, in world units (the art is drawn on the same grid).
 * Landmarks sit on `lots`: a world's projects fill them in the order they
 * appear in projects.ts, so list the lots nearest the arrival gates first and
 * keep a few spare for future projects.
 */
export interface MapLayout {
  size: { w: number; h: number };
  /** Where the traveler starts when arriving without a gate (a deep link). */
  spawn: Point;
  lots: Point[];
  /** Portal gates, keyed by the place they lead to. */
  gates: Partial<Record<PlaceId, Point>>;
  /** The hub's studio building (hub only). */
  home?: Point;
  /** A region to fit on screen when the map opens (instead of zooming in on the traveler). */
  overview?: { x: number; y: number; w: number; h: number };
  /** Where this world's secret hides. */
  secret?: Point;
  fog?: { kind: 'ink' | 'chunks' | 'mist' | 'halftone'; cell: number; radius: number };
}

export const NEXUS: Place = {
  id: 'nexus',
  name: 'The Nexus',
  short: 'Nexus',
  tagline: 'A hub drifting between dimensions',
  tokens: {
    bg: '#030712',
    surface: '#0A1122',
    raised: '#111B33',
    ink: '#F1F5F9',
    muted: '#A3AEC4',
    accent: '#8EE04B',
    'accent-ink': '#08160A',
    'accent-text': '#9EE65F',
    line: 'rgba(158, 230, 95, 0.18)',
    focus: '#C3F59A',
    route: '#8EE04B',
    fog: '#030712',
    'deco-1': '#8EE04B',
    'deco-2': '#5EEAD4',
    'deco-3': '#C084FC',
    'font-display': "'Bricolage Grotesque Variable', 'Bricolage Grotesque', ui-sans-serif, sans-serif",
    'font-body': "'Bricolage Grotesque Variable', 'Bricolage Grotesque', ui-sans-serif, sans-serif",
    'display-weight': '700',
    'display-case': 'none',
    'display-tracking': '-0.025em',
    'r-card': '16px',
    'r-control': '9999px',
    bw: '1px',
    'shadow-card': '0 1px 0 rgba(255, 255, 255, 0.04) inset, 0 24px 48px -24px rgba(2, 6, 23, 0.8)',
    'shadow-pop': '0 10px 32px -10px rgba(142, 224, 75, 0.55)',
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
    tagline: 'Inked corridors that draw themselves',
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
    tagline: 'Blocks, rails and a sky that keeps time',
    tokens: {
      bg: '#8FCBEA',
      surface: '#C9C9C4',
      raised: '#DCDCD7',
      ink: '#1F2226',
      muted: '#40454C',
      accent: '#2F7A1F',
      'accent-ink': '#FBFFF5',
      'accent-text': '#1F5514',
      line: '#1E1E1E',
      focus: '#1F2226',
      route: '#5A4632',
      fog: '#EEF2F4',
      'deco-1': '#6DBB3B',
      'deco-2': '#8B5E3C',
      'deco-3': '#3A7BD5',
      'font-display': "'Pixelify Sans Variable', 'Pixelify Sans', 'Atkinson Hyperlegible', monospace",
      'font-body': "'Atkinson Hyperlegible', ui-sans-serif, sans-serif",
      'display-weight': '600',
      'display-case': 'none',
      'display-tracking': '0.01em',
      'r-card': '0px',
      'r-control': '0px',
      bw: '2px',
      'shadow-card':
        'inset -3px -3px 0 rgba(0, 0, 0, 0.28), inset 3px 3px 0 rgba(255, 255, 255, 0.6), 0 0 0 2px #1E1E1E',
      'shadow-pop':
        'inset -3px -3px 0 rgba(0, 0, 0, 0.3), inset 3px 3px 0 rgba(255, 255, 255, 0.35), 0 0 0 2px #1E1E1E',
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
    tagline: 'Rain, gargoyles and a signal in the sky',
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
    tagline: 'Red, blue and loud on every page',
    tokens: {
      bg: '#F2EFE6',
      surface: '#FFFEFA',
      raised: '#FFF3B0',
      ink: '#161616',
      muted: '#3D3D3D',
      accent: '#C8102E',
      'accent-ink': '#FFFEFA',
      'accent-text': '#A80D26',
      line: '#161616',
      focus: '#161616',
      route: '#161616',
      fog: '#1B4FD8',
      'deco-1': '#1B4FD8',
      'deco-2': '#FFD400',
      'deco-3': '#E8414A',
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

/** What each secret says when you find it. TODO(alex): drafts. */
export const SECRETS: Record<WorldId, { title: string; text: string }> = {
  manuscript: {
    title: 'A note in the margin',
    text: 'You lifted the corner. Most people never read the margins.',
  },
  voxel: {
    title: 'Eight bits, one byte',
    text: 'Eight little blocks just clicked into one. That is the whole studio name, really.',
  },
  noir: {
    title: 'Writing on the roof',
    text: 'Someone painted it where only the searchlight reaches: "Still up? So am I."',
  },
  pop: {
    title: 'Bonus panel!',
    text: 'You found the gutter between the panels. Nobody lives here but you.',
  },
};

/** Map layouts. Gates are keyed by destination; worlds form a ring of
 *  neighbours (Manuscript, Voxel, Pop, Noir) and each has a gate home. */
export const MAPS: Record<PlaceId, MapLayout> = {
  nexus: {
    size: { w: 1600, h: 1200 },
    home: { x: 800, y: 590 },
    spawn: { x: 990, y: 566 },
    overview: { x: 262, y: 110, w: 1076, h: 1010 },
    lots: [],
    gates: {
      manuscript: { x: 800, y: 228 },
      voxel: { x: 1222, y: 600 },
      pop: { x: 800, y: 972 },
      noir: { x: 378, y: 600 },
    },
  },
  manuscript: {
    size: { w: 2200, h: 1500 },
    spawn: { x: 430, y: 1150 },
    lots: [
      { x: 980, y: 760 },
      { x: 1560, y: 1060 },
      { x: 1430, y: 470 },
      { x: 720, y: 1110 },
      { x: 1080, y: 320 },
      { x: 1850, y: 820 },
    ],
    gates: {
      nexus: { x: 330, y: 1250 },
      voxel: { x: 1930, y: 360 },
      noir: { x: 300, y: 330 },
    },
    secret: { x: 2120, y: 1420 },
    fog: { kind: 'ink', cell: 40, radius: 260 },
  },
  voxel: {
    size: { w: 2200, h: 1500 },
    spawn: { x: 1100, y: 1240 },
    lots: [
      { x: 700, y: 820 },
      { x: 1100, y: 560 },
      { x: 1520, y: 860 },
      { x: 520, y: 1200 },
      { x: 1700, y: 1220 },
      { x: 1100, y: 980 },
    ],
    gates: {
      nexus: { x: 1100, y: 1330 },
      manuscript: { x: 280, y: 380 },
      pop: { x: 1930, y: 400 },
    },
    secret: { x: 1600, y: 1180 },
    fog: { kind: 'chunks', cell: 50, radius: 240 },
  },
  noir: {
    size: { w: 2200, h: 1500 },
    spawn: { x: 1020, y: 1290 },
    lots: [
      { x: 1700, y: 1268 },
      { x: 1000, y: 880 },
      { x: 520, y: 880 },
      { x: 1480, y: 540 },
      { x: 660, y: 1200 },
      { x: 1920, y: 870 },
    ],
    gates: {
      nexus: { x: 1020, y: 1380 },
      pop: { x: 250, y: 1250 },
      manuscript: { x: 280, y: 200 },
    },
    secret: { x: 1250, y: 330 },
    fog: { kind: 'mist', cell: 40, radius: 260 },
  },
  pop: {
    size: { w: 2200, h: 1500 },
    spawn: { x: 1100, y: 330 },
    lots: [
      { x: 370, y: 900 },
      { x: 1100, y: 920 },
      { x: 1830, y: 900 },
      { x: 860, y: 1380 },
      { x: 1340, y: 1380 },
      { x: 400, y: 330 },
    ],
    gates: {
      nexus: { x: 1100, y: 250 },
      voxel: { x: 1910, y: 1290 },
      noir: { x: 290, y: 1290 },
    },
    secret: { x: 1425, y: 455 },
    fog: { kind: 'halftone', cell: 36, radius: 250 },
  },
};

/** Where you step out when travelling from `from` to `to`. */
export function arrivalPoint(to: PlaceId, from: PlaceId | null): Point {
  const map = MAPS[to];
  const gate = (from && map.gates[from]) ?? map.gates.nexus;
  return gate ?? map.spawn;
}

/** The gate to walk to when leaving `from` for `to`: a direct gate if there is one, else the way home. */
export function departureGate(from: PlaceId, to: PlaceId): Point | null {
  const gates = MAPS[from].gates;
  return gates[to] ?? gates.nexus ?? null;
}
