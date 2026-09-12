import { LandingDiscoveryRail } from '@/components/landing/LandingDiscoveryRail';
import { MetaBlog } from '@/services/blog/blogTypes';
import { EventItem } from '@/services/events/eventTypes';
import { cleanup, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '../../../utils';

vi.mock('@/hooks/user/useActiveUsers', () => ({
  default: () => ({ details: [] }),
}));

vi.mock('@/hooks/profile/useProfileImage', () => ({
  default: (username: string) => ({
    imageUrl: `/profiles/${username}.jpg`,
    isLoading: false,
    isError: false,
  }),
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

const event = (id: number): EventItem => ({
  id,
  title: `Event ${id}`,
  slug: `event-${id}`,
  start_time: `2027-0${id + 1}-12T10:00:00.000Z`,
  end_time: `2027-0${id + 1}-12T11:00:00.000Z`,
  timezone: 'UTC',
  event_type: 'virtual',
  status: 'published',
});

const post = (id: number): MetaBlog => ({
  blog_id: `post-${id}`,
  title: `Trending post ${id}`,
  first_image: '',
  first_paragraph: 'A useful perspective.',
  owner_account_id: `author-${id}`,
  published_time: '2026-09-11T09:00:00.000Z',
  tags: ['Community'],
});

describe('LandingDiscoveryRail', () => {
  afterEach(cleanup);

  it('combines real event, post, and people destinations without fake metrics', async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <LandingDiscoveryRail
        events={[event(1), event(2)]}
        trending={[post(1), post(2), post(3)]}
        eventsLoading={false}
        eventsError={false}
      />
    );

    expect(
      screen.getByRole('complementary', { name: 'Discover more' })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: "This week's events" })
    ).toBeDefined();
    expect(
      screen.getAllByRole('link', { name: 'Event 2' })[0]?.getAttribute('href')
    ).toBe('/events/event-2');
    expect(
      screen.getByRole('heading', { name: 'Trending posts' })
    ).toBeDefined();
    expect(screen.getByText('01')).toBeDefined();
    expect(document.body.textContent).not.toContain('%');
    expect(
      screen.getByRole('heading', { name: 'Featured hosts and writers' })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: 'The Morning Monkeys Dispatch' })
    ).toBeDefined();
    expect(screen.queryByRole('link', { name: 'Explore groups' })).toBeNull();

    await user.type(
      screen.getByRole('textbox', { name: 'Email address' }),
      'reader@example.com'
    );
    await user.click(screen.getByRole('button', { name: 'Subscribe free' }));
    expect(screen.getByText('Subscriptions are coming soon.')).toBeDefined();
    expect(screen.queryByText(/check your inbox/i)).toBeNull();
  });
});
