import { SITE_URL } from '@/lib/seo';

export type BodySegment =
  | { kind: 'text'; text: string }
  | { kind: 'link'; text: string; href: string; internal: boolean }
  | { kind: 'mention'; text: string; username: string };

export type InternalTarget =
  | { kind: 'blog'; id: string }
  | { kind: 'event'; slug: string }
  | { kind: 'group'; slug: string }
  | { kind: 'profile'; username: string }
  | { kind: 'discussion'; id: string };

const URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>]+/gi;
// Usernames may contain dots but a trailing dot ends the sentence instead.
const MENTION_PATTERN =
  /(^|[^\w@./])@([A-Za-z0-9_](?:[A-Za-z0-9_.]*[A-Za-z0-9_])?)/g;
const TRAILING_PUNCTUATION = '.,!?;:\'"';
const USERNAME_PATTERN = /^[A-Za-z0-9_.]+$/;
const SLUG_PATTERN = /^[A-Za-z0-9_-]+$/;

const RESERVED_TOP_LEVEL = new Set([
  'about',
  'actions',
  'activity',
  'api',
  'auth',
  'blog',
  'cards',
  'cookies',
  'create',
  'discussions',
  'edit',
  'events',
  'favicon.ico',
  'feed',
  'groups',
  'library',
  'llms.txt',
  'notifications',
  'posts',
  'privacy',
  'robots.txt',
  'search',
  'settings',
  'sitemap.xml',
  'snapshot',
  'support',
  'terms',
  'topics',
]);

function bareHost(host: string) {
  return host.toLowerCase().replace(/^www\./, '');
}

const INTERNAL_HOSTS = new Set([
  'monkeys.com.co',
  bareHost(new URL(SITE_URL).host),
]);

function count(text: string, char: string) {
  return text.split(char).length - 1;
}

function trimTrailing(raw: string) {
  let text = raw;
  for (;;) {
    const last = text.at(-1);
    if (last && TRAILING_PUNCTUATION.includes(last)) {
      text = text.slice(0, -1);
    } else if (last === ')' && count(text, '(') < count(text, ')')) {
      text = text.slice(0, -1);
    } else {
      return text;
    }
  }
}

function toLink(text: string): BodySegment | null {
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
  } catch {
    return null;
  }
  if (INTERNAL_HOSTS.has(bareHost(url.host))) {
    return {
      kind: 'link',
      text,
      href: `${url.pathname}${url.search}${url.hash}`,
      internal: true,
    };
  }
  return { kind: 'link', text, href: url.href, internal: false };
}

function splitMentions(text: string, segments: BodySegment[]) {
  let cursor = 0;
  const pushPlain = (plain: string) => {
    if (!plain) return;
    const last = segments.at(-1);
    if (last?.kind === 'text') {
      last.text += plain;
    } else {
      segments.push({ kind: 'text', text: plain });
    }
  };
  for (const match of Array.from(text.matchAll(MENTION_PATTERN))) {
    const start = (match.index ?? 0) + match[1].length;
    pushPlain(text.slice(cursor, start));
    segments.push({
      kind: 'mention',
      text: `@${match[2]}`,
      username: match[2],
    });
    cursor = start + match[2].length + 1;
  }
  pushPlain(text.slice(cursor));
}

// The gateway omits empty fields, so a deleted post arrives without a body.
export function splitBody(body = ''): BodySegment[] {
  const segments: BodySegment[] = [];
  let cursor = 0;
  const pushText = (text: string) => splitMentions(text, segments);
  for (const match of Array.from(body.matchAll(URL_PATTERN))) {
    const start = match.index ?? 0;
    const text = trimTrailing(match[0]);
    const link = text ? toLink(text) : null;
    if (!link) continue;
    pushText(body.slice(cursor, start));
    segments.push(link);
    cursor = start + text.length;
  }
  pushText(body.slice(cursor));
  return segments;
}

export function internalTarget(href: string): InternalTarget | null {
  const path = href.split(/[?#]/)[0];
  const parts = path.split('/').filter(Boolean);
  const [first, second] = parts;
  if (parts.length === 1) {
    const username = first.replace(/^@/, '');
    if (RESERVED_TOP_LEVEL.has(first) || !USERNAME_PATTERN.test(username)) {
      return null;
    }
    return { kind: 'profile', username };
  }
  if (parts.length !== 2 || !SLUG_PATTERN.test(second)) return null;
  switch (first) {
    case 'blog':
      return { kind: 'blog', id: second.split('-').at(-1) ?? second };
    case 'events':
      return { kind: 'event', slug: second };
    case 'groups':
      return { kind: 'group', slug: second };
    case 'discussions':
      return { kind: 'discussion', id: second };
    default:
      return null;
  }
}

export function firstInternalLink(
  body?: string
): { href: string; target: InternalTarget } | null {
  for (const segment of splitBody(body)) {
    if (segment.kind !== 'link' || !segment.internal) continue;
    const target = internalTarget(segment.href);
    if (target) return { href: segment.href, target };
  }
  return null;
}
