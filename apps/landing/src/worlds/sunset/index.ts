import { ChargeScene } from '../../scenes/NoirScenes';
import { BallScene } from '../../scenes/PopScenes';
import { LapsScene } from '../../scenes/SunsetScenes';
import type { WorldModule } from '../types';
import { tilesFog } from './fog';
import SunsetLandmark from './Landmarks';
import { Car, SunsetBackdrop, SunsetGate, SunsetSkyFx, SunsetTraffic } from './Pieces';
import SunsetSecret from './Secret';
import SunsetTerrain from './Terrain';
import './sunset.css';

const sunset: WorldModule = {
  Terrain: SunsetTerrain,
  Landmark: SunsetLandmark,
  Gate: SunsetGate,
  Traveler: Car,
  UnderFog: SunsetTraffic,
  Backdrop: SunsetBackdrop,
  Ambient: SunsetSkyFx,
  Secret: SunsetSecret,
  routeClass: 'route-gps',
  landmarkHeight: 300,
  fog: tilesFog,
  scenes: {
    charge: ChargeScene,
    ball: BallScene,
    laps: LapsScene,
  },
};

export default sunset;
