import { ArrowUpRightIcon, CheckIcon, ChevronUpIcon } from 'lucide-react';
import { projectsInWorld, type Project } from '../../data/projects';
import { WORLDS, WORLD_IDS, isWorldId, type PlaceId, type WorldId } from '../../data/worlds';
import { useProgress } from '../../state/app';
import PlaceGlyph from '../PlaceGlyph';
import RouteLink from '../RouteLink';
import { useFound } from './useFound';

interface Props {
  place: PlaceId;
  open: boolean;
  onToggle: () => void;
  /** Called when a destination is picked (the mobile sheet folds away). */
  onPick: () => void;
}

/**
 * Every project, always one click away: the ones in this world first, then the
 * other worlds. Docked on desktop, a bottom sheet on phones. Picking one in
 * another world walks to the right portal and steps through.
 */
export default function TravelPanel({ place, open, onToggle, onPick }: Props) {
  const { discovered } = useProgress();
  const { found, total } = useFound('nexus');
  const order: WorldId[] = isWorldId(place) ? [place, ...WORLD_IDS.filter((w) => w !== place)] : [...WORLD_IDS];

  return (
    <aside id="travel" className="travel-panel chrome" data-open={open} aria-labelledby="travel-title" tabIndex={-1}>
      <div className="travel-head">
        <h2 id="travel-title" className="type-display text-lg leading-none">
          Travel
        </h2>
        <span className="text-sm text-muted tabular-nums">
          {found}/{total} found
        </span>
        <button
          type="button"
          className="travel-toggle"
          aria-expanded={open}
          aria-controls="travel-body"
          aria-label={open ? 'Fold the travel list' : 'Open the travel list'}
          onClick={onToggle}
        >
          <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div id="travel-body" className="travel-body">
        {order.map((world) => {
          const list = projectsInWorld(world);
          const seen = discovered[world] ?? [];
          return (
            <section key={world} aria-labelledby={`travel-${world}`} className="travel-group">
              <h3 id={`travel-${world}`} className="travel-group-title">
                <PlaceGlyph id={world} className="h-4 w-4 shrink-0" />
                <span>{world === place ? `Here in ${WORLDS[world].name}` : WORLDS[world].name}</span>
                <span className="ml-auto tabular-nums" aria-label={`${seen.length} of ${list.length} found`}>
                  {seen.length}/{list.length}
                </span>
              </h3>
              <ul>
                {list.map((project) => (
                  <TravelItem key={project.slug} project={project} found={seen.includes(project.slug)} onPick={onPick} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </aside>
  );
}

function TravelItem({ project, found, onPick }: { project: Project; found: boolean; onPick: () => void }) {
  return (
    <li className="travel-item" data-found={found}>
      {/* Named by its own text (WCAG 2.5.3): "Travel to Habits: Three years of…". */}
      <RouteLink to={{ place: project.world, project: project.slug, view: 'auto' }} className="travel-go" onClick={onPick}>
        <span className="travel-name">
          <span className="sr-only">Travel to </span>
          <span>{project.name}</span>
          <span className="sr-only">: </span>
          {found && <CheckIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
        </span>
        <span className="travel-line">
          {project.oneLiner}
          {found && <span className="sr-only"> (found)</span>}
        </span>
      </RouteLink>
      <a href={project.liveUrl} className="travel-launch" aria-label={`Launch ${project.name}`} title="Launch the live project">
        <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
      </a>
    </li>
  );
}
