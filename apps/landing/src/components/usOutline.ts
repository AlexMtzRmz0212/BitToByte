// A coarse outline of the contiguous United States, for the flight transition
// between Vice City (Florida) and Los Santos (California). Longitude/latitude
// pairs, clockwise from the north-west corner; projected onto a 960 x 520 stage
// (longitude scaled by cos 38 degrees so the shape isn't stretched).

const OUTLINE: [number, number][] = [
  [-124.7, 48.4], [-123.2, 49.0], [-95.2, 49.0], [-94.6, 48.7], [-89.6, 48.0], [-84.9, 46.9], [-84.5, 46.5],
  [-83.0, 42.0], [-82.5, 41.7], [-79.0, 42.8], [-76.5, 43.6], [-75.0, 45.0], [-71.5, 45.0], [-70.0, 46.7],
  [-69.2, 47.4], [-67.8, 47.1], [-67.0, 44.8], [-70.2, 43.6], [-70.7, 42.7], [-70.0, 41.8], [-71.4, 41.4],
  [-73.7, 40.9], [-74.0, 40.0], [-74.9, 38.9], [-75.5, 38.0], [-75.9, 37.0], [-75.5, 35.3], [-77.0, 34.5],
  [-78.9, 33.7], [-80.9, 32.0], [-81.4, 30.7], [-81.3, 29.8], [-80.5, 28.4], [-80.0, 26.8], [-80.1, 25.8],
  [-80.5, 25.2], [-81.1, 25.1], [-81.8, 26.1], [-82.7, 27.7], [-82.8, 29.0], [-83.8, 29.9], [-84.3, 30.0],
  [-85.4, 29.7], [-86.5, 30.4], [-88.0, 30.3], [-89.4, 30.2], [-89.2, 29.1], [-90.5, 29.1], [-92.0, 29.6],
  [-93.8, 29.7], [-94.8, 29.3], [-96.5, 28.3], [-97.4, 27.3], [-97.2, 25.9], [-99.1, 26.4], [-99.5, 27.5],
  [-100.5, 29.1], [-101.4, 29.8], [-102.4, 29.8], [-103.1, 29.0], [-104.4, 29.6], [-104.9, 30.6],
  [-106.5, 31.8], [-108.2, 31.8], [-108.2, 31.3], [-111.1, 31.3], [-114.8, 32.5], [-117.1, 32.5],
  [-118.5, 34.0], [-120.6, 34.5], [-121.9, 36.6], [-122.5, 37.8], [-123.7, 38.9], [-124.4, 40.4],
  [-124.1, 42.0], [-124.5, 43.0], [-124.0, 46.2],
];

export const STAGE = { w: 960, h: 520 } as const;

/** Longitude/latitude to stage pixels. */
export const project = (lon: number, lat: number): [number, number] => [(lon + 125) * 16.4, (49.5 - lat) * 20.8];

export const US_PATH =
  OUTLINE.map(([lon, lat], i) => {
    const [x, y] = project(lon, lat);
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join('') + 'Z';

/** Where each theme's city sits on the stage. */
export const CITY = {
  vice: project(-80.2, 25.8),
  santos: project(-118.2, 34.0),
} as const;

/** A quadratic arc between two stage points, bowed north. */
export function arcPath(from: readonly [number, number], to: readonly [number, number]): string {
  const cx = (from[0] + to[0]) / 2;
  const cy = Math.min(from[1], to[1]) - 200;
  return `M${from[0].toFixed(1)} ${from[1].toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${to[0].toFixed(1)} ${to[1].toFixed(1)}`;
}
