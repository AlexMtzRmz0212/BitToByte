import { describe, expect, it } from 'vitest';
import { isArchetypeId, isSceneId } from '../districts/archetypes';
import { KINDS, projects } from './projects';

// Guards the promise that adding a project is a data-only change: anything a
// component relies on is checked here instead.
describe('projects data', () => {
  it('has unique, URL-safe slugs', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it.each(projects.map((p) => [p.slug, p] as const))('%s is complete', (_, p) => {
    expect(p.name.trim()).not.toBe('');
    expect(p.oneLiner.length).toBeGreaterThan(20);
    expect(p.oneLiner.length).toBeLessThanOrEqual(90);
    expect(p.summary.length).toBeGreaterThan(40);
    expect(p.stack.length).toBeGreaterThan(0);
    expect(p.liveUrl).toMatch(/^https:\/\//);
    if (p.repoUrl) expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//);
    expect(isArchetypeId(p.district)).toBe(true);
    expect(isSceneId(p.scene)).toBe(true);
    expect(KINDS.map((k) => k.id)).toContain(p.kind);
    if (p.preview) expect(p.preview.src).toMatch(/^\/previews\/.+\.webp$/);
  });

  it('uses no em or en dashes in visible copy', () => {
    for (const p of projects) {
      for (const text of [p.name, p.oneLiner, p.summary]) expect(text).not.toMatch(/[–—]/);
    }
  });
});
