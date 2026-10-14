import { LandingEventsSection } from '@/components/landing/LandingEventsSection';
import { EventItem } from '@/services/events/eventTypes';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

const event = (id: number): EventItem => ({
  id,
  title: `Future event ${id}`,
  slug: `future-event-${id}`,
  description: 'A focused community session.',
  start_time: `2027-0${id + 1}-12T10:00:00.000Z`,
  end_time: `2027-0${id + 1}-12T11:00:00.000Z`,
  timezone: 'UTC',
  event_type: 'virtual',
  status: 'published',
  organizer_username: 'host',
  attendee_count: 12,
  tags: ['Community'],
  ticket_tiers: [
    {
      id,
      name: 'General admission',
      price: 0,
      capacity: 100,
      currency: 'USD',
    },
  ],
});

describe('LandingEventsSection', () => {
  afterEach(cleanup);

  it('shows up to three crawlable upcoming event cards', () => {
    render(
      <LandingEventsSection
        events={[event(1), event(2), event(3), event(4)]}
        isLoading={false}
        isError={false}
      />
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Upcoming events' })
    ).toBeDefined();
    expect(
      screen
        .getAllByRole('link', { name: 'Future event 1' })[0]
        ?.getAttribute('href')
    ).toBe('/events/future-event-1');
    expect(screen.queryByText('Future event 4')).toBeNull();
    expect(
      screen.getByRole('link', { name: 'View all events' }).getAttribute('href')
    ).toBe('/events');
  });

  it('uses a compact empty state with a route to event discovery', () => {
    render(
      <LandingEventsSection events={[]} isLoading={false} isError={false} />
    );

    expect(
      screen.getByText('No upcoming events are scheduled yet.')
    ).toBeDefined();
    expect(
      screen.getByRole('link', { name: 'Browse events' }).getAttribute('href')
    ).toBe('/events');
  });

  it('keeps event failure contained inside the section', () => {
    render(<LandingEventsSection events={[]} isLoading={false} isError />);

    expect(
      screen.getByText('Upcoming events could not be loaded.')
    ).toBeDefined();
    expect(
      screen.getByRole('link', { name: 'Browse events' }).getAttribute('href')
    ).toBe('/events');
  });

  it('reserves three card-sized placeholders while loading', () => {
    render(<LandingEventsSection events={[]} isLoading isError={false} />);

    expect(screen.getAllByLabelText('Loading event')).toHaveLength(3);
  });

  it('renders concise event rows for the discovery rail', () => {
    render(
      <LandingEventsSection
        events={[event(1), event(2)]}
        isLoading={false}
        isError={false}
        variant='compact'
      />
    );

    expect(
      screen.getByRole('heading', { level: 2, name: 'Upcoming events' })
    ).toBeDefined();
    expect(screen.getByText('Future event 1')).toBeDefined();
    expect(screen.getByText('Future event 2')).toBeDefined();
    expect(
      screen.getByRole('link', { name: 'View all events' }).getAttribute('href')
    ).toBe('/events');
  });
});
