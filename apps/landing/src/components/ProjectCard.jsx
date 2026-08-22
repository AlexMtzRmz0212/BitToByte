import { ArrowUpRight, Sparkles } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const { title, description, url, icon, tags, accent, featured, meta, className } = project;
  // Double-width tiles get a slightly larger title so the mosaic has a rhythm;
  // the narrow ones stay compact (matches the portfolio).
  const isWide = className?.includes('col-span-2');

  return (
    <a
      href={url}
      style={{ '--glow': accent }}
      className="group relative flex h-full w-full overflow-hidden rounded-2xl p-px transition-transform duration-300 hover:-translate-y-1.5"
    >
      {/* rotating conic glow border (revealed on hover) */}
      <span className="conic-border pointer-events-none absolute -inset-[150%] opacity-0 transition-opacity duration-500 animate-spin-slow group-hover:opacity-100" />

      {/* outward ambient glow */}
      <span
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
        style={{ backgroundColor: accent }}
      />

      {/* inner surface */}
      <div className="relative z-10 flex h-full w-full flex-col rounded-[15px] border border-white/[0.06] bg-gray-900/80 p-6 backdrop-blur-xl">
        {/* top spotlight on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[15px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(440px circle at 50% 0%, ${accent}24, transparent 70%)`,
          }}
        />

        <div className="relative flex items-start justify-between">
          <div
            className="flex w-fit items-center justify-center rounded-xl border border-white/10 bg-white/5 p-3 transition-transform duration-300 group-hover:scale-110"
            style={{ color: accent }}
          >
            {icon}
          </div>

          <span
            className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium"
            style={{
              color: accent,
              borderColor: `${accent}55`,
              backgroundColor: `${accent}14`,
            }}
          >
            {featured && <Sparkles className="h-3 w-3" />}
            {meta}
          </span>
        </div>

        <div className="relative mt-5 flex flex-1 flex-col">
          <h3
            className={`flex items-center gap-2 font-semibold tracking-tight ${
              isWide ? 'text-2xl' : 'text-xl'
            }`}
          >
            {title}
            <ArrowUpRight className="h-5 w-5 shrink-0 text-gray-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
          </h3>

          <p
            className={`mt-2 leading-relaxed text-gray-400 ${
              isWide ? 'text-sm md:text-base' : 'text-sm'
            }`}
          >
            {description}
          </p>

          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-gray-400 transition-colors duration-300 group-hover:border-white/20 group-hover:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
