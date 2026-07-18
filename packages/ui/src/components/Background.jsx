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
 * @param {number} spread    Spotlight size, 0–1. 0 keeps the default compact 600px
 *                           circle; as it rises the radius grows AND the falloff
 *                           flattens, so at 1 the whole viewport sits at one uniform
 *                           brightness — the glow has become the page's light and
 *                           moving the pointer no longer changes anything.
 */
const Background = ({ glow = '96, 162, 255', strength = 0.4, spread = 0 }) => {
  const glowRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;

    const paint = () => {
      raf = 0;
      const el = glowRef.current;
      if (el) {
        // Grow the radius from the compact 600px spotlight (spread 0) toward 2.8x the
        // viewport diagonal, so at full spread the flat inner plateau (0–40% of the
        // radius) alone spans more than a full diagonal — i.e. covers every pixel no
        // matter where the pointer sits.
        const diag = Math.hypot(window.innerWidth, window.innerHeight);
        const radius = Math.round(600 + spread * (diag * 2.8 - 600));
        // Flatten the falloff as spread -> 1: the plateau opacity (mid) rises from a
        // spotlighty 0.35x up to the full strength, so the page reaches one uniform
        // brightness and pointer movement stops making any visible difference.
        const mid = (strength * (0.35 + spread * 0.65)).toFixed(3);
        el.style.background = `radial-gradient(${radius}px circle at ${x}px ${y}px, rgba(${glow}, ${strength}), rgba(${glow}, ${mid}) 40%, transparent 64%)`;
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      schedule();
    };

    paint(); // initial position
    window.addEventListener('mousemove', onMove);
    window.addEventListener('resize', schedule); // keep full-page coverage on resize
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [glow, strength, spread]);

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
