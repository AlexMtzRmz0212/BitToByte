// District archetypes: the landmark a project gets on its world's map.
//
// A project picks one by id in src/data/projects.ts. A world draws the ids its
// own projects use as bespoke buildings; any other id (including `hall`) gets
// that world's generic hall with the project's name on a sign. So a new
// project only ever needs data, never a new component.

export const ARCHETYPES = {
  courthouse: { label: 'Courthouse with scales' },
  lighthouse: { label: 'Harbour charging lighthouse' },
  gate: { label: 'Border gate with a ledger board' },
  clocktower: { label: 'Clock tower with a notice board' },
  monument: { label: 'Hall-of-fame monument' },
  cinema: { label: 'Projection house' },
  tower: { label: 'Command tower' },
  garden: { label: 'Walled garden with a sundial' },
  stadium: { label: 'Stadium' },
  library: { label: 'Comic archive library' },
  arena: { label: 'Hill arena with a beacon' },
  hall: { label: 'Town hall' },
} as const;

export type ArchetypeId = keyof typeof ARCHETYPES;

export const isArchetypeId = (value: unknown): value is ArchetypeId =>
  typeof value === 'string' && Object.hasOwn(ARCHETYPES, value);

// Arrival mini-scenes: a few seconds of what the project does, played when the
// traveler reaches the district. World-agnostic: they draw with theme tokens.
export const SCENE_IDS = [
  'scales',
  'charge',
  'flipboard',
  'sort',
  'ranking',
  'projector',
  'timer',
  'sundial',
  'ball',
  'shelf',
  'queue',
] as const;

export type SceneId = (typeof SCENE_IDS)[number];

export const isSceneId = (value: unknown): value is SceneId =>
  typeof value === 'string' && (SCENE_IDS as readonly string[]).includes(value);
