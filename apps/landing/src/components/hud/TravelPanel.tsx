import { ArrowUpRightIcon, CheckIcon, ChevronUpIcon, PanelRightCloseIcon, PanelRightOpenIcon } from 'lucide-react';
import { useRef } from 'react';
import { projectsInWorld, type Project } from '../../data/projects';
import { WORLD_IDS, isWorldId, type PlaceId, type WorldId } from '../../data/worlds';
import { usePlaceResolver, useProgress, useTheme } from '../../state/app';
import PlaceGlyph from '../PlaceGlyph';
import RouteLink from '../RouteLink';
import { useFound } from './useFound';
import { useTravelMinimized } from './useTravelMinimized';

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
 *
 * On desktop it can shrink to a slim rail of world emblems, each ringed with its
 * progress. Pressing an emblem reopens the list at that world.
 */
export default function TravelPanel({ place, open, onToggle, onPick }: Props) {
  const { discovered } = useProgress();
  const { found, total } = useFound('nexus');
  const placeOf = usePlaceResolver();
  // Leonida, the state beyond Vice City, only exists in Vice City's theme.
  const leonidaOpen = useTheme('sunset') !== 'santos';
  const [minimized, setMinimized] = useTravelMinimized();
  const body = useRef<HTMLDivElement>(null);
  const minimizeButton = useRef<HTMLButtonElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  // Leonida belongs to Vice City's world: its projects are listed first there too.
  const home: PlaceId = place === 'leonida' ? 'sunset' : place;
  const order: WorldId[] = isWorldId(home) ? [home, ...WORLD_IDS.filter((w) => w !== home)] : [...WORLD_IDS];

  const minimize = () => {
    setMinimized(true);
    requestAnimationFrame(() => expandButton.current?.focus());
  };
  const expand = (world?: WorldId) => {
    setMinimized(false);
    requestAnimationFrame(() => {
      const group = world && document.getElementById(`travel-group-${world}`);
      if (group && body.current) {
        body.current.scrollTop = group.offsetTop - body.current.offsetTop;
        group.querySelector('a')?.focus({ preventScroll: true });
      } else {
        minimizeButton.current?.focus();
      }
    });
  };

  return (
    <aside id="travel" className="travel-panel chrome" data-open={open} data-minimized={minimized} aria-labelledby="travel-title" tabIndex={-1}>
      <div className="travel-full">
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
          <button
            ref={minimizeButton}
            type="button"
            className="travel-minimize"
            aria-label="Minimize the travel list"
            title="Minimize"
            onClick={minimize}
          >
            <PanelRightCloseIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div ref={body} id="travel-body" className="travel-body">
          {order.map((world) => {
            const list = projectsInWorld(world);
            const seen = discovered[world] ?? [];
            return (
              <section key={world} id={`travel-group-${world}`} aria-labelledby={`travel-${world}`} className="travel-group">
                <h3 id={`travel-${world}`} className="travel-group-title">
                  <PlaceGlyph id={world} className="h-4 w-4 shrink-0" />
                  <span>{world === home ? `Here in ${placeOf(world).name}` : placeOf(world).name}</span>
                  <span className="ml-auto tabular-nums" aria-label={`${seen.length} of ${list.length} found`}>
                    {seen.length}/{list.length}
                  </span>
                </h3>
                <ul>
                  {list.map((project) => (
                    <TravelItem key={project.slug} project={project} found={seen.includes(project.slug)} onPick={onPick} />
                  ))}
                  {world === 'sunset' && leonidaOpen && (
                    <li className="travel-item">
                      <RouteLink to={{ place: 'leonida', project: null, view: 'auto' }} className="travel-go" onClick={onPick}>
                        <span className="travel-name">
                          <span className="sr-only">Travel to </span>
                          <span>{placeOf('leonida').name}</span>
                          <span className="sr-only">: </span>
                        </span>
                        <span className="travel-line">The state beyond Vice City: swamps, keys and a long highway north.</span>
                      </RouteLink>
                    </li>
                  )}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

      <div className="travel-rail">
        <button
          ref={expandButton}
          type="button"
          className="travel-rail-button"
          aria-label="Expand the travel list"
          title="Expand"
          onClick={() => expand()}
        >
          <PanelRightOpenIcon className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="travel-rail-count" aria-label={`${found} of ${total} found`}>
          {found}/{total}
        </span>
        {order.map((world) => {
          const count = projectsInWorld(world).length;
          const seen = discovered[world]?.length ?? 0;
          const label = `${placeOf(world).name}, ${seen} of ${count} found`;
          return (
            <button
              key={world}
              type="button"
              className="travel-rail-button"
              data-here={world === home}
              aria-label={`${label}: open in the travel list`}
              title={label}
              onClick={() => expand(world)}
            >
              <svg className="travel-rail-ring" viewBox="0 0 40 40" aria-hidden="true">
                <circle cx="20" cy="20" r="18" pathLength={1} className="travel-rail-track" />
                <circle cx="20" cy="20" r="18" pathLength={1} className="travel-rail-progress" strokeDasharray={`${seen / count} 1`} />
              </svg>
              <PlaceGlyph id={world} className="h-4 w-4" />
            </button>
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
      {project.liveUrl ? (
        <a href={project.liveUrl} className="travel-launch" aria-label={`Launch ${project.name}`} title="Launch the live project">
          <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
        </a>
      ) : (
        project.repoUrl && (
          <a href={project.repoUrl} rel="noopener" className="travel-launch" aria-label={`Code for ${project.name}`} title="View the code">
            <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
          </a>
        )
      )}
    </li>
  );
}
