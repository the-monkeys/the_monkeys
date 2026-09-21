import {
  DEFAULT_GROUP_COMMUNITY_TAB,
  groupCommunityHash,
  groupCommunityLocation,
  groupCommunityTabs,
  parseGroupCommunityTab,
} from '@/lib/groupCommunityTab';
import { describe, expect, it } from 'vitest';

describe('groupCommunityTab', () => {
  it('puts posts first and hides staff tabs for members', () => {
    expect(groupCommunityTabs(false)[0]).toBe('posts');
    expect(groupCommunityTabs(false)).toEqual([
      'posts',
      'events',
      'about',
      'members',
    ]);
    expect(groupCommunityTabs(true).slice(-2)).toEqual(['requests', 'invites']);
  });

  it('defaults empty hash to posts and aliases blogs', () => {
    expect(parseGroupCommunityTab('', false)).toBe(
      DEFAULT_GROUP_COMMUNITY_TAB
    );
    expect(parseGroupCommunityTab('#', false)).toBe('posts');
    expect(parseGroupCommunityTab('#blogs', false)).toBe('posts');
    expect(parseGroupCommunityTab('#events', false)).toBe('events');
    expect(parseGroupCommunityTab('#about', true)).toBe('about');
  });

  it('falls back when a staff tab is opened without staff access', () => {
    expect(parseGroupCommunityTab('#invites', false)).toBe('posts');
    expect(parseGroupCommunityTab('#requests', true)).toBe('requests');
    expect(parseGroupCommunityTab('#not-a-tab', true)).toBe('posts');
  });

  it('keeps the canonical group path hash-free on the default tab', () => {
    expect(groupCommunityHash('posts')).toBe('');
    expect(groupCommunityHash('events')).toBe('#events');
    expect(
      groupCommunityLocation('/groups/monkeys-admin-a8df79c4', '', 'posts')
    ).toBe('/groups/monkeys-admin-a8df79c4');
    expect(
      groupCommunityLocation('/groups/monkeys-admin-a8df79c4', '', 'members')
    ).toBe('/groups/monkeys-admin-a8df79c4#members');
  });
});
