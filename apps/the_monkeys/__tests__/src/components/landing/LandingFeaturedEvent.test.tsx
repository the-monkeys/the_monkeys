import { LandingFeaturedEvent } from '@/components/landing/LandingFeaturedEvent';
import { EventItem } from '@/services/events/eventTypes';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/profile/useProfileImage', () => ({
  default: () => ({
    imageUrl: '/profiles/host.jpg',
    isLoading: false,
    isError: false,
  }),
}));
vi.mock('@/hooks/user/useGetProfileInfoByUserId', () => ({
  default: () => ({
    user: { user: { username: 'account-host' } },
    isLoading: false,
    isError: false,
  }),
}));

const featuredEvent: EventItem = {
  id: 12,
  title: 'Community design session',
  slug: 'community-design-session',
  description: 'A practical discussion about building better communities.',
  start_time: '2027-02-12T10:00:00.000Z',
  end_time: '2027-02-12T11:00:00.000Z',
  timezone: 'UTC',
  event_type: 'virtual',
  status: 'published',
  organizer_username: 'host',
  attendee_count: 12,
  tags: ['Design'],
};

describe('LandingFeaturedEvent', () => {
  afterEach(cleanup);

  it('links real event details without inventing an RSVP action', () => {
    render(<LandingFeaturedEvent event={featuredEvent} />);

    expect(
      screen.getByRole('article', { name: 'Featured event' })
    ).toBeDefined();
    expect(
      screen
        .getAllByRole('link', { name: featuredEvent.title })[0]
        ?.getAttribute('href')
    ).toBe('/events/community-design-session');
    expect(screen.getByText('Online')).toBeDefined();
    expect(
      screen.getByText((_, element) => element?.textContent === 'Hosted by @host')
    ).toBeDefined();
    const attendance = screen.getByRole('group', {
      name: 'Event host and attendance',
    });
    expect(
      within(attendance)
        .getByRole('link', { name: 'View event host profile' })
        .getAttribute('href')
    ).toBe('/host');
    expect(attendance.querySelector('img')).toBeDefined();
    expect(within(attendance).getByText('+12 attending')).toBeDefined();
    expect(screen.queryByRole('link', { name: /RSVP/i })).toBeNull();
  });

  it('does not expose an internal account identifier as the organizer name', () => {
    const internalUsername = '75784c6bc9c54f95ac0b012f7aed758f';

    render(
      <LandingFeaturedEvent
        event={{
          ...featuredEvent,
          organizer_username: internalUsername,
          organizer_account_id: 'host-account-id',
        }}
      />
    );

    expect(screen.queryByText(`@${internalUsername}`)).toBeNull();

    const attendance = screen.getByRole('group', {
      name: 'Event host and attendance',
    });
    expect(
      within(attendance)
        .getByRole('link', { name: 'View event host profile' })
        .getAttribute('href')
    ).toBe('/account-host');
    expect(attendance.querySelector('img')).toBeDefined();
    expect(
      within(attendance).queryByText(internalUsername)
    ).toBeNull();
  });

  it('resolves the host photo from the organizer account when username is absent', () => {
    render(
      <LandingFeaturedEvent
        event={{
          ...featuredEvent,
          organizer_username: undefined,
          organizer_account_id: 'host-account-id',
        }}
      />
    );

    expect(
      screen
        .getByRole('link', { name: 'View event host profile' })
        .getAttribute('href')
    ).toBe('/account-host');
  });

  it('does not create a profile link from an unresolved opaque organizer id', () => {
    render(
      <LandingFeaturedEvent
        event={{
          ...featuredEvent,
          organizer_username: '75784c6bc9c54f95ac0b012f7aed758f',
          organizer_account_id: undefined,
        }}
      />
    );

    expect(
      screen.queryByRole('link', { name: 'View event host profile' })
    ).toBeNull();
  });

  it('keeps the event title near the card header instead of anchoring it at the bottom', () => {
    render(<LandingFeaturedEvent event={featuredEvent} />);

    const heading = screen.getByRole('heading', { name: featuredEvent.title });
    expect(heading.parentElement?.parentElement?.className).not.toContain(
      'mt-auto'
    );
  });

  it('keeps the card content-sized without an artificial spacer', () => {
    render(<LandingFeaturedEvent event={featuredEvent} />);

    const article = screen.getByRole('article', { name: 'Featured event' });
    const actionRow = screen.getByRole('link', {
      name: 'View event',
    }).parentElement;

    expect(article.className).not.toContain('lg:min-h-full');
    expect(article.className).not.toContain('min-h-[25rem]');
    expect(actionRow?.className).not.toContain('mt-auto');
  });
});
