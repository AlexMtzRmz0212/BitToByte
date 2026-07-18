import { useEffect, useRef, useState } from 'react';
import { SunMoon, Moon, Sun } from 'lucide-react';

/**
 * Compact "Theme" control: a small glass pill that expands to a slider bar.
 * The single 0-100 level drives both the page theme (dark -> light) and the
 * pointer-glow strength, wired up in App. Chrome uses the same neutral utility
 * classes as the rest of the site, so the control themes itself along with the page.
 *
 * @param {number} level              Current level (0-100).
 * @param {(level:number)=>void} onChange  Called with the new level as the user drags.
 */
const ThemeSlider = ({ level, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Collapse when the user interacts outside the control.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    return () => window.removeEventListener('pointerdown', onDown);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-[65]">
      <div className="flex items-center rounded-full border border-white/10 bg-gray-900/90 px-2 py-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Theme"
          className="flex shrink-0 items-center gap-2 rounded-full px-2.5 py-1.5 text-sm font-medium text-gray-300 transition-colors duration-200 hover:text-white"
        >
          <SunMoon className="h-4 w-4" />
          {!open && <span>Theme</span>}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none ${
            open
              ? 'ml-1 max-w-[min(16rem,calc(100vw-8rem))] opacity-100'
              : 'max-w-0 opacity-0'
          }`}
        >
          <div className="flex w-64 max-w-[calc(100vw-8rem)] items-center gap-2 pr-1">
            <Moon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
            <input
              type="range"
              min="0"
              max="100"
              value={level}
              onChange={(e) => onChange(Number(e.target.value))}
              className="theme-range min-w-0 flex-1"
              style={{ '--v': level }}
              aria-label="Page brightness"
            />
            <Sun className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSlider;
