import { EventMeetingAccessCard } from '@/components/events/detail/EventMeetingAccessCard';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

describe('EventMeetingAccessCard', () => {
  afterEach(cleanup);

  it('presents meeting access as a clear external event action', () => {
    render(
      <EventMeetingAccessCard meetingLink='https://meet.example.com/writing-room' />
    );

    const action = screen.getByRole('link', { name: /join online event/i });

    expect(action.getAttribute('href')).toBe(
      'https://meet.example.com/writing-room'
    );
    expect(action.getAttribute('target')).toBe('_blank');
    expect(
      screen.getByText(
        'Your access is confirmed. Open the meeting link when you are ready.'
      )
    ).toBeDefined();
  });

  it('renders nothing when no meeting link is available', () => {
    const { container } = render(<EventMeetingAccessCard />);

    expect(container.firstChild).toBeNull();
  });
});
