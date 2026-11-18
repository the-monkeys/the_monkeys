import { PropsWithChildren } from 'react';

import {
  MY_VERIFICATION_KEY,
  useMyVerification,
} from '@/features/verification/hooks/useMyVerification';
import {
  useCreateGroup,
  useCreateGroupEvent,
} from '@/hooks/groups/useGroupQueries';
import axiosInstance from '@/services/api/axiosInstance';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it } from 'vitest';

const adapter = axiosInstance.defaults.adapter;
let client: QueryClient;
let posts: { key: unknown; path: string | undefined }[];
let fail = false;
let finish: (() => void) | undefined;
let delay = false;

beforeEach(() => {
  posts = [];
  fail = false;
  delay = false;
  finish = undefined;
  client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  });
  client.setQueryData(['auth'], { account_id: 'account-a', username: 'alice' });
  client.setQueryData(MY_VERIFICATION_KEY, { status: 'none' });
  client.setQueryData([...MY_VERIFICATION_KEY, 'account-a'], {
    status: 'none',
  });
  axiosInstance.defaults.adapter = async (config) => {
    if (config.method === 'get') {
      return {
        config,
        data: { status: 'none' },
        headers: {},
        status: 200,
        statusText: 'OK',
      };
    }
    posts.push({
      path: config.url,
      key: config.headers.get('Idempotency-Key'),
    });
    if (delay)
      await new Promise<void>((resolve) => {
        finish = resolve;
      });
    if (fail) throw new Error('Response lost');
    return {
      config,
      data: {
        id: 'request-1',
        status: 'pending',
        group: { slug: 'new-group' },
        event: { slug: 'new-event' },
      },
      headers: {},
      status: 200,
      statusText: 'OK',
    };
  };
});
afterEach(() => {
  cleanup();
  client.clear();
  axiosInstance.defaults.adapter = adapter;
});

function wrapper({ children }: PropsWithChildren) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

it('does not display the previous account private verification request after switching accounts', async () => {
  const privateRequest = {
    id: 'private-alice-request',
    username: 'alice',
    status: 'pending',
    verification_type: 'id_document',
    selfie_checksum: 'private-checksum',
  };
  // Keep a legacy prefix entry too: the scoped query must never consume it.
  client.setQueryData(MY_VERIFICATION_KEY, privateRequest);
  client.setQueryData([...MY_VERIFICATION_KEY, 'account-a'], privateRequest);
  const { result, rerender } = renderHook(() => useMyVerification(), {
    wrapper,
  });
  expect(result.current.request?.id).toBe('private-alice-request');
  act(() => {
    client.setQueryData(['auth'], { account_id: 'account-b', username: 'bob' });
  });
  rerender();
  expect(result.current.request).toBeUndefined();
  await waitFor(() => expect(result.current.none).toBe(true));
});

it('does not request private verification status without an authenticated identity', async () => {
  client.setQueryData(['auth'], null);
  client.removeQueries({ queryKey: MY_VERIFICATION_KEY });
  let reads = 0;
  const normalAdapter = axiosInstance.defaults
    .adapter as import('axios').AxiosAdapter;
  axiosInstance.defaults.adapter = async (config) => {
    if (config.url === '/user/verification/me') reads++;
    return normalAdapter(config);
  };
  const { result } = renderHook(() => useMyVerification(), { wrapper });
  await act(async () => {
    await Promise.resolve();
  });
  expect(result.current.isLoading).toBe(false);
  expect(result.current.request).toBeUndefined();
  expect(reads).toBe(0);
});

it('exposes a status-read error and lets the UI retry the scoped query', async () => {
  client.removeQueries({ queryKey: MY_VERIFICATION_KEY });
  const normalAdapter = axiosInstance.defaults
    .adapter as import('axios').AxiosAdapter;
  let readFails = true;
  axiosInstance.defaults.adapter = async (config) => {
    if (readFails && config.url === '/user/verification/me')
      throw new Error('Status unavailable');
    return normalAdapter(config);
  };
  const { result } = renderHook(() => useMyVerification(), { wrapper });
  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(result.current.error?.message).toBe('Status unavailable');
  readFails = false;
  await act(async () => {
    await result.current.refetch();
  });
  await waitFor(() => {
    expect(result.current.isError).toBe(false);
    expect(result.current.none).toBe(true);
  });
});

it.each([
  [
    'verification',
    () => useMyVerification().submit,
    { verification_type: 'social_proof' },
    '/user/verification',
  ],
  ['group', () => useCreateGroup(), { name: 'Club' }, '/groups'],
  [
    'group event',
    () => useCreateGroupEvent('club'),
    {
      title: 'Meetup',
      start_time: '2099-01-01',
      end_time: '2099-01-02',
      event_type: 'virtual',
    },
    '/groups/club/events',
  ],
] as const)(
  '%s guards public mutate/mutateAsync before rendering and retains its retry key',
  async (_name, useCreate, input, path) => {
    // The table inputs deliberately exercise the existing public mutation API.
    const { result } = renderHook(() => useCreate(), { wrapper });
    delay = true;
    let first!: Promise<unknown>;
    let duplicate!: Promise<unknown>;
    act(() => {
      first = result.current.mutateAsync(input as never);
      duplicate = result.current.mutateAsync(input as never);
      result.current.mutate(input as never);
    });
    expect(duplicate).toBe(first);
    await waitFor(() => expect(posts).toHaveLength(1));
    expect(posts[0].path).toBe(path);
    expect(posts[0].key).toEqual(expect.any(String));
    fail = true;
    await act(async () => {
      finish!();
      await expect(first).rejects.toThrow('Response lost');
    });
    delay = false;
    fail = false;
    await act(async () => {
      await result.current.mutateAsync(input as never);
    });
    expect(posts).toHaveLength(2);
    expect(posts[1].key).toBe(posts[0].key);
    await act(async () => {
      await result.current.mutateAsync(input as never);
    });
    expect(posts[2].key).not.toBe(posts[1].key);
  }
);

it.each([
  [
    'verification',
    () => useMyVerification().submit,
    { verification_type: 'social_proof' },
  ],
  ['group', () => useCreateGroup(), { name: 'Club' }],
  [
    'group event',
    () => useCreateGroupEvent('club'),
    {
      title: 'Meetup',
      start_time: '2099-01-01',
      end_time: '2099-01-02',
      event_type: 'virtual',
    },
  ],
] as const)(
  'does not reuse a failed %s key after the signed-in account changes',
  async (_name, useCreate, body) => {
    const { result, rerender } = renderHook(() => useCreate(), { wrapper });
    fail = true;
    await act(async () => {
      await result.current.mutateAsync(body as never).catch(() => {});
    });
    await act(async () => {
      client.setQueryData(['auth'], {
        account_id: 'account-b',
        username: 'bob',
      });
    });
    rerender();
    await act(async () => {
      await result.current.mutateAsync(body as never).catch(() => {});
    });
    expect(posts).toHaveLength(2);
    expect(posts[1].key).not.toBe(posts[0].key);
  }
);

it('keeps failed group-event attempts separate when the target group changes', async () => {
  const { result, rerender } = renderHook(
    ({ slug }) => useCreateGroupEvent(slug),
    { wrapper, initialProps: { slug: 'first' } }
  );
  const body = {
    title: 'Meetup',
    start_time: '2099-01-01',
    end_time: '2099-01-02',
    event_type: 'virtual' as const,
  };
  fail = true;
  await act(async () => {
    await result.current.mutateAsync(body).catch(() => {});
  });
  rerender({ slug: 'second' });
  await act(async () => {
    await result.current.mutateAsync(body).catch(() => {});
  });
  expect(posts.map(({ path }) => path)).toEqual([
    '/groups/first/events',
    '/groups/second/events',
  ]);
  expect(posts[1].key).not.toBe(posts[0].key);
});

it('keeps verification callbacks and reset compatible with the existing panel', async () => {
  const { result } = renderHook(() => useMyVerification(), { wrapper });
  let successes = 0;
  act(() => {
    result.current.submit.mutate(
      { verification_type: 'social_proof' },
      {
        onSuccess: () => {
          successes++;
        },
      }
    );
    result.current.submit.mutate(
      { verification_type: 'social_proof' },
      {
        onSuccess: () => {
          successes++;
        },
      }
    );
  });
  await waitFor(() => expect(successes).toBe(1));
  act(() => {
    result.current.submit.reset();
  });
  await act(async () => {
    await result.current.submit.mutateAsync({
      verification_type: 'social_proof',
    });
  });
  expect(posts).toHaveLength(2);
  expect(posts[1].key).not.toBe(posts[0].key);
});
