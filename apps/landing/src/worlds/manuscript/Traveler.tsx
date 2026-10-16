import { FOOT } from './Life';

// The traveler on the parchment is never drawn as a figure: you only see ink
// footprints appearing where it walks (Life.tsx), and a small name ribbon
// floating over the latest step. Standing still, it shows the last pair.

export default function ManuscriptTraveler() {
  return (
    <div className="ms-traveler">
      <svg viewBox="-20 -20 40 40" width="40" height="40" aria-hidden="true" focusable="false" className="ms-stance">
        <path d={FOOT} transform="translate(-6 2)" />
        <path d={FOOT} transform="translate(6 -4)" />
      </svg>
      <span className="ms-ribbon">You</span>
    </div>
  );
}
