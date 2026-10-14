import { RsvpPanel } from '@/components/events/RsvpPanel';
import { EventItem, RsvpStatus } from '@/services/events/eventTypes';
import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../../utils';

const onlineEvent: EventItem = {
  id: 41,
  title: 'Community writing room',
  slug: 'community-writing-room',
  start_time: '2099-02-12T10:00:00.000Z',
  end_time: '2099-02-12T11:00:00.000Z',
  timezone: 'UTC',
  event_type: 'virtual',
  status: 'published',
  meeting_link: 'https://meet.example.com/writing-room',
  ticket_tiers: [
    {
      id: 7,
      name: 'General',
      price: 0,
      capacity: 40,
      booked: 4,
    },
  ],
};

describe('RsvpPanel meeting access', () => {
  afterEach(cleanup);

  it('shows a clear meeting action in the confirmed attendee panel', () => {
    renderWithProviders(
      <RsvpPanel
        event={onlineEvent}
        viewerStatus='confirmed'
        session={{
          account_id: 'guest-account',
          email: 'guest@example.com',
          username: 'confirmed-guest',
        }}
      />
    );

    const action = screen.getByRole('link', { name: /join online event/i });

    expect(action.getAttribute('href')).toBe(
      'https://meet.example.com/writing-room'
    );
    expect(
      screen.getByText(
        'Your access is confirmed. Open the meeting link when you are ready.'
      )
    ).toBeDefined();
  });

  it('does not expose a cached confirmed meeting link after logout', () => {
    renderWithProviders(
      <RsvpPanel event={onlineEvent} viewerStatus='confirmed' session={null} />
    );

    expect(
      screen.queryByRole('link', { name: /join online event/i })
    ).toBeNull();
  });

  it.each<RsvpStatus>([
    'pending_payment',
    'pending_host_review',
    'waitlisted',
    'cancelled',
  ])('hides meeting access when the RSVP status is %s', (viewerStatus) => {
    renderWithProviders(
      <RsvpPanel
        event={onlineEvent}
        viewerStatus={viewerStatus}
        session={{
          account_id: 'guest-account',
          email: 'guest@example.com',
          username: 'event-guest',
        }}
      />
    );

    expect(
      screen.queryByRole('link', { name: /join online event/i })
    ).toBeNull();
  });
});
