import { discussionTimeLabel } from '@/lib/discussionTime';
import { describe, expect, it } from 'vitest';

describe('discussionTimeLabel', () => {
  it('formats UTC and ignores a bad value', () => {
    expect(discussionTimeLabel('2026-10-05T04:00:00Z')).toBe('5 Oct 2026');
    expect(discussionTimeLabel('nope')).toBe('');
    expect(discussionTimeLabel(undefined)).toBe('');
  });
});
