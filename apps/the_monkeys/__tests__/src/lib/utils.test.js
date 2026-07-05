import { getRelativeTime } from '@/lib/utils';
import { describe, expect, it } from 'vitest';

describe('getRelativeTime', () => {
  it('Returns "just now" for timestamps less than 60 seconds ago', () => {
    const recent = new Date(Date.now() - 30 * 1000).toISOString();
    expect(getRelativeTime(recent)).toBe('just now');
  });

  it('Returns minutes ago for timestamps less than 1 hour ago', () => {
    const minutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(getRelativeTime(minutesAgo)).toBe('5 min ago');
  });

  it('Returns hours ago for timestamps less than 1 day ago', () => {
    const hoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(getRelativeTime(hoursAgo)).toBe('3 hr ago');
  });

  it('Returns days ago for timestamps less than 30 days ago', () => {
    const daysAgo = new Date(
      Date.now() - 7 * 24 * 60 * 60 * 1000
    ).toISOString();
    expect(getRelativeTime(daysAgo)).toBe('7 days ago');
  });

  it('Returns formatted date for timestamps older than 30 days', () => {
    const old = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
    const result = getRelativeTime(old);
    expect(result).toMatch(/\w+ \d+, \d{4}/);
  });
});
