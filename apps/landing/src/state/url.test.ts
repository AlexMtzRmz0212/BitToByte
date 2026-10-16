import { describe, expect, it } from 'vitest';
import { NEXUS_ROUTE, normalizeRoute, parseRoute, routeToSearch, type Route } from './url';

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

  it('ignores unknown ids', () => {
    expect(parseRoute('?world=atlantis&project=nope')).toEqual(NEXUS_ROUTE);
    expect(parseRoute('?world=noir&project=nope')).toEqual({ place: 'noir', project: null, view: 'auto' });
  });

  it('drops a selection on the Nexus map', () => {
    expect(normalizeRoute({ place: 'nexus', project: 'cinetech', view: 'auto' })).toEqual(NEXUS_ROUTE);
    expect(normalizeRoute({ place: 'nexus', project: null, view: 'map' })).toEqual(NEXUS_ROUTE);
  });
});
