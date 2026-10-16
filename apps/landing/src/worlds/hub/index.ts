import type { WorldModule } from '../types';
import { HubGate, HubHome, HubTerrain, Saucer } from './HubArt';
import Starfield from './Starfield';
import './hub.css';

// The hub ships in the main bundle: it is the landing page.
export const hubModule: WorldModule = {
  Terrain: HubTerrain,
  Landmark: () => null,
  Gate: HubGate,
  Home: HubHome,
  Traveler: Saucer,
  routeClass: 'route-flight',
  landmarkHeight: 0,
  Backdrop: Starfield,
};
