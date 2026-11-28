import React, { useState } from 'react';

import { DiscussionCard } from '@/components/discussions/DiscussionCard';
import type { Discussion } from '@/services/discussions/discussionsTypes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

const mock = vi.hoisted(() => ({
  consent: false,
  push: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: { account_id: 'adult' } }),
}));
vi.mock('next/navigation', () => ({
  usePathname: () => '/discussions',
  useRouter: () => ({ push: mock.push, refresh: mock.refresh }),
}));
vi.mock('@/components/discussions/DiscussionAvatar', () => ({
  DiscussionAvatar: () => null,
}));
vi.mock('@/components/discussions/DiscussionGroupLine', () => ({
  DiscussionGroupLine: () => null,
}));
vi.mock('@/components/discussions/DiscussionLinkPreview', () => ({
  DiscussionLinkPreview: () => null,
}));
const post = {
  public_id: 'held',
  status: 'visible',
  body: 'Sensitive content',
  author_gone: true,
  is_nsfw: true,
  content_rating: { is_nsfw: true, revision: 1, revealed: false },
} as Discussion;
vi.mock('@/services/discussions/discussionsApi', () => ({
  getDiscussion: vi.fn(async () => ({
    ...post,
    body: mock.consent
      ? 'Revealed in the original feed slot'
      : 'Sensitive content',
    content_rating: { is_nsfw: true, revision: 1, revealed: mock.consent },
  })),
}));
vi.mock('@/services/moderation/moderationApi', () => ({
  getContentAccess: vi.fn(async () => ({
    is_nsfw: true,
    can_reveal: true,
    revision: 1,
    revealed: mock.consent,
  })),
  revealContent: vi.fn(async () => {
    mock.consent = true;
    return {
      access: { is_nsfw: true, can_reveal: true, revision: 1, revealed: true },
    };
  }),
}));
afterEach(() => {
  cleanup();
  mock.consent = false;
  vi.clearAllMocks();
});
it('replaces a discussion held in component state without navigating or changing its sibling', async () => {
  function Feed() {
    const [posts] = useState([post]);
    return (
      <>
        {posts.map((item) => (
          <DiscussionCard
            key={item.public_id}
            post={item}
            linked
            showMenu={false}
          />
        ))}
        <p>Next discussion stays here</p>
      </>
    );
  }
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <Feed />
    </QueryClientProvider>
  );
  fireEvent.click(await screen.findByRole('button', { name: 'Show content' }));
  await screen.findByText('Revealed in the original feed slot');
  expect(screen.getByText('Next discussion stays here')).toBeTruthy();
  expect(mock.push).not.toHaveBeenCalled();
  expect(mock.refresh).not.toHaveBeenCalled();
});

it.each(['restricted', 'withdrawn'])(
  'does not let older cached safe detail override a newly %s discussion',
  (state) => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    client.setQueryData(
      ['discussions', 'revealed-card', 'held', { viewer: 'adult' }],
      {
        ...post,
        body: 'Older cached body must stay hidden',
        is_nsfw: false,
        content_rating: { is_nsfw: false, revision: 2 },
      }
    );
    const incoming = {
      ...post,
      content_rating: { is_nsfw: true, revision: 3, revealed: false },
      content_unavailable: state === 'withdrawn',
    };
    render(
      <QueryClientProvider client={client}>
        <DiscussionCard post={incoming} linked showMenu={false} />
      </QueryClientProvider>
    );
    expect(screen.queryByText('Older cached body must stay hidden')).toBeNull();
    if (state === 'withdrawn')
      expect(screen.getByText('Content unavailable.')).toBeTruthy();
  }
);
