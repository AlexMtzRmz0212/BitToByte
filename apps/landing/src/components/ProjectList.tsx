import { ExternalLinkIcon, MapPinIcon } from 'lucide-react';
import { GithubIcon } from '@alex_mtz/bittobyte-ui';
import { ARCHETYPES } from '../districts/archetypes';
import { kindLabel, projectsInWorld, type Project } from '../data/projects';
import { WORLDS, WORLD_IDS, isWorldId, type PlaceId, type WorldId } from '../data/worlds';
import { hasMap } from '../worlds/registry';
import PlaceGlyph from './PlaceGlyph';
import RouteLink from './RouteLink';

// The whole catalog as plain, crawlable HTML, grouped by world: the "Skip the
// map" view, the reduced-motion default and the fallback if a map fails.

interface Props {
  /** The place the list is shown in: its own world comes first. */
  place: PlaceId;
  /** Slug to highlight (from ?project=). */
  focus?: string | null;
}

export default function ProjectList({ place, focus = null }: Props) {
  const order: WorldId[] = isWorldId(place) ? [place, ...WORLD_IDS.filter((w) => w !== place)] : [...WORLD_IDS];
  return (
    <div className="flex flex-col gap-16">
      {order.map((world) => (
        <section key={world} aria-labelledby={`world-${world}`}>
          <h2 id={`world-${world}`} className="flex items-center gap-2.5 type-display text-2xl text-ink sm:text-3xl">
            <PlaceGlyph id={world} className="h-6 w-6 shrink-0 text-accent-text" />
            {world === place ? `Here in ${WORLDS[world].name}` : WORLDS[world].name}
          </h2>
          <p className="mt-1.5 text-muted">{WORLDS[world].tagline}</p>
          <ul className="mt-6 grid gap-6 lg:grid-cols-2">
            {projectsInWorld(world).map((project) => (
              <Item key={project.slug} project={project} highlighted={focus === project.slug} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Item({ project, highlighted }: { project: Project; highlighted: boolean }) {
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
      <div className="flex flex-1 flex-col gap-3.5 p-5 sm:p-6">
        <p className="text-sm text-muted">{kindLabel(project.kind)}</p>
        <h3 id={headingId} className="type-display -mt-2 text-2xl leading-tight text-ink">
          {project.name}
        </h3>
        <p className="text-lg leading-snug text-ink">{project.oneLiner}</p>
        <p className="leading-relaxed text-muted">{project.summary}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label="Built with">
          {project.stack.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
        <p className="flex items-center gap-1.5 text-sm text-muted">
          <MapPinIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
          On the map: {ARCHETYPES[project.district].label.toLowerCase()}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <a href={project.liveUrl} className="btn btn-primary" aria-label={`Launch live project: ${project.name}`}>
            Launch live project
          </a>
          {project.repoUrl && (
            <a href={project.repoUrl} rel="noopener" className="btn btn-ghost" aria-label={`Code for ${project.name}`}>
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
          {hasMap(project.world) && (
            <RouteLink
              to={{ place: project.world, project: project.slug, view: 'map' }}
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
