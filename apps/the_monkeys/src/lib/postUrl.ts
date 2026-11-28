import {
  generateLegacySlug,
  generateSlug,
} from '@/app/blog/utils/generateSlug';
import { getPostSeoContent } from '@/lib/postSeoContent';
import { SITE_URL, normalizeSeoText } from '@/lib/seo';

/** Encoded path component; preserve the public title boundary, not the headline. */
function publicationPrefix(
  slug?: string,
  articleId?: string
): string | undefined {
  if (!slug || !articleId || slug.length > 2048) return undefined;
  try {
    const decoded = decodeURIComponent(slug).normalize('NFC');
    const suffix = `-${articleId}`;
    if (!decoded.endsWith(suffix)) return undefined;
    const prefix = decoded.slice(0, -suffix.length);
    if (
      !prefix ||
      !storedPrefixCharacters.test(prefix) ||
      !readablePrefixCharacter.test(prefix)
    )
      return undefined;
    return encodeURIComponent(prefix);
  } catch {
    return undefined;
  }
}

/** An explicit published canonical is independent of later headline edits. */
export function canonicalPostTitleSlug(
  title: string,
  canonicalSlug?: string,
  articleId?: string
): string {
  const published = publicationPrefix(canonicalSlug, articleId);
  if (published) return published;
  return encodeURIComponent(
    generateSlug(normalizeSeoText(title, 100) || 'Published Post')
  );
}

export function canonicalPostDocumentTitleSlug(
  document: unknown,
  canonicalSlug?: string,
  articleId?: string
): string {
  return (
    publicationPrefix(canonicalSlug, articleId) ??
    encodeURIComponent(generateSlug(getPostSeoContent(document).title))
  );
}

/** The existing publish/schedule API accepts a raw slug string, with its ID. */
export function publicationPostSlug(
  document: unknown,
  articleId: string
): string {
  return `${generateSlug(getPostSeoContent(document).title)}-${articleId}`;
}

/** RSS GUIDs must not change merely because readable multilingual links improve. */
export function legacyPostTitleSlug(title: string): string {
  return generateLegacySlug(normalizeSeoText(title, 100) || 'Published Post');
}

const storedPrefixCharacters = new RegExp('^[\\p{L}\\p{N}\\p{M}_-]*$', 'u');
const readablePrefixCharacter = new RegExp('[\\p{L}\\p{N}]', 'u');

/** Older API projections can contain either a bare prefix or a complete slug. */
export function postLinkTitleSlug(
  title: string,
  articleId: string,
  storedSlug?: string,
  canonicalSlug?: string
): string {
  const published = publicationPrefix(canonicalSlug, articleId);
  if (published) return published;
  const fallback = canonicalPostTitleSlug(title);
  if (!storedSlug) return fallback;
  try {
    const decoded = decodeURIComponent(storedSlug).normalize('NFC');
    if (!storedPrefixCharacters.test(decoded)) return fallback;
    // A title may legitimately end with the ID; do not mistake its bare prefix
    // for a complete stored slug in that case.
    if (decoded === decodeURIComponent(fallback)) return fallback;
    const suffix = `-${articleId}`;
    const prefix = decoded.endsWith(suffix)
      ? decoded.slice(0, -suffix.length)
      : decoded;
    if (prefix && !readablePrefixCharacter.test(prefix)) return fallback;
    return encodeURIComponent(prefix);
  } catch {
    return fallback;
  }
}

/** A feed item's historical identity must not follow later headline edits. */
export function postRssGuid(post: {
  title: string;
  blog_id: string;
  rss_guid?: string;
}) {
  if (typeof post.rss_guid === 'string') {
    try {
      const url = new URL(post.rss_guid);
      const slug = url.pathname.startsWith('/blog/')
        ? url.pathname.slice(6)
        : '';
      const prefix = decodeURIComponent(slug).slice(
        0,
        -(post.blog_id.length + 1)
      );
      if (
        url.origin === SITE_URL &&
        !url.search &&
        !url.hash &&
        !url.username &&
        !url.password &&
        decodeURIComponent(slug).endsWith('-' + post.blog_id) &&
        storedPrefixCharacters.test(prefix)
      )
        return post.rss_guid;
    } catch {
      /* Invalid optional metadata retains the legacy GUID. */
    }
  }
  return (
    SITE_URL + '/blog/' + legacyPostTitleSlug(post.title) + '-' + post.blog_id
  );
}
