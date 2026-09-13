import { LandingHero } from '@/components/landing/LandingHero';
import { MetaBlog } from '@/services/blog/blogTypes';
import { EventItem } from '@/services/events/eventTypes';
import { cleanup, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../utils';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useSearchParams: () => ({ toString: () => '' }),
}));

vi.mock('@/components/editorial/FeaturedAuthorsStrip', () => ({
  default: ({ title }: { title: string }) => <section aria-label={title} />,
}));
vi.mock('@/hooks/user/useGetProfileInfoByUserId', () => ({
  default: () => ({
    user: {
      user: {
        username: 'ada',
        first_name: 'Ada',
        last_name: 'Lovelace',
      },
    },
    isLoading: false,
    isError: false,
  }),
}));
vi.mock('@/hooks/profile/useProfileImage', () => ({
  default: () => ({ imageUrl: '', isLoading: false, isError: true }),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ isSuccess: false }),
}));
vi.mock('@/hooks/user/useLikeStatus', () => ({
  useIsPostLiked: () => ({
    likeStatus: false,
    isLoading: false,
    isError: false,
  }),
  useGetLikesCount: (_blogId: string, initialCount?: number) => ({
    likes: initialCount ?? 0,
    likeCountLoading: false,
    likeCountError: false,
  }),
}));
vi.mock('@/hooks/user/useBookmarkStatus', () => ({
  useIsPostBookmarked: () => ({
    bookmarkStatus: { bookMarked: false },
    isLoading: false,
    isError: false,
  }),
}));

const lead: MetaBlog = {
  blog_id: 'post-123',
  title: 'A thoughtful future for local communities',
  first_image: '/cover.jpg',
  first_paragraph: 'A practical field guide for people building together.',
  owner_account_id: 'author-1',
  published_time: '2026-09-11T09:00:00.000Z',
  tags: ['Community'],
  like_count: 7,
};

const featuredEvent: EventItem = {
  id: 12,
  title: 'Community design session',
  slug: 'community-design-session',
  start_time: '2027-02-12T10:00:00.000Z',
  end_time: '2027-02-12T11:00:00.000Z',
  timezone: 'UTC',
  event_type: 'virtual',
  status: 'published',
};

describe('LandingHero', () => {
  afterEach(cleanup);

  it('opens with the lead story instead of a static platform heading', () => {
    renderWithProviders(<LandingHero lead={lead} />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: lead.title,
      })
    ).toBeDefined();
    expect(
      screen.queryByRole('heading', {
        name: 'Posts, events and communities',
      })
    ).toBeNull();
    expect(screen.getByRole('region', { name: 'Live & hosts' })).toBeDefined();
  });

  it('places the crawlable lead-story heading over its image', () => {
    renderWithProviders(<LandingHero lead={lead} />);

    const feature = screen.getByRole('article', { name: 'Featured post' });
    expect(feature).toBeDefined();
    const leadHeading = screen.getByRole('heading', {
      level: 1,
      name: lead.title,
    });
    const visualLink = leadHeading.closest('a');

    expect(visualLink?.getAttribute('href')).toBe(
      '/blog/a-thoughtful-future-for-local-communities-post-123'
    );
    expect(visualLink?.querySelector('img')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Read post' })).toBeDefined();
  });

  it('restores the author, like count, and bookmark controls in the lead footer', () => {
    renderWithProviders(<LandingHero lead={lead} />);

    const footer = screen.getByRole('group', {
      name: 'Featured post byline and actions',
    });

    expect(
      within(footer)
        .getByRole('link', { name: 'Ada Lovelace' })
        .getAttribute('href')
    ).toBe('/ada');
    expect(within(footer).getByLabelText('7 likes')).toBeDefined();
    expect(within(footer).getByTitle('Login to like this post')).toBeDefined();
    expect(
      within(footer).getByTitle('Login to bookmark this post')
    ).toBeDefined();
  });

  it('keeps the featured post before the featured event in mobile reading order', () => {
    renderWithProviders(
      <LandingHero
        lead={lead}
        featuredEvent={featuredEvent}
        primaryContent={<main>Primary landing content</main>}
        secondaryContent={
          <aside aria-label='Discover more'>Secondary landing content</aside>
        }
      />
    );

    const postArticle = screen.getByRole('article', {
      name: 'Featured post',
    });
    const mobileEvent = document.querySelector(
      '[data-layout="mobile-featured-event"]'
    );
    const desktopEvent = document.querySelector(
      '[data-layout="desktop-featured-event"]'
    );
    const primaryContent = screen.getByText('Primary landing content');

    expect(
      postArticle.compareDocumentPosition(mobileEvent!) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      mobileEvent!.compareDocumentPosition(primaryContent) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    const secondaryColumn = screen.getByRole('region', {
      name: 'Featured events and discovery',
    });
    expect(secondaryColumn.contains(desktopEvent)).toBe(true);
    expect(
      secondaryColumn.contains(
        screen.getByRole('complementary', { name: 'Discover more' })
      )
    ).toBe(true);
  });

  it('keeps an accessible page heading without restoring removed hero copy', () => {
    renderWithProviders(<LandingHero />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Monkeys' })
    ).toBeDefined();
    expect(
      screen.queryByRole('heading', {
        name: 'Posts, events and communities',
      })
    ).toBeNull();
    expect(screen.queryByRole('article', { name: 'Featured post' })).toBeNull();
  });
});
