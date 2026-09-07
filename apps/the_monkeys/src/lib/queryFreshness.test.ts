import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it } from 'vitest';

import {
  LIVE_LIST_STALE_MS,
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
