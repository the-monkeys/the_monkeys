import React from 'react';

import { useLandingCommunity } from '@/hooks/landing/useLandingCommunity';
import { landingDiscussionQuery } from '@/services/landing/communityApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => ({ data: undefined as any }));
vi.mock('@/hooks/auth/useAuth', () => ({ default: () => auth }));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  auth.data = undefined;
});
it('keeps signed-in previews separate from public hydration and forwards cookies for remembered reveals', async () => {
  const fetch = vi.fn(async (_url, options) =>
    Response.json({
      discussions: [
        {
          public_id: 'post',
          status: 'visible',
          body: options.credentials === 'omit' ? '' : 'Authorised discussion',
        },
      ],
      groups: [],
    })
  );
  vi.stubGlobal('fetch', fetch);
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const publicData = [{ public_id: 'post', status: 'visible', body: '' }];
  client.setQueryData(landingDiscussionQuery.queryKey, publicData);
  auth.data = { account_id: 'adult' };
  const { result } = renderHook(() => useLandingCommunity(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
  await waitFor(() =>
    expect(result.current.discussions.data?.[0].body).toBe(
      'Authorised discussion'
    )
  );
  expect(
    fetch.mock.calls.some(
      ([, options]) => options.credentials === 'same-origin'
    )
  ).toBe(true);
  expect(client.getQueryData(landingDiscussionQuery.queryKey)).toEqual(
    publicData
  );
});
