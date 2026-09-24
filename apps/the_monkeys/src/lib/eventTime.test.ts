import {
  eventDateParts,
  formatEventCardWhen,
  formatEventWhen,
  formatPrice,
  parseEventTime,
  toIsoTime,
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
  it('does not throw for an invalid IANA timezone', () => {
    const start = '2026-09-20T14:34:00Z';
    expect(() => formatEventCardWhen(start, 'Not/AZone')).not.toThrow();
    expect(() => eventDateParts(start, 'Not/AZone')).not.toThrow();
    expect(() => formatEventWhen(start, undefined, 'Not/AZone')).not.toThrow();
    expect(formatEventCardWhen(start, 'Not/AZone').length).toBeGreaterThan(0);
    expect(eventDateParts(start, 'Not/AZone')).not.toBeNull();
  });
});
