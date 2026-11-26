import { describe, expect, it } from 'vitest';

import { queryKeys } from './queryKeys';

describe('compatible and account scoped query keys', () => {
  it('preserves public SSR and legacy interaction shapes', () => {
    expect(queryKeys.auth.session()).toEqual(['auth']);
    expect(queryKeys.blog.homepageRoot()).toEqual([
      'meta-feed-blogs',
      'homepage',
    ]);
    expect(queryKeys.blog.homepage('latest', 12, 0, 'v1')).toEqual([
      'meta-feed-blogs',
      'homepage',
      'public',
      'v1',
      'latest',
      12,
      0,
    ]);
    expect(queryKeys.profile.activeUsers('24h')).toEqual([
      'active-users',
      '24h',
    ]);
    expect(queryKeys.profile.image('writer')).toEqual([
      'profile-image',
      'writer',
    ]);
    expect(queryKeys.profile.byUsername('writer')).toEqual([
      'current-user',
      'writer',
    ]);
    expect(queryKeys.profile.byAccount('a')).toEqual([
      'user-profile-info',
      'a',
    ]);
    expect(queryKeys.blog.likes.status('post')).toEqual([
      'blog',
      'post',
      'interaction',
      'like-status',
    ]);
    expect(queryKeys.blog.likes.status('post', null)).not.toEqual(
      queryKeys.blog.likes.status('post')
    );
    expect(queryKeys.blog.bookmarks.status('post', null)).not.toEqual(
      queryKeys.blog.bookmarks.status('post')
    );
    expect(queryKeys.blog.bookmarks.list('a', 10, 0)).toEqual([
      'bookmarked-blogs',
      'a',
      10,
      0,
    ]);
  });
  it('separates every personalized resource across A, anonymous and B', () => {
    for (const key of [
      (viewer: string | null) => queryKeys.blog.likes.status('post', viewer),
      (viewer: string | null) =>
        queryKeys.blog.bookmarks.status('post', viewer),
      (viewer: string | null) => queryKeys.profile.followers(viewer),
      (viewer: string | null) => queryKeys.profile.following(viewer),
      (viewer: string | null) => queryKeys.profile.topics(viewer),
      (viewer: string | null) => queryKeys.blog.drafts.list(viewer, 10, 0),
      (viewer: string | null) => queryKeys.blog.drafts.detail('post', viewer),
      (viewer: string | null) => queryKeys.blog.scheduled.list(viewer, 10, 0),
      (viewer: string | null) => queryKeys.notifications.list(viewer),
      (viewer: string | null) =>
        queryKeys.events.attendingList(viewer, { limit: 10 }),
      (viewer: string | null) => queryKeys.events.detail('event', viewer),
      (viewer: string | null) => queryKeys.groups.detail('group', viewer),
    ]) {
      expect(key('a')).not.toEqual(key(null));
      expect(key('a')).not.toEqual(key('b'));
    }
    expect(queryKeys.events.attendingList('a', { limit: 10 })).not.toEqual(
      queryKeys.events.attendingList('a', { limit: 20 })
    );
  });
});
