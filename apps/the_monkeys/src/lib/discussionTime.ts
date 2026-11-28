export type DiscussionInstant = string | { seconds?: number | string };

export function discussionInstantMs(value?: DiscussionInstant): number {
  if (!value) return NaN;
  if (typeof value === 'string') return Date.parse(value);
  const seconds = Number(value.seconds);
  if (!Number.isFinite(seconds)) return NaN;
  return seconds * 1000;
}

export function discussionIsoTime(
  value?: DiscussionInstant
): string | undefined {
  const ms = discussionInstantMs(value);
  return Number.isNaN(ms) ? undefined : new Date(ms).toISOString();
}

export function discussionTimeLabel(value?: DiscussionInstant): string {
  const ms = discussionInstantMs(value);
  if (Number.isNaN(ms)) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(ms));
}
