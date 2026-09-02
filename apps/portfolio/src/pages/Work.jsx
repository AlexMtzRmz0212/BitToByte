import { Reveal } from '@alex_mtz/bittobyte-ui';
import { ArchiveList, ProjectGrid } from '../components/ProjectSections';
import { groupedProjects } from '../lib/projectGroups';
import { coursework } from '../data/resume';
import { usePageMeta } from '../hooks/usePageMeta';

export default function Work() {
  usePageMeta(
    'Work · Alejandro Martínez',
    'Every project: live products, data experiments, and written case studies of hackathon and coursework builds.'
  );

  const { featured, more, archive } = groupedProjects();

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Work</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-gray-400">
          Everything in one place. The live products are running right now; the case studies are
          finished builds that were never meant to stay hosted, written up instead of redeployed.
        </p>
      </Reveal>

      <h2 className="mb-6 mt-14 text-sm font-semibold uppercase tracking-widest text-gray-200">
        Live products
      </h2>
      <ProjectGrid projects={featured} titleAs="h3" />

      <h2 className="mb-6 mt-16 text-sm font-semibold uppercase tracking-widest text-gray-200">
        Tools & experiments
      </h2>
      <ProjectGrid projects={more} titleAs="h3" />

      <h2 className="mb-3 mt-16 text-sm font-semibold uppercase tracking-widest text-gray-200">
        Case studies
      </h2>
      <p className="mb-6 max-w-2xl text-sm text-gray-400">
        Hackathon, capstone, and personal builds. Each one covers the problem, the approach, the
        stack, and what actually came out of it.
      </p>
      <ArchiveList projects={archive} titleAs="h3" />

      <h2 className="mb-3 mt-16 text-sm font-semibold uppercase tracking-widest text-gray-200">
        Academic projects
      </h2>
      <p className="mb-6 max-w-2xl text-sm text-gray-400">
        Coursework from the AI Software Development certificate and the mechatronics capstone.
        Listed rather than written up, because the code is not currently published.
      </p>
      <ul className="grid gap-4 md:grid-cols-2">
        {coursework.map((item, i) => (
          <Reveal
            as="li"
            key={item.title}
            delay={i * 50}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
          >
            <h3 className="font-semibold text-gray-100">{item.title}</h3>
            <p className="mt-1 text-xs text-gray-400">
              {item.org} · {item.dates}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">{item.summary}</p>
            <p className="mt-2 text-xs text-gray-400">{item.tags.join(', ')}</p>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
