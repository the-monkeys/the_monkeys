import { describe, expect, it } from 'vitest';

import { queryKeys } from './queryKeys';

describe('queryKeys', () => {
  it('isolates private query data by account', () => {
    const privateKeys = (accountId: string) => [
      queryKeys.blog.savedBlogs.forAccount(accountId),
      queryKeys.blog.drafts.forAccount(accountId),
      queryKeys.blog.scheduled.forAccount(accountId),
      queryKeys.blog.followingFeed(accountId, 20, 0),
      queryKeys.blog.followingAuthors(accountId),
      queryKeys.blog.likes.status('blog-1', accountId),
      queryKeys.blog.bookmarks.status('blog-1', accountId),
      queryKeys.user.followers(accountId),
      queryKeys.user.following(accountId),
      queryKeys.user.profileTopics(accountId),
      queryKeys.notifications.forAccount(accountId),
      queryKeys.verification.mine(accountId),
      queryKeys.cards.userAddresses(accountId),
    ];

    expect(privateKeys('account-1')).not.toEqual(privateKeys('account-2'));
  });

  it('keeps public data keys independent of the signed-in account', () => {
    expect(queryKeys.user.profileImage('monkey')).toEqual([
      'profile-image',
      'monkey',
    ]);
    expect(queryKeys.blog.likes.count('blog-1')).toEqual([
      'blog',
      'blog-1',
      'interaction',
      'likes-count',
    ]);
  });
});
