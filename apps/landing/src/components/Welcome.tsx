import { useEffect, useRef } from 'react';
import { ArrowRightIcon, ArrowUpRightIcon, CompassIcon, FileTextIcon, ListIcon } from 'lucide-react';
import { mailto, site } from '../data/site';
import { dismissWelcome, markIntroSeen } from '../state/app';
import ContactLinks from './ContactLinks';
import RouteLink from './RouteLink';
import './welcome.css';

const { welcome } = site;
const resumeHost = site.profileUrl.replace(/^https?:\/\//, '');

/**
 * The first thing a new visitor sees: who this is, and how to look at the work.
 * Two equal doors show the same projects two ways (the Citadel map, the plain
 * list); the résumé sits beneath them as an extra. It lives on `/` as a layer
 * over the hub, is prerendered, and is hidden before first paint for anyone who
 * has already picked a door (see index.html). Without JavaScript it stays out
 * of the way and the page is the plain hub document.
 */
export default function Welcome() {
  const root = useRef<HTMLElement>(null);

  // Start at the top of the welcome for screen readers; Tab then reaches the first door.
  useEffect(() => root.current?.focus({ preventScroll: true }), []);

  return (
    <section ref={root} id="welcome" className="welcome" aria-labelledby="welcome-title" tabIndex={-1}>
      <div className="welcome-inner">
        <p className="availability welcome-availability">
          <span className="availability-dot" aria-hidden="true" />
          {site.availability}
          <a href={mailto} className="availability-link">
            Email me
          </a>
        </p>

        <h1 id="welcome-title" className="wordmark">
          <span className="w-bit">Bit</span>
          <span className="w-to">To</span>
          <span className="w-byte">Byte</span>
        </h1>
        <p className="intro-tagline">{site.tagline}</p>
        <p className="welcome-blurb">{site.blurb}</p>

        <p className="welcome-prompt" id="welcome-prompt">
          {welcome.prompt}
        </p>
        <ul className="welcome-doors" aria-labelledby="welcome-prompt">
          <li>
            <button type="button" className="door door-primary" onClick={dismissWelcome}>
              <span className="door-icon" aria-hidden="true">
                <CompassIcon className="h-5 w-5" />
              </span>
              <span className="door-title">
                {welcome.citadel.title}
                <ArrowRightIcon className="door-arrow h-4 w-4" aria-hidden="true" />
              </span>
              <span className="door-body">{welcome.citadel.body}</span>
              <span className="door-meta">{welcome.citadel.meta}</span>
            </button>
          </li>
          <li>
            <RouteLink
              to={{ place: 'nexus', project: null, view: 'list' }}
              className="door"
              onClick={markIntroSeen}
            >
              <span className="door-icon" aria-hidden="true">
                <ListIcon className="h-5 w-5" />
              </span>
              <span className="door-title">
                {welcome.list.title}
                <ArrowRightIcon className="door-arrow h-4 w-4" aria-hidden="true" />
              </span>
              <span className="door-body">{welcome.list.body}</span>
              <span className="door-meta">{welcome.list.meta}</span>
            </RouteLink>
          </li>
        </ul>

        <div className="welcome-extra">
          <p className="welcome-extra-lead">{welcome.resume.lead}</p>
          <a href={site.profileUrl} className="extra-link" onClick={markIntroSeen}>
            <FileTextIcon className="h-4 w-4 flex-none" aria-hidden="true" />
            <span className="extra-title">{welcome.resume.title}</span>
            <span className="extra-body">{welcome.resume.body}</span>
            <span className="extra-host">{resumeHost}</span>
            <ArrowUpRightIcon className="extra-arrow h-4 w-4 flex-none" aria-hidden="true" />
          </a>
          <ContactLinks className="welcome-contact" />
        </div>
      </div>
    </section>
  );
}
