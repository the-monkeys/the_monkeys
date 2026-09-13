import { EventHostPanel } from '@/components/events/detail/EventHostPanel';
import { EventItem } from '@/services/events/eventTypes';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

const hostedOnlineEvent: EventItem = {
  id: 41,
  title: 'Community writing room',
  slug: 'community-writing-room',
  event_type: 'virtual',
  status: 'published',
  meeting_link: 'https://meet.example.com/writing-room',
  attendee_count: 4,
};

describe('EventHostPanel meeting access', () => {
  afterEach(cleanup);

  it('lets the host open the online event from the responsive host panel', () => {
    render(<EventHostPanel event={hostedOnlineEvent} />);

    const action = screen.getByRole('link', { name: /join online event/i });

    expect(action.getAttribute('href')).toBe(
      'https://meet.example.com/writing-room'
    );
    expect(action.getAttribute('target')).toBe('_blank');
  });
});
