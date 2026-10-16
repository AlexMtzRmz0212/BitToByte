// District archetypes: the building concept a project gets on every map.
//
// A project picks one archetype by id in src/data/projects.ts. Each world draws
// the same archetype in its own visual language, so a new project only needs an
// existing id here, never a new component.

export const ARCHETYPES = {
  courthouse: { label: 'Courthouse with scales' },
  lighthouse: { label: 'Coastal charging lighthouse' },
  gate: { label: 'Border gate with a data board' },
  clocktower: { label: 'Clock tower with a notice board' },
  monument: { label: 'Hall-of-fame monument' },
  cinema: { label: 'Projection house' },
  tower: { label: 'Command tower' },
  garden: { label: 'Garden with a sundial' },
  stadium: { label: 'Stadium' },
  library: { label: 'Archive library' },
  arena: { label: 'Hill arena with a beacon' },
} as const;

export type ArchetypeId = keyof typeof ARCHETYPES;

export const isArchetypeId = (value: unknown): value is ArchetypeId =>
  typeof value === 'string' && value in ARCHETYPES;

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
