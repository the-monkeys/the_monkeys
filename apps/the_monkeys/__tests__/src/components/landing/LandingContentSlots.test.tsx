import React from 'react';

import {
  LandingDiscussions,
  LandingGroups,
} from '@/components/landing/LandingCommunity';
import { LandingEditorialFeed } from '@/components/landing/LandingEditorialFeed';
import { LandingEventsSection } from '@/components/landing/LandingEventsSection';
import { LandingFeaturedEvent } from '@/components/landing/LandingFeaturedEvent';
import { LandingFeedEvent } from '@/components/landing/LandingFeedEvent';
import { LandingHero } from '@/components/landing/LandingHero';
import { LandingMorePosts } from '@/components/landing/LandingMorePosts';
import { LandingContentAccess } from '@/components/moderation/LandingContentAccess';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  auth: { data: undefined as any, isPending: false, isLoading: false },
  access: vi.fn(),
  profile: vi.fn(),
  discussionRead: vi.fn(),
  discussion: {} as any,
}));
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
  useSearchParams: () => ({ toString: () => '' }),
}));
vi.mock('@/hooks/auth/useAuth', () => ({ default: () => mocks.auth }));
vi.mock('@/services/moderation/moderationApi', () => ({
  getContentAccess: mocks.access,
  revealContent: vi.fn(),
}));
vi.mock('@/hooks/events/useViewerTimezone', () => ({
  useViewerTimezone: () => 'UTC',
}));
vi.mock('@/hooks/user/useGetProfileInfoByUserId', () => ({
  default: mocks.profile,
}));
vi.mock('@/hooks/profile/useProfileImage', () => ({
  default: () => ({ imageUrl: '', isLoading: false, isError: true }),
}));
vi.mock('@/hooks/user/useUser', () => ({
  default: () => ({ user: undefined }),
}));
vi.mock('@/components/editorial/FeaturedAuthorsStrip', () => ({
  default: () => null,
}));
vi.mock('@/components/editorial/BlogActionBar', () => ({
  default: () => null,
}));
vi.mock('@/services/discussions/discussionsApi', () => ({
  getDiscussion: mocks.discussionRead,
}));

const post = {
  blog_id: 'secret-post',
  title: 'Protected headline',
  first_paragraph: 'Protected excerpt',
  first_image: '/secret-cover.jpg',
  owner_account_id: 'secret-author',
  published_time: '2026-11-20T10:00:00Z',
  tags: ['Protected topic'],
};
const event = {
  id: 1,
  slug: 'secret-event',
  title: 'Protected event',
  description: 'Protected event details',
  cover_image: '/secret-event.jpg',
  event_type: 'virtual' as const,
  status: 'published' as const,
  start_time: '2027-01-20T10:00:00Z',
};
const group = {
  id: 1,
  slug: 'secret-group',
  name: 'Protected group',
  description: 'Protected group details',
  logo_image: '/secret-logo.jpg',
  visibility: 'public' as const,
  status: 'published' as const,
};
const discussion = {
  public_id: 'secret-discussion',
  body: 'Protected discussion body',
  status: 'visible' as const,
  audience: 'public' as const,
  author_username: 'secret-author',
};

type State = 'pending' | 'restricted' | 'revealed' | 'safe';
function rated<T>(value: T, state: State) {
  return state === 'safe'
    ? value
    : {
        ...value,
        is_nsfw: true,
        content_rating: {
          is_nsfw: true,
          revealed: state === 'revealed',
          revision: 1,
        },
      };
}
const cases = [
  {
    name: 'lead',
    slots: ['lead'],
    view: (s: State) => <LandingHero lead={rated(post, s)} />,
  },
  {
    name: 'editorial posts',
    slots: ['primary-post', 'post', 'post'],
    view: (s: State) => (
      <LandingEditorialFeed
        posts={[0, 1, 2].map((i) =>
          rated({ ...post, blog_id: `post-${i}` }, s)
        )}
        events={[]}
      />
    ),
  },
  {
    name: 'more posts',
    slots: ['prominent-post', 'prominent-post', 'compact-post'],
    view: (s: State) => (
      <LandingMorePosts
        posts={[0, 1, 2].map((i) =>
          rated({ ...post, blog_id: `more-${i}` }, s)
        )}
      />
    ),
  },
  {
    name: 'feed event',
    slots: ['feed-event'],
    view: (s: State) => <LandingFeedEvent event={rated(event, s)} />,
  },
  {
    name: 'featured event',
    slots: ['featured-event'],
    view: (s: State) => <LandingFeaturedEvent event={rated(event, s)} />,
  },
  {
    name: 'event row',
    slots: ['event-row'],
    view: (s: State) => (
      <LandingEventsSection
        events={[rated(event, s)]}
        isLoading={false}
        isError={false}
        variant='compact'
      />
    ),
  },
  {
    name: 'group',
    slots: ['group'],
    view: (s: State) => (
      <LandingGroups groups={{ data: [rated(group, s)] }} rail />
    ),
  },
  {
    name: 'discussion',
    slots: ['discussion'],
    view: (s: State) => (
      <LandingDiscussions discussions={{ data: [rated(discussion, s)] }} />
    ),
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  mocks.discussionRead.mockImplementation(async () => mocks.discussion);
  mocks.profile.mockReturnValue({
    user: { user: { username: 'author', first_name: 'Author' } },
    isLoading: false,
  });
  mocks.access.mockResolvedValue({
    is_nsfw: true,
    revealed: true,
    revision: 1,
  });
});
afterEach(cleanup);

describe.each(cases)('$name sensitive layout contract', ({ slots, view }) => {
  it.each(['pending', 'restricted', 'revealed'] as const)(
    'retains its context-specific slot in %s state',
    async (state) => {
      mocks.auth = {
        data: state === 'revealed' ? { account_id: 'adult' } : undefined,
        isPending: state === 'pending',
        isLoading: state === 'pending',
      };
      mocks.discussion = rated(discussion, state);
      const client = new QueryClient({
        defaultOptions: { queries: { retry: false, gcTime: 0 } },
      });
      const result = render(
        <QueryClientProvider client={client}>{view(state)}</QueryClientProvider>
      );
      await waitFor(() =>
        expect(
          Array.from(
            result.container.querySelectorAll('[data-content-slot]'),
            (node) => node.getAttribute('data-content-slot')
          )
        ).toEqual(slots)
      );
      if (state !== 'revealed') {
        expect(result.container.textContent).not.toMatch(
          /Protected (headline|excerpt|topic|event|group|discussion)/
        );
        expect(result.container.querySelector('img')).toBeNull();
        expect(mocks.profile).not.toHaveBeenCalled();
        expect(
          result.container.querySelectorAll(
            `[data-content-gate-state="${state}"]`
          )
        ).toHaveLength(slots.length);
        if (state === 'restricted')
          expect(
            screen.getAllByRole('link', { name: /log in to continue/i })
          ).toHaveLength(slots.length);
      } else {
        await waitFor(() =>
          expect(result.container.textContent).toMatch(/Protected/)
        );
        expect(
          result.container.querySelector(
            '[data-content-gate-state="restricted"]'
          )
        ).toBeNull();
      }
      client.clear();
    }
  );

  it('keeps safe cards free of sensitive wrappers and gate controls', () => {
    mocks.auth = { data: undefined, isPending: false, isLoading: false };
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    const result = render(
      <QueryClientProvider client={client}>{view('safe')}</QueryClientProvider>
    );
    expect(result.container.querySelector('[data-content-slot]')).toBeNull();
    expect(
      result.container.querySelector('[data-content-gate-state]')
    ).toBeNull();
    expect(result.container.textContent).toMatch(/Protected/);
    expect(mocks.access).not.toHaveBeenCalled();
    client.clear();
  });
});

it.each([true, false])(
  'uses managed discussion provenance without a duplicate detail GET when pending is %s',
  async (pending) => {
    mocks.auth = {
      data: { account_id: 'adult' },
      isPending: false,
      isLoading: false,
    };
    const item = {
      ...rated(discussion, 'revealed'),
      content_rating: {
        target: { kind: 'discussion' as const, id: discussion.public_id },
        is_nsfw: true,
        revealed: true,
        revision: 1,
      },
    };
    mocks.discussion = item;
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
    render(
      <QueryClientProvider client={client}>
        <LandingContentAccess
          viewer='adult'
          sources={[
            { viewer: 'adult', items: [item], fresh: !pending, pending },
          ]}
        >
          <LandingDiscussions discussions={{ data: [item] }} />
        </LandingContentAccess>
      </QueryClientProvider>
    );
    if (pending) {
      await screen.findByRole('status', { name: 'Loading sensitive content' });
      expect(screen.queryByText('Protected discussion body')).toBeNull();
    } else await screen.findByText('Protected discussion body');
    expect(mocks.discussionRead).not.toHaveBeenCalled();
    expect(mocks.access).not.toHaveBeenCalled();
    client.clear();
  }
);
