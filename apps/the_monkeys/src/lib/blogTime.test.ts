import { formatBlogTimestamp, localTimezoneLabel } from '@/lib/blogTime';
import moment from 'moment';
import { describe, expect, it, vi } from 'vitest';

describe('localTimezoneLabel', () => {
  it('returns a short zone label from Intl', () => {
    const label = localTimezoneLabel();
    expect(label).toBeTruthy();
    expect(label).toMatch(/^[A-Za-z0-9+:\-]+$/);
  });

  it('returns empty string when Intl is unavailable', () => {
    const DateTimeFormat = Intl.DateTimeFormat;
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => {
      throw new Error('no ICU');
    });

    try {
      expect(localTimezoneLabel()).toBe('');
    } finally {
      Intl.DateTimeFormat = DateTimeFormat;
      vi.restoreAllMocks();
    }
  });
});

describe('formatBlogTimestamp', () => {
  it('formats date and time in the same local zone, not forced UTC', () => {
    const date = '2026-10-10T23:30:00Z';
    const label = localTimezoneLabel();
    const local = moment(date);

    const expected = `${local.format('MMM DD, yyyy')} / ${local.format(
      'hh:mm A'
    )}${label ? ` ${label}` : ''}`;

    expect(formatBlogTimestamp(date)).toBe(expected);
  });

  it('omits the zone label without a trailing separator when Intl fails', () => {
    const DateTimeFormat = Intl.DateTimeFormat;
    vi.spyOn(Intl, 'DateTimeFormat').mockImplementation(() => {
      throw new Error('no ICU');
    });

    try {
      const out = formatBlogTimestamp('2026-10-10T23:30:00Z');
      const local = moment('2026-10-10T23:30:00Z');

      expect(out).toBe(
        `${local.format('MMM DD, yyyy')} / ${local.format('hh:mm A')}`
      );
      expect(out.endsWith(' ')).toBe(false);
    } finally {
      Intl.DateTimeFormat = DateTimeFormat;
      vi.restoreAllMocks();
    }
  });
});
