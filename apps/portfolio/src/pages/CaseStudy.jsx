import { Link, useParams } from 'react-router-dom';
import { Reveal } from '@alex_mtz/bittobyte-ui';
import { ArrowLeft, ExternalLink, Info } from 'lucide-react';
import { projectBySlug } from '@bittobyte/content';
import { caseStudies } from '../data/caseStudies';
import PipelineDiagram from '../components/PipelineDiagram';
import { usePageMeta } from '../hooks/usePageMeta';
import NotFound from './NotFound';

// Small-caps kicker, deliberately: this is the heading itself, not an eyebrow floating
// above a larger one, which is the shape that reads as generated. It is gray-200 rather
// than gray-400 so the heading is brighter than the body copy it introduces; at gray-400
// it was the same colour as its own paragraphs and a size smaller, which left the
// hierarchy inverted for sighted readers.
const Block = ({ title, children }) => (
  <section className="mt-14">
    <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-gray-200">{title}</h2>
    {children}
  </section>
);

export default function CaseStudy() {
  const { slug } = useParams();
  const project = projectBySlug(slug);
  const study = project ? caseStudies[project.id] : null;

  usePageMeta(study ? `${project.name} · Case study` : 'Not found', study?.headline ?? undefined);

  // An unknown or writeup-less slug is a dead link either way, so it gets the
  // same 404 rather than an empty shell that looks like a loading failure.
  if (!study) return <NotFound />;

  const accent = project.accent;

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link
        to="/work"
        className="group inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft
          className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        All work
      </Link>

      <Reveal>
        <header className="mt-6 border-b border-white/10 pb-10">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{project.name}</h1>
          <p className="mt-3 text-xl leading-snug" style={{ color: accent }}>
            {study.headline}
          </p>

          <dl className="mt-8 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
            {[
              ['Role', study.meta.role],
              ['Context', study.meta.team],
              ['Where', study.meta.org],
              ['When', study.meta.dates],
              ['Status', study.meta.status],
            ]
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label}>
                  <dt className="text-xs uppercase tracking-widest text-gray-400">{label}</dt>
                  <dd className="mt-1 text-gray-300">{value}</dd>
                </div>
              ))}
          </dl>

          {study.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {study.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-gray-300 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </header>
      </Reveal>

      <Block title="Context">
        <p className="leading-relaxed text-gray-400">{study.context}</p>
      </Block>

      <Block title="The problem">
        <p className="leading-relaxed text-gray-400">{study.problem}</p>
      </Block>

      <Block title="Approach">
        <ol className="space-y-8">
          {study.approach.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 50} className="flex gap-5">
              <span
                className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs"
                style={{ color: accent, borderColor: `${accent}55` }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-100">{step.title}</h3>
                <p className="mt-1.5 leading-relaxed text-gray-400">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Block>

      {study.diagram && (
        <Block title="How it fits together">
          {/* Wide diagrams scroll inside their own box rather than widening the page. */}
          <div className="overflow-x-auto">
            <PipelineDiagram name={study.diagram} accent={accent} />
          </div>
        </Block>
      )}

      <Block title="Tech stack">
        <dl className="grid gap-6 sm:grid-cols-2">
          {study.stack.map((block) => (
            <div key={block.group}>
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
            </div>
          ))}
        </dl>
      </Block>

      <Block title="Outcome">
        <ul className="space-y-3">
          {study.outcome.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed text-gray-400">
              <span
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: accent }}
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </Block>

      {study.note && (
        <p className="mt-12 flex gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-5 text-sm leading-relaxed text-gray-400">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
          {study.note}
        </p>
      )}

      <nav className="mt-16 border-t border-white/10 pt-8">
        <Link
          to="/work"
          className="group inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back to all work
        </Link>
      </nav>
    </article>
  );
}
