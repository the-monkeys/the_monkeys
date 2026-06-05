/** Hostnames accepted for X / Twitter post URLs. */
const TWEET_HOSTS = new Set([
  'twitter.com',
  'www.twitter.com',
  'mobile.twitter.com',
  'x.com',
  'www.x.com',
  'mobile.x.com',
]);

/**
 * Extracts a numeric tweet id from an X/Twitter status URL or raw id string.
 */
export const parseTweetId = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^\d{5,}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, '');
    if (!TWEET_HOSTS.has(host) && !TWEET_HOSTS.has(url.hostname)) {
      return null;
    }
    const match = url.pathname.match(/\/status\/(\d+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
};

export const isTweetUrl = (raw: string): boolean => parseTweetId(raw) !== null;
