export function socialProofUrlError(raw: string): string | null {
  const s = raw.trim();
  if (!s) return 'Add a public profile link so the host can review you.';
  if (s.length > 2048) return 'That link is too long.';
  let url: URL;
  try {
    url = new URL(s);
  } catch {
    return 'Use a full http(s) link, like your LinkedIn or Instagram.';
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return 'Use a full http(s) link, like your LinkedIn or Instagram.';
  }
  if (!url.host) {
    return 'Use a full http(s) link, like your LinkedIn or Instagram.';
  }
  return null;
}
