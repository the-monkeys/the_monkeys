import LandingPageClient from '@/app/LandingPageClient';
import useGetHomepageBlogs from '@/hooks/blog/useGetHomepageBlogs';
import { useEventList } from '@/hooks/events/useEventQueries';
import { useLandingCommunity } from '@/hooks/landing/useLandingCommunity';
import { MetaBlog } from '@/services/blog/blogTypes';
import { EventItem } from '@/services/events/eventTypes';
import { act, cleanup, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../utils';

vi.mock('../../../public/image-placeholder.png', () => ({
  default: { src: '/image-placeholder.png' },
}));
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => ({ toString: () => '' }),
}));
const { latestBlogs, trendingBlogs } = vi.hoisted(() => ({
  latestBlogs: vi.fn(),
  trendingBlogs: vi.fn(),
}));
vi.mock('@/hooks/blog/useGetHomepageBlogs', () => ({
  default: vi.fn((params: any) =>
    (params?.sort === 'trending' ? trendingBlogs : latestBlogs)(params)
  ),
}));
vi.mock('@/hooks/events/useEventQueries', () => ({ useEventList: vi.fn() }));
vi.mock('@/hooks/landing/useLandingCommunity', () => ({
  useLandingCommunity: vi.fn(),
}));
vi.mock('@/services/fetcher', () => ({
  fetcher: vi.fn().mockResolvedValue(null),
  authFetcher: vi.fn().mockResolvedValue(null),
}));
vi.mock('@/hooks/profile/useProfileImage', () => ({
  default: () => ({ imageUrl: '', isLoading: false, isError: true }),
}));
vi.mock('@/hooks/user/useUserConnections', () => ({
  useIsFollowingUser: () => ({
    followStatus: { isFollowing: false },
    isLoading: false,
    isError: false,
  }),
  useFollowUser: () => ({
    followMutation: { isPending: false, mutate: vi.fn() },
    unfollowMutation: { isPending: false, mutate: vi.fn() },
  }),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: { username: 'viewer' }, isSuccess: true }),
}));
vi.mock('@/components/editorial/FeaturedAuthorsStrip', () => ({
  default: ({ title = 'Featured authors' }: { title?: string }) => (
    <section aria-label={title} />
  ),
}));
vi.mock('@/components/editorial/BlogActionBar', () => ({
  default: ({
    blogId,
    blogURL,
    initialLikeCount,
  }: {
    blogId?: string;
    blogURL: string;
    initialLikeCount?: number;
  }) => (
    <div
      data-testid='post-actions'
      data-blog-id={blogId}
      data-blog-url={blogURL}
      data-like-count={initialLikeCount}
    />
  ),
}));
vi.mock('@/components/user/userInfo', () => ({
  UserInfoCardShowcase: ({
    authorID,
    date,
  }: {
    authorID?: string;
    date?: string;
  }) => (
    <div data-testid='post-author' data-author-id={authorID} data-date={date} />
  ),
}));
vi.mock('@growthbook/growthbook-react', () => ({
  useFeatureIsOn: () => false,
}));

const posts: MetaBlog[] = Array.from({ length: 18 }, (_, index) => ({
  blog_id: `post-${index + 1}`,
  title: `Useful community idea ${index + 1}`,
  first_image: `/cover-${index + 1}.jpg`,
  first_paragraph: 'A concise perspective for curious people.',
  owner_account_id: `author-${index + 1}`,
  published_time: '2026-09-11T09:00:00.000Z',
  tags: ['Community'],
  like_count: index,
  homepage_eligibility: {
    eligible: true,
    lead_eligible: true,
    word_count: 250,
    minimum_words: 250,
    reasons: [],
    version: 'homepage-v1',
  },
}));

const upcomingEvent: EventItem = {
  id: 1,
  title: 'Community design session',
  slug: 'community-design-session',
  start_time: '2027-02-12T10:00:00.000Z',
  end_time: '2027-02-12T11:00:00.000Z',
  timezone: 'UTC',
  event_type: 'virtual',
  status: 'published',
  organizer_username: 'host',
  tags: ['Design'],
};

const secondEvent: EventItem = {
  ...upcomingEvent,
  id: 2,
  title: 'Writers evening',
  slug: 'writers-evening',
};

const thirdEvent: EventItem = {
  ...upcomingEvent,
  id: 3,
  title: 'Technology roundtable',
  slug: 'technology-roundtable',
};

describe('LandingPageClient', () => {
  beforeEach(() => {
    vi.mocked(useLandingCommunity, { partial: true }).mockReturnValue({
      discussions: {
        data: [
          {
            public_id: 'landing-discussion',
            body: 'A real public discussion preview',
            status: 'visible',
          },
        ],
        isPending: false,
        isError: false,
      },
      groups: {
        data: [
          {
            id: 1,
            name: 'A real public group',
            slug: 'public-group',
            status: 'published',
            visibility: 'public',
          },
        ],
        isPending: false,
        isError: false,
      },
    } as ReturnType<typeof useLandingCommunity>);
    trendingBlogs.mockReturnValue({
      blogs: {
        blogs: [
          {
            ...posts[0],
            blog_id: 'trending-1',
            title: 'Endpoint trending post',
          },
        ],
        has_more: false,
        homepage_policy_version: 'homepage-v1',
      },
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('requests only the posts used by the landing layout', () => {
    latestBlogs.mockReturnValue({
      blogs: { blogs: [] },
      isLoading: false,
      isError: false,
    });
    vi.mocked(useEventList, { partial: true }).mockReturnValue({
      data: { events: [] },
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<LandingPageClient />);

    expect(latestBlogs).toHaveBeenCalledWith({ limit: 12 });
    expect(useGetHomepageBlogs).toHaveBeenCalledWith(
      {
        limit: 12,
        sort: 'trending',
      },
      { viewer: 'viewer', enabled: true }
    );
    const community = screen.getByRole('region', { name: 'Top discussions' });
    const groupSection = screen.getByRole('region', {
      name: 'Discover groups',
    });
    const navigation = screen.getByRole('navigation', {
      name: 'Explore Monkeys',
    });
    expect(
      community.compareDocumentPosition(groupSection) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    // Feed controls now belong to the independent post column. Mobile visual
    // order is preserved by responsive CSS and checked in the browser.
    expect(
      screen
        .getByRole('region', { name: 'Featured posts and feed' })
        .contains(navigation)
    ).toBe(true);
    expect(
      screen
        .getByRole('region', { name: 'Featured events and discovery' })
        .contains(groupSection)
    ).toBe(true);
    expect(screen.getByText('A real public discussion preview')).toBeDefined();
    expect(screen.getByText('A real public group')).toBeDefined();
  });

  it('keeps events and the dispatch signup discoverable when posts fail', () => {
    latestBlogs.mockReturnValue({
      blogs: undefined,
      isLoading: false,
      isError: true,
    });
    vi.mocked(useEventList).mockReturnValue({
      data: { events: [upcomingEvent] },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useEventList>);

    renderWithProviders(<LandingPageClient />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Monkeys' })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: 'Upcoming events' })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: 'The Morning Monkeys Dispatch' })
    ).toBeDefined();
    expect(
      screen.getByRole('navigation', { name: 'Explore Monkeys' })
    ).toBeDefined();
    expect(
      screen.queryByRole('region', { name: 'More from the community' })
    ).toBeNull();
  });

  it('uses post language throughout the successful landing experience', () => {
    latestBlogs.mockReturnValue({
      blogs: { blogs: posts, total_blogs: posts.length },
      isLoading: false,
      isError: false,
    });
    vi.mocked(useEventList).mockReturnValue({
      data: { events: [upcomingEvent, secondEvent, thirdEvent] },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useEventList>);

    renderWithProviders(<LandingPageClient />);

    const editorialFeed = screen.getByRole('region', {
      name: 'Editorial feed',
    });
    expect(editorialFeed).toBeDefined();
    expect(
      editorialFeed.querySelectorAll('[aria-label="Feed post"]')
    ).toHaveLength(3);
    expect(
      editorialFeed.querySelectorAll('[aria-label="Feed event"]')
    ).toHaveLength(2);
    expect(screen.getByRole('region', { name: 'Live & hosts' })).toBeDefined();
    expect(
      screen.getByRole('article', { name: 'Featured post' })
    ).toBeDefined();
    expect(
      screen.getAllByRole('article', { name: 'Featured event' })
    ).toHaveLength(1);
    expect(
      screen.getByRole('complementary', { name: 'Discover more' })
    ).toBeDefined();
    expect(screen.getByText('Endpoint trending post')).toBeDefined();
    expect(useEventList).toHaveBeenCalledWith(
      expect.objectContaining({ date: 'this-week' }),
      true,
      true
    );
    const eventColumn = screen.getByRole('region', {
      name: 'Featured events and discovery',
    });
    expect(
      eventColumn.contains(
        document.querySelector('[data-layout="featured-event"]')
      )
    ).toBe(true);
    expect(
      eventColumn.contains(
        screen.getByRole('region', { name: 'Discover groups' })
      )
    ).toBe(true);
    expect(screen.getAllByText('Community design session')).toHaveLength(1);
    expect(document.body.textContent).not.toMatch(/\bblogs?\b/i);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.queryByRole('main')).toBeNull();

    const morePosts = screen.getByRole('region', {
      name: 'More from the community',
    });
    const morePostCards = within(morePosts).getAllByRole('article');
    expect(morePostCards).toHaveLength(6);
    expect(
      within(morePosts).getByRole('article', {
        name: 'Useful community idea 5',
      })
    ).toBeDefined();
    expect(
      within(morePosts).getAllByRole('heading', { level: 3 })
    ).toHaveLength(6);
    expect(
      morePosts.querySelectorAll('[data-card-variant="prominent"]')
    ).toHaveLength(2);
    expect(
      morePosts.querySelectorAll('[data-card-variant="compact"]')
    ).toHaveLength(4);
    expect(
      within(morePosts)
        .getByRole('link', { name: 'Useful community idea 5' })
        .getAttribute('href')
    ).toBe('/blog/useful-community-idea-5-post-5');
    expect(
      within(morePosts).queryByRole('link', {
        name: 'Useful community idea 11',
      })
    ).toBeNull();
    expect(
      within(morePosts)
        .getByRole('link', { name: 'Explore all posts' })
        .getAttribute('href')
    ).toBe('/feed');
    expect(
      within(morePosts)
        .getByRole('link', { name: 'Browse events' })
        .getAttribute('href')
    ).toBe('/events');
    expect(
      within(morePosts)
        .getByRole('link', { name: 'Discover groups' })
        .getAttribute('href')
    ).toBe('/groups');
    expect(within(morePosts).getAllByTestId('post-actions')).toHaveLength(6);
    expect(
      within(morePostCards[0]).getByTestId('post-actions').dataset
    ).toMatchObject({
      blogId: 'post-5',
      blogUrl: '/blog/useful-community-idea-5-post-5',
      likeCount: '4',
    });
    expect(
      within(morePostCards[0]).getByTestId('post-author').dataset.authorId
    ).toBe('author-5');
    expect(
      within(morePostCards[0]).getByTestId('post-author').dataset.date
    ).toBeTruthy();
    const firstMoreImage = within(morePostCards[0]).getByRole('img');
    expect(firstMoreImage.getAttribute('fetchpriority')).not.toBe('high');
    expect(firstMoreImage.getAttribute('sizes')).toBe(
      '(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw'
    );
  });

  it('defers author and action queries until more posts approach the viewport', async () => {
    const callbacks: IntersectionObserverCallback[] = [];

    vi.stubGlobal(
      'IntersectionObserver',
      class {
        root = null;
        rootMargin = '0px';
        thresholds = [0];

        constructor(callback: IntersectionObserverCallback) {
          callbacks.push(callback);
        }

        disconnect() {}
        observe() {}
        takeRecords() {
          return [];
        }
        unobserve() {}
      }
    );
    latestBlogs.mockReturnValue({
      blogs: { blogs: posts, total_blogs: posts.length },
      isLoading: false,
      isError: false,
    });
    vi.mocked(useEventList).mockReturnValue({
      data: { events: [upcomingEvent, secondEvent, thirdEvent] },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useEventList>);

    renderWithProviders(<LandingPageClient />);

    const morePosts = screen.getByRole('region', {
      name: 'More from the community',
    });
    expect(within(morePosts).queryAllByTestId('post-actions')).toHaveLength(0);

    await act(async () => {
      callbacks.forEach((callback) =>
        callback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        )
      );
    });

    expect(within(morePosts).getAllByTestId('post-actions')).toHaveLength(6);
  });

  it('keeps the mixed feed directly after the filter navigation', async () => {
    const user = userEvent.setup();
    latestBlogs.mockReturnValue({
      blogs: { blogs: posts, total_blogs: posts.length },
      isLoading: false,
      isError: false,
    });
    vi.mocked(useEventList).mockReturnValue({
      data: { events: [upcomingEvent, secondEvent, thirdEvent] },
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useEventList>);

    renderWithProviders(<LandingPageClient />);

    const navigation = screen.getByRole('navigation', {
      name: 'Explore Monkeys',
    });
    const feed = screen.getByRole('region', { name: 'Editorial feed' });

    expect(navigation.nextElementSibling?.contains(feed)).toBe(true);

    await user.click(screen.getByRole('link', { name: 'Articles & analysis' }));
    expect(feed.querySelectorAll('[aria-label="Feed post"]')).toHaveLength(3);
    expect(feed.querySelectorAll('[aria-label="Feed event"]')).toHaveLength(0);
  });
});

describe('homepage eligibility without a lead', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });
  it('keeps qualified text-only articles visible without creating a featured lead', () => {
    latestBlogs.mockReturnValue({
      blogs: {
        blogs: posts.slice(0, 3).map((post) => ({
          ...post,
          first_image: '',
          homepage_eligibility: {
            ...post.homepage_eligibility,
            lead_eligible: false,
          },
        })),
      },
      isLoading: false,
      isError: false,
    });
    trendingBlogs.mockReturnValue({
      blogs: { blogs: [] },
      isLoading: false,
      isError: false,
    });
    vi.mocked(useLandingCommunity, { partial: true }).mockReturnValue({
      discussions: { data: [], isPending: false, isError: false },
      groups: { data: [], isPending: false, isError: false },
    } as any);
    vi.mocked(useEventList).mockReturnValue({
      data: { events: [] },
      isLoading: false,
      isError: false,
    } as any);
    renderWithProviders(<LandingPageClient />);
    expect(screen.queryByRole('article', { name: 'Featured post' })).toBeNull();
    expect(screen.getAllByRole('article', { name: 'Feed post' })).toHaveLength(
      3
    );
    expect(screen.getByText('Useful community idea 1')).toBeDefined();
    expect(
      screen.getByText('No trending posts are available yet.')
    ).toBeDefined();
  });
});
