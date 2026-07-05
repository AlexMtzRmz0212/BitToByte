// src/components/SectionHeading.jsx
import Reveal from './Reveal';

const SectionHeading = ({ eyebrow, title, subtitle, align = 'center' }) => (
  <Reveal
    className={`flex flex-col ${
      align === 'center' ? 'items-center text-center' : 'items-start text-left'
    }`}
  >
    {eyebrow && (
      <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-blue-300">
        {eyebrow}
      </span>
    )}
    <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 max-w-2xl text-base text-gray-400 md:text-lg">
        {subtitle}
      </p>
    )}
  </Reveal>
);

export default SectionHeading;
