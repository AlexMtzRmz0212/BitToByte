import type { Point } from '../../data/worlds';

/**
 * A flat roof with words painted on it. You can only make them out when the
 * light sweeps across, unless you've already found them.
 */
export default function NoirSecret({ at, found }: { at: Point; found: boolean }) {
  const { x, y } = at;
  return (
    <g className={found ? 'nr-secret nr-secret-found' : 'nr-secret'}>
      <path d={`M${x - 150} ${y + 40}h250l40 -36h-250z`} className="nr-roof" />
      <path d={`M${x - 150} ${y + 40}h250v14h-250z`} className="nr-side" />
      <text x={x - 6} y={y + 30} textAnchor="middle" className="nr-roof-text">
        STILL UP? SO AM I.
      </text>
      <path d={`M${x - 130} ${y + 24}h230`} className="nr-roof-sweep" />
    </g>
  );
}
