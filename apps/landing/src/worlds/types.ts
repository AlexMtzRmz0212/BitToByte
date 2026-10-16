import type { ComponentType } from 'react';
import type { Project } from '../data/projects';
import type { MapLayout, PlaceId, Point } from '../data/worlds';
import type { MapController } from '../engine/controller';

// What a world's lazily loaded module provides. The map screen is generic: it
// lays these pieces out, handles travel and selection, and never knows which
// world it is showing.

export interface LandmarkProps {
  project: Project;
  at: Point;
  discovered: boolean;
}

export interface GateProps {
  to: PlaceId;
  at: Point;
}

export interface WorldModule {
  /** Ground, scenery and decoration: SVG content drawn on the map grid. */
  Terrain: ComponentType<{ layout: MapLayout }>;
  /** A project's building: SVG content, centred on `at` (its base). */
  Landmark: ComponentType<LandmarkProps>;
  /** A portal gate to another place: SVG content centred on `at`. */
  Gate: ComponentType<GateProps>;
  /** The hub's studio building, if this map has one. */
  Home?: ComponentType<{ at: Point }>;
  /** Drawn inside the traveler element (HTML), centred on its position. */
  Traveler: ComponentType;
  /** Class on the route path, for the world's line style. */
  routeClass: string;
  /** How tall a landmark is (world units), so its label sits above it. */
  landmarkHeight: number;
  /** Optional screen-space layer behind the map (a sky). */
  Backdrop?: ComponentType;
  /** Optional screen-space effects (particles, rain). Gets the live controller. */
  Ambient?: ComponentType<{ controller: MapController }>;
}
