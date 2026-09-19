import { metadata as groupMembersMetadata } from '@/app/groups/[slug]/members/layout';
import { describe, expect, it } from 'vitest';

import { robotsForPath } from './seo';

describe('SEO route policy', () => {
  it.each([
    ['/search', false, true],
    ['/search?query=ai', false, true],
    ['/auth/login', false, false],
    ['/notifications', false, false],
    ['/settings', false, false],
    ['/library', false, false],
    ['/activity', false, false],
    ['/create', false, false],
    ['/edit/post-id', false, false],
    ['/groups/example/members', false, false],
    ['/groups/example/requests', false, false],
    ['/groups/example/manage', false, false],
    ['/events', true, true],
    ['/groups', true, true],
    ['/topics/business', true, true],
  ] as const)('sets an intentional policy for %s', (path, index, follow) => {
    expect(robotsForPath(path)).toMatchObject({ index, follow });
  });

  it('protects the actual group members route from indexing', () => {
    expect(groupMembersMetadata.robots).toMatchObject({
      index: false,
      follow: false,
    });
  });
});
