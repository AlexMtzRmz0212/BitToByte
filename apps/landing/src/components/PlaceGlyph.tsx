import type { PlaceId } from '../data/worlds';

// Small original emblems for each place, drawn on a 24px grid in currentColor.
const PATHS: Record<PlaceId, string> = {
  // A portal ring with a point of light inside.
  nexus: 'M12 3.5a8.5 8.5 0 1 1 0 17a8.5 8.5 0 1 1 0-17M12 10.2a1.8 1.8 0 1 1 0 3.6a1.8 1.8 0 1 1 0-3.6',
  // A four-point compass star.
  manuscript: 'M12 2.5l2.2 7.3 7.3 2.2-7.3 2.2L12 21.5l-2.2-7.3L2.5 12l7.3-2.2z',
  // An isometric cube.
  voxel: 'M12 2.8l8 4.6v9.2l-8 4.6-8-4.6V7.4zM4 7.4l8 4.6 8-4.6M12 12v9.2',
  // A skyline of three towers.
  noir: 'M3 21h18M5 21V10h4v11M10 21V4h5v17M16 21v-8h3v8',
  // A comic starburst.
  pop: 'M12 2.5l2 5 5-2-2 5 5 1.5-5 1.5 2 5-5-2-2 5-2-5-5 2 2-5-5-1.5 5-1.5-2-5 5 2z',
};

export default function PlaceGlyph({ id, className = 'h-5 w-5' }: { id: PlaceId; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d={PATHS[id]} />
    </svg>
  );
}
