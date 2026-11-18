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

  it('keeps the complete crawlable headline and image linked in the compact lead story', () => {
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

  it('names the lead link from its rendered headline, including encoded punctuation', () => {
    renderWithProviders(
      <LandingHero lead={{ ...lead, title: 'Research &amp; Development' }} />
    );

    const headline = screen.getByRole('heading', {
      level: 1,
      name: 'Research & Development',
    });
    const link = screen.getByRole('link', { name: 'Research & Development' });
    expect(link.getAttribute('aria-labelledby')).toBe(headline.id);
    expect(headline.closest('a')).toBe(link);
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

  it('uses single-instance community/event slots in logical mobile reading order', () => {
    renderWithProviders(
      <LandingHero
        lead={lead}
        featuredEvent={featuredEvent}
        communityContent={
          <section aria-label='Discussion previews'>Discussions here</section>
        }
        groupsContent={
          <section aria-label='Group previews'>Groups here</section>
        }
        primaryContent={<main>Primary landing content</main>}
        secondaryContent={
          <aside aria-label='Discover more'>Secondary landing content</aside>
        }
      />
    );

    const postArticle = screen.getByRole('article', {
      name: 'Featured post',
    });
    const event = document.querySelector('[data-layout="featured-event"]');
    const discussions = screen.getByRole('region', {
      name: 'Discussion previews',
    });
    const groups = screen.getByRole('region', { name: 'Group previews' });
    const primaryContent = screen.getByText('Primary landing content');

    expect(
      postArticle.compareDocumentPosition(discussions) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      discussions.compareDocumentPosition(groups) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      groups.compareDocumentPosition(event!) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      event!.compareDocumentPosition(primaryContent) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      screen.getAllByRole('article', { name: 'Featured event' })
    ).toHaveLength(1);
    const secondaryColumn = screen.getByRole('region', {
      name: 'Featured events and discovery',
    });
    expect(secondaryColumn.contains(event)).toBe(true);
    expect(secondaryColumn.contains(groups)).toBe(true);
    expect(
      screen.getByRole('complementary', { name: 'Discover more' })
    ).toBeDefined();
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
