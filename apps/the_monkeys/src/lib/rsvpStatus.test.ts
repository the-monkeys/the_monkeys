import { describe, expect, it } from 'vitest';

import { hasOpenRsvp, rsvpStatusCopy, stickyAttendLabel } from './rsvpStatus';

describe('hasOpenRsvp', () => {
  it('treats host-review and unpaid confirmed as open responses', () => {
    expect(hasOpenRsvp('pending_host_review')).toBe(true);
    expect(hasOpenRsvp('confirmed')).toBe(true);
    expect(hasOpenRsvp('pending_payment')).toBe(true);
    expect(hasOpenRsvp('cancelled')).toBe(false);
    expect(hasOpenRsvp('')).toBe(false);
  });
});

describe('rsvpStatusCopy', () => {
  it('explains a free meetup waiting on the host', () => {
    expect(rsvpStatusCopy('pending_host_review')).toMatch(
      /application pending/i
    );
    expect(rsvpStatusCopy('pending_host_review')).toMatch(/host is reviewing/i);
  });
});

describe('stickyAttendLabel', () => {
  it('shows Waiting while the host reviews, including unpaid meetups', () => {
    expect(
      stickyAttendLabel({ going: true, status: 'pending_host_review' })
    ).toBe('Waiting');
  });

  it('keeps Attend for people who have not applied', () => {
    expect(stickyAttendLabel({ going: false })).toBe('Attend');
  });

  it('asks guests to apply when the host reviews', () => {
    expect(stickyAttendLabel({ going: false, requiresHostReview: true })).toBe(
      'Apply'
    );
  });
});
