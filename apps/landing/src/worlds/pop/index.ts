import { BallScene, RankingScene, ShelfScene } from '../../scenes/PopScenes';
import type { WorldModule } from '../types';
import { halftoneFog } from './fog';
import PopLandmark from './Landmarks';
import { PopGate, PopSfx, Spider } from './Pieces';
import PopSecret from './Secret';
import PopTerrain from './Terrain';
import './pop.css';

const pop: WorldModule = {
  Terrain: PopTerrain,
  Landmark: PopLandmark,
  Gate: PopGate,
  Traveler: Spider,
  Ambient: PopSfx,
  Secret: PopSecret,
  routeClass: 'route-silk',
  landmarkHeight: 340,
  fog: halftoneFog,
  scenes: {
    ranking: RankingScene,
    ball: BallScene,
    shelf: ShelfScene,
  },
};

export default pop;
