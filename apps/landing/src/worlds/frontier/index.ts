import { SundialScene } from '../../scenes/ManuscriptScenes';
import { QueueScene } from '../../scenes/VoxelScenes';
import type { WorldModule } from '../types';
import { dustFog } from './fog';
import FrontierLandmark from './Landmarks';
import { FrontierBackdrop, FrontierGate, FrontierSkyFx, FrontierTrain, Rider } from './Pieces';
import FrontierSecret from './Secret';
import FrontierTerrain from './Terrain';
import './frontier.css';

const frontier: WorldModule = {
  Terrain: FrontierTerrain,
  Landmark: FrontierLandmark,
  Gate: FrontierGate,
  Traveler: Rider,
  Overlay: FrontierTrain,
  Backdrop: FrontierBackdrop,
  Ambient: FrontierSkyFx,
  Secret: FrontierSecret,
  routeClass: 'route-wagon',
  landmarkHeight: 300,
  fog: dustFog,
  scenes: {
    sundial: SundialScene,
    queue: QueueScene,
  },
};

export default frontier;
