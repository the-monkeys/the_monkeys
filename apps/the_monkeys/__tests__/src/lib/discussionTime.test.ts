import { discussionIsoTime, discussionTimeLabel } from '@/lib/discussionTime';
import { describe, expect, it } from 'vitest';

describe('discussionTimeLabel', () => {
  it('formats UTC and ignores a bad value', () => {
    expect(discussionTimeLabel('2026-10-05T04:00:00Z')).toBe('5 Oct 2026');
    expect(
      discussionTimeLabel({
        seconds: Date.parse('2026-10-05T04:00:00Z') / 1000,
      })
    ).toBe('5 Oct 2026');
    expect(discussionTimeLabel('nope')).toBe('');
    expect(discussionTimeLabel(undefined)).toBe('');
  });

  it('turns any API instant into an ISO string', () => {
    expect(discussionIsoTime({ seconds: 0 })).toBe('1970-01-01T00:00:00.000Z');
    expect(discussionIsoTime('nope')).toBeUndefined();
  });
});
