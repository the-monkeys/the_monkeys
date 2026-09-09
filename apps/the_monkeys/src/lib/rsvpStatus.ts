import { RsvpStatus } from '@/services/events/eventTypes';

/** Guest has an open response the host or they can still act on. */
export function hasOpenRsvp(status?: RsvpStatus | string): boolean {
  return (
    status === 'confirmed' ||
    status === 'waitlisted' ||
    status === 'pending_payment' ||
    status === 'pending_host_review'
  );
}

export function rsvpStatusCopy(status?: string): string {
  switch (status) {
    case 'waitlisted':
      return 'The event is full. You are on the waitlist.';
    case 'confirmed':
      return 'You are in.';
    case 'pending_payment':
      return 'Finish payment to confirm your seat.';
    case 'pending_host_review':
      return 'Application pending. The host is reviewing your application.';
    case 'cancelled':
      return 'Application declined.';
    default:
      return '';
  }
}

export function stickyAttendLabel(opts: {
  cancelled?: boolean;
  closed?: boolean;
  rsvpClosed?: boolean;
  going?: boolean;
  requiresHostReview?: boolean;
  status?: RsvpStatus | string;
}): string {
  if (opts.closed) return opts.cancelled ? 'Cancelled' : 'Ended';
  if (opts.rsvpClosed && !opts.going) return 'Closed';
  if (opts.status === 'pending_host_review') return 'Waiting';
  if (opts.status === 'pending_payment') return 'Pay';
  if (opts.going) return 'You’re in';
  if (opts.requiresHostReview) return 'Apply';
  return 'Attend';
}
