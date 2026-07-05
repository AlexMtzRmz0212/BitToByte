/**
 * Fixed ambient backdrop: drifting aurora blobs + a masked tech grid.
 * Sits behind everything (-z-10) and ignores pointer events.
 */
const Background = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full bg-blue-600/20 blur-[130px] animate-aurora" />
    <div className="absolute top-1/3 -right-32 h-[34rem] w-[34rem] rounded-full bg-purple-600/20 blur-[130px] animate-aurora [animation-delay:-7s]" />
    <div className="absolute top-2/3 left-1/4 h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-[130px] animate-aurora [animation-delay:-14s]" />

    <div
      className="absolute inset-0 animate-grid-fade"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.06) 1px, transparent 1px)',
        backgroundSize: '52px 52px',
        maskImage:
          'radial-gradient(ellipse 90% 70% at 50% 0%, #000 35%, transparent 100%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 90% 70% at 50% 0%, #000 35%, transparent 100%)',
      }}
    />

    {/* faint vignette toward the bottom for depth */}
    <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-gray-950 to-transparent" />
  </div>
);

export default Background;
