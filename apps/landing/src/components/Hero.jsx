import { ArrowRight, ArrowDown } from 'lucide-react';

const Hero = () => {
  return (
    <header
      id="top"
      className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 pt-24 text-center"
    >
      <div className="relative flex flex-col items-center">
        {/* One color, two sizes. The emphasis between the two lines is typographic,
            not a colored or gradient-filled tail on the closing phrase: that reads as
            decoration, and it is the first thing that makes a headline look generated.
            Accent color on this page belongs to things you can click. */}
        <h1 className="max-w-4xl font-extrabold leading-[1.04] tracking-tight text-gray-50">
          <span className="block text-2xl font-semibold text-gray-400 md:text-3xl lg:text-4xl">
            Building complexity
          </span>
          <span className="mt-2 block text-5xl md:text-7xl lg:text-8xl">
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

export default Hero;
