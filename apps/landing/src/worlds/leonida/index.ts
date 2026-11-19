import '../vice/vice.css';
import type { WorldModule } from '../types';
import { viceFog } from '../vice/fog';
import { ViceBackdrop, ViceCar, ViceGate, ViceSkyFx } from '../vice/Pieces';
import LeonidaTerrain from './Terrain';
import './leonida.css';

// The state of Leonida: Vice City's neighbour, reached through the highway gate.
// It borrows Vice City's gate, convertible, sky and fog, and has no projects of
// its own, so there are no landmarks and no secret.

const leonida: WorldModule = {
  Terrain: LeonidaTerrain,
  Landmark: () => null,
  Gate: ViceGate,
  Traveler: ViceCar,
  Backdrop: ViceBackdrop,
  Ambient: ViceSkyFx,
  routeClass: 'route-vice',
  landmarkHeight: 0,
  fog: viceFog,
};

export default leonida;
