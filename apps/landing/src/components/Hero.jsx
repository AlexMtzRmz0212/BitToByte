import { ArrowRight, ArrowDown } from 'lucide-react';
import { stats } from '../data/content';
import { useReveal } from '../hooks/useReveal';
import { useCountUp } from '../hooks/useCountUp';

const Hero = () => {
  return (
    <header
      id="top"
      className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-24 text-center"
    >
      <div className="relative flex flex-col items-center">
        <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.04] tracking-tight md:text-7xl lg:text-8xl">
          Building complexity
          <br />
          <span className="bg-[length:200%_auto] bg-gradient-to-r from-blue-300 via-blue-500 to-blue-300 bg-clip-text text-transparent animate-gradient-x">
            one piece at a time.
          </span>
        </h1>

        <p className="mt-7 max-w-2xl text-lg text-gray-400 md:text-xl">
          The central hub for automated systems, AI-driven applications, and interactive data
          visualization: engineered, deployed, and online.
        </p>

        <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/30 hover:brightness-110"
          >
            Explore Projects
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href="https://github.com/AlexMtzRmz0212"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-gray-200 transition-all duration-300 hover:border-white/20 hover:bg-white/10"
          >
            View GitHub
          </a>
        </div>

        <StatsRow />
      </div>

      <a
        href="#capabilities"
        aria-label="Scroll to content"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 transition-colors hover:text-gray-200"
      >
        <ArrowDown className="h-5 w-5 animate-float" />
      </a>
    </header>
  );
};

const StatsRow = () => {
  const [ref, visible] = useReveal({ threshold: 0.4 });
  return (
    <div
      ref={ref}
      className="mt-14 grid w-full max-w-2xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4"
    >
      {stats.map((s) => (
        <Stat key={s.label} {...s} active={visible} />
      ))}
    </div>
  );
};

const Stat = ({ value, suffix, label, active }) => {
  const count = useCountUp(value, active);
  return (
    <div className="flex flex-col items-center">
      <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
        {count}
        {suffix}
      </span>
      <span className="mt-1 text-xs uppercase tracking-widest text-gray-400">{label}</span>
    </div>
  );
};

export default Hero;
