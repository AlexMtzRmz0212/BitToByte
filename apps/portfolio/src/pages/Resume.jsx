import { Reveal } from '@alex_mtz/bittobyte-ui';
import { ChevronDown, GraduationCap, Languages, Wrench } from 'lucide-react';
import {
  additionalExperience,
  coursework,
  education,
  experience,
  languages,
  profile,
  skills,
} from '../data/resume';
import { usePageMeta } from '../hooks/usePageMeta';

const ACCENT = '#b5f53c';

const Section = ({ id, title, icon: Icon, children }) => (
  <section id={id} className="mt-16 first:mt-0">
    <h2 className="mb-8 flex items-center gap-2.5 text-2xl font-bold">
      {Icon && <Icon className="h-5 w-5" style={{ color: ACCENT }} aria-hidden="true" />}
      {title}
    </h2>
    {children}
  </section>
);

const Role = ({ role }) => (
  <article className="relative border-l border-white/10 pl-6">
    <span
      className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full"
      style={{ backgroundColor: role.current ? ACCENT : '#4b5563' }}
      aria-hidden="true"
    />

    <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h3 className="text-lg font-semibold text-gray-100">
        {role.role}
        {role.note && <span className="ml-2 text-sm font-normal text-gray-400">({role.note})</span>}
      </h3>
      <p className="font-mono text-xs text-gray-400">
        {role.start} – {role.end}
      </p>
    </header>
    <p className="mt-0.5 text-sm text-gray-400">
      {role.org} · {role.location}
    </p>

    <ul className="mt-4 space-y-2">
      {role.bullets.map((bullet) => (
        <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-gray-400">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-400" aria-hidden="true" />
          {bullet}
        </li>
      ))}
    </ul>

    {/* <details> rather than a state toggle: it opens without JS, is keyboard
        operable by default, and browser find-in-page can reach the closed text. */}
    {role.detail && (
      <details className="group mt-4 rounded-lg border border-white/10 bg-white/[0.02]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm text-gray-300 transition-colors hover:text-white">
          What the role actually involved
          <ChevronDown
            className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="space-y-4 border-t border-white/5 px-4 py-4">
          <p className="text-sm leading-relaxed text-gray-400">{role.detail.intro}</p>
          {role.detail.sections.map((part) => (
            <div key={part.title}>
              <h4 className="text-sm font-semibold text-gray-200">{part.title}</h4>
              <p className="mt-1 text-sm leading-relaxed text-gray-400">{part.body}</p>
            </div>
          ))}
        </div>
      </details>
    )}
  </article>
);

export default function Resume() {
  usePageMeta(
    `Resume · ${profile.name}`,
    `Curriculum vitae for ${profile.name}, ${profile.title}: experience, education, and skills.`
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Reveal>
        <header className="border-b border-white/10 pb-10">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{profile.name}</h1>
          <p className="mt-2 text-xl" style={{ color: ACCENT }}>
            {profile.title}
          </p>
          <p className="mt-1 text-sm text-gray-400">{profile.location}</p>

          <p className="mt-6 max-w-2xl leading-relaxed text-gray-400">{profile.summary}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {profile.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </header>
      </Reveal>

      <Section id="experience" title="Experience">
        <div className="space-y-10">
          {experience.map((role, i) => (
            <Reveal key={role.id} delay={i * 60}>
              <Role role={role} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="education" title="Education" icon={GraduationCap}>
        <ul className="space-y-6">
          {education.map((item, i) => (
            <Reveal as="li" key={item.credential} delay={i * 60}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold text-gray-100">{item.credential}</h3>
                <p className="font-mono text-xs text-gray-400">{item.years}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-400">
                {item.school} · {item.location}
              </p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section id="skills" title="Skills" icon={Wrench}>
        <dl className="grid gap-6 sm:grid-cols-2">
          {skills.map((block, i) => (
            <Reveal key={block.group} delay={i * 60}>
              <dt className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                {block.group}
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-gray-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Section>

      <Section id="languages" title="Languages" icon={Languages}>
        <ul className="flex flex-wrap gap-3">
          {languages.map((lang) => (
            <li
              key={lang.name}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300"
            >
              {lang.name}
              <span className="ml-2 text-xs text-gray-400">{lang.level}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="coursework" title="Academic projects">
        <p className="-mt-4 mb-8 max-w-2xl text-sm text-gray-400">
          Finished coursework from the AI Software Development certificate, plus the mechatronics
          capstone. These are listed rather than written up: the code is not currently published, so
          the record here stays to what it can support.
        </p>
        <ul className="space-y-6">
          {coursework.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 50}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold text-gray-100">{item.title}</h3>
                <p className="font-mono text-xs text-gray-400">{item.dates}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-400">{item.org}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.summary}</p>
              <p className="mt-2 text-xs text-gray-400">{item.tags.join(', ')}</p>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section id="additional" title="Additional experience">
        <p className="-mt-4 mb-8 max-w-2xl text-sm text-gray-400">
          Not engineering, and still on the CV: this is where the leadership, teaching, and
          operations experience came from.
        </p>
        <ul className="space-y-8">
          {additionalExperience.map((item, i) => (
            <Reveal as="li" key={item.role} delay={i * 60}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-semibold text-gray-100">{item.role}</h3>
                <p className="font-mono text-xs text-gray-400">{item.dates}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-400">
                {item.org} · {item.location}
              </p>
              {item.note && <p className="mt-0.5 text-xs text-gray-400">{item.note}</p>}
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.summary}</p>
            </Reveal>
          ))}
        </ul>
      </Section>
    </div>
  );
}
