import { LedgerScene, ScalesScene, SundialScene } from '../../scenes/ManuscriptScenes';
import type { WorldModule } from '../types';
import { inkFog } from './fog';
import ManuscriptGate from './Gate';
import ManuscriptLandmark from './Landmarks';
import ManuscriptTerrain from './Terrain';
import { ManuscriptDust, ManuscriptLife } from './Life';
import ManuscriptTraveler from './Traveler';
import './manuscript.css';

const manuscript: WorldModule = {
  Terrain: ManuscriptTerrain,
  Landmark: ManuscriptLandmark,
  Gate: ManuscriptGate,
  Traveler: ManuscriptTraveler,
  Overlay: ManuscriptLife,
  Ambient: ManuscriptDust,
  routeClass: 'route-ink',
  landmarkHeight: 214,
  fog: inkFog,
  scenes: {
    scales: ScalesScene,
    flipboard: LedgerScene,
    sundial: SundialScene,
  },
};

export default manuscript;
