import {
  buildGoogleCalendarUrl,
  buildOutlookCalendarUrl,
  buildYahooCalendarUrl,
  formatUtcCalendarDate,
  getCalendarDescription,
  getCalendarLocation,
  getCalendarTimes,
  getCalendarUrls,
} from '@/lib/calendarLinks';
import { EventItem } from '@/services/events/eventTypes';
import { describe, expect, it } from 'vitest';

const mockEvent: EventItem = {
  id: 101,
  title: 'React & Next.js Meetup',
  slug: 'react-nextjs-meetup',
  description: 'Join us for an exciting evening of tech talks and networking!',
  start_time: '2026-11-15T18:00:00.000Z',
  end_time: '2026-11-15T20:00:00.000Z',
  timezone: 'Asia/Kolkata',
  event_type: 'in_person',
  location: 'WeWork Galaxy, Bengaluru',
  status: 'published',
};

describe('calendarLinks', () => {
  describe('formatUtcCalendarDate', () => {
    it('formats a date to UTC basic format without dashes or colons', () => {
      const d = new Date('2026-11-15T18:30:45.000Z');
      expect(formatUtcCalendarDate(d)).toBe('20261115T183045Z');
    });
  });

  describe('getCalendarTimes', () => {
    it('parses valid start and end times', () => {
      const times = getCalendarTimes({
        start_time: '2026-11-15T18:00:00.000Z',
        end_time: '2026-11-15T20:00:00.000Z',
      });
      expect(times).not.toBeNull();
      expect(times?.start.toISOString()).toBe('2026-11-15T18:00:00.000Z');
      expect(times?.end.toISOString()).toBe('2026-11-15T20:00:00.000Z');
    });

    it('defaults end time to 1 hour after start if end_time is missing', () => {
      const times = getCalendarTimes({
        start_time: '2026-11-15T18:00:00.000Z',
      });
      expect(times).not.toBeNull();
      expect(times?.start.toISOString()).toBe('2026-11-15T18:00:00.000Z');
      expect(times?.end.toISOString()).toBe('2026-11-15T19:00:00.000Z');
    });

    it('defaults end time to 1 hour after start if end_time is before or equal to start_time', () => {
      const times = getCalendarTimes({
        start_time: '2026-11-15T18:00:00.000Z',
        end_time: '2026-11-15T17:00:00.000Z',
      });
      expect(times).not.toBeNull();
      expect(times?.start.toISOString()).toBe('2026-11-15T18:00:00.000Z');
      expect(times?.end.toISOString()).toBe('2026-11-15T19:00:00.000Z');
    });

    it('returns null if start_time is missing or invalid', () => {
      expect(getCalendarTimes({ start_time: undefined })).toBeNull();
      expect(getCalendarTimes({ start_time: 'invalid' })).toBeNull();
    });
  });

  describe('getCalendarLocation', () => {
    it('returns event location string for in-person events', () => {
      expect(getCalendarLocation(mockEvent)).toBe('WeWork Galaxy, Bengaluru');
    });

    it('prefers venue address when venue object is provided', () => {
      const eventWithVenue: EventItem = {
        ...mockEvent,
        venue: {
          name: 'The Hub',
          address_line1: '100 Main St',
          city: 'Bengaluru',
          country: 'India',
        },
      };
      expect(getCalendarLocation(eventWithVenue)).toBe(
        'The Hub, 100 Main St, Bengaluru, India'
      );
    });

    it('returns meeting_link for virtual events if available', () => {
      const virtualEvent: EventItem = {
        ...mockEvent,
        event_type: 'virtual',
        location: undefined,
        meeting_link: 'https://meet.google.com/xyz-abcd-uvw',
      };
      expect(getCalendarLocation(virtualEvent)).toBe(
        'https://meet.google.com/xyz-abcd-uvw'
      );
    });

    it('falls back to Online for virtual events without meeting link', () => {
      const virtualEvent: EventItem = {
        ...mockEvent,
        event_type: 'virtual',
        location: undefined,
        meeting_link: undefined,
      };
      expect(getCalendarLocation(virtualEvent)).toBe('Online');
    });
  });

  describe('getCalendarDescription', () => {
    it('includes description, meeting link, and event link', () => {
      const details = getCalendarDescription(
        {
          description: 'Great meetup',
          meeting_link: 'https://zoom.us/j/12345',
        },
        'https://themonkeys.life/events/react-nextjs-meetup'
      );
      expect(details).toContain('Great meetup');
      expect(details).toContain('Meeting link: https://zoom.us/j/12345');
      expect(details).toContain(
        'Event link: https://themonkeys.life/events/react-nextjs-meetup'
      );
    });
  });

  describe('buildGoogleCalendarUrl', () => {
    it('generates a valid Google Calendar URL with all query parameters', () => {
      const urlStr = buildGoogleCalendarUrl(
        mockEvent,
        'https://themonkeys.life/events/react-nextjs-meetup'
      );
      const url = new URL(urlStr);

      expect(url.origin).toBe('https://calendar.google.com');
      expect(url.pathname).toBe('/calendar/render');
      expect(url.searchParams.get('action')).toBe('TEMPLATE');
      expect(url.searchParams.get('text')).toBe('React & Next.js Meetup');
      expect(url.searchParams.get('dates')).toBe(
        '20261115T180000Z/20261115T200000Z'
      );
      expect(url.searchParams.get('ctz')).toBe('Asia/Kolkata');
      expect(url.searchParams.get('location')).toBe('WeWork Galaxy, Bengaluru');
      expect(url.searchParams.get('details')).toContain(
        'Join us for an exciting evening'
      );
      expect(url.searchParams.get('details')).toContain(
        'Event link: https://themonkeys.life/events/react-nextjs-meetup'
      );
    });
  });

  describe('buildOutlookCalendarUrl', () => {
    it('generates a valid Outlook compose deeplink URL with ISO timestamps', () => {
      const urlStr = buildOutlookCalendarUrl(
        mockEvent,
        'https://themonkeys.life/events/react-nextjs-meetup'
      );
      const url = new URL(urlStr);

      expect(url.origin).toBe('https://outlook.live.com');
      expect(url.pathname).toBe('/calendar/0/deeplink/compose');
      expect(url.searchParams.get('path')).toBe('/calendar/action/compose');
      expect(url.searchParams.get('rru')).toBe('addevent');
      expect(url.searchParams.get('subject')).toBe('React & Next.js Meetup');
      expect(url.searchParams.get('startdt')).toBe('2026-11-15T18:00:00.000Z');
      expect(url.searchParams.get('enddt')).toBe('2026-11-15T20:00:00.000Z');
      expect(url.searchParams.get('location')).toBe('WeWork Galaxy, Bengaluru');
      expect(url.searchParams.get('body')).toContain(
        'Join us for an exciting evening'
      );
      expect(url.searchParams.get('body')).toContain(
        'Event link: https://themonkeys.life/events/react-nextjs-meetup'
      );
    });
  });

  describe('buildYahooCalendarUrl', () => {
    it('generates a valid Yahoo Calendar URL with basic UTC timestamps', () => {
      const urlStr = buildYahooCalendarUrl(
        mockEvent,
        'https://themonkeys.life/events/react-nextjs-meetup'
      );
      const url = new URL(urlStr);

      expect(url.origin).toBe('https://calendar.yahoo.com');
      expect(url.searchParams.get('v')).toBe('60');
      expect(url.searchParams.get('title')).toBe('React & Next.js Meetup');
      expect(url.searchParams.get('st')).toBe('20261115T180000Z');
      expect(url.searchParams.get('et')).toBe('20261115T200000Z');
      expect(url.searchParams.get('in_loc')).toBe('WeWork Galaxy, Bengaluru');
      expect(url.searchParams.get('desc')).toContain(
        'Join us for an exciting evening'
      );
      expect(url.searchParams.get('desc')).toContain(
        'Event link: https://themonkeys.life/events/react-nextjs-meetup'
      );
    });
  });

  describe('getCalendarUrls', () => {
    it('returns an object containing google, outlook, and yahoo URLs', () => {
      const urls = getCalendarUrls(
        mockEvent,
        'https://themonkeys.life/events/react-nextjs-meetup'
      );
      expect(urls.google).toContain('calendar.google.com');
      expect(urls.outlook).toContain('outlook.live.com');
      expect(urls.yahoo).toContain('calendar.yahoo.com');
    });
  });
});
