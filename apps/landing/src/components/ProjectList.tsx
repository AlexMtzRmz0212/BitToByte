import { ArrowUpRightIcon, ExternalLinkIcon, MapPinIcon } from 'lucide-react';
import { GithubIcon } from '@alex_mtz/bittobyte-ui';
import { ARCHETYPES } from '../districts/archetypes';
import { KINDS, projectsByKind, type Project } from '../data/projects';
import type { WorldId } from '../data/worlds';
import RouteLink from './RouteLink';

// The project catalog as plain, crawlable HTML. Two densities:
//   index  the compact list under the Nexus hero (prerendered for crawlers)
//   full   the list view: everything the map's info card shows, without the map

interface Props {
  variant: 'index' | 'full';
  /** In a world's list view: enables "Show on the map" and the district line. */
  world?: WorldId | null;
  /** Whether that world has a map to show the project on. */
  mapAvailable?: boolean;
  /** Slug to highlight (from ?project=). */
  focus?: string | null;
  headingLevel?: 2 | 3;
}

export default function ProjectList({
  variant,
  world = null,
  mapAvailable = false,
  focus = null,
  headingLevel = 2,
}: Props) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const groups = KINDS.map((kind) => ({ kind, items: projectsByKind(kind.id) })).filter(
    (g) => g.items.length
  );

  return (
    <div
      className={
        variant === 'index'
          ? 'grid gap-x-12 gap-y-14 md:grid-cols-2'
          : 'flex flex-col gap-14'
      }
    >
      {groups.map(({ kind, items }) => (
        <section
          key={kind.id}
          aria-labelledby={`group-${kind.id}`}
          className={variant === 'index' && items.length > 2 ? 'md:col-span-2' : undefined}
        >
          <Heading id={`group-${kind.id}`} className="text-sm font-semibold text-muted">
            {kind.label}
          </Heading>
          <ul
            className={
              variant === 'index'
                ? `mt-5 grid gap-x-10 gap-y-9 ${items.length > 2 ? 'md:grid-cols-3' : ''}`
                : 'mt-5 grid gap-6 lg:grid-cols-2'
            }
          >
            {items.map((project) =>
              variant === 'index' ? (
                <IndexItem key={project.slug} project={project} headingLevel={headingLevel} />
              ) : (
                <FullItem
                  key={project.slug}
                  project={project}
                  world={world}
                  mapAvailable={mapAvailable}
                  highlighted={focus === project.slug}
                  headingLevel={headingLevel}
                />
              )
            )}
          </ul>
        </section>
      ))}
    </div>
  );
}

function ItemHeading({ level, children, id }: { level: 2 | 3; children: string; id?: string }) {
  const Tag = level === 2 ? 'h3' : 'h4';
  return (
    <Tag id={id} className="type-display text-xl leading-tight text-ink sm:text-2xl">
      {children}
    </Tag>
  );
}

function Stack({ items, limit }: { items: string[]; limit?: number }) {
  const shown = limit ? items.slice(0, limit) : items;
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
      {shown.map((tag) => (
        <li key={tag} className="tag">
          {tag}
        </li>
      ))}
    </ul>
  );
}

function IndexItem({ project, headingLevel }: { project: Project; headingLevel: 2 | 3 }) {
  return (
    <li className="flex flex-col gap-3">
      <ItemHeading level={headingLevel}>{project.name}</ItemHeading>
      <p className="max-w-[46ch] text-[0.975rem] leading-relaxed text-muted">{project.oneLiner}</p>
      <Stack items={project.stack} limit={4} />
      <div className="-ml-3 flex flex-wrap items-center">
        <a
          href={project.liveUrl}
          aria-label={`Launch ${project.name}`}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-control px-3 font-semibold text-accent-text hover:underline"
        >
          Launch
          <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
        </a>
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            rel="noopener"
            aria-label={`Code for ${project.name}`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-control px-3 text-muted hover:text-ink"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            Code
          </a>
        )}
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener"
          aria-label={`Open ${project.name} in a new tab`}
          title="Open in a new tab"
          className="inline-flex h-11 w-11 items-center justify-center rounded-control text-muted hover:text-ink"
        >
          <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </li>
  );
}

function FullItem({
  project,
  world,
  mapAvailable,
  highlighted,
  headingLevel,
}: {
  project: Project;
  world: WorldId | null;
  mapAvailable: boolean;
  highlighted: boolean;
  headingLevel: 2 | 3;
}) {
  const headingId = `project-${project.slug}`;
  return (
    <li
      id={project.slug}
      aria-labelledby={headingId}
      className={`flex flex-col overflow-hidden rounded-card border-[length:var(--w-bw)] bg-surface shadow-card ${
        highlighted ? 'border-accent-text' : 'border-line'
      }`}
    >
      {project.preview && (
        <img
          src={project.preview.src}
          alt={project.preview.alt}
          width={project.preview.width}
          height={project.preview.height}
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full border-b-[length:var(--w-bw)] border-line object-cover object-top"
        />
      )}
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <ItemHeading level={headingLevel} id={headingId}>
          {project.name}
        </ItemHeading>
        <p className="text-lg leading-snug text-ink">{project.oneLiner}</p>
        <p className="leading-relaxed text-muted">{project.summary}</p>
        <Stack items={project.stack} />
        {world && (
          <p className="flex items-center gap-1.5 text-sm text-muted">
            <MapPinIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            On the map: {ARCHETYPES[project.district].label.toLowerCase()}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <a
            href={project.liveUrl}
            className="btn btn-primary"
            aria-label={`Launch live project: ${project.name}`}
          >
            Launch live project
          </a>
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              rel="noopener"
              className="btn btn-ghost"
              aria-label={`Code for ${project.name}`}
            >
              <GithubIcon className="h-4 w-4" />
              Code
            </a>
          )}
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener"
            className="btn btn-ghost btn-icon"
            aria-label={`Open ${project.name} in a new tab`}
            title="Open in a new tab"
          >
            <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
          </a>
          {world && mapAvailable && (
            <RouteLink
              to={{ place: world, project: project.slug, view: 'map' }}
              className="btn btn-ghost"
              aria-label={`Show on the map: ${project.name}`}
            >
              <MapPinIcon className="h-4 w-4" aria-hidden="true" />
              Show on the map
            </RouteLink>
          )}
        </div>
      </div>
    </li>
  );
}
