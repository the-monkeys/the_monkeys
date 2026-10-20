import moment from 'moment';

/** Short local timezone label (e.g. "IST", "PDT", "GMT+5:30"). */
export function localTimezoneLabel(): string {
  try {
    const parts = new Intl.DateTimeFormat(undefined, {
      timeZoneName: 'short',
    }).formatToParts(new Date());
    return parts.find((part) => part.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
}

/**
 * Blog header timestamp with date and time in the viewer's timezone,
 * e.g. "Oct 10, 2026 / 10:48 PM IST".
 */
export function formatBlogTimestamp(date?: string | number | Date): string {
  const local = moment(date);
  const tz = localTimezoneLabel();
  return `${local.format('MMM DD, yyyy')} / ${local.format('hh:mm A')}${
    tz ? ` ${tz}` : ''
  }`;
}
