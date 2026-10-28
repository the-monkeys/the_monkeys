import {
  eventDateParts,
  formatEventCardWhen,
  formatEventWhen,
  formatPrice,
  fromLocalInput,
  parseEventTime,
  toIsoTime,
  toLocalInput,
} from '@/lib/eventTime';
import { describe, expect, it } from 'vitest';

describe('parseEventTime', () => {
  it('reads RFC3339 strings', () => {
    const d = parseEventTime('2026-08-22T10:00:00Z');
    expect(d?.toISOString()).toBe('2026-08-22T10:00:00.000Z');
  });

  it('reads proto seconds', () => {
    const d = parseEventTime({ seconds: 1_000_000_000, nanos: 0 });
    expect(d?.toISOString()).toBe('2001-09-09T01:46:40.000Z');
  });

  it('returns null for empty values', () => {
    expect(parseEventTime(undefined)).toBeNull();
    expect(parseEventTime('not-a-date')).toBeNull();
  });
});

describe('toIsoTime', () => {
  it('emits ISO from proto timestamps used in event JSON-LD', () => {
    expect(toIsoTime({ seconds: 1788537600 })).toBe('2026-09-04T16:00:00.000Z');
  });

  it('returns undefined for missing values', () => {
    expect(toIsoTime(undefined)).toBeUndefined();
  });
});

describe('formatPrice', () => {
  it('shows Free for zero', () => {
    expect(formatPrice(0)).toBe('Free');
  });
});

describe('event timezone formatting', () => {
  it.each([
    ['2026-11-12T19:00', 'Asia/Kolkata', '2026-11-12T13:30:00.000Z'],
    ['2026-07-12T19:00', 'Europe/Berlin', '2026-07-12T17:00:00.000Z'],
    ['2026-11-12T19:00', 'Europe/Berlin', '2026-11-12T18:00:00.000Z'],
    ['2026-11-12T23:59:59', 'Asia/Kolkata', '2026-11-12T18:29:59.000Z'],
  ])(
    'converts %s in %s independently of the browser zone',
    (input, zone, expected) => {
      expect(fromLocalInput(input, zone)).toBe(expected);
      expect(toLocalInput(expected, zone)).toBe(input.slice(0, 16));
    }
  );

  it.each([
    ['2026-11-12T19:00', 'India'],
    ['2026-03-29T02:30', 'Europe/Berlin'],
    ['2026-10-25T02:30', 'Europe/Berlin'],
    ['2026-02-30T19:00', 'Asia/Kolkata'],
  ])('refuses invalid or nonunique wall time %s in %s', (input, zone) => {
    expect(() => fromLocalInput(input, zone)).toThrow();
  });

  it('shows both dates when a range crosses midnight in the viewing zone', () => {
    const label = formatEventWhen(
      '2026-11-12T18:00:00Z',
      '2026-11-12T19:00:00Z',
      'Asia/Kolkata'
    );
    expect(label).toMatch(/12/);
    expect(label).toMatch(/13/);
    expect(label).toMatch(/GMT\+5:30|IST/);
  });

  it('omits the repeated date when UTC midnight is within one viewing-zone day', () => {
    const label = formatEventWhen(
      '2026-11-12T23:00:00Z',
      '2026-11-13T01:00:00Z',
      'Asia/Kolkata'
    );
    expect((label.match(/Nov/g) || []).length).toBe(1);
  });

  it('uses the viewing-zone calendar date when it differs from the browser date', () => {
    const label = formatEventWhen(
      '2026-11-12T07:00:00Z',
      '2026-11-12T09:00:00Z',
      'America/Los_Angeles'
    );
    expect(label).toMatch(/Nov 11/);
    expect(label).toMatch(/Nov 12/);
  });
  it('does not throw for an invalid IANA timezone', () => {
    const start = '2026-09-20T14:34:00Z';
    expect(() => formatEventCardWhen(start, 'Not/AZone')).not.toThrow();
    expect(() => eventDateParts(start, 'Not/AZone')).not.toThrow();
    expect(() => formatEventWhen(start, undefined, 'Not/AZone')).not.toThrow();
    expect(formatEventCardWhen(start, 'Not/AZone').length).toBeGreaterThan(0);
    expect(eventDateParts(start, 'Not/AZone')).not.toBeNull();
  });
});
