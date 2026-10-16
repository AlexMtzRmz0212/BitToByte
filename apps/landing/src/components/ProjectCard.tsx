import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { ExternalLinkIcon, XIcon } from 'lucide-react';
import { GithubIcon } from '@alex_mtz/bittobyte-ui';
import { kindLabel, type Project } from '../data/projects';
import { WORLDS } from '../data/worlds';
import PlaceGlyph from './PlaceGlyph';

interface Props {
  project: Project;
  onClose: () => void;
  /** Runs the launch animation, then navigates. Return false to let the link work normally. */
  onLaunch?: (project: Project) => boolean;
  /** The arrival mini-scene, shown at the top of the card. */
  scene?: ReactNode;
}

/** What you see on arrival: what it is, what it's built with, and the way in. */
export default function ProjectCard({ project, onClose, onLaunch, scene }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);
  const card = useRef<HTMLElement>(null);

  // Arrival moves focus here, so keyboard and screen-reader users land on it too.
  // Closing hands focus back to whatever had it (the marker or list entry that
  // opened the card), or to the map, so nobody loses their place.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    heading.current?.focus({ preventScroll: true });
    const el = card.current;
    return () => {
      const lost = document.activeElement === document.body || el?.contains(document.activeElement);
      if (!lost) return;
      if (opener?.isConnected && !el?.contains(opener)) opener.focus({ preventScroll: true });
      // The opener may be gone or hidden (a folded sheet): fall back to the map.
      if (document.activeElement !== opener) document.getElementById('map-viewport')?.focus({ preventScroll: true });
    };
  }, [project.slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const launch = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (onLaunch?.(project)) event.preventDefault();
  };

  return (
    <section ref={card} className="project-card chrome" aria-labelledby="card-title" data-slug={project.slug}>
      <button type="button" className="card-close" onClick={onClose} aria-label="Close and keep exploring">
        <XIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      {scene && <div className="card-scene">{scene}</div>}
      <p className="card-kicker">
        <PlaceGlyph id={project.world} className="h-4 w-4" />
        {kindLabel(project.kind)} in {WORLDS[project.world].name}
      </p>
      <h2 id="card-title" ref={heading} tabIndex={-1} className="card-title type-display">
        {project.name}
      </h2>
      <p className="card-oneliner">{project.oneLiner}</p>
      <p className="card-summary">{project.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Built with">
        {project.stack.map((tag) => (
          <li key={tag} className="tag">
            {tag}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <a href={project.liveUrl} className="btn btn-primary" onClick={launch} aria-label={`Launch live project: ${project.name}`}>
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
          className="btn btn-ghost"
          aria-label={`Open ${project.name} in a new tab`}
        >
          <ExternalLinkIcon className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">New tab</span>
        </a>
      </div>
      {/* Below the actions, so Launch stays in view on short screens. */}
      {project.preview && (
        <img
          src={project.preview.src}
          alt={project.preview.alt}
          width={project.preview.width}
          height={project.preview.height}
          loading="lazy"
          decoding="async"
          className="card-preview"
        />
      )}
    </section>
  );
}
