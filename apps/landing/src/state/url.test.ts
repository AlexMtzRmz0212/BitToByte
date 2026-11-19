import { describe, expect, it } from 'vitest';
import { NEXUS_ROUTE, normalizeRoute, parseRoute, routeToSearch, wantsWelcome, type Route } from './url';

describe('routes and URLs', () => {
  it('defaults to the Nexus', () => {
    expect(parseRoute('')).toEqual(NEXUS_ROUTE);
    expect(routeToSearch(NEXUS_ROUTE)).toBe('/');
  });

  it('round-trips world, project and view', () => {
    const cases: Route[] = [
      { place: 'manuscript', project: null, view: 'auto' },
      { place: 'noir', project: 'cinetech', view: 'auto' },
      { place: 'pop', project: 'fedethics', view: 'list' },
      { place: 'voxel', project: null, view: 'map' },
      { place: 'nexus', project: 'habits', view: 'list' },
    ];
    for (const route of cases) {
      expect(parseRoute(routeToSearch(route).slice(1))).toEqual(route);
    }
  });

  it('writes world slugs and still reads the ids', () => {
    expect(routeToSearch({ place: 'noir', project: 'cinetech', view: 'auto' })).toBe('/?world=gotham&project=cinetech');
    expect(routeToSearch({ place: 'sunset', project: null, view: 'auto' })).toBe('/?world=los-santos');
    expect(parseRoute('?world=gotham').place).toBe('noir');
    expect(parseRoute('?world=noir').place).toBe('noir');
    expect(parseRoute('?world=blackwater').place).toBe('frontier');
    expect(parseRoute('?world=hogwarts&project=fedethics')).toEqual({ place: 'manuscript', project: 'fedethics', view: 'auto' });
  });

  it('still reads the slugs worlds had before they were renamed', () => {
    expect(parseRoute('?world=inkwell').place).toBe('manuscript');
    expect(parseRoute('?world=blockport').place).toBe('voxel');
    expect(parseRoute('?world=lamplight').place).toBe('noir');
    expect(parseRoute('?world=halftone').place).toBe('pop');
  });

  it('ignores unknown ids', () => {
    expect(parseRoute('?world=atlantis&project=nope')).toEqual(NEXUS_ROUTE);
    expect(parseRoute('?world=noir&project=nope')).toEqual({ place: 'noir', project: null, view: 'auto' });
  });

  it('treats /?welcome as a request for the welcome, not a route', () => {
    expect(wantsWelcome('?welcome')).toBe(true);
    expect(wantsWelcome('?welcome=1')).toBe(true);
    expect(wantsWelcome('')).toBe(false);
    expect(wantsWelcome('?world=gotham')).toBe(false);
    expect(parseRoute('?welcome')).toEqual(NEXUS_ROUTE);
  });

  it('reads and writes the theme of a themed world', () => {
    expect(routeToSearch({ place: 'sunset', project: null, view: 'auto', theme: 'santos' })).toBe(
      '/?world=los-santos&theme=santos'
    );
    expect(parseRoute('?world=los-santos&theme=santos')).toEqual({
      place: 'sunset',
      project: null,
      view: 'auto',
      theme: 'santos',
    });
    expect(parseRoute('?world=los-santos&theme=vice&view=map').theme).toBe('vice');
    // No theme in the URL means "the remembered or default one": the route says nothing.
    expect(parseRoute('?world=los-santos')).toEqual({ place: 'sunset', project: null, view: 'auto' });
    // Unknown themes, and themes on worlds that have none, are ignored.
    expect(parseRoute('?world=los-santos&theme=miami').theme).toBeUndefined();
    expect(parseRoute('?world=gotham&theme=santos')).toEqual({ place: 'noir', project: null, view: 'auto' });
    expect(routeToSearch({ place: 'noir', project: null, view: 'auto', theme: 'santos' })).toBe('/?world=gotham');
  });

  it('knows Leonida, which has no projects and no list of its own', () => {
    expect(parseRoute('?world=leonida')).toEqual({ place: 'leonida', project: null, view: 'auto' });
    expect(routeToSearch({ place: 'leonida', project: null, view: 'map' })).toBe('/?world=leonida&view=map');
    expect(parseRoute('?world=leonida&project=sports').project).toBeNull();
    // Its list view is Vice City's.
    expect(parseRoute('?world=leonida&view=list')).toEqual({
      place: 'sunset',
      project: null,
      view: 'list',
      theme: 'vice',
    });
  });

  it('drops a selection on the Nexus map', () => {
    expect(normalizeRoute({ place: 'nexus', project: 'cinetech', view: 'auto' })).toEqual(NEXUS_ROUTE);
    expect(normalizeRoute({ place: 'nexus', project: null, view: 'map' })).toEqual(NEXUS_ROUTE);
  });
});
