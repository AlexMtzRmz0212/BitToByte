import { techStack } from '../data/content';
import SectionHeading from './SectionHeading';

const TechMarquee = () => {
  // duplicated once so the -50% translate loops seamlessly
  const row = [...techStack, ...techStack];

  return (
    <section id="stack" className="relative py-16">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading align="left" title="Built with a modern stack" />
      </div>

      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
          {row.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="group flex items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-gray-300 backdrop-blur transition-colors duration-300 hover:border-blue-400/40 hover:text-white"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400/70 transition-colors group-hover:bg-blue-400" />
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechMarquee;
