// Brand monogram glyphs, drawn to sit INSIDE the Navbar logo tile (the tile's
// background + text color come from markClassName / markIconClassName). Both use
// `currentColor` so the tile controls the ink. Matching full-tile versions live in
// each app's public/favicon.svg so the browser tab and the navbar read as one mark.

const glyphProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

// Angular "A" chevron with a crossbar. Reads cleanly down to favicon sizes.
const AlexMark = ({ className }) => (
  <svg {...glyphProps} className={className}>
    <path d="M5 19 12 5l7 14" />
    <path d="M8.3 13.5h7.4" />
  </svg>
);

// Geometric "B": a stem with two stacked bowls.
const BitToByteMark = ({ className }) => (
  <svg {...glyphProps} className={className}>
    <path d="M8 4v16" />
    <path d="M8 4h5.5a4 4 0 0 1 0 8H8" />
    <path d="M8 12h6a4.2 4.2 0 0 1 0 8H8" />
  </svg>
);

export { AlexMark, BitToByteMark };
