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
  // A horseshoe, open end down, with its nail holes.
  frontier:
    'M7.5 20.5H4.6C3.6 18 3 15.4 3 12.6a9 9 0 0 1 18 0c0 2.8-.6 5.4-1.6 7.9h-2.9c.9-2.5 1.4-5 1.4-7.9a5.9 5.9 0 0 0-11.8 0c0 2.9.5 5.4 1.4 7.9zM5.6 10.5h.01M18.4 10.5h.01M8.3 6h.01M15.7 6h.01',
  // A palm tree on the shore.
  sunset: 'M5 21h14M13 21c0-4 .4-7.6 1.6-10.6M14.6 10.4C13 7.6 9.4 7 6.3 8.4M14.6 10.4c.8-2.8 3.6-4.6 6.6-4.2M14.6 10.4c-2.8-.2-5.4 1.4-6.6 4.2M14.6 10.4c2.8.2 5 2.2 5.8 5M14.6 10.4c.2-2.8-1.2-5.4-3.6-6.8',
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
