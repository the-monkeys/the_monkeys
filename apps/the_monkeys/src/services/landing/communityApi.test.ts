import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  landingDiscussionQuery,
  landingGroupQuery,
  readLandingDiscussions,
  readLandingGroups,
} from './communityApi';

vi.mock('@/constants/api', () => ({ API_URL: 'http://127.0.0.1:8081/api/v1' }));
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('anonymous landing community reads', () => {
  it('forwards query cancellation and releases its own timeout', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url, options) =>
          new Promise((_resolve, reject) => {
            options.signal.addEventListener(
              'abort',
              () => reject(new Error('cancelled')),
              { once: true }
            );
          })
      )
    );
    const controller = new AbortController();
    const pending = expect(
      readLandingDiscussions(controller.signal)
    ).rejects.toThrow('cancelled');
    controller.abort();
    await pending;
    expect(vi.getTimerCount()).toBe(0);
  });
  it('requests only existing public lists with no cookies or cached responses', async () => {
    const fetch = vi.fn(
      async (_url: RequestInfo | URL, _options?: RequestInit) =>
        Response.json({ discussions: [], groups: [] })
    );
    vi.stubGlobal('fetch', fetch);
    await Promise.all([readLandingDiscussions(), readLandingGroups()]);
    expect(fetch.mock.calls.map((call) => String(call[0]))).toEqual([
      '/api/v1/discussions',
      '/api/v1/groups?limit=6&status=published&public_only=1',
    ]);
    for (const call of fetch.mock.calls)
      expect(call[1]).toMatchObject({ credentials: 'omit', cache: 'no-store' });
  });

  it('filters unsafe records before data reaches hydration or a shared query cache', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          discussions: [
            {
              public_id: 'secret',
              body: 'Members only',
              status: 'visible',
              audience: 'group_only',
            },
            { public_id: 'open', body: 'Public text', status: 'visible' },
          ],
        })
      )
    );
    expect((await readLandingDiscussions()).map((p) => p.public_id)).toEqual([
      'open',
    ]);
  });

  it('rejects bad envelopes and upstream errors instead of claiming a successful empty list', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 525 }))
      .mockResolvedValueOnce(Response.json({ error: 'unavailable' }))
      .mockResolvedValueOnce(Response.json({ groups: 'broken' }));
    vi.stubGlobal('fetch', fetch);
    await expect(readLandingDiscussions()).rejects.toThrow();
    await expect(readLandingDiscussions()).rejects.toThrow();
    await expect(readLandingGroups()).rejects.toThrow();
  });

  it('accepts null lists emitted by an empty protobuf response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ discussions: null, groups: null }))
    );
    expect(await readLandingDiscussions()).toEqual([]);
    expect(await readLandingGroups()).toEqual([]);
  });

  it('bounds slow API requests and clears the timeout after failure', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url, options) =>
          new Promise((_resolve, reject) => {
            options.signal.addEventListener(
              'abort',
              () => reject(new Error('aborted')),
              { once: true }
            );
          })
      )
    );
    const pending = expect(readLandingGroups()).rejects.toThrow('aborted');
    await vi.advanceTimersByTimeAsync(15000);
    await pending;
    expect(vi.getTimerCount()).toBe(0);
  });

  it('uses public-only keys isolated from membership and following feeds, with live refresh', () => {
    expect(landingDiscussionQuery.queryKey).toEqual([
      'discussions',
      'landing',
      'public',
    ]);
    expect(landingGroupQuery.queryKey).toEqual(['groups', 'landing', 'public']);
    expect(landingDiscussionQuery.staleTime).toBe(0);
    expect(landingGroupQuery.retry).toBe(false);
  });
});

it('allows browser reads to finish after a slow gateway check without an early cancellation', async () => {
  vi.useFakeTimers();
  vi.stubGlobal(
    'fetch',
    vi.fn(
      (_url, options) =>
        new Promise((resolve, reject) => {
          const completed = setTimeout(
            () => resolve(Response.json({ groups: [] })),
            6000
          );
          options.signal.addEventListener(
            'abort',
            () => {
              clearTimeout(completed);
              reject(new Error('premature cancellation'));
            },
            { once: true }
          );
        })
    )
  );
  const result = readLandingGroups().catch((error) => error);
  await vi.advanceTimersByTimeAsync(6000);
  expect(await result).toEqual([]);
  expect(vi.getTimerCount()).toBe(0);
});

it('keeps server prefetch bounded independently of the longer browser deadline', async () => {
  vi.useFakeTimers();
  vi.stubGlobal('window', undefined);
  vi.stubGlobal(
    'fetch',
    vi.fn(
      (_url, options) =>
        new Promise((_resolve, reject) => {
          options.signal.addEventListener(
            'abort',
            () => reject(new Error('server deadline')),
            { once: true }
          );
        })
    )
  );
  const result = expect(readLandingGroups()).rejects.toThrow('server deadline');
  await vi.advanceTimersByTimeAsync(5000);
  await result;
  expect(vi.getTimerCount()).toBe(0);
});
