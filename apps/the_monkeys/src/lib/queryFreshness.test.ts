import { homepageBlogQuery } from '@/services/blog/homepageApi';
import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import {
  LIVE_LIST_STALE_MS,
  invalidateAfterArticleWrite,
  invalidateAfterEventWrite,
  invalidateAfterGroupEventWrite,
  invalidateAfterGroupWrite,
} from './queryFreshness';
import { queryKeys } from './queryKeys';

function seedLists(qc: QueryClient) {
  qc.setQueryData(queryKeys.events.list({ limit: 12 }), { events: ['old'] });
  qc.setQueryData(queryKeys.groups.list({ limit: 8 }), { groups: ['old'] });
  qc.setQueryData(queryKeys.blog.all, { posts: ['keep'] });
}

describe('LIVE_LIST_STALE_MS', () => {
  it('treats discover lists as immediately stale', () => {
    expect(LIVE_LIST_STALE_MS).toBe(0);
  });
});

describe('invalidateAfterEventWrite', () => {
  it('invalidates event lists and leaves blogs and groups cached', async () => {
    const qc = new QueryClient();
    seedLists(qc);

    await invalidateAfterEventWrite(qc);

    expect(
      qc.getQueryState(queryKeys.events.list({ limit: 12 }))?.isInvalidated
    ).toBe(true);
    expect(
      qc.getQueryState(queryKeys.groups.list({ limit: 8 }))?.isInvalidated
    ).toBe(false);
    expect(qc.getQueryState(queryKeys.blog.all)?.isInvalidated).toBe(false);
  });

  it('also invalidates that event detail when a slug is given', async () => {
    const qc = new QueryClient();
    qc.setQueryData(queryKeys.events.detail('lab-writing'), { title: 'old' });

    await invalidateAfterEventWrite(qc, 'lab-writing');

    expect(
      qc.getQueryState(queryKeys.events.detail('lab-writing'))?.isInvalidated
    ).toBe(true);
  });
});

describe('invalidateAfterGroupWrite', () => {
  it('invalidates group lists without touching event lists', async () => {
    const qc = new QueryClient();
    seedLists(qc);

    await invalidateAfterGroupWrite(qc);

    expect(
      qc.getQueryState(queryKeys.groups.list({ limit: 8 }))?.isInvalidated
    ).toBe(true);
    expect(
      qc.getQueryState(queryKeys.events.list({ limit: 12 }))?.isInvalidated
    ).toBe(false);
  });

  it('invalidates the attached blog list when a group slug is given', async () => {
    const qc = new QueryClient();
    qc.setQueryData(queryKeys.groups.blogs('writers', { limit: 20 }), {
      blogs: ['old'],
    });

    await invalidateAfterGroupWrite(qc, 'writers');

    expect(
      qc.getQueryState(queryKeys.groups.blogs('writers', { limit: 20 }))
        ?.isInvalidated
    ).toBe(true);
  });
});

describe('invalidateAfterGroupEventWrite', () => {
  it('invalidates both event and group lists', async () => {
    const qc = new QueryClient();
    seedLists(qc);

    await invalidateAfterGroupEventWrite(qc);

    expect(
      qc.getQueryState(queryKeys.events.list({ limit: 12 }))?.isInvalidated
    ).toBe(true);
    expect(
      qc.getQueryState(queryKeys.groups.list({ limit: 8 }))?.isInvalidated
    ).toBe(true);
  });
});

it('article writes invalidate every homepage sort/page without invalidating ordinary feeds', async () => {
  const qc = new QueryClient();
  const home = [
    homepageBlogQuery(),
    homepageBlogQuery({ sort: 'trending' }),
    homepageBlogQuery({ offset: 12 }),
    homepageBlogQuery({ limit: 4 }),
  ];
  const unrelated = [
    ['meta-feed-blogs', 12],
    ['trending-blogs'],
    ['blog'],
    ['following-feed'],
    ['events'],
    ['groups'],
  ];
  for (const q of home) qc.setQueryData(q.queryKey, { blogs: [] });
  for (const key of unrelated) qc.setQueryData(key, { keep: true });
  await invalidateAfterArticleWrite(qc);
  for (const q of home)
    expect(qc.getQueryState(q.queryKey)?.isInvalidated).toBe(true);
  for (const key of unrelated)
    expect(qc.getQueryState(key)?.isInvalidated).toBe(false);
});

it('publishing refreshes cached author and library lists before their freshness window expires', async () => {
  const qc = new QueryClient();
  const author = queryKeys.blog.byUsername('writer', 10, 0);
  const drafts = queryKeys.blog.drafts.list('writer', 10, 0);
  const scheduled = queryKeys.blog.scheduled.list('writer', 10, 0);
  qc.setQueryData(author, { blogs: [] });
  qc.setQueryData(drafts, { blogs: ['published-post'] });
  qc.setQueryData(scheduled, { blogs: ['published-post'] });

  await invalidateAfterArticleWrite(qc);

  expect(
    await qc.fetchQuery({
      queryKey: author,
      staleTime: 60_000,
      queryFn: async () => ({ blogs: ['published-post'] }),
    })
  ).toEqual({ blogs: ['published-post'] });
  expect(
    await qc.fetchQuery({
      queryKey: drafts,
      staleTime: 60_000,
      queryFn: async () => ({ blogs: [] }),
    })
  ).toEqual({ blogs: [] });
  expect(
    await qc.fetchQuery({
      queryKey: scheduled,
      staleTime: 60_000,
      queryFn: async () => ({ blogs: [] }),
    })
  ).toEqual({ blogs: [] });
});
