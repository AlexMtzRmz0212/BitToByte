import { capabilities } from '../data/content';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

const Capabilities = () => (
  <section id="capabilities" className="relative mx-auto max-w-7xl px-6 py-24">
    <SectionHeading
      eyebrow="What I build"
      title="Engineering across the stack"
      subtitle="From embedded hardware to AI models to the dashboards that make data make sense."
    />

    <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {capabilities.map((cap, i) => (
        <Reveal key={cap.title} delay={i * 90}>
          <article
            style={{ '--glow': cap.accent }}
            className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-gray-900/50 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/15"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(400px circle at 50% 0%, ${cap.accent}1a, transparent 70%)`,
              }}
            />
            <div
              className="relative flex w-fit items-center justify-center rounded-xl border border-white/10 bg-white/5 p-3 transition-transform duration-300 group-hover:scale-110"
              style={{ color: cap.accent }}
            >
              {cap.icon}
            </div>
            <h3 className="relative mt-5 text-lg font-semibold tracking-tight">
              {cap.title}
            </h3>
            <p className="relative mt-2 text-sm leading-relaxed text-gray-400">
              {cap.description}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  </section>
);

export default Capabilities;
