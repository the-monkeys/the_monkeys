import { describe, expect, it } from 'vitest';

import { normalizeRestrictedPostLocations } from './restrictedPostLocations';

const post = {
  blog_id: 'restricted',
  title: 'Sensitive content',
  is_nsfw: true,
  seo_indexable: true,
  audience: 'public',
  published_time: '2026-01-01T00:00:00Z',
  canonical_slug: 'existing-restricted',
  private_email: 'secret@example.test',
};
describe('sitemap-only restricted locations', () => {
  it('includes only the existing URL and modification date, never original content', () => {
    expect(normalizeRestrictedPostLocations({ blogs: [post] })).toEqual([
      {
        path: '/blog/existing-restricted',
        published_time: '2026-01-01T00:00:00Z',
      },
    ]);
    expect(
      JSON.stringify(normalizeRestrictedPostLocations({ blogs: [post] }))
    ).not.toContain('secret');
  });
  it.each([
    { ...post, seo_indexable: undefined },
    { ...post, is_nsfw: false },
    { ...post, audience: 'group_only' },
    { ...post, is_draft: true },
    { ...post, is_archived: true },
    { ...post, is_scheduled: true },
    { ...post, content_unavailable: true },
    { ...post, published_time: '2099-01-01T00:00:00Z' },
  ])('excludes private/draft/future/old-backend entries', (value) => {
    expect(normalizeRestrictedPostLocations({ blogs: [value] })).toEqual([]);
  });
  it('preserves the existing generic fallback when a publication slug is absent', () => {
    expect(
      normalizeRestrictedPostLocations({
        blogs: [{ ...post, canonical_slug: undefined }],
      })
    ).toEqual([
      { path: '/blog/post-restricted', published_time: post.published_time },
    ]);
  });
});
