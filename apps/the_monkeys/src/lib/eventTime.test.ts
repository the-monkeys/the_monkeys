import { formatPrice, parseEventTime } from '@/lib/eventTime';
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

describe('formatPrice', () => {
  it('shows Free for zero', () => {
    expect(formatPrice(0)).toBe('Free');
  });
});
