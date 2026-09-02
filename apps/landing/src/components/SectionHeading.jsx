// src/components/SectionHeading.jsx
import Reveal from './Reveal';

const SectionHeading = ({ eyebrow, title, subtitle, align = 'center' }) => (
  <Reveal
    className={`flex flex-col ${
      align === 'center' ? 'items-center text-center' : 'items-start text-left'
    }`}
  >
    {/* Deliberately not a pill, and not all-caps letterspaced: an eyebrow dressed as a
        chip above every single H2 is section furniture, and it makes each section open
        exactly like the last. Use it sparingly, and let it read as a plain label. */}
    {eyebrow && <span className="mb-2 text-sm font-medium text-blue-300">{eyebrow}</span>}
    <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">{title}</h2>
    {subtitle && <p className="mt-4 max-w-2xl text-base text-gray-400 md:text-lg">{subtitle}</p>}
  </Reveal>
);

export default SectionHeading;
