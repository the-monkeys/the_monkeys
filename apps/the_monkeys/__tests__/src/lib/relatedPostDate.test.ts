import { formatRelatedPostDate } from '@/lib/publicRelatedPosts';
import { describe, expect, it } from 'vitest';

describe('stable server and browser recommendation dates', () => {
  it('uses the same UTC calendar date across timezone boundaries', () => {
    expect(formatRelatedPostDate('2026-01-01T23:30:00Z')).toBe('Jan 1, 2026');
    expect(formatRelatedPostDate('2026-01-02T01:00:00+05:30')).toBe(
      'Jan 1, 2026'
    );
    expect(formatRelatedPostDate('2026-01-01T23:30:00')).toBe('Jan 1, 2026');
    expect(formatRelatedPostDate('')).toBe('');
    expect(formatRelatedPostDate('invalid')).toBe('');
  });
});
