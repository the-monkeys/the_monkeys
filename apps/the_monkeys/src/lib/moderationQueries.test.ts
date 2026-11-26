import { QueryClient, QueryObserver } from '@tanstack/react-query';
import { expect, it, vi } from 'vitest';

import { refreshContentQueries } from './moderationQueries';

it('refreshes group blog pages but leaves identity queries untouched', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const blog = vi.fn(async () => ['revealed']);
  const identity = vi.fn(async () => ({ username: 'reader' }));
  const key = ['groups', 'blogs', 'local-group'];
  client.setQueryData(key, ['redacted']);
  client.setQueryData(['user', 'reader'], {});
  const blogObserver = new QueryObserver(client, {
    queryKey: key,
    queryFn: blog,
    staleTime: Infinity,
  });
  const userObserver = new QueryObserver(client, {
    queryKey: ['user', 'reader'],
    queryFn: identity,
    staleTime: Infinity,
  });
  const a = blogObserver.subscribe(() => {}),
    b = userObserver.subscribe(() => {});
  try {
    await refreshContentQueries(client, { kind: 'blog', id: 'post' });
    expect(blog).toHaveBeenCalledTimes(1);
    expect(identity).not.toHaveBeenCalled();
  } finally {
    a();
    b();
    client.clear();
  }
});
it('propagates source failure to the gate so it can offer recovery', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const key = ['discussions', 'site'];
  client.setQueryData(key, ['redacted']);
  const observer = new QueryObserver(client, {
    queryKey: key,
    queryFn: async () => {
      throw new Error('source unavailable');
    },
    staleTime: Infinity,
  });
  const off = observer.subscribe(() => {});
  try {
    await expect(
      refreshContentQueries(client, { kind: 'discussion', id: 'post' })
    ).rejects.toThrow('source unavailable');
  } finally {
    off();
    client.clear();
  }
});

it('keeps validated feed data steady while an authorised replacement is loading', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const key = ['meta-feed-blogs', 'homepage'];
  client.setQueryData(key, ['existing card']);
  let complete!: (value: string[]) => void;
  const observer = new QueryObserver(client, {
    queryKey: key,
    queryFn: () =>
      new Promise<string[]>((resolve) => {
        complete = resolve;
      }),
    staleTime: Infinity,
  });
  let markedAsWithdrawn = false;
  const off = observer.subscribe(() => {
    markedAsWithdrawn ||= client.getQueryState(key)?.isInvalidated === true;
  });
  const refresh = refreshContentQueries(client, { kind: 'blog', id: 'post' });
  try {
    expect(markedAsWithdrawn).toBe(false);
    expect(client.getQueryData(key)).toEqual(['existing card']);
  } finally {
    complete(['revealed card']);
    await refresh;
    off();
    client.clear();
  }
});
