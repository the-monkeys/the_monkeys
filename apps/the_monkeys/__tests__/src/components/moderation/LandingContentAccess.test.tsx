/* eslint-disable @next/next/no-img-element -- Verify protected children do not mount. */
import React from 'react';

import { ContentGate } from '@/components/moderation/ContentGate';
import {
  type LandingAccessSource,
  LandingContentAccess,
} from '@/components/moderation/LandingContentAccess';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  account: 'adult',
  get: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({
    data: mocks.account ? { account_id: mocks.account } : undefined,
    isPending: false,
    isLoading: false,
  }),
}));
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ refresh: mocks.refresh }),
}));
vi.mock('@/services/moderation/moderationApi', () => ({
  getContentAccess: mocks.get,
  revealContent: vi.fn(),
}));
const target = { kind: 'blog' as const, id: 'one' };
const permitted = {
  is_nsfw: true,
  content_rating: {
    target,
    is_nsfw: true,
    revision: 2,
    revealed: true,
    reason: 'revealed',
  },
};
function makeView(
  content = permitted,
  sources: LandingAccessSource[] = [
    { items: [content], viewer: 'adult', fresh: true, pending: false },
  ],
  viewer = 'adult'
) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const tree = (
    item: typeof permitted,
    input: LandingAccessSource[],
    account: string
  ) => (
    <QueryClientProvider client={client}>
      <LandingContentAccess viewer={account} sources={input}>
        <ContentGate content={item} target={target}>
          <img src='/private.png' alt='private image' />
          <p>private body</p>
        </ContentGate>
      </LandingContentAccess>
    </QueryClientProvider>
  );
  const view = render(tree(content, sources, viewer));
  return {
    ...view,
    update: (
      item: typeof permitted,
      input: LandingAccessSource[],
      account = 'adult'
    ) => view.rerender(tree(item, input, account)),
  };
}
beforeEach(() => {
  mocks.account = 'adult';
  vi.clearAllMocks();
  mocks.get.mockResolvedValue({
    target,
    is_nsfw: true,
    revision: 2,
    revealed: false,
    reason: 'underage',
  });
});
afterEach(cleanup);
it('uses the fresh exact viewer response without another per-card policy read or list refresh', async () => {
  makeView();
  await screen.findByText('private body');
  expect(screen.getByAltText('private image')).toBeTruthy();
  expect(mocks.get).not.toHaveBeenCalled();
  expect(mocks.refresh).not.toHaveBeenCalled();
});
it('waits for all initial sources without mounting private text or media, then reveals together', async () => {
  const one = {
    items: [permitted],
    viewer: 'adult',
    fresh: true,
    pending: false,
  };
  const view = makeView(permitted, [
    one,
    {
      items: [
        {
          ...permitted,
          content_rating: {
            ...permitted.content_rating,
            target: { kind: 'event', id: 'two' },
          },
        },
      ],
      viewer: 'adult',
      fresh: false,
      pending: true,
    },
  ]);
  expect(screen.queryByText('private body')).toBeNull();
  expect(screen.queryByAltText('private image')).toBeNull();
  expect(mocks.get).not.toHaveBeenCalled();
  view.update(permitted, [
    one,
    { viewer: 'adult', fresh: true, pending: false },
  ]);
  await screen.findByText('private body');
});
it.each([
  'public-seed',
  'other-viewer',
  'different-object',
  'different-target',
  'failed-source',
] as const)('does not trust %s as fresh permission', async (mode) => {
  const content =
    mode === 'different-target'
      ? {
          ...permitted,
          content_rating: {
            ...permitted.content_rating,
            target: { kind: 'blog' as const, id: 'elsewhere' },
          },
        }
      : permitted;
  const source = {
    items: [mode === 'different-object' ? { ...content } : content],
    viewer: mode === 'other-viewer' ? 'other' : 'adult',
    fresh: !['public-seed', 'failed-source'].includes(mode),
    pending: false,
  };
  makeView(content, [source]);
  await waitFor(() => expect(mocks.get).toHaveBeenCalled());
  expect(screen.queryByText('private body')).toBeNull();
  expect(screen.queryByAltText('private image')).toBeNull();
});
it('uses a fresh denial without another request and conceals a previously revealed card immediately', async () => {
  const view = makeView();
  await screen.findByText('private body');
  const denied = {
    ...permitted,
    content_rating: {
      ...permitted.content_rating,
      revision: 3,
      revealed: false,
      reason: 'underage',
    },
  };
  view.update(denied, [
    { items: [denied], viewer: 'adult', fresh: true, pending: false },
  ]);
  expect(screen.queryByText('private body')).toBeNull();
  await screen.findByText(/available only to people aged 18/i);
  expect(mocks.get).not.toHaveBeenCalled();
});
it('never carries an adult response across account switching or logout', async () => {
  const source = {
    items: [permitted],
    viewer: 'adult',
    fresh: true,
    pending: false,
  };
  const view = makeView(permitted, [source]);
  await screen.findByText('private body');
  mocks.account = 'child';
  view.update(permitted, [source], 'child');
  expect(screen.queryByText('private body')).toBeNull();
  await waitFor(() => expect(mocks.get).toHaveBeenCalled());
  mocks.account = '';
  view.update(permitted, [source], '');
  expect(screen.queryByAltText('private image')).toBeNull();
  await screen.findByRole('link', { name: /log in/i });
});

it('fails closed on a failed managed refresh and retries its list source', async () => {
  const retry = vi.fn();
  const view = makeView();
  await screen.findByText('private body');
  view.update(permitted, [
    {
      items: [permitted],
      viewer: 'adult',
      fresh: false,
      pending: false,
      failed: true,
      retry,
    },
  ]);
  expect(screen.queryByAltText('private image')).toBeNull();
  const button = await screen.findByRole('button', { name: 'Try again' });
  button.click();
  expect(retry).toHaveBeenCalledTimes(1);
  expect(mocks.get).not.toHaveBeenCalled();
});

it('does not delay checked protected cards for an unrelated ordinary source', async () => {
  makeView(permitted, [
    { items: [permitted], viewer: 'adult', fresh: true, pending: false },
    { items: [{}], viewer: 'adult', fresh: false, pending: true },
  ]);
  await screen.findByText('private body');
  expect(mocks.get).not.toHaveBeenCalled();
});
