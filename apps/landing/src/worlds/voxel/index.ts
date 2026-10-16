import { QueueScene, SortScene, TimerScene } from '../../scenes/VoxelScenes';
import type { WorldModule } from '../types';
import VoxelLandmark from './Landmarks';
import { Minecart, VoxelGate } from './Pieces';
import { chunkFog } from './fog';
import VoxelSecret from './Secret';
import { VoxelAmbient, VoxelSky } from './Sky';
import VoxelTerrain, { CloudLayer } from './Terrain';
import './voxel.css';

const voxel: WorldModule = {
  Terrain: VoxelTerrain,
  Landmark: VoxelLandmark,
  Gate: VoxelGate,
  Traveler: Minecart,
  Overlay: CloudLayer,
  Backdrop: VoxelSky,
  Ambient: VoxelAmbient,
  Secret: VoxelSecret,
  routeClass: 'route-rails',
  landmarkHeight: 250,
  fog: chunkFog,
  scenes: {
    sort: SortScene,
    timer: TimerScene,
    queue: QueueScene,
  },
};

export default voxel;
