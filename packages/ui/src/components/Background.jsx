import { useEffect, useRef } from 'react';

/**
 * Fixed ambient backdrop (aurora blobs + masked grid, behind everything) plus a
 * cursor spotlight that glows OVER the page. The spotlight is a top overlay with
 * `mix-blend-mode: screen`, so it adds light to whatever it passes: cards, text
 * areas, and the dark background alike, like a flashlight following the mouse.
 *
 * The glow is driven straight through the DOM via requestAnimationFrame (no React
 * re-render per mouse move), so it stays smooth over long, content-heavy pages.
 */
/**
 * @param {string} glow      Cursor-spotlight color as an "r, g, b" triplet.
 *                           Defaults to the BitToByte blue; pass the site accent to match.
 * @param {number} strength  Core opacity of the spotlight (0–1). Lower it for
 *                           high-luminance accents (e.g. lime) that read too hot.
 */
const Background = ({ glow = '96, 162, 255', strength = 0.4 }) => {
  const glowRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;

    const paint = () => {
      raf = 0;
      const el = glowRef.current;
      if (el) {
        const mid = (strength * 0.35).toFixed(3);
        el.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(${glow}, ${strength}), rgba(${glow}, ${mid}) 40%, transparent 64%)`;
      }
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    paint(); // initial position
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [glow, strength]);

  return (
    <>
      {/* ambient backdrop, sits behind all content */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-[38rem] w-[38rem] rounded-full bg-blue-600/20 blur-[130px] animate-aurora" />
        <div className="absolute top-1/3 -right-32 h-[34rem] w-[34rem] rounded-full bg-blue-600/20 blur-[130px] animate-aurora [animation-delay:-7s]" />
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

      {/* cursor spotlight OVER content: screen blend lights up cards as it passes */}
      <div
        ref={glowRef}
        className="pointer-events-none fixed inset-0 z-[60]"
        style={{ mixBlendMode: 'screen' }}
      />
    </>
  );
};

export default Background;
