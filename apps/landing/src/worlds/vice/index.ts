import { ChargeScene } from '../../scenes/NoirScenes';
import { BallScene } from '../../scenes/PopScenes';
import { LapsScene } from '../../scenes/SunsetScenes';
import type { WorldModule } from '../types';
import { viceFog } from './fog';
import ViceLandmark from './Landmarks';
import { ViceBackdrop, ViceCar, ViceGate, ViceSkyFx, ViceTraffic } from './Pieces';
import ViceSecret from './Secret';
import ViceTerrain from './Terrain';
import './vice.css';

// Vice City, the default theme of the sunset world (Los Santos is worlds/sunset).
// The arrival scenes are shared with the other worlds; they draw with tokens.

const vice: WorldModule = {
  Terrain: ViceTerrain,
  Landmark: ViceLandmark,
  Gate: ViceGate,
  Traveler: ViceCar,
  UnderFog: ViceTraffic,
  Backdrop: ViceBackdrop,
  Ambient: ViceSkyFx,
  Secret: ViceSecret,
  routeClass: 'route-vice',
  landmarkHeight: 300,
  fog: viceFog,
  scenes: {
    charge: ChargeScene,
    ball: BallScene,
    laps: LapsScene,
  },
};

export default vice;
