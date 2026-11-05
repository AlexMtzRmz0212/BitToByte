import { ProjectorScene, TunerScene } from '../../scenes/NoirScenes';
import type { WorldModule } from '../types';
import { mistFog } from './fog';
import NoirLandmark from './Landmarks';
import { Beacon, NoirBackdrop, NoirGate, NoirSkyFx } from './Pieces';
import NoirSecret from './Secret';
import NoirTerrain, { NoirTraffic } from './Terrain';
import './noir.css';

const noir: WorldModule = {
  Terrain: NoirTerrain,
  Landmark: NoirLandmark,
  Gate: NoirGate,
  Traveler: Beacon,
  UnderFog: NoirTraffic,
  Backdrop: NoirBackdrop,
  Ambient: NoirSkyFx,
  Secret: NoirSecret,
  routeClass: 'route-trail',
  landmarkHeight: 300,
  fog: mistFog,
  scenes: {
    projector: ProjectorScene,
    tuner: TunerScene,
  },
};

export default noir;
