import {
  activePublishGroups,
  blogApiError,
  effectiveBlogAudience,
  publicationScope,
} from '@/services/blog/blogPublication';
import { GroupItem } from '@/services/groups/groupsTypes';
import { describe, expect, it } from 'vitest';

const group = (overrides: Partial<GroupItem> = {}): GroupItem => ({
  id: 1,
  slug: 'writers',
  name: 'Writers',
  status: 'published',
  visibility: 'public',
  viewer_member_status: 'active',
  ...overrides,
});

describe('blog publication scope', () => {
  it('offers only active memberships regardless of group role', () => {
    expect(
      activePublishGroups([
        group({ slug: 'active' }),
        group({ slug: 'pending', viewer_member_status: 'pending' }),
        group({
          slug: 'organizer-without-active-membership',
          viewer_member_status: '',
          viewer_role: 'organizer',
        }),
      ]).map((item) => item.slug)
    ).toEqual(['active']);
  });

  it('keeps the requested audience for public groups', () => {
    expect(effectiveBlogAudience(group(), 'public')).toBe('public');
    expect(effectiveBlogAudience(group(), 'group_only')).toBe('group_only');
  });

  it.each(['private', 'unlisted'] as const)(
    'forces %s groups to members only',
    (visibility) => {
      expect(effectiveBlogAudience(group({ visibility }), 'public')).toBe(
        'group_only'
      );
    }
  );

  it('omits group fields when no group is selected', () => {
    expect(publicationScope(null, 'group_only')).toEqual({});
  });

  it('trims the selected group slug and returns the effective audience', () => {
    expect(
      publicationScope(group({ slug: '  tea-club  ' }), 'group_only')
    ).toEqual({ group_slug: 'tea-club', audience: 'group_only' });
  });

  it('reads both supported API error keys', () => {
    expect(
      blogApiError({
        isAxiosError: true,
        response: { data: { error: 'group not found' } },
      })
    ).toBe('group not found');
    expect(
      blogApiError({
        isAxiosError: true,
        response: { data: { message: 'the blog does not exist' } },
      })
    ).toBe('the blog does not exist');
  });

  it('falls back safely when an API response has no server message', () => {
    expect(blogApiError(new Error('network unavailable'))).toBe(
      'network unavailable'
    );
    expect(blogApiError(null)).toBe('Something went wrong');
  });
});
