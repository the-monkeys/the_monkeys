import { buildCalendarProviderUrl } from '@/lib/eventCalendar';
import { EventItem } from '@/services/events/eventTypes';
import { describe, expect, it } from 'vitest';

const event: EventItem = {
  id: 7,
  slug: 'india-meetup',
  title: 'Meet & learn + build',
  status: 'published',
  event_type: 'virtual',
  timezone: 'Asia/Kolkata',
  start_time: '2026-11-12T19:00:00+05:30',
  end_time: '2026-11-12T20:30:00+05:30',
  meeting_link: 'https://private.example.test/secret',
  description: 'Join at https://private.example.test/secret',
};

describe('calendar provider links', () => {
  it.each(['google', 'outlook'] as const)(
    'does not turn a cancelled occurrence into an active %s appointment',
    (provider) => {
      expect(
        buildCalendarProviderUrl(
          { ...event, status: 'cancelled' },
          provider,
          'http://127.0.0.1:3000'
        )
      ).toBeNull();
    }
  );
  it('opens Google with the stored India instants and event timezone, not the browser zone', () => {
    const url = new URL(
      buildCalendarProviderUrl(event, 'google', 'http://127.0.0.1:3000')!
    );
    expect(url.origin).toBe('https://calendar.google.com');
    expect(url.searchParams.get('dates')).toBe(
      '20261112T133000Z/20261112T150000Z'
    );
    expect(url.searchParams.get('ctz')).toBe('Asia/Kolkata');
    expect(url.searchParams.get('text')).toBe('Meet & learn + build');
    expect(url.searchParams.get('details')).toContain(
      'http://127.0.0.1:3000/events/india-meetup'
    );
    expect(url.href).not.toMatch(/secret|private\.example/);
  });

  it.each([
    [
      '2026-10-23T19:00:00+02:00',
      '2026-10-23T20:00:00+02:00',
      '2026-10-23T17:00:00.000Z',
    ],
    [
      '2026-10-30T19:00:00+01:00',
      '2026-10-30T20:00:00+01:00',
      '2026-10-30T18:00:00.000Z',
    ],
    [
      '2026-11-12T23:30:00-08:00',
      '2026-11-13T00:30:00-08:00',
      '2026-11-13T07:30:00.000Z',
    ],
  ])(
    'keeps exact Outlook instants across DST and date boundaries: %s',
    (start, end, expected) => {
      const url = new URL(
        buildCalendarProviderUrl(
          { ...event, start_time: start, end_time: end },
          'outlook',
          'http://127.0.0.1:3000'
        )!
      );
      expect(url.origin).toBe('https://outlook.live.com');
      expect(url.searchParams.get('startdt')).toBe(expected);
      expect(url.searchParams.get('enddt')).toBe(new Date(end).toISOString());
      expect(url.href).not.toMatch(/secret|private\.example/);
    }
  );

  it.each(['', 'India', 'Not/AZone'])(
    'keeps legacy timezone %j exportable without guessing a new instant',
    (timezone) => {
      const url = new URL(
        buildCalendarProviderUrl(
          { ...event, timezone },
          'google',
          'http://127.0.0.1:3000'
        )!
      );
      expect(url.searchParams.get('dates')).toBe(
        '20261112T133000Z/20261112T150000Z'
      );
      expect(url.searchParams.has('ctz')).toBe(false);
    }
  );

  it('handles protobuf timestamps without changing their instants', () => {
    const url = new URL(
      buildCalendarProviderUrl(
        {
          ...event,
          start_time: { seconds: 1794490200 },
          end_time: { seconds: 1794495600 },
        },
        'google',
        'http://127.0.0.1:3000'
      )!
    );
    expect(url.searchParams.get('dates')).toBe(
      '20261112T133000Z/20261112T150000Z'
    );
  });

  it.each([
    { start_time: undefined },
    { end_time: 'invalid' },
    { start_time: { seconds: 'NaN' } },
    { end_time: '2026-11-12T13:00:00Z' },
    { start_time: '2026-11-12T19:00:00' },
  ])(
    'refuses unusable or timezone-less instants instead of shifting them: %j',
    (patch) => {
      expect(
        buildCalendarProviderUrl(
          { ...event, ...patch },
          'google',
          'http://127.0.0.1:3000'
        )
      ).toBeNull();
    }
  );
});
